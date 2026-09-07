// Site news entries — the "latest" block on the home page. Newest first.
export interface NewsItem {
  date: string; // ISO
  title: string;
  body: string;
  href: string;
}

export const news: NewsItem[] = [
  {
    date: '2026-09-07',
    title: 'Specification working draft published on the site',
    body:
      'The five-part framework specification — 13 sections converted from the AsciiDoc sources — is now readable at unidpp.org/specs, with per-part status badges.',
    href: '/specs/',
  },
  {
    date: '2026-09-07',
    title: 'EU-profile conformance report: 22 fixtures, 26 error findings',
    body:
      'Every example payload printed in EN 18223:2026 was run through the validators — 14 pass, 8 fail — with each finding cited to the standard’s own normative text.',
    href: '/implementation/conformance/',
  },
  {
    date: '2026-09-07',
    title: 'Demonstration runs live: battery-loop, car, laptop',
    body:
      'The reference core’s demo binary replays three product lifecycles with byte-identical, generated traces — Tier-A packing against the QR budget included.',
    href: '/implementation/demos/',
  },
  {
    date: '2026-09-01',
    title: 'Six contribution papers drafted for ISO/IEC JTC 5 and partner bodies',
    body:
      'Position paper, registry requirements, lifecycle and events, implementation report, trust annex input, and the terminology announcement — PDFs available.',
    href: '/papers/',
  },
  {
    date: '2026-08-24',
    title: 'Terminology dataset reaches 146 verified concepts',
    body:
      'The multilingual Glossarist edition of the DPP vocabulary — 141 harvested definitions from the EN series, CWAs, and IDTA — now covers 146 concepts.',
    href: '/terminology/',
  },
];
