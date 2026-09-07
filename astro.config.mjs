import { defineConfig } from 'astro/config';

// The site builds into `dist/` — a subfolder — so the build never writes to
// the repository root. The v1 single-page site at the root `index.html`
// remains the GitHub Pages fallback landing until switchover (see README.md).
// Switchover: Settings → Pages → Source "GitHub Actions"; the workflow
// deploys the contents of `dist/` and the root index.html is bypassed
// (kept, not deleted).
export default defineConfig({
  site: 'https://www.unidpp.org',
  outDir: './dist',
  build: {
    format: 'directory',
  },
});
