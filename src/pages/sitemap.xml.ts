// Static endpoint: emits /sitemap.xml listing every canonical page of the
// site. Redirect stubs (the former top-level and /reference/ pages) are
// deliberately not listed; their canonical targets are.
const BASE = 'https://www.unidpp.org';
const pages: { path: string; priority: string }[] = [
  { path: '/', priority: '1.0' },
  { path: '/about/', priority: '0.6' },
  { path: '/learn/', priority: '0.9' },
  { path: '/why/', priority: '0.8' },
  { path: '/framework/', priority: '0.9' },
  { path: '/framework/standards/', priority: '0.7' },
  { path: '/framework/trust/', priority: '0.7' },
  { path: '/specs/', priority: '0.9' },
  { path: '/specs/part-1-framework/', priority: '0.8' },
  { path: '/specs/part-2-profiles/', priority: '0.8' },
  { path: '/specs/part-3-events/', priority: '0.8' },
  { path: '/specs/part-4-tiers/', priority: '0.8' },
  { path: '/specs/part-5-conformance/', priority: '0.8' },
  { path: '/implementation/', priority: '0.7' },
  { path: '/implementation/demos/', priority: '0.7' },
  { path: '/implementation/conformance/', priority: '0.7' },
  { path: '/papers/', priority: '0.6' },
  { path: '/terminology/', priority: '0.6' },
  { path: '/compare/', priority: '0.6' },
  { path: '/community/', priority: '0.5' },
];
export async function GET() {
  const urls = pages
    .map((page) => `  <url><loc>${BASE}${page.path}</loc><priority>${page.priority}</priority></url>`)
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
