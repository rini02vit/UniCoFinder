import React from 'react';
import AppLayout from './AppLayout';
import AnimatedOutlet from './AnimatedOutlet';
import Sidebar from '../navigation/Sidebar';
import MobileDrawer from '../navigation/MobileDrawer';
import AIChatWidget from '../../features/ai/components/AIChatWidget';

const ProtectedLayout = () => {
  return (
    <AppLayout isProtected={true}>
      <Sidebar />
      <MobileDrawer />
      <main className="main-content">
        <AnimatedOutlet />
      </main>
      <AIChatWidget />
    </AppLayout>
  );
};

export default ProtectedLayout;
