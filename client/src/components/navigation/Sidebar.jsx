import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import NavigationLinks, { PROTECTED_LINKS } from './NavigationLinks';
import { ROUTES } from '../../constants/routes';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="navbar-brand" style={{ padding: '1rem 1rem 2rem' }}>
        <Link to={ROUTES.HOME} className="text-gradient">UniCoFinder</Link>
      </div>
      
      <NavigationLinks links={PROTECTED_LINKS} />
      
      <div style={{ flexGrow: 1 }}></div>
      
      {/* Logout Link */}
      <Link to={ROUTES.LOGIN} style={{ color: 'var(--danger)' }}>
        <LogOut size={20} />
        Logout
      </Link>
    </aside>
  );
};

export default Sidebar;
