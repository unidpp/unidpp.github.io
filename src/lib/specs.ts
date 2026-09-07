// The specification: part structure and AsciiDoc rendering.
//
// The `.adoc` files under `src/spec/` are a snapshot of the canonical
// sources in the `unidpp/unidpp-spec` repository (Metanorma project,
// CC-BY-4.0, stage 20 working draft). They are converted to HTML at
// build time with Asciidoctor — the snapshot is source, the rendered
// pages are derived output; update the snapshot from the spec repo.
import * as asciidoctor from '@asciidoctor/core';

const raw = import.meta.glob('../spec/*.adoc', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function sectionSource(file: string): string {
  const entry = raw[`../spec/${file}`];
  if (entry === undefined) {
    throw new Error(`Missing spec section source: ${file}`);
  }
  return entry;
}

/** Convert one AsciiDoc section to an HTML fragment. */
export async function renderAdoc(file: string): Promise<string> {
  const html = await (asciidoctor as any).convert(sectionSource(file), {
    safe: 'safe',
    standalone: false,
    attributes: {
      'nofooter': '',
      'sectlinks': '',
      // Cross-references to clauses resolve in-text; keep ids as-is.
      'idprefix': '',
      'idseparator': '-',
    },
  });
  return html as string;
}

export interface SpecSection {
  file: string;
  /** Display title of the converted section. */
  title: string;
}

export interface SpecPart {
  slug: string;
  label: string;
  title: string;
  subtitle: string;
  stage: 'wd' | 'cd' | 'fdis';
  sections: SpecSection[];
}

function titleOf(file: string): string {
  const source = sectionSource(file);
  const m = source.match(/^==\s+(.+)$/m);
  return m ? m[1].trim() : file;
}

function sections(files: string[]): SpecSection[] {
  return files.map((file) => ({ file, title: titleOf(file) }));
}

/** The part decomposition of the UniDPP specification. */
export const parts: SpecPart[] = [
  {
    slug: 'part-1-framework',
    label: 'Part 1',
    title: 'Framework',
    subtitle:
      'Scope, normative references, terms, and the framework core: the fourteen design invariants, the six layers, and the profile mount.',
    stage: 'wd',
    sections: sections([
      '01-scope.adoc',
      '02-normrefs.adoc',
      '03-terms.adoc',
      '04-framework.adoc',
    ]),
  },
  {
    slug: 'part-2-profiles',
    label: 'Part 2',
    title: 'Profiles',
    subtitle:
      'The three-axial composition model, the profile manifest, trigger predicates, and capability gating of profile requirements.',
    stage: 'wd',
    sections: sections(['05-profiles.adoc']),
  },
  {
    slug: 'part-3-events',
    label: 'Part 3',
    title: 'Identity, events and transforms',
    subtitle:
      'The identifier model and relationship algebra, the typed event taxonomy and append-only log, and the quantity-conserving transformation algebra.',
    stage: 'wd',
    sections: sections([
      '06-identity-and-links.adoc',
      '07-events.adoc',
      '08-transforms.adoc',
    ]),
  },
  {
    slug: 'part-4-tiers',
    label: 'Part 4',
    title: 'Tiers and trust',
    subtitle:
      'Payload tiers and offline operation (Tier A/B/C), freshness verdicts, and the trust and verification model.',
    stage: 'wd',
    sections: sections(['09-tiers.adoc', '10-trust.adoc']),
  },
  {
    slug: 'part-5-conformance',
    label: 'Part 5',
    title: 'Conformance',
    subtitle:
      'Conformance classes and requirements, Annex A negative fixtures, and the bibliography.',
    stage: 'wd',
    sections: sections([
      '11-conformance.adoc',
      'annex-a-negative-fixtures.adoc',
      '99-bibliography.adoc',
    ]),
  },
];

export function getPart(slug: string): SpecPart | undefined {
  return parts.find((p) => p.slug === slug);
}
