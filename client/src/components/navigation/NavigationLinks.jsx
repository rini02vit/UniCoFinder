import React from 'react';
import NavigationItem from './NavigationItem';
import { ROUTES } from '../../constants/routes';
import { Building2, GraduationCap, LayoutDashboard, Search, Scale, FileText, PieChart, Sparkles } from 'lucide-react';

export const PUBLIC_LINKS = [
  { to: ROUTES.UNIVERSITIES, label: 'Universities', icon: Building2 },
  { to: ROUTES.SCHOLARSHIPS, label: 'Scholarships', icon: GraduationCap },
];

export const PROTECTED_LINKS = [
  { to: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { to: ROUTES.UNIVERSITIES, label: 'Universities', icon: Search },
  { to: ROUTES.SCHOLARSHIPS, label: 'Scholarships', icon: GraduationCap },
  { to: ROUTES.COMPARE, label: 'Compare', icon: Scale },
  { to: ROUTES.APPLICATION_TRACKER, label: 'Applications', icon: FileText },
  { to: ROUTES.BUDGET, label: 'Budget', icon: PieChart },
  { to: ROUTES.AI_ADVISOR, label: 'AI Advisor', icon: Sparkles },
];

const NavigationLinks = ({ links, onItemClick, className = '' }) => {
  return (
    <>
      {links.map((link) => (
        <NavigationItem
          key={link.to}
          to={link.to}
          label={link.label}
          icon={link.icon}
          onClick={onItemClick}
          className={className}
        />
      ))}
    </>
  );
};

export default NavigationLinks;
