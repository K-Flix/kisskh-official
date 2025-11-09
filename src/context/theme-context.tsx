
'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';

const DEFAULT_THEME = '29 94% 51%'; // Orange

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<string>(() => {
    if (typeof window === 'undefined') {
        return DEFAULT_THEME;
    }
    try {
        const storedTheme = localStorage.getItem('kisskh-theme');
        return storedTheme ? storedTheme : DEFAULT_THEME;
    } catch (error) {
        console.error('Failed to read theme from localStorage', error);
        return DEFAULT_THEME;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('kisskh-theme', theme);
    } catch (error) {
      console.error('Failed to save theme to localStorage', error);
    }
  }, [theme]);

  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
  };
  
  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
