import { motion } from 'motion/react';
import { Lock, Shield, Eye, ArrowRight, Sparkles } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface LandingPageProps {
  onLaunchApp: () => void;
}

export function LandingPage({ onLaunchApp }: LandingPageProps) {
  return (
    <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
      {/* Hero Section */}
      <div className="text-center mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#7C3AED]/20 border border-[#7C3AED]/50 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-[#FACC15]" />
            <span className="text-sm text-[#9CA3AF]">Powered by Fully Homomorphic Encryption</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl mb-6 bg-gradient-to-r from-white via-[#00D1FF] to-[#8B5CF6] bg-clip-text text-transparent">
            Reimagine Credit. Privately.
          </h1>
          
          <p className="text-xl text-[#9CA3AF] mb-10 max-w-2xl mx-auto">
            Encrypted lending powered by Fully Homomorphic Encryption. Your credit, your privacy, secured on-chain.
          </p>

          <div className="flex items-center justify-center gap-4">
            <motion.button
              onClick={onLaunchApp}
              className="px-8 py-4 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] rounded-lg flex items-center gap-2 hover:shadow-2xl hover:shadow-[#8B5CF6]/50 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Launch App
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              className="px-8 py-4 border border-[#7C3AED] rounded-lg hover:bg-[#7C3AED]/10 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <GlassCard className="p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#7C3AED] to-[#EC4899] rounded-lg flex items-center justify-center mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl mb-2">Fully Encrypted</h3>
            <p className="text-[#9CA3AF]">
              All data encrypted on-chain via Zama FHEVM. Your information stays private, always.
            </p>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <GlassCard className="p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#00D1FF] to-[#7C3AED] rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl mb-2">Trustless Verification</h3>
            <p className="text-[#9CA3AF]">
              Smart contracts verify creditworthiness without exposing sensitive data.
            </p>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <GlassCard className="p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FACC15] to-[#EC4899] rounded-lg flex items-center justify-center mb-4">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-xl mb-2">Zero Knowledge</h3>
            <p className="text-[#9CA3AF]">
              Prove your eligibility without revealing your credit score or financial details.
            </p>
          </GlassCard>
        </motion.div>
      </div>

      {/* Visual Demo Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <GlassCard className="p-8">
          <h3 className="text-2xl mb-6 text-center">Your Data, Encrypted</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-black/40 rounded-lg border border-[#7C3AED]/30">
              <div className="text-sm text-[#9CA3AF] mb-2">Collateral Balance</div>
              <div className="flex items-center gap-2 text-xl">
                <Lock className="w-5 h-5 text-[#7C3AED]" />
                <span className="text-[#7C3AED]">🔒 Hidden</span>
              </div>
            </div>
            
            <div className="p-4 bg-black/40 rounded-lg border border-[#00D1FF]/30">
              <div className="text-sm text-[#9CA3AF] mb-2">Credit Score</div>
              <div className="flex items-center gap-2 text-xl">
                <Lock className="w-5 h-5 text-[#00D1FF]" />
                <span className="text-[#00D1FF]">🔒 Hidden</span>
              </div>
            </div>
            
            <div className="p-4 bg-black/40 rounded-lg border border-[#FACC15]/30">
              <div className="text-sm text-[#9CA3AF] mb-2">Loan Balance</div>
              <div className="flex items-center gap-2 text-xl">
                <Lock className="w-5 h-5 text-[#FACC15]" />
                <span className="text-[#FACC15]">🔒 Hidden</span>
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-[#9CA3AF] mt-6">
            All computations happen on encrypted data. Nobody can see your information.
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
