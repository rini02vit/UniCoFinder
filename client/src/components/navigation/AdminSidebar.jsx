import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { LogOut, LayoutDashboard, BarChart3, Building2, GraduationCap, Globe, Users, FileText } from 'lucide-react';
import { ROUTES } from '../../constants/routes';

const ADMIN_LINKS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
];

const DISABLED_LINKS = [
  { label: 'Universities', icon: Building2 },
  { label: 'Scholarships', icon: GraduationCap },
  { label: 'Users', icon: Users },
  { label: 'Reports', icon: FileText },
];

const AdminSidebar = () => {
  return (
    <aside className="sidebar">
      <div className="navbar-brand" style={{ padding: '1rem 1rem 2rem' }}>
        <Link to={ROUTES.HOME} className="text-gradient">UniCoFinder Admin</Link>
      </div>
      
      {ADMIN_LINKS.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          <link.icon size={20} />
          {link.label}
        </NavLink>
      ))}

      <div className="sidebar-section">
        <h3 className="section-label">CONTENT</h3>
        <nav className="nav-menu">
          <NavLink to="/admin/universities" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <Building2 size={20} />
            <span>Universities</span>
          </NavLink>
          <NavLink to="/admin/scholarships" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <GraduationCap size={20} />
            <span>Scholarships</span>
          </NavLink>
          <NavLink to="/admin/countries" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <Globe2 size={20} />
            <span>Countries</span>
          </NavLink>
        </nav>
      </div>

      <div style={{ marginTop: '2rem', marginBottom: '0.5rem', paddingLeft: '1rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
        Coming Soon
      </div>

      {DISABLED_LINKS.map((link) => (
        <div
          key={link.label}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            color: 'var(--text-muted)',
            cursor: 'not-allowed',
            opacity: 0.6
          }}
          title={`${link.label} will be available in a future update`}
        >
          <link.icon size={20} />
          {link.label}
        </div>
      ))}
      
      <div style={{ flexGrow: 1 }}></div>
      
      {/* Bottom Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Link to={ROUTES.LOGIN} style={{ color: 'var(--danger)' }}>
          <LogOut size={20} />
          Logout
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
