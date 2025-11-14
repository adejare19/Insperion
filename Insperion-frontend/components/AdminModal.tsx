import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Loader2, CheckCircle, Shield } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminModal({ isOpen, onClose }: AdminModalProps) {
  const [maxLtv, setMaxLtv] = useState('75');
  const [minScore, setMinScore] = useState('500');
  const [liqThreshold, setLiqThreshold] = useState('80');
  const [aprBps, setAprBps] = useState('500');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate encryption and update process
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    setIsProcessing(false);
    setIsSuccess(true);
    
    // Auto close after success
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2000);
  };

  const handleClose = () => {
    setIsSuccess(false);
    setIsProcessing(false);
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
                <div className="flex items-center gap-2">
                  <Shield className="w-6 h-6 text-[#7C3AED]" />
                  <h2 className="text-2xl">Admin Policy Config</h2>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!isSuccess ? (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm text-[#9CA3AF] mb-2">
                        Max LTV (%)
                      </label>
                      <input
                        type="number"
                        value={maxLtv}
                        onChange={(e) => setMaxLtv(e.target.value)}
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg focus:border-[#7C3AED] focus:outline-none transition-colors"
                        required
                        min="0"
                        max="100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-[#9CA3AF] mb-2">
                        Minimum Score
                      </label>
                      <input
                        type="number"
                        value={minScore}
                        onChange={(e) => setMinScore(e.target.value)}
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg focus:border-[#00D1FF] focus:outline-none transition-colors"
                        required
                        min="0"
                        max="1000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-[#9CA3AF] mb-2">
                        Liquidation Threshold (%)
                      </label>
                      <input
                        type="number"
                        value={liqThreshold}
                        onChange={(e) => setLiqThreshold(e.target.value)}
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg focus:border-[#FACC15] focus:outline-none transition-colors"
                        required
                        min="0"
                        max="100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-[#9CA3AF] mb-2">
                        APR (Basis Points)
                      </label>
                      <input
                        type="number"
                        value={aprBps}
                        onChange={(e) => setAprBps(e.target.value)}
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg focus:border-[#EC4899] focus:outline-none transition-colors"
                        required
                        min="0"
                      />
                      <div className="text-xs text-[#9CA3AF] mt-1">
                        {aprBps ? `${(parseInt(aprBps) / 100).toFixed(2)}% APR` : '0% APR'}
                      </div>
                    </div>
                  </div>

                  {isProcessing && (
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
                          <div className="text-sm">Encrypting policy parameters...</div>
                          <div className="text-xs text-[#9CA3AF]">
                            Updating encrypted on-chain configuration
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-3 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] rounded-lg hover:shadow-lg hover:shadow-[#8B5CF6]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{
                      boxShadow: '0 0 30px rgba(139, 92, 246, 0.3)',
                    }}
                    whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                    whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Update Policy Parameters'
                    )}
                  </motion.button>

                  <p className="text-xs text-[#9CA3AF] mt-4 text-center">
                    All policy parameters will be encrypted before on-chain update
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
                  <h3 className="text-2xl mb-2">Policy Updated</h3>
                  <p className="text-[#9CA3AF]">
                    Encrypted policy parameters updated successfully
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
