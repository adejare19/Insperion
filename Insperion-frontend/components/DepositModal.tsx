import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Loader2, CheckCircle } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DepositModal({ isOpen, onClose }: DepositModalProps) {
  const [amount, setAmount] = useState('');
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEncrypting(true);
    
    // Simulate encryption process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsEncrypting(false);
    setIsSuccess(true);
    
    // Auto close after success
    setTimeout(() => {
      setIsSuccess(false);
      setAmount('');
      onClose();
    }, 2000);
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
            onClick={onClose}
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
                <h2 className="text-2xl">Deposit Collateral</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!isSuccess ? (
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
                        ETH
                      </div>
                    </div>
                  </div>

                  {isEncrypting && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 bg-[#7C3AED]/10 border border-[#7C3AED]/30 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        >
                          <Lock className="w-5 h-5 text-[#7C3AED]" />
                        </motion.div>
                        <div>
                          <div className="text-sm">Encrypting amount...</div>
                          <div className="text-xs text-[#9CA3AF]">
                            Using FHE to secure your data
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={isEncrypting || !amount}
                    className="w-full py-3 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] rounded-lg hover:shadow-lg hover:shadow-[#8B5CF6]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    whileHover={{ scale: isEncrypting ? 1 : 1.02 }}
                    whileTap={{ scale: isEncrypting ? 1 : 0.98 }}
                  >
                    {isEncrypting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Encrypting...
                      </>
                    ) : (
                      'Submit Encrypted Deposit'
                    )}
                  </motion.button>

                  <p className="text-xs text-[#9CA3AF] mt-4 text-center">
                    Your deposit will be encrypted using FHE before submission
                  </p>
                </form>
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
                  <h3 className="text-2xl mb-2">Success!</h3>
                  <p className="text-[#9CA3AF]">
                    Encrypted deposit of {amount} ETH submitted successfully
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
