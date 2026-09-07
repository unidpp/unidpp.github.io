# unidpp.github.io — the UniDPP website (www.unidpp.org)

Part of UniDPP (github.com/unidpp) — see the UniDPP project notes.
License: MIT (site content and code).

An Astro static site, formal register, built alongside the v1 single-page
site (`index.html` at the repository root).

## Information architecture

The site is a branded initiative site: a top section nav (sticky header),
dedicated sections for the specification and the reference stack, sidebar
navigation on content pages, dark mode, and full-site search (pagefind).

```
/ hero (passport spread + MRZ), initiative overview,
 stats, reading path, latest news
/learn/ 01 Understand — what a DPP is, in plain language
/why/ 02 Why international — one laptop, five jurisdictions
/framework/ 03 How it works — six layers, fourteen invariants,
 lens model, profile axes, capability classes,
 twin axis, resilience; sidebar section nav:
 /framework/standards/ topics map, EU profile, seams, landscape
 /framework/trust/ SIGNATIF model, revocation, stamps
/specs/ the specification — five parts with stage badges,
 per-part pages rendered from the AsciiDoc sources:
 /specs/part-1-framework/ scope, normrefs, terms, framework core
 /specs/part-2-profiles/ profile mechanism
 /specs/part-3-events/ identity, events, transforms
 /specs/part-4-tiers/ payload tiers, trust
 /specs/part-5-conformance/ conformance + Annex A + bibliography
/implementation/ repositories, live explorer embed, quickstart,
 evidence annexes:
 /implementation/demos/ narrated demo runs, verbatim CLI traces
 (document-terminal styling)
 /implementation/conformance/ EU-profile conformance register: EN 18223
 example corpus, findings, runner command
/papers/ six contribution papers with PDFs, NWIPs
/terminology/ Glossarist vocabulary dataset + embed point
/compare/ freeDPP / OpenDPP / UniDPP capability table
/community/ contributing, IPR, governance, adoption, contact
/about/ mission, stewardship table, licensing, contact
```

The reading-spine pages end with a "Continue" link to the next level
(01 → 02 → 03 → the specification); /implementation/demos/ continues to
/implementation/conformance/. The former URLs (`/how/`, `/demos/`,
`/conformance/`, `/standards/`, `/trust/`, and everything under
`/reference/`) remain as meta-refresh redirect stubs to their new
locations, so external links keep resolving.

## Design system

Tokens are defined once in `src/styles/theme.css`, following the
`--bg/--text/--accent/--border` naming, with dark mode via `html.dark`
(toggle in the header, pre-paint inline script, persisted to
`localStorage['unidpp-theme']`):

- Light: paper `#FAFAF7` background, ink `#1A2332` text, navy `#14335C`
 accent, hairline `#E3E7EC` borders
- Dark: `#0F1420` background, `#E8ECF1` text, `#7EA7D4` accent (lighter
 for contrast)
- Semantic only: `--green #1E6B4F` valid/verified states, `--red #B4442C`
 verdicts/warnings
- Radius 6px, no box-shadows, hairline rules; container max-width 1200px;
 sidebar rail 15rem on content pages (>=960px)

Type — the body face is the identity (self-hosted via Fontsource, OFL):

- **IBM Plex Sans** (400/500/600/700) — body AND display; the wordmark is
 the two-part `uni`/`DPP` lockup in Plex Sans with tight tracking.
 No decorative serif anywhere, by explicit direction.
- **IBM Plex Mono** (400/500) — MRZ strip, identifiers, code, registers,
 spec stage badges.

Prose is capped at 72ch; "plate" sections (diagrams, tables) run wider
between hairline top/bottom rules. The homepage hero keeps the signature
element: a twin record card with three translucent lens layers (CSS-only
radio controls, keyboard-operable) above an MRZ strip that types on with a
`steps()` animation (instant under prefers-reduced-motion). Search is a
header button opening a dialog that lazily imports the pagefind index
built by `npm run build` (`astro build && pagefind --site dist`). No JS
frameworks — Astro + vanilla CSS only.

## Specification rendering

`src/spec/*.adoc` is a committed snapshot of the clause sources from
[unidpp/unidpp-spec](https://github.com/unidpp/unidpp-spec) (Metanorma
project, CC-BY-4.0, stage 20 working draft). `src/lib/specs.ts` defines
the five-part decomposition and converts each section to HTML at build
time with Asciidoctor (`@asciidoctor/core`); `src/pages/specs/[part].astro`
renders the fragments. The spec repository is the source of truth — refresh
the snapshot from it; the site pages are derived output.

## Repository layout

```
index.html v1 single-page site — GitHub Pages fallback landing (DO NOT DELETE)
astro.config.mjs Astro config: site URL, outDir ./dist
package.json build scripts (dev / build+pagefind / preview)
src/styles/theme.css design tokens + base + shared components + adoc styles
src/layouts/BaseLayout.astro page shell: head, theme pre-paint, header,
 optional section sidebar (rail slot), footer,
 search dialog
src/pages/ section pages + redirect stubs for moved URLs
src/pages/specs/ specification index + [part].astro renderer
src/pages/implementation/ stack index + demos + conformance
src/pages/sitemap.xml.ts static endpoint emitting /sitemap.xml
src/components/ Header (sticky nav, dark toggle, search, GitHub),
 Footer, Sidebar, Badge (WD/CD/FDIS pills),
 Card, CardGrid, DataTable, DocTerminal
 (document-terminal run transcript), Continue
 (next-page link), HeroSpread, MrzStrip,
 Redirect (meta-refresh stub)
src/lib/ specs.ts (part model + Asciidoctor render),
 sections.ts (sidebar nav data)
src/data/ verbatim demo-trace extracts (JSON, generated
 from unidpp-demo-docs; the traces must stay
 byte-identical to the binary's output) + news.ts
src/spec/ committed snapshot of the specification sources
public/ static assets copied verbatim to dist/: robots.txt,
 CNAME, papers/*.pdf (six contribution papers)
.github/workflows/deploy.yml GitHub Pages deployment (build dist/, upload, deploy)
dist/ build output (gitignored)
```

## Local development

```
npm install
npm run dev # http://localhost:4321 (search needs a built index)
npm run build # static site into dist/, then pagefind index
npm run preview # serve dist/ locally
```

`npm install && npm run build` must succeed with no errors; the build writes
only to `dist/`.

## GitHub Pages deployment and the index.html fallback

Two sites coexist in this repository by design:

1. **v1 fallback** — the root `index.html` is the complete v1 single-page
 site. While GitHub Pages is set to *Deploy from a branch* (`main` /
 root), `index.html` is served and nothing else is needed.
2. **Astro site** — `astro.config.mjs` sets `outDir: './dist'`, a subfolder,
 so the Astro build never writes to the repository root and never touches
 `index.html`. `.github/workflows/deploy.yml` installs with `npm ci`,
 builds with `npm run build`, and uploads the contents of `dist/` as the
 Pages artifact.

**Switchover procedure** (when the Astro site is ready to become the
landing site):

1. Push to `main` (the workflow runs; its artifact is unused until step 2).
2. Repository Settings → Pages → Source: **GitHub Actions**.
3. The Pages site is now the `dist/` build: the full multi-page site,
 `sitemap.xml`, `robots.txt`, and `CNAME` (www.unidpp.org).
4. The root `index.html` is bypassed by this mode. It is kept in the
 repository as the fallback and historical record, not deleted.

To roll back, set Pages Source back to *Deploy from a branch* (`main` /
root); the v1 `index.html` is served again immediately.

## Domain

`public/CNAME` carries `www.unidpp.org` and is deployed with the Astro
build. DNS: point `www.unidpp.org` at the GitHub Pages target per the
repository's Pages settings.
