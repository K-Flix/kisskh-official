
'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

export function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant="default"
                    size="icon"
                    onClick={scrollToTop}
                    className={cn(
                        'rounded-full h-12 w-12 transition-opacity duration-300',
                        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    )}
                    aria-label="Back to top"
                    >
                    <ArrowUp className="h-6 w-6" />
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Back to top</p>
            </TooltipContent>
      </Tooltip>
    </div>
  );
}
