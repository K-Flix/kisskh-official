
'use client';

import { useTheme } from '@/context/theme-context';
import { Inter } from 'next/font/google';
import { useEffect, useState } from 'react';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
    const { theme } = useTheme();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const style = isMounted ? { '--primary-hsl': theme } as React.CSSProperties : {};
    
    return (
        <html 
            lang="en" 
            className={`dark ${inter.variable}`}
            style={style}
        >
            <body className="font-body antialiased min-h-screen bg-background">
                {children}
            </body>
        </html>
    )
}
