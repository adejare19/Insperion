import { Shield, Wallet } from 'lucide-react';
import { motion } from 'motion/react';

interface NavbarProps {
  walletConnected: boolean;
  onConnectWallet: () => void;
  onLogoClick: () => void;
}

export function Navbar({ walletConnected, onConnectWallet, onLogoClick }: NavbarProps) {
  return (
    <nav className="relative z-50 border-b border-white/10 backdrop-blur-xl bg-black/20">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={onLogoClick}
            className="flex items-center gap-2 group"
          >
            <div className="relative">
              <Shield className="w-8 h-8 text-[#7C3AED] group-hover:text-[#00D1FF] transition-colors" />
              <motion.div
                className="absolute inset-0 bg-[#7C3AED] rounded-full blur-xl opacity-50"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <span className="text-2xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">
              Insperion
            </span>
          </button>

          <div className="flex items-center gap-8">
            <a href="#" className="text-[#9CA3AF] hover:text-white transition-colors">
              Docs
            </a>
            <a href="#" className="text-[#9CA3AF] hover:text-white transition-colors">
              About
            </a>
            
            <motion.button
              onClick={onConnectWallet}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] rounded-lg hover:shadow-lg hover:shadow-[#8B5CF6]/50 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Wallet className="w-4 h-4" />
              {walletConnected ? 'Connected' : 'Connect Wallet'}
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  );
}
