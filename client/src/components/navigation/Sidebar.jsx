import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import NavigationLinks, { PROTECTED_LINKS } from './NavigationLinks';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../features/auth/context/AuthContext';

const Sidebar = () => {
  const { logout } = useAuth();
  return (
    <aside className="sidebar">
      <div className="navbar-brand" style={{ padding: '1rem 1rem 2rem' }}>
        <Link to={ROUTES.HOME} className="text-gradient">UniCoFinder</Link>
      </div>
      
      <NavigationLinks links={PROTECTED_LINKS} />
      
      <div style={{ flexGrow: 1 }}></div>
      
      {/* Bottom Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Link to={ROUTES.PROFILE} style={{ color: 'var(--text-secondary)' }}>
          <User size={20} />
          Profile
        </Link>
        <button type="button" className="sidebar-logout-btn" onClick={logout} style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', textAlign: 'left', width: '100%' }}>
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
