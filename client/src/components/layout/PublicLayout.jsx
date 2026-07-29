import React from 'react';
import AppLayout from './AppLayout';
import AnimatedOutlet from './AnimatedOutlet';
import Navbar from '../navigation/Navbar';
import Footer from '../navigation/Footer';
import MobileDrawer from '../navigation/MobileDrawer';

const PublicLayout = () => {
  return (
    <AppLayout isProtected={false}>
      <Navbar />
      <MobileDrawer />
      <main className="main-content">
        <AnimatedOutlet />
      </main>
      <Footer />
    </AppLayout>
  );
};

export default PublicLayout;
