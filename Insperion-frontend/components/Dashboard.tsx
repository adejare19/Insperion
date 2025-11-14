import { motion } from 'motion/react';
import { Lock, TrendingUp, DollarSign, Activity, Settings } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface DashboardProps {
  onDepositClick: () => void;
  onEligibilityClick: () => void;
  onBorrowRepayClick: () => void;
  onAdminClick: () => void;
  walletConnected: boolean;
}

export function Dashboard({ 
  onDepositClick, 
  onEligibilityClick, 
  onBorrowRepayClick,
  onAdminClick,
  walletConnected 
}: DashboardProps) {
  return (
    <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl mb-2">Dashboard</h1>
          <p className="text-[#9CA3AF]">Manage your encrypted credit account</p>
        </div>
        <button
          onClick={onAdminClick}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
        >
          <Settings className="w-6 h-6 text-[#9CA3AF] hover:text-white" />
        </button>
      </div>

      {/* Encrypted Account Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-6 hover:border-[#7C3AED]/50 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-[#9CA3AF]">Encrypted Collateral</div>
              <div className="p-2 bg-[#7C3AED]/20 rounded-lg">
                <Lock className="w-5 h-5 text-[#7C3AED]" />
              </div>
            </div>
            <div className="text-3xl mb-2 flex items-center gap-2">
              <span className="text-[#7C3AED]">🔒</span>
              <span className="text-[#9CA3AF]">Hidden</span>
            </div>
            <p className="text-xs text-[#9CA3AF]">
              All data encrypted on-chain via Zama FHEVM
            </p>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="p-6 hover:border-[#00D1FF]/50 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-[#9CA3AF]">Encrypted Score</div>
              <div className="p-2 bg-[#00D1FF]/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-[#00D1FF]" />
              </div>
            </div>
            <div className="text-3xl mb-2 flex items-center gap-2">
              <span className="text-[#00D1FF]">🔒</span>
              <span className="text-[#9CA3AF]">Hidden</span>
            </div>
            <p className="text-xs text-[#9CA3AF]">
              Score computed on encrypted data
            </p>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard className="p-6 hover:border-[#FACC15]/50 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-[#9CA3AF]">Loan Balance</div>
              <div className="p-2 bg-[#FACC15]/20 rounded-lg">
                <DollarSign className="w-5 h-5 text-[#FACC15]" />
              </div>
            </div>
            <div className="text-3xl mb-2 flex items-center gap-2">
              <span className="text-[#FACC15]">🔒</span>
              <span className="text-[#9CA3AF]">Hidden</span>
            </div>
            <p className="text-xs text-[#9CA3AF]">
              Private loan balance tracking
            </p>
          </GlassCard>
        </motion.div>
      </div>

      {/* Actions Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <GlassCard className="p-6 mb-8">
          <h2 className="text-2xl mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.button
              onClick={onDepositClick}
              className="p-4 bg-gradient-to-br from-[#7C3AED]/20 to-[#7C3AED]/5 border border-[#7C3AED]/30 rounded-lg hover:border-[#7C3AED] transition-all group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-left">
                <div className="text-3xl mb-2">💳</div>
                <div className="group-hover:text-[#7C3AED] transition-colors">
                  Deposit Collateral
                </div>
                <div className="text-sm text-[#9CA3AF] mt-1">Add encrypted funds</div>
              </div>
            </motion.button>

            <motion.button
              onClick={onEligibilityClick}
              className="p-4 bg-gradient-to-br from-[#00D1FF]/20 to-[#00D1FF]/5 border border-[#00D1FF]/30 rounded-lg hover:border-[#00D1FF] transition-all group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-left">
                <div className="text-3xl mb-2">✅</div>
                <div className="group-hover:text-[#00D1FF] transition-colors">
                  Check Eligibility
                </div>
                <div className="text-sm text-[#9CA3AF] mt-1">Verify borrowing status</div>
              </div>
            </motion.button>

            <motion.button
              onClick={onBorrowRepayClick}
              className="p-4 bg-gradient-to-br from-[#FACC15]/20 to-[#FACC15]/5 border border-[#FACC15]/30 rounded-lg hover:border-[#FACC15] transition-all group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-left">
                <div className="text-3xl mb-2">🪙</div>
                <div className="group-hover:text-[#FACC15] transition-colors">
                  Borrow / Repay
                </div>
                <div className="text-sm text-[#9CA3AF] mt-1">Manage your loans</div>
              </div>
            </motion.button>

            <motion.button
              onClick={onBorrowRepayClick}
              className="p-4 bg-gradient-to-br from-[#EC4899]/20 to-[#EC4899]/5 border border-[#EC4899]/30 rounded-lg hover:border-[#EC4899] transition-all group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-left">
                <div className="text-3xl mb-2">📊</div>
                <div className="group-hover:text-[#EC4899] transition-colors">
                  View Analytics
                </div>
                <div className="text-sm text-[#9CA3AF] mt-1">Track your activity</div>
              </div>
            </motion.button>
          </div>
        </GlassCard>
      </motion.div>

      {/* Policy Overview & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard className="p-6">
            <h2 className="text-2xl mb-6">System Policy</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                <span className="text-[#9CA3AF]">Max LTV</span>
                <span className="text-[#7C3AED]">75%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                <span className="text-[#9CA3AF]">Min Score</span>
                <span className="text-[#00D1FF]">500</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                <span className="text-[#9CA3AF]">Liquidation Threshold</span>
                <span className="text-[#FACC15]">80%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                <span className="text-[#9CA3AF]">APR</span>
                <span className="text-[#EC4899]">5.0%</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-6 h-6 text-[#7C3AED]" />
              <h2 className="text-2xl">Activity Feed</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#7C3AED]/20 rounded-lg">
                  <span className="text-xl">💳</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm">Collateral updated successfully</div>
                  <div className="text-xs text-[#9CA3AF]">2 hours ago</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#00D1FF]/20 rounded-lg">
                  <span className="text-xl">✅</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm">Eligibility check: PASSED</div>
                  <div className="text-xs text-[#9CA3AF]">1 day ago</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#FACC15]/20 rounded-lg">
                  <span className="text-xl">🪙</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm">Loan repayment processed</div>
                  <div className="text-xs text-[#9CA3AF]">3 days ago</div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
