import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import NavigationLinks, { PUBLIC_LINKS } from './NavigationLinks';
import { ROUTES } from '../../constants/routes';
import { NavigationContext } from '../layout/AppLayout';
import { useAuth } from '../../features/auth/context/AuthContext';

const Navbar = () => {
  const { setIsMobileDrawerOpen } = useContext(NavigationContext);
  const { user, isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-brand">
        <Link to={ROUTES.HOME} className="text-gradient">UniCoFinder</Link>
      </div>
      
      <button 
        className="mobile-menu-btn" 
        onClick={() => setIsMobileDrawerOpen(true)}
        aria-label="Open menu"
      >
        <Menu />
      </button>

      <div className="navbar-nav">
        <NavigationLinks links={PUBLIC_LINKS} />
        
        {isAuthenticated ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
              Hello, {user?.firstName || user?.name || user?.email?.split(/[@.]/)[0] || 'Student'}
            </span>
            <Link to={ROUTES.DASHBOARD} className="btn btn-primary" style={{ padding: '0.5rem 1.2rem' }}>
              Dashboard
            </Link>
          </div>
        ) : (
          <>
            <Link to={ROUTES.LOGIN} className="btn btn-outline" style={{ padding: '0.5rem 1.2rem' }}>
              Log In
            </Link>
            <Link to={ROUTES.REGISTER} className="btn btn-primary" style={{ padding: '0.5rem 1.2rem' }}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
