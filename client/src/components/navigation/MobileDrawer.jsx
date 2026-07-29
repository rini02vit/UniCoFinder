import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import NavigationLinks, { PUBLIC_LINKS, PROTECTED_LINKS } from './NavigationLinks';
import { ROUTES } from '../../constants/routes';
import { NavigationContext } from '../layout/AppLayout';

const MobileDrawer = () => {
  const { isMobileDrawerOpen, setIsMobileDrawerOpen } = useContext(NavigationContext);
  
  // Note: For this layout, we'll assume the drawer needs to know if it's protected or public.
  // We can pass a prop or just check a context if needed, but for simplicity, we'll render 
  // public links here as a fallback or if there's no auth context yet. 
  // In a real app with AuthContext, we'd toggle these links based on isAuthenticated.
  const links = PUBLIC_LINKS; 

  const handleClose = () => setIsMobileDrawerOpen(false);

  return (
    <AnimatePresence>
      {isMobileDrawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="modal-backdrop active"
            style={{ zIndex: 99 }}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              bottom: 0,
              width: '80%',
              maxWidth: '300px',
              backgroundColor: 'var(--bg-color)',
              borderRight: '1px solid var(--border-color)',
              zIndex: 100,
              padding: '2rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <Link to={ROUTES.HOME} className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 800, textDecoration: 'none' }} onClick={handleClose}>
                UniCoFinder
              </Link>
              <button onClick={handleClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <NavigationLinks 
                links={links} 
                onItemClick={handleClose} 
                className="btn btn-secondary btn-block" 
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileDrawer;
