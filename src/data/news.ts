// Site news entries — the "latest" block on the home page. Newest
// first. Only real, dated milestones; there is no filler line under
// the list.
export interface NewsItem {
  date: string; // ISO, or ISO month for items dated by month
  title: string;
  body: string;
  href: string;
}

export const news: NewsItem[] = [
  {
    date: '2026-09-07',
    title: 'Terminology browser live at /terminology/',
    body:
      'The DPP vocabulary concept browser — 145 verified concepts compiled from the EN series, CWA 18291, and IDTA 01001 — is now served from this site.',
    href: '/terminology/',
  },
  {
    date: '2026-09-07',
    title: 'CalConnect whitepaper and PWI vocabulary draft filed for ISO/IEC JTC 5',
    body:
      'The whitepaper on an international framework for the Digital Product Passport and the accompanying PWI vocabulary draft are filed as inputs to JTC 5.',
    href: '/papers/',
  },
  {
    date: '2026-09',
    title: 'Verifier CLI and ISO 19135 registry service published',
    body:
      'The passport verifier CLI and the registry service implementing the ISO 19135 register item lifecycle are published under github.com/unidpp.',
    href: 'https://github.com/unidpp',
  },
];
