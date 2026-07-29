import React, { createContext, useState, useEffect } from 'react';
import { getStorageItem, setStorageItem } from '../utils/storage';

export const ThemeContext = createContext();

const THEME_KEY = 'unicofinder-theme';

export const ThemeProvider = ({ children }) => {
  // theme can be 'light', 'dark', or 'system'
  const [theme, setTheme] = useState(() => getStorageItem(THEME_KEY, 'system'));

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (currentTheme) => {
      let resolvedTheme = currentTheme;
      if (currentTheme === 'system') {
        resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }

      if (resolvedTheme === 'light') {
        root.setAttribute('data-theme', 'light');
      } else {
        root.removeAttribute('data-theme');
      }
    };

    applyTheme(theme);
    setStorageItem(THEME_KEY, theme);

    // Listen for system theme changes if theme is set to 'system'
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
