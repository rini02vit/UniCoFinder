import React from 'react';

const AppShell = ({ children }) => {
  return (
    <>
      {/* Global components like FullScreenLoader, toast notifications will be mounted here */}
      {children}
    </>
  );
};

export default AppShell;
