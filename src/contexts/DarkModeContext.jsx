import React, { createContext, useContext, useEffect, useState } from 'react';

const DarkModeContext = createContext(undefined);

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
};

export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return JSON.parse(saved);
    if (typeof window !== 'undefined') return window.matchMedia('(prefers-color-scheme: dark)').matches;
    return false;
  });

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);
  const setDarkMode = (dark) => setIsDarkMode(dark);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) { root.setAttribute('data-theme', 'dark'); root.classList.add('dark'); }
    else { root.setAttribute('data-theme', 'light'); root.classList.remove('dark'); }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) { root.setAttribute('data-theme', 'dark'); root.classList.add('dark'); }
    else { root.setAttribute('data-theme', 'light'); root.classList.remove('dark'); }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    root.classList.add('theme-transition');
    const timer = setTimeout(() => root.classList.remove('theme-transition'), 300);
    return () => clearTimeout(timer);
  }, [isDarkMode]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      const hasManual = localStorage.getItem('darkMode') !== null;
      if (!hasManual) setIsDarkMode(e.matches);
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode, setDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};
