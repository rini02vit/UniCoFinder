import React from 'react';
import AppLayout from './AppLayout';
import AnimatedOutlet from './AnimatedOutlet';
import AdminSidebar from '../navigation/AdminSidebar';
import MobileDrawer from '../navigation/MobileDrawer';

const AdminLayout = () => {
  return (
    <AppLayout isProtected={true}>
      <AdminSidebar />
      <MobileDrawer />
      <main className="main-content">
        <AnimatedOutlet />
      </main>
    </AppLayout>
  );
};

export default AdminLayout;
