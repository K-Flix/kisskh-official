
'use client';

import { useTheme } from '@/context/theme-context';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
    const { theme } = useTheme();
    
    return (
        <html 
            lang="en" 
            className={`dark ${inter.variable}`}
            style={{ '--primary-hsl': theme } as React.CSSProperties}
        >
            {children}
        </html>
    )
}
