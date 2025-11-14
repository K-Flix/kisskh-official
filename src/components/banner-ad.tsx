'use client';

import Script from 'next/script';
import { useEffect, useRef } from 'react';

export function BannerAd() {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = adContainerRef.current;
    if (!container) return;

    // Clear previous ad scripts if any
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

  }, []);

  return (
    <div className="my-8 flex justify-center">
        <div ref={adContainerRef}></div>
    </div>
  );
}
