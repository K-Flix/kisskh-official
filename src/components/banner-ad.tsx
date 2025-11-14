'use client';

import { useEffect, useRef } from 'react';

export function BannerAd() {
  const adContainerRef = useRef<HTMLDivElement>(null);
  const adLoadedRef = useRef(false);

  useEffect(() => {
    const container = adContainerRef.current;
    if (!container || adLoadedRef.current) return;

    const timer = setTimeout(() => {
        // Prevent ad from loading more than once
        if (adLoadedRef.current) return;
        adLoadedRef.current = true;

        // Clear previous ad scripts if any, just in case
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }

        try {
          const adScript = document.createElement('script');
          adScript.type = 'text/javascript';
          adScript.innerHTML = `
            atOptions = {
              'key' : '1fdfdbb2ce472537351df2f832fb5705',
              'format' : 'iframe',
              'height' : 250,
              'width' : 300,
              'params' : {}
            };
          `;
          container.appendChild(adScript);

          const invokeScript = document.createElement('script');
          invokeScript.type = 'text/javascript';
          invokeScript.src = '//sparrowcanned.com/1fdfdbb2ce472537351df2f832fb5705/invoke.js';
          container.appendChild(invokeScript);
        } catch (e) {
          console.error("Ad script failed to load", e);
        }
    }, 3000); // Wait 3 seconds before loading the ad

    return () => {
        clearTimeout(timer);
    }
  }, []);

  return (
    <div className="my-8 flex justify-center">
        <div ref={adContainerRef} style={{ minHeight: '250px' }}></div>
    </div>
  );
}
