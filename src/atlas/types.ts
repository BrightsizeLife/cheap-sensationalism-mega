// The shape of an edition: a dated snapshot of everything on the site.
//
// Three levels, and then a way around them:
//   line   a section, named for what you do there (listen, read, ...).
//          five at most, one colour each.
//   hub    a launching page inside a section (music, instruments, ...).
//   thing  one piece of work. it is filed under one or more hubs, and it
//          can point at any other thing in any section through `related`.
// The hierarchy is for finding your way; `hubs` and `related` are the
// rhizome, the connections that ignore the hierarchy on purpose.

/** The five pact hues. Each line takes one; they are never cycled. */
export type Hue = 'technology' | 'architecture' | 'culture' | 'practices' | 'outcomes';

/** How finished something is. */
export type Status = 'live' | 'wip' | 'idea';

export interface LinkRef {
  label: string;
  url: string;
}

export interface Line {
  id: string;
  name: string;
  /** One capital letter for the bullet. */
  letter: string;
  hue: Hue;
  blurb: string;
}

export interface Hub {
  id: string;
  line: string;
  name: string;
  /** The launching page's h1: what the page is, as a sentence. */
  h1: string;
  lede: string;
  /** The one thing this page exists for. Rendered as the filled button. */
  action?: LinkRef;
  /** Old paths that should land here, e.g. /instruments for /music-tools. */
  aliases?: string[];
}

export interface Thing {
  id: string;
  title: string;
  /** Hub ids. The first is home; the rest are transfers. */
  hubs: string[];
  kind: string;
  status: Status;
  /** Why it is not in service yet, or what the catch is. Shown next to the status. */
  note?: string;
  blurb: string;
  year?: string;
  /** Last meaningful change, YYYY-MM. */
  updated?: string;
  /** What it is made with. */
  made?: string;
  links: LinkRef[];
  /** A public repository, if there is one. Private repos are never linked. */
  source?: string;
  /** Other things this one talks to, on any line. */
  related: string[];
}

export interface BannerItem {
  text: string;
  link?: LinkRef;
}

export interface Edition {
  id: string;
  published: string;
  /** One sentence on what changed in this edition. */
  note: string;
  lines: Line[];
  hubs: Hub[];
  things: Thing[];
  /** The moving banner at the top of the landing page. */
  banner: BannerItem[];
  /** Accounts (perverse sociality), and other people's better websites. */
  elsewhere: { accounts: (LinkRef & { blurb?: string })[]; detours: (LinkRef & { blurb: string })[] };
}
