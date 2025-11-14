import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface EligibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EligibilityModal({ isOpen, onClose }: EligibilityModalProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<'eligible' | 'not-eligible' | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsChecking(true);
      setResult(null);

      // Simulate eligibility check
      setTimeout(() => {
        setIsChecking(false);
        // Randomly determine eligibility for demo
        setResult(Math.random() > 0.3 ? 'eligible' : 'not-eligible');
      }, 3000);
    }
  }, [isOpen]);

  const handleClose = () => {
    setResult(null);
    setIsChecking(false);
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
                <h2 className="text-2xl">Eligibility Check</h2>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-center py-8">
                {isChecking && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="inline-block mb-4"
                    >
                      <Loader2 className="w-16 h-16 text-[#7C3AED]" />
                    </motion.div>
                    <h3 className="text-xl mb-2">Verifying Encrypted Score...</h3>
                    <p className="text-[#9CA3AF]">
                      Computing on encrypted data without revealing your information
                    </p>
                  </motion.div>
                )}

                {result === 'eligible' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', duration: 0.5 }}
                      className="inline-block p-4 bg-green-500/20 rounded-full mb-4"
                      style={{
                        boxShadow: '0 0 40px rgba(34, 197, 94, 0.4)',
                      }}
                    >
                      <CheckCircle className="w-16 h-16 text-green-500" />
                    </motion.div>
                    <h3 className="text-2xl mb-2 text-green-500">Eligible for Borrowing</h3>
                    <p className="text-[#9CA3AF] mb-6">
                      Your encrypted credit score meets the minimum requirements
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-left">
                      <div className="p-3 bg-black/40 rounded-lg">
                        <div className="text-xs text-[#9CA3AF] mb-1">Max Borrow</div>
                        <div className="text-green-500">$50,000</div>
                      </div>
                      <div className="p-3 bg-black/40 rounded-lg">
                        <div className="text-xs text-[#9CA3AF] mb-1">Interest Rate</div>
                        <div className="text-green-500">5.0% APR</div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {result === 'not-eligible' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', duration: 0.5 }}
                      className="inline-block p-4 bg-red-500/20 rounded-full mb-4"
                      style={{
                        boxShadow: '0 0 40px rgba(239, 68, 68, 0.4)',
                      }}
                    >
                      <XCircle className="w-16 h-16 text-red-500" />
                    </motion.div>
                    <h3 className="text-2xl mb-2 text-red-500">Not Eligible Yet</h3>
                    <p className="text-[#9CA3AF] mb-6">
                      Your encrypted score doesn't meet minimum requirements
                    </p>
                    <div className="p-4 bg-black/40 rounded-lg text-left">
                      <div className="text-sm mb-2">Suggestions:</div>
                      <ul className="text-sm text-[#9CA3AF] space-y-1">
                        <li>• Increase your collateral balance</li>
                        <li>• Maintain good repayment history</li>
                        <li>• Wait for score recalculation</li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
