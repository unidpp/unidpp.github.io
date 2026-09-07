// Static endpoint: emits /sitemap.xml listing every canonical page of the
// site. Redirect stubs (the former top-level pages) are deliberately not
// listed; their canonical targets are.
const BASE = 'https://www.unidpp.org';
const pages: { path: string; priority: string }[] = [
  { path: '/', priority: '1.0' },
  { path: '/learn/', priority: '0.9' },
  { path: '/why/', priority: '0.8' },
  { path: '/how/', priority: '0.9' },
  { path: '/reference/', priority: '0.7' },
  { path: '/reference/framework/', priority: '0.8' },
  { path: '/reference/standards/', priority: '0.7' },
  { path: '/reference/implementation/', priority: '0.6' },
  { path: '/reference/compare/', priority: '0.6' },
  { path: '/reference/trust/', priority: '0.7' },
  { path: '/reference/papers/', priority: '0.6' },
  { path: '/reference/terminology/', priority: '0.6' },
  { path: '/reference/about/', priority: '0.5' },
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
