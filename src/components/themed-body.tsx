
'use client';

import { useTheme } from '@/context/theme-context';
import { useEffect } from 'react';

export function ThemedBody({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  useEffect(() => {
    document.body.style.setProperty('--primary-hsl', theme);
  }, [theme]);

  return <>{children}</>;
}
