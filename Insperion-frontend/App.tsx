import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { DepositModal } from './components/DepositModal';
import { EligibilityModal } from './components/EligibilityModal';
import { BorrowRepayModal } from './components/BorrowRepayModal';
import { AdminModal } from './components/AdminModal';
import { AnimatedBackground } from './components/AnimatedBackground';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  const [walletConnected, setWalletConnected] = useState(false);
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [eligibilityModalOpen, setEligibilityModalOpen] = useState(false);
  const [borrowRepayModalOpen, setBorrowRepayModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  const handleConnectWallet = () => {
    setWalletConnected(true);
  };

  const handleLaunchApp = () => {
    if (!walletConnected) {
      setWalletConnected(true);
    }
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
