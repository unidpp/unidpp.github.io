// Sidebar navigation definitions for the sectioned pages.
export interface NavItem {
  label: string;
  href: string;
}

export const frameworkNav: NavItem[] = [
  { label: 'Architecture', href: '/framework/#architecture' },
  { label: 'The fourteen invariants', href: '/framework/#invariants' },
  { label: 'The lens model', href: '/framework/#lens' },
  { label: 'Profile axes', href: '/framework/#axes' },
  { label: 'Capability classes', href: '/framework/#capability' },
  { label: 'Twin axis', href: '/framework/#twin' },
  { label: 'Resilience', href: '/framework/#resilience' },
  { label: 'Standards map', href: '/framework/standards/' },
  { label: 'Trust model', href: '/framework/trust/' },
];

export const specsNav: NavItem[] = [
  { label: 'Specification index', href: '/specs/' },
  { label: 'Part 1 · Framework', href: '/specs/part-1-framework/' },
  { label: 'Part 2 · Profiles', href: '/specs/part-2-profiles/' },
  { label: 'Part 3 · Events, identity, transforms', href: '/specs/part-3-events/' },
  { label: 'Part 4 · Tiers and trust', href: '/specs/part-4-tiers/' },
  { label: 'Part 5 · Conformance', href: '/specs/part-5-conformance/' },
];

export const implementationNav: NavItem[] = [
  { label: 'Repositories and quickstart', href: '/implementation/' },
  { label: 'Demonstrations', href: '/implementation/demos/' },
  { label: 'Conformance register', href: '/implementation/conformance/' },
];
