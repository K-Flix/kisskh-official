
'use client';

import { useApp } from '@/context/app-context';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function useBack() {
  const router = useRouter();
  const { previousPath } = useApp();

  const handleBack = useCallback(() => {
    if (previousPath && previousPath !== window.location.pathname) {
      router.push(previousPath);
    } else {
      router.push('/');
    }
  }, [router, previousPath]);

  return { handleBack };
}
