// Insperion-frontend/components/BorrowRepayModal.tsx

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Loader2, CheckCircle } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { encryptUint64 } from '../fhevm/encrypt'; // Import FHE encryption
import { getRegistryContract } from '../contracts/registry'; // Import contract logic
import { ethers } from 'ethers'; // Import ethers for types

interface BorrowRepayModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Add required props for blockchain interaction
  provider: ethers.BrowserProvider | null; 
}

export function BorrowRepayModal({ isOpen, onClose, provider }: BorrowRepayModalProps) {
  const [mode, setMode] = useState<'borrow' | 'repay'>('borrow');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null); // New state for errors

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorStatus(null);
    
    const floatAmount = parseFloat(amount);
    if (!floatAmount || floatAmount <= 0 || !provider) {
      setErrorStatus("Invalid amount or wallet not connected.");
      return;
    }

    setIsProcessing(true);
    
    try {
      // 1. Encrypt the amount using the client SDK
      const encrypted = await encryptUint64(floatAmount);

      // 2. Get the contract instance (must have the signer)
      const registry = getRegistryContract(provider);
      
      // 3. Call the appropriate encrypted function
      let tx: ethers.ContractTransactionResponse;

      if (mode === 'borrow') {
        tx = await registry.borrow(encrypted.handles[0]);
      } else { // repay
        tx = await registry.repay(encrypted.handles[0]);
      }

      // Wait for the transaction to be mined
      await tx.wait();
      
      setIsSuccess(true);
      
      // Auto close after success
      setTimeout(() => {
        handleClose();
      }, 2000);

    } catch (error: any) {
      console.error("FHE Transaction Failed:", error);
      setErrorStatus(`Transaction failed: ${error.message.substring(0, 50)}...`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setIsProcessing(false);
    setAmount('');
    setErrorStatus(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md"
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl">Manage Loan</h2>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!isSuccess ? (
                <>
                  {/* Mode Toggle */}
                  <div className="flex gap-2 p-1 bg-black/40 rounded-lg mb-6">
                    <button
                      onClick={() => setMode('borrow')}
                      className={`flex-1 py-2 rounded-md transition-all ${
                        mode === 'borrow'
                          ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] shadow-lg'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      Borrow
                    </button>
                    <button
                      onClick={() => setMode('repay')}
                      className={`flex-1 py-2 rounded-md transition-all ${
                        mode === 'repay'
                          ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] shadow-lg'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      Repay
                    </button>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                      <label className="block text-sm text-[#9CA3AF] mb-2">
                        Amount
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="0.00"
                          className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg focus:border-[#7C3AED] focus:outline-none transition-colors"
                          required
                          min="0"
                          step="0.01"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                          USD
                        </div>
                      </div>
                    </div>
                      
                      {/* Error Display */}
                      {errorStatus && (
                        <div className="mb-4 p-3 bg-red-600/20 text-red-400 rounded-lg text-sm">
                            Error: {errorStatus}
                        </div>
                      )}

                    {/* Loan Details */}
                    <div className="mb-6 p-4 bg-black/40 rounded-lg space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#9CA3AF]">Interest Rate</span>
                        <span className="text-[#00D1FF]">5.0% APR</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#9CA3AF]">Available</span>
                        <span className="text-[#FACC15]">$50,000</span>
                      </div>
                      {mode === 'borrow' && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#9CA3AF]">Collateral Required</span>
                          <span className="text-[#7C3AED]">
                            {amount ? `$${(floatAmount * 1.33).toFixed(2)}` : '$0.00'}
                          </span>
                        </div>
                      )}
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isProcessing || !amount}
                      className="w-full py-3 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] rounded-lg hover:shadow-lg hover:shadow-[#8B5CF6]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                      whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Encrypting & Sending...
                        </>
                      ) : (
                        `Submit ${mode === 'borrow' ? 'Borrow' : 'Repayment'}`
                      )}
                    </motion.button>

                    <p className="text-xs text-[#9CA3AF] mt-4 text-center">
                      Transaction will be processed privately using encrypted data
                    </p>
                  </form>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.5 }}
                    className="inline-block p-4 bg-green-500/20 rounded-full mb-4"
                  >
                    <CheckCircle className="w-12 h-12 text-green-500" />
                  </motion.div>
                  <h3 className="text-2xl mb-2">Transaction Processed</h3>
                  <p className="text-[#9CA3AF]">
                    {mode === 'borrow' ? 'Loan of' : 'Repayment of'} ${amount} processed privately
                  </p>
                </motion.div>
              )}
            </GlassCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
