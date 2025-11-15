
'use client';

import { useEffect, useRef } from 'react';

export function BannerAd() {
  return (
    <div className="my-8 flex justify-center">
      <iframe
        src="/ad-frame.html"
        sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation allow-same-origin"
        width="300"
        height="250"
        scrolling="no"
        frameBorder="0"
        className="border-0 overflow-hidden"
        title="Banner Ad"
      ></iframe>
    </div>
  );
}
