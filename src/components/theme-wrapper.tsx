
'use client';

import { useTheme } from '@/context/theme-context';
import { useEffect, useState } from 'react';

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
    const { theme } = useTheme();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const style = isMounted ? { '--primary-hsl': theme } as React.CSSProperties : {};
    
    // The <html> and <body> tags are now in the root layout.
    // This component just applies the theme CSS variable.
    return (
        <div style={style} className="contents">
            {children}
        </div>
    )
}
