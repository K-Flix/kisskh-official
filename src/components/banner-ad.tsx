
'use client';

import { useEffect, useRef } from 'react';

export function BannerAd() {
  const adContainerRef = useRef<HTMLDivElement>(null);
  const adLoadedRef = useRef(false);

  useEffect(() => {
    const container = adContainerRef.current;
    if (!container || adLoadedRef.current) return;

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
    }
  }, []);

  return (
    <div className="my-8 flex justify-center">
      <div ref={adContainerRef} className="min-w-[300px] min-h-[250px] flex justify-center items-center"></div>
    </div>
  );
}
