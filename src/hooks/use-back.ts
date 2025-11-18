
'use client';

import { useApp } from '@/context/app-context';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function useBack() {
  const router = useRouter();
  const { previousPath } = useApp();

  const handleBack = useCallback(() => {
    // Check if there is history to go back to in the browser
    if (window.history.length > 2 && previousPath) {
        router.back();
    } else if (previousPath) {
        router.push(previousPath);
    } else {
        router.push('/');
    }
  }, [router, previousPath]);

  return { handleBack };
}
