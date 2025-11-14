import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { connectWallet } from './wallet/connect';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { DepositModal } from './components/DepositModal';
import { EligibilityModal } from './components/EligibilityModal';
import { BorrowRepayModal } from './components/BorrowRepayModal';
import { AdminModal } from './components/AdminModal';
import { AnimatedBackground } from './components/AnimatedBackground';
import { ethers } from 'ethers'; // ⚠️ Added ethers import

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  const [walletConnected, setWalletConnected] = useState(false);
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [eligibilityModalOpen, setEligibilityModalOpen] = useState(false);
  const [borrowRepayModalOpen, setBorrowRepayModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  // ⚠️ ADDED: State for provider and address to pass to Dashboard
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [userAddress, setUserAddress] = useState('');

  const handleConnectWallet = async () => {
    try {
      // ⚠️ UPDATED: Capture provider and address from connectWallet
      const { provider, address } = await connectWallet();
      
      setProvider(provider);
      setUserAddress(address);
      setWalletConnected(true);
    
    } catch (err) {
      console.error(err);
      // Reset state if connection fails
      setProvider(null);
      setUserAddress('');
      setWalletConnected(false);
    }
  };

  const handleLaunchApp = () => {
    // NOTE: You should likely call handleConnectWallet() here or ensure
    // wallet is connected before launching to the dashboard.
    // If you keep this logic, ensure you handle the missing provider/address in Dashboard.
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#080014] via-[#1a0733] to-[#0B001F] text-white overflow-hidden relative">
      <AnimatedBackground />
      
      <Navbar 
        walletConnected={walletConnected}
        onConnectWallet={handleConnectWallet}
        onLogoClick={() => setCurrentView('landing')}
      />

      {currentView === 'landing' ? (
        <LandingPage onLaunchApp={handleLaunchApp} />
      ) : (
        <Dashboard
          onDepositClick={() => setDepositModalOpen(true)}
          onEligibilityClick={() => setEligibilityModalOpen(true)}
          onBorrowRepayClick={() => setBorrowRepayModalOpen(true)}
          onAdminClick={() => setAdminModalOpen(true)}
          walletConnected={walletConnected}
          // ⚠️ ADDED: Pass provider and address to Dashboard
          provider={provider} 
          userAddress={userAddress}
        />
      )}

      <DepositModal 
        isOpen={depositModalOpen} 
        onClose={() => setDepositModalOpen(false)} 
      />

      <EligibilityModal 
        isOpen={eligibilityModalOpen} 
        onClose={() => setEligibilityModalOpen(false)} 
      />

      <BorrowRepayModal 
        isOpen={borrowRepayModalOpen} 
        onClose={() => setBorrowRepayModalOpen(false)} 
      />

      <AdminModal 
        isOpen={adminModalOpen} 
        onClose={() => setAdminModalOpen(false)} 
      />
    </div>
  );
}
