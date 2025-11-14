
import { SVGProps } from 'react';

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="0"
    >
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm3 8h-1.5c-.2 0-.5.1-.5.5V10h2l-.2 2h-1.8v5h-3v-5H9V10h1.5V7.5c0-1.4 1.1-2.5 2.5-2.5H16v3z"/>
    </svg>
  );
}

export function TwitterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function TelegramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="m9.417 15.181-.397 5.584c.568 0 .814-.244 1.109-.537l2.663-2.545 5.518 4.041c1.012.564 1.725.267 1.998-.931L22.43 3.947c.328-1.358-.517-1.858-1.4-1.51L1.562 9.103c-1.343.525-1.326 1.258-.242 1.581l4.971 1.545 11.392-6.93c.533-.324 1.012-.153.583.186z"/>
    </svg>
  );
}
