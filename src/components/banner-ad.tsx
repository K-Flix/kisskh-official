'use client';

import { useEffect, useRef, useState } from 'react';

export function BannerAd() {
  const adContainerRef = useRef<HTMLDivElement>(null);
  const adLoadedRef = useRef(false);
  const [adFailed, setAdFailed] = useState(false);

  useEffect(() => {
    const container = adContainerRef.current;
    if (!container || adLoadedRef.current) return;

    const loadTimer = setTimeout(() => {
        // Prevent ad from loading more than once
        if (adLoadedRef.current) return;
        adLoadedRef.current = true;

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
          setAdFailed(true);
        }
    }, 3000); // Wait 3 seconds before trying to load the ad

    // Check if the ad actually loaded after a delay
    const failTimer = setTimeout(() => {
        if (container && container.children.length <= 2) { // 2 because we append two script tags
            setAdFailed(true);
        }
    }, 5000); // 5 seconds total (3s delay + 2s to load)

    return () => {
        clearTimeout(loadTimer);
        clearTimeout(failTimer);
    }
  }, []);

  if (adFailed) {
    return null;
  }

  return (
    <div className="my-8 flex justify-center min-h-[250px]">
        <div ref={adContainerRef}></div>
    </div>
  );
}
