
'use client';

import { useEffect } from 'react';
import { useTheme } from '@/context/theme-context';

export function ThemeInjector() {
  const { theme } = useTheme();
  
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-hsl', theme);
  }, [theme]);

  return null;
}
