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

/** The part decomposition of the UniDPP specification (the ten-Part
 * family of FRAMEWORK.md; each clause file renders in exactly one
 * Part). */
export const parts: SpecPart[] = [
  {
    slug: 'part-1-framework',
    label: 'Part 1',
    title: 'Framework and fundamental principles',
    subtitle:
      'Scope, normative references, terms, and the framework core: the design invariants, the layers, and the profile mount.',
    stage: 'wd',
    sections: sections(['01-scope.adoc', '02-normrefs.adoc', '03-terms.adoc', '04-framework.adoc']),
  },
  {
    slug: 'part-2-core',
    label: 'Part 2',
    title: 'Core model: identity, events, product algebra',
    subtitle:
      'The identifier model and the relationship algebra R1–R7, the typed event taxonomy and the append-only log, and the quantity-conserving transformation algebra.',
    stage: 'wd',
    sections: sections(['06-identity-and-links.adoc', '07-events.adoc', '08-transforms.adoc']),
  },
  {
    slug: 'part-3-profiles',
    label: 'Part 3',
    title: 'Profiles and the Primmel binding',
    subtitle:
      'The three-axial composition model, the profile manifest with its issuer class, trigger predicates, capability gating, and the binding of executable transformation expressions.',
    stage: 'wd',
    sections: sections(['05-profiles.adoc']),
  },
  {
    slug: 'part-4-projections',
    label: 'Part 4',
    title: 'Projections and the twin interface',
    subtitle:
      'The projection calculus and its descriptor, the frozen view with pinned artifacts, and the conforming-twin interface.',
    stage: 'wd',
    sections: sections(['13-projections.adoc']),
  },
  {
    slug: 'part-5-tiers-trust',
    label: 'Part 5',
    title: 'Payload tiers and trust',
    subtitle:
      'Payload tiers and offline operation (Tier A/B/C), freshness verdicts, and the trust and verification model with its readings and coverage.',
    stage: 'wd',
    sections: sections(['09-tiers.adoc', '10-trust.adoc']),
  },
  {
    slug: 'part-6-federation',
    label: 'Part 6',
    title: 'Federation and discovery',
    subtitle:
      'The discovery registry: service descriptors, protocol bindings, listing gates, onboarding ceremonies, and seed bundles.',
    stage: 'wd',
    sections: sections(['16-discovery.adoc']),
  },
  {
    slug: 'part-7-semantics',
    label: 'Part 7',
    title: 'Semantic registry and mappings',
    subtitle:
      'The register discipline, data elements, and the three-tier mapping of correspondences between registers.',
    stage: 'wd',
    sections: sections(['15-semantics.adoc']),
  },
  {
    slug: 'part-8-sovereignty',
    label: 'Part 8',
    title: 'Sovereignty: segments, policies, residence',
    subtitle:
      'The segment grid, policy objects and reveal rules, the commitment spine, and the law of edge commitments.',
    stage: 'wd',
    sections: sections(['12-operations.adoc']),
  },
  {
    slug: 'part-9-conformance',
    label: 'Part 9',
    title: 'Conformance, annexes and bibliography',
    subtitle:
      'Conformance classes and requirements, the negative fixtures, the canonical encoding annex, and the bibliography.',
    stage: 'wd',
    sections: sections(['11-conformance.adoc', 'annex-a-negative-fixtures.adoc', 'annex-b-canonical-encoding.adoc', '99-bibliography.adoc']),
  },
  {
    slug: 'part-10-retrieval',
    label: 'Part 10',
    title: 'Client retrieval interface',
    subtitle:
      'Context-keyed resolution, the retrieval request and response, partial and sealed responses with attestation offers, and the error semantics.',
    stage: 'wd',
    sections: sections(['14-retrieval.adoc']),
  },
];

export function getPart(slug: string): SpecPart | undefined {
  return parts.find((p) => p.slug === slug);
}
