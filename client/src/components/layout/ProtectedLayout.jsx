import React from 'react';
import AppLayout from './AppLayout';
import AnimatedOutlet from './AnimatedOutlet';
import Sidebar from '../navigation/Sidebar';
import MobileDrawer from '../navigation/MobileDrawer';
import AIChatWidget from '../../features/ai/components/AIChatWidget';
import { Menu } from 'lucide-react';
import { NavigationContext } from './AppLayout';
import { useContext } from 'react';

const MobileHeader = () => {
  const { setIsMobileDrawerOpen } = useContext(NavigationContext);
  return (
    <div className="mobile-header">
      <button onClick={() => setIsMobileDrawerOpen(true)} className="mobile-menu-btn" aria-label="Open Menu">
        <Menu size={24} />
      </button>
      <span className="text-gradient" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>UniCoFinder</span>
      <div style={{ width: '24px' }}></div> {/* Spacer for centering */}
    </div>
  );
};

const ProtectedLayout = () => {
  return (
    <AppLayout isProtected={true}>
      <Sidebar />
      <MobileDrawer />
      <main className="main-content">
        <MobileHeader />
        <AnimatedOutlet />
      </main>
      <AIChatWidget />
    </AppLayout>
  );
};

export default ProtectedLayout;
