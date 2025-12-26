import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark(!isDark);

  const theme = {
    isDark,
    colors: {
      primary: isDark ? '#3498db' : '#2c3e50',
      secondary: isDark ? '#2c3e50' : '#3498db',
      background: isDark ? '#1a1a1a' : '#f5f5f5',
      surface: isDark ? '#2d2d2d' : '#ffffff',
      text: isDark ? '#ffffff' : '#2c3e50',
      textSecondary: isDark ? '#b0b0b0' : '#7f8c8d',
      border: isDark ? '#404040' : '#ddd',
      success: '#27ae60',
      error: '#e74c3c',
      warning: '#f39c12'
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};