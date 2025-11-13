'use client';

import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

/**
 * Safely navigates back if there is a history, otherwise pushes to the homepage.
 * @param router - The Next.js App Router instance.
 */
export function safeRouterBack(router: AppRouterInstance) {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/');
  }
}
