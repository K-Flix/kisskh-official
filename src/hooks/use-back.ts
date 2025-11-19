
'use client';

import { useApp } from '@/context/app-context';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function useBack() {
  const router = useRouter();
  const { previousPath } = useApp();

  const handleBack = useCallback(() => {
    const hasHistory = typeof window !== 'undefined' && window.history.length > 2;
    const isSameOrigin = typeof window !== 'undefined' && document.referrer.includes(window.location.origin);

    if (hasHistory && isSameOrigin) {
        router.back();
    } else if (previousPath) {
        router.push(previousPath);
    } else {
        router.push('/');
    }
  }, [router, previousPath]);

  return { handleBack };
}
