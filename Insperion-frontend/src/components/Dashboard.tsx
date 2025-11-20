import { useEffect, useState } from 'react';
import { Lock, TrendingUp, DollarSign } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { Button } from './Button';
import { decrypt as decryptEncrypt } from '../fhevm/encrypt'; 
import { decrypt as decryptDecrypt } from '../fhevm/decrypt';
import { getRegistryContract } from '../contracts/registry';
import { ethers } from 'ethers';

// --- Props ---
interface DashboardProps {
  onDepositClick: () => void;
  onEligibilityClick: () => void;
  onBorrowRepayClick: () => void;
  onAdminClick: () => void;
  walletConnected: boolean;
  provider: ethers.BrowserProvider | null; 
  userAddress: string;
}

export function Dashboard({
  onDepositClick,
  onEligibilityClick,
  onBorrowRepayClick,
  onAdminClick,
  walletConnected,
  provider, 
  userAddress 
}: DashboardProps) {
  
  const [collateral, setCollateral] = useState<string | null>(null);
  const [score, setScore] = useState<string | null>(null);
  const [loanBalance, setLoanBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEncryptedData = async () => {
      if (!provider || !userAddress || !walletConnected) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
              
      try {
        const registry = getRegistryContract(provider);

        const [encCollateral, encScore, encDebt] = await Promise.all([
          registry.getEncCollateral(userAddress),
          registry.getEncScore(userAddress),
          registry.getEncDebt(userAddress)
        ]);

        // Use renamed decrypt functions
        const decryptedCollateral = await decryptEncrypt(encCollateral);
        const decryptedScore = await decryptDecrypt(encScore);
        const decryptedDebt = await decryptEncrypt(encDebt);

        setCollateral(`$${(Number(decryptedCollateral) / 100).toFixed(2)}`);
        setScore(Number(decryptedScore).toString());
        setLoanBalance(`$${(Number(decryptedDebt) / 100).toFixed(2)}`);

      } catch (error) {
        console.error("Error fetching encrypted data:", error);
        setCollateral(null);
        setScore(null);
        setLoanBalance(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEncryptedData();
  }, [provider, userAddress, walletConnected]);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-white">Insperion Private Lending Dashboard</h1>
        <p className="text-[#9CA3AF] text-lg">
          Manage your private collateral and loans on the FHEVM.
        </p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 hover:border-[#7C3AED]/50 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-[#9CA3AF]">Encrypted Collateral</div>
            <div className="p-2 bg-[#7C3AED]/20 rounded-lg">
              <Lock className="w-5 h-5 text-[#7C3AED]" />
            </div>
          </div>
          <div className="text-3xl mb-2 flex items-center gap-2">
            {isLoading ? (
              <span className="text-[#9CA3AF]">Loading...</span>
            ) : collateral ? (
              <span className="text-white">{collateral}</span>
            ) : (
              <>
                <span className="text-[#7C3AED]">🔒</span>
                <span className="text-[#9CA3AF]">Hidden</span>
              </>
            )}
          </div>
          <p className="text-xs text-[#9CA3AF]">
            All data encrypted on-chain via Zama FHEVM
          </p>
        </GlassCard>

        <GlassCard className="p-6 hover:border-[#00D1FF]/50 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-[#9CA3AF]">Encrypted Score</div>
            <div className="p-2 bg-[#00D1FF]/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-[#00D1FF]" />
            </div>
          </div>
          <div className="text-3xl mb-2 flex items-center gap-2">
            {isLoading ? (
              <span className="text-[#9CA3AF]">Loading...</span>
            ) : score ? (
              <span className="text-white">{score}</span>
            ) : (
              <>
                <span className="text-[#00D1FF]">🔒</span>
                <span className="text-[#9CA3AF]">Hidden</span>
              </>
            )}
          </div>
          <p className="text-xs text-[#9CA3AF]">
            Score computed on encrypted data
          </p>
        </GlassCard>

        <GlassCard className="p-6 hover:border-[#FACC15]/50 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-[#9CA3AF]">Loan Balance</div>
            <div className="p-2 bg-[#FACC15]/20 rounded-lg">
              <DollarSign className="w-5 h-5 text-[#FACC15]" />
            </div>
          </div>
          <div className="text-3xl mb-2 flex items-center gap-2">
            {isLoading ? (
              <span className="text-[#9CA3AF]">Loading...</span>
            ) : loanBalance ? (
              <span className="text-white">{loanBalance}</span>
            ) : (
              <>
                <span className="text-[#FACC15]">🔒</span>
                <span className="text-[#9CA3AF]">Hidden</span>
              </>
            )}
          </div>
          <p className="text-xs text-[#9CA3AF]">
            Private loan balance tracking
          </p>
        </GlassCard>
      </div>
      
      <GlassCard className="p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-white">Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button 
            className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white" 
            onClick={onDepositClick}
            disabled={!walletConnected || isLoading}
          >
            Deposit Collateral
          </Button>
          <Button 
            className="bg-[#00D1FF] hover:bg-[#00B8E3] text-black" 
            onClick={onEligibilityClick}
            disabled={!walletConnected || isLoading}
          >
            Check Eligibility
          </Button>
          <Button 
            className="bg-[#FACC15] hover:bg-[#EAB308] text-black" 
            onClick={onBorrowRepayClick}
            disabled={!walletConnected || isLoading}
          >
            Borrow / Repay
          </Button>
          <Button 
            className="bg-[#475569] hover:bg-[#334155] text-white" 
            onClick={onAdminClick}
            disabled={!walletConnected || isLoading}
          >
            Admin Panel
          </Button>
        </div>
        {!walletConnected && (
          <p className="text-center text-red-400">Please connect your wallet to interact with the dashboard.</p>
        )}
      </GlassCard>
    </div>
  );
}
