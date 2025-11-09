
'use client';

import { useTheme } from '@/context/theme-context';
import { Palette } from 'lucide-react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

const colors = [
  { name: 'Orange', hsl: '29 94% 51%' },
  { name: 'Blue', hsl: '221.2 83.2% 53.3%' },
  { name: 'Rose', hsl: '346.8 77.2% 49.8%' },
  { name: 'Green', hsl: '142.1 76.2% 36.3%' },
  { name: 'Cyan', hsl: '187 100% 37.8%' },
  { name: 'Violet', hsl: '262.1 83.3% 57.8%' },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white">
                <Palette />
                <span className="sr-only">Switch theme</span>
              </Button>
            </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>
            <p>Change Theme</p>
        </TooltipContent>
      </Tooltip>
      <PopoverContent className="w-auto p-2 bg-secondary border-border/50">
        <div className="grid grid-cols-3 gap-2">
          {colors.map((color) => {
            const isActive = theme === color.hsl;
            return (
              <Tooltip key={color.name}>
                <TooltipTrigger asChild>
                    <button
                        onClick={() => setTheme(color.hsl)}
                        className={cn(
                        'h-8 w-8 rounded-full border-2 transition-transform hover:scale-110',
                        isActive ? 'border-white' : 'border-transparent'
                        )}
                        style={{ backgroundColor: `hsl(${color.hsl})` }}
                        aria-label={`Switch to ${color.name} theme`}
                    />
                </TooltipTrigger>
                <TooltipContent>
                    <p>{color.name}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
