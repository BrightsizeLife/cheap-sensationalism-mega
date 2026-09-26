// Loads every edition in content/editions/, newest first, and derives the
// lookups the pages need. An edition file is plain JSON so it can be
// edited by hand or exported from a spreadsheet: list fields accept either
// a JSON array or a comma-separated string.

import type { Edition, Hub, Line, Status, Thing } from './types';

const files = import.meta.glob('../../content/editions/*.json', { eager: true, import: 'default' });

const list = (v: unknown): string[] =>
  Array.isArray(v)
    ? v.map(String).map((s) => s.trim()).filter(Boolean)
    : typeof v === 'string'
      ? v.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

const STATUSES: Status[] = ['live', 'wip', 'idea'];

function parse(raw: any): Edition {
  const things: Thing[] = (raw.things ?? []).map((t: any) => ({
    ...t,
    hubs: list(t.hubs),
    related: list(t.related),
    links: Array.isArray(t.links) ? t.links : [],
    status: STATUSES.includes(t.status) ? t.status : 'wip',
  }));
  return {
    id: String(raw.id),
    published: String(raw.published),
    note: raw.note ?? '',
    lines: raw.lines ?? [],
    hubs: (raw.hubs ?? []).map((h: any) => ({ ...h, aliases: list(h.aliases) })),
    things,
    banner: raw.banner ?? raw.advisories ?? [],
    elsewhere: raw.elsewhere ?? { accounts: [], detours: [] },
  };
}

/** Every edition, newest first. */
export const EDITIONS: Edition[] = Object.values(files)
  .map(parse)
  .sort((a, b) => b.id.localeCompare(a.id));

export const LATEST = EDITIONS[0];

export function getEdition(id: string | null): Edition | undefined {
  if (!id) return LATEST;
  return EDITIONS.find((e) => e.id === id);
}

export function previousEdition(e: Edition): Edition | undefined {
  const i = EDITIONS.indexOf(e);
  return i >= 0 ? EDITIONS[i + 1] : undefined;
}

/** Everything a page needs to ask of one edition. */
export class Atlas {
  readonly lineById = new Map<string, Line>();
  readonly hubById = new Map<string, Hub>();
  readonly thingById = new Map<string, Thing>();
  /** Things that were not in the edition before this one. */
  readonly fresh = new Set<string>();

  constructor(readonly edition: Edition) {
    edition.lines.forEach((l) => this.lineById.set(l.id, l));
    edition.hubs.forEach((h) => this.hubById.set(h.id, h));
    edition.things.forEach((t) => this.thingById.set(t.id, t));
    const prev = previousEdition(edition);
    if (prev) {
      const before = new Set(prev.things.map((t) => t.id));
      edition.things.forEach((t) => {
        if (!before.has(t.id)) this.fresh.add(t.id);
      });
    }
    if (import.meta.env.DEV) this.check();
  }

  hubsOn(lineId: string): Hub[] {
    return this.edition.hubs.filter((h) => h.line === lineId);
  }

  /** Hubs with a page of their own, i.e. not a section's loose things. */
  hubsListed(lineId: string): Hub[] {
    return this.hubsOn(lineId).filter((h) => !h.loose);
  }

  /** Where a link to this hub goes. Loose things live on the section page. */
  hubPath(hub: Hub): string {
    return `/${hub.loose ? hub.line : hub.id}`;
  }

  thingsAt(hubId: string): Thing[] {
    return this.edition.things.filter((t) => t.hubs.includes(hubId));
  }

  thingsOn(lineId: string): Thing[] {
    return this.edition.things.filter((t) => this.linesOf(t).some((l) => l.id === lineId));
  }

  /** The line of a thing's home hub. */
  lineOf(t: Thing): Line | undefined {
    const hub = this.hubById.get(t.hubs[0]);
    return hub ? this.lineById.get(hub.line) : undefined;
  }

  /** Every line a thing stops on, home line first. */
  linesOf(t: Thing): Line[] {
    const out: Line[] = [];
    for (const h of t.hubs) {
      const line = this.lineById.get(this.hubById.get(h)?.line ?? '');
      if (line && !out.includes(line)) out.push(line);
    }
    return out;
  }

  /** A thing with more than one hub is a transfer station. */
  isTransfer(t: Thing): boolean {
    return t.hubs.length > 1;
  }

  /** Related things in both directions, since a connection is mutual. */
  neighbours(t: Thing): Thing[] {
    const ids = new Set(t.related);
    this.edition.things.forEach((o) => {
      if (o.related.includes(t.id)) ids.add(o.id);
    });
    ids.delete(t.id);
    return [...ids].map((id) => this.thingById.get(id)).filter((x): x is Thing => !!x);
  }

  /** Hubs that share at least one thing with this hub. */
  transfersFrom(hubId: string): { hub: Hub; via: Thing[] }[] {
    const out = new Map<string, Thing[]>();
    this.thingsAt(hubId).forEach((t) =>
      t.hubs.filter((h) => h !== hubId).forEach((h) => out.set(h, [...(out.get(h) ?? []), t])),
    );
    return [...out.entries()]
      .map(([id, via]) => ({ hub: this.hubById.get(id)!, via }))
      .filter((x) => x.hub);
  }

  /** Resolve a path segment to a hub, including old names. */
  hubForSlug(slug: string): Hub | undefined {
    return this.hubById.get(slug) ?? this.edition.hubs.find((h) => h.aliases?.includes(slug));
  }

  count(things: Thing[] = this.edition.things) {
    const by = (s: Status) => things.filter((t) => t.status === s).length;
    return { all: things.length, live: by('live'), wip: by('wip'), idea: by('idea') };
  }

  /** Warn about references that point nowhere. Development only. */
  private check() {
    const e = this.edition;
    e.hubs.forEach((h) => {
      if (!this.lineById.has(h.line)) console.warn(`[atlas ${e.id}] hub ${h.id} is on unknown line ${h.line}`);
    });
    e.things.forEach((t) => {
      if (!t.hubs.length) console.warn(`[atlas ${e.id}] ${t.id} has no hub`);
      t.hubs.forEach((h) => {
        if (!this.hubById.has(h)) console.warn(`[atlas ${e.id}] ${t.id} stops at unknown hub ${h}`);
      });
      t.related.forEach((r) => {
        if (!this.thingById.has(r)) console.warn(`[atlas ${e.id}] ${t.id} relates to unknown thing ${r}`);
      });
    });
    const ids = e.things.map((t) => t.id);
    ids.forEach((id, i) => {
      if (ids.indexOf(id) !== i) console.warn(`[atlas ${e.id}] duplicate thing id ${id}`);
    });
  }
}

const cache = new Map<string, Atlas>();
export function atlasFor(e: Edition): Atlas {
  let a = cache.get(e.id);
  if (!a) {
    a = new Atlas(e);
    cache.set(e.id, a);
  }
  return a;
}
