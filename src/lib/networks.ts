
import type { NetworkConfig } from './types';

/**
 * Configuration array for streaming providers and broadcast networks.
 * NOTE: Every object must consistently contain both providerIds and networkIds,
 * using an empty array ([]) if the ID type is not applicable.
 */
export const networksConfig: NetworkConfig[] = [
  // --- Streaming Providers (OTT) and Combined Networks ---
  { name: 'Netflix', logo_path: 'https://media.themoviedb.org/t/p/w154/wwemzKWzjKYJFfCeiB57q3r4Bcm.png', providerIds: [8], networkIds: [213] },
  { name: 'Amazon Prime Video', logo_path: 'https://media.themoviedb.org/t/p/w154/w7HfLNm9CWwRmAMU58udl2L7We7.png', providerIds: [9], networkIds: [1024] },
  { name: 'Disney+', logo_path: 'https://media.themoviedb.org/t/p/w154/1edZOYAfoyZyZ3rklNSiUpXX30Q.png', providerIds: [337], networkIds: [2739] },
  { name: 'Hulu', logo_path: 'https://media.themoviedb.org/t/p/w154/pqUTCleNUiTLAVlelGxUgWn1ELh.png', providerIds: [15], networkIds: [453, 1772] },
  { name: 'HBO / Max', logo_path: 'https://media.themoviedb.org/t/p/w154/tuomPhY2UtuPTqqFnKMVHvSb724.png', providerIds: [1899], networkIds: [49] },
  { name: 'Paramount+', logo_path: 'https://media.themoviedb.org/t/p/w154/fi83B1oztoS47xxcemFdPMhIzK.png', providerIds: [531], networkIds: [4330] },
  { name: 'Peacock', logo_path: 'https://media.themoviedb.org/t/p/w154/gIAcGTjKKr0KOHL5s4O36roJ8p7.png', providerIds: [387], networkIds: [3353] },
  { name: 'Apple TV+', logo_path: 'https://media.themoviedb.org/t/p/w154/bngHRFi794mnMq34gfVcm9nDxN1.png', providerIds: [350], networkIds: [2552] },
  { name: 'Showtime', logo_path: 'https://media.themoviedb.org/t/p/w154/Allse9kbjiP6ExaQrnSpIhkurEi.png', providerIds: [67], networkIds: [67] },
  { name: 'Starz', logo_path: 'https://media.themoviedb.org/t/p/w154/GMDGZk9iDG4WDijY3VgUgJeyus.png', providerIds: [43], networkIds: [318] },
  // CORRECTED: Crunchyroll needs networkIds: []
  { name: 'Crunchyroll', logo_path: 'https://media.themoviedb.org/t/p/w154/qqyXcZlJQKlRmAD1TCKV7mGLQlt.png', providerIds: [283], networkIds: [] },
  { name: 'Viu', logo_path: 'https://media.themoviedb.org/t/p/w154/q2nugloW9BDdW9YzmRbemdb9cNn.png', providerIds: [1045], networkIds: [5972, 3547, 4597, 2980, 3174, 7001, 7648, 7237, 2146] },
  { name: 'Youku', logo_path: 'https://media.themoviedb.org/t/p/w154/w2TeR3fvPZ9a617tNIF1oOfyPtk.png', providerIds: [353], networkIds: [1419] },
  { name: 'Bilibili', logo_path: 'https://media.themoviedb.org/t/p/w154/mtmMg3PD4YGfrlmqpEiO6NL2ch9.png', providerIds: [456], networkIds: [1605, 8576] },
  { name: 'iQIYI', logo_path: 'https://media.themoviedb.org/t/p/w154/ewwmht0dJZVia8gvmmf3rKSZynF.png', providerIds: [119], networkIds: [1330, 6316, 7737] },
  { name: 'Tencent Video', logo_path: 'https://media.themoviedb.org/t/p/w154/6Lfll43wYG2eyereOBjpYFRSGs4.png', providerIds: [188], networkIds: [2007] },

  // --- Broadcast Networks Only (Provider IDs set to empty array for consistency) ---
  { name: 'CBS', logo_path: 'https://media.themoviedb.org/t/p/w154/wju8KhOUsR5y4bH9p3Jc50hhaLO.png', providerIds: [], networkIds: [16] },
  { name: 'NBC', logo_path: 'https://media.themoviedb.org/t/p/w154/cm111bsDVlYaC1foL0itvEI4yLG.png', providerIds: [], networkIds: [6] },
  { name: 'ABC', logo_path: 'https://media.themoviedb.org/t/p/w154/2uy2ZWcplrSObIyt4x0Y9rkG6qO.png', providerIds: [], networkIds: [2] },
  { name: 'Fox', logo_path: 'https://media.themoviedb.org/t/p/w154/1DSpHrWyOORkL9N2QHX7Adt31mQ.png', providerIds: [], networkIds: [19] },
  { name: 'AMC', logo_path: 'https://media.themoviedb.org/t/p/w154/pmvRmATOCaDykE6JrVoeYxlFHw3.png', providerIds: [], networkIds: [174] },
  { name: 'BBC', logo_path: 'https://media.themoviedb.org/t/p/w154/imf3gQOupRLdbwRC6FalEovuAPS.png', providerIds: [], networkIds: [4] },
  { name: 'The CW', logo_path: 'https://media.themoviedb.org/t/p/w154/hEpcdJ4O6eitG9ADSnUrlovS.png', providerIds: [], networkIds: [71] },
  { name: 'MGM+', logo_path: 'https://media.themoviedb.org/t/p/w154/89TXvQzvoKvyqD9EEogohzMJ8D6.png', providerIds: [], networkIds: [6219] },
  { name: 'tvN', logo_path: 'https://media.themoviedb.org/t/p/w154/aRDq8zBrX3YLpHSfueNQBkNnn7b.png', providerIds: [], networkIds: [866] },
  { name: 'JTBC', logo_path: 'https://media.themoviedb.org/t/p/w154/44I4aVlasm8Blb8WPGXTkMYuZJF.png', providerIds: [], networkIds: [885] },
  { name: 'SBS', logo_path: 'https://media.themoviedb.org/t/p/w154/uHQFPvRTlpgaIFQVN8eKWEnFOll.png', providerIds: [], networkIds: [156] },
  { name: 'MBC', logo_path: 'https://media.themoviedb.org/t/p/w154/pOSCKaZhndUFYtxHXjQOV6xJi1s.png', providerIds: [], networkIds: [97, 2440, 2513, 1234, 3264] },
  { name: 'KBS2', logo_path: 'https://media.themoviedb.org/t/p/w154/nFmWwUAf2D3iAtizUcmkxufaM0q.png', providerIds: [], networkIds: [18, 1923, 342, 2459, 2772, 4866, 1137, 829, 1796] },
];
