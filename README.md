# unidpp.github.io — the UniDPP website (www.unidpp.org)

Part of UniDPP (github.com/unidpp) — see TODO.impl §03.
License: MIT (site content and code).

An Astro static site, formal register, built alongside the v1 single-page
site (`index.html` at the repository root).

## Information architecture

The site is a progressive spine — four numbered levels, read in order,
each assuming the one before it:

```
/                       overview, with the passport-spread hero
/learn/            01   Understand — what a DPP is, in plain language
/why/              02   Why international — one laptop, five jurisdictions
/how/              03   How it works — six layers, fourteen invariants,
                        capability classes, trust in one section
/reference/        04   Reference — the full factual material:
  /reference/framework/        invariants, lens model, axes, twin, resilience
  /reference/standards/        topics map, EU profile, seams, landscape
  /reference/implementation/   repositories, quickstart
  /reference/compare/          freeDPP / OpenDPP / UniDPP capability table
  /reference/trust/            SIGNATIF model, revocation, stamps
  /reference/papers/           contribution catalogue, NWIPs
  /reference/terminology/      Glossarist vocabulary dataset
  /reference/about/            stewardship, governance, contact
```

Navigation is a left depth-rail on desktop (>=960px) and a top chip row on
mobile; every page states its depth level. The former top-level pages
(`/framework/`, `/standards/`, `/implementation/`, `/compare/`, `/trust/`,
`/papers/`, `/terminology/`, `/about/`) remain as meta-refresh redirect
stubs to their `/reference/` locations, so external links keep resolving.

## Design system

Tokens (defined once in `src/components/BaseLayout.astro`):

- `--paper #FAFAF7` page background; `--ink #1A2332` text
- `--navy #14335C` primary accent (links, rail, lens tints, MRZ bar)
- `--green #1E6B4F` semantic only: valid/verified states
- `--red #B4442C` semantic only: verdicts/warnings
- `--muted #6B7686` secondary text; `--hairline #E3E7EC` rules and borders
- radius 6px, no box-shadows, hairline rules throughout

Type (self-hosted open fonts via Fontsource, OFL):

- Fraunces (variable, optical sizing) — display, headings only
- Public Sans (400/500/600/700) — body
- IBM Plex Mono (400/500/600) — MRZ strip, identifiers, code, tables of IDs

Prose is capped at 72ch; "plate" sections (diagrams, tables) run wider
between hairline top/bottom rules. The homepage hero is the signature:
a twin record card with three translucent lens layers (CSS-only radio
controls, keyboard-operable) above an MRZ strip that types on with a
`steps()` animation (instant under prefers-reduced-motion). No JS
frameworks — Astro + vanilla CSS only.

## Repository layout

```
index.html                  v1 single-page site — GitHub Pages fallback landing (DO NOT DELETE)
astro.config.mjs            Astro config: site URL, outDir ./dist
package.json                build scripts (npm run dev / build / preview)
src/pages/*.astro           redirect stubs for the former top-level pages
src/pages/{learn,why,how}.astro   levels 01-03
src/pages/reference/*.astro level 04 reference pages + index
src/pages/sitemap.xml.ts    static endpoint emitting /sitemap.xml
src/components/             BaseLayout (tokens + global styles), Nav (depth
                            rail / chip row), Footer, Card, CardGrid,
                            DataTable, HeroSpread, MrzStrip
public/                     static assets copied verbatim to dist/: robots.txt, CNAME
.github/workflows/deploy.yml  GitHub Pages deployment (build dist/, upload, deploy)
dist/                       build output (gitignored)
```

## Local development

```
npm install
npm run dev        # http://localhost:4321
npm run build      # static site into dist/
npm run preview    # serve dist/ locally
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
