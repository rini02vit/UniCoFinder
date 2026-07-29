import React, { useState } from 'react';
import AnimatedOutlet from './AnimatedOutlet';

export const NavigationContext = React.createContext();

const AppLayout = ({ children, isProtected = false }) => {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  return (
    <NavigationContext.Provider value={{ isMobileDrawerOpen, setIsMobileDrawerOpen }}>
      <div className={`app-container ${isProtected ? 'has-sidebar' : ''}`}>
        {children}
      </div>
    </NavigationContext.Provider>
  );
};

export default AppLayout;
