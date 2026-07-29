import React from 'react';
import { NavLink } from 'react-router-dom';

const NavigationItem = ({ to, icon: Icon, label, onClick, className = '' }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => `${className} ${isActive ? 'active' : ''}`}
    >
      {Icon && <Icon size={20} />}
      {label}
    </NavLink>
  );
};

export default NavigationItem;
