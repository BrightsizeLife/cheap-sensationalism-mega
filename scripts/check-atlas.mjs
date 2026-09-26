// Checks every edition in content/editions/ before a build, so a typo in
// the JSON fails here with a sentence instead of quietly drawing a broken
// map. Run with `npm run check:atlas`. No dependencies.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const DIR = 'content/editions';
const HUES = ['technology', 'architecture', 'culture', 'practices', 'outcomes'];
const STATUSES = ['live', 'wip', 'idea'];
const RESERVED = ['thing', 'station', 'editions', 'fonts', 'album-notes.html'];
const list = (v) => (Array.isArray(v) ? v : typeof v === 'string' ? v.split(',').map((s) => s.trim()).filter(Boolean) : []);

let problems = 0;
const say = (file, msg) => {
  problems++;
  console.error(`${file}: ${msg}`);
};

for (const name of readdirSync(DIR).filter((f) => f.endsWith('.json')).sort()) {
  const file = join(DIR, name);
  let e;
  try {
    e = JSON.parse(readFileSync(file, 'utf8'));
  } catch (err) {
    say(file, `is not valid JSON (${err.message})`);
    continue;
  }
  if (`${e.id}.json` !== name) say(file, `id "${e.id}" should match the file name`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(e.published ?? '')) say(file, 'published should be a date like 2026-09-24');

  const lines = e.lines ?? [];
  if (lines.length > 5) say(file, `has ${lines.length} lines; the palette has 5 hues, so 5 is the ceiling`);
  const hues = lines.map((l) => l.hue);
  hues.forEach((h, i) => {
    if (!HUES.includes(h)) say(file, `line ${lines[i].id} has unknown hue "${h}"`);
    if (hues.indexOf(h) !== i) say(file, `hue "${h}" is used by two lines`);
  });
  const letters = lines.map((l) => l.letter);
  letters.forEach((l, i) => {
    if (typeof l !== 'string' || l.length !== 1) say(file, `line ${lines[i].id} needs a one-character letter`);
    if (letters.indexOf(l) !== i) say(file, `letter "${l}" is used by two lines`);
  });

  const lineIds = new Set(lines.map((l) => l.id));
  const hubs = e.hubs ?? [];
  const slugs = new Map();
  const claim = (slug, owner) => {
    if (RESERVED.includes(slug)) say(file, `${owner} uses the reserved path /${slug}`);
    if (slugs.has(slug)) say(file, `/${slug} is claimed by both ${slugs.get(slug)} and ${owner}`);
    slugs.set(slug, owner);
  };
  lines.forEach((l) => claim(l.id, `line ${l.id}`));
  hubs.forEach((h) => {
    claim(h.id, `hub ${h.id}`);
    list(h.aliases).forEach((a) => claim(a, `hub ${h.id} (alias)`));
    if (!lineIds.has(h.line)) say(file, `hub ${h.id} is on unknown line "${h.line}"`);
    if (!h.h1 || !h.lede) say(file, `hub ${h.id} needs an h1 and a lede`);
    if (h.loose !== undefined && typeof h.loose !== 'boolean') say(file, `hub ${h.id} loose should be true or false`);
  });
  lines.forEach((l) => {
    const loose = hubs.filter((h) => h.line === l.id && h.loose);
    if (loose.length > 1) say(file, `line ${l.id} has ${loose.length} loose hubs; one holds all of a section's loose things`);
  });

  const hubIds = new Set(hubs.map((h) => h.id));
  const things = e.things ?? [];
  const ids = new Set();
  for (const t of things) {
    if (!/^[a-z0-9-]+$/.test(t.id ?? '')) say(file, `thing id "${t.id}" should be lowercase letters, digits and hyphens`);
    if (ids.has(t.id)) say(file, `thing id "${t.id}" appears twice`);
    ids.add(t.id);
  }
  for (const t of things) {
    const where = `thing ${t.id}`;
    if (!t.title) say(file, `${where} has no title`);
    if (!t.blurb) say(file, `${where} has no blurb`);
    if (!STATUSES.includes(t.status)) say(file, `${where} has status "${t.status}"; use one of ${STATUSES.join(', ')}`);
    const th = list(t.hubs);
    if (!th.length) say(file, `${where} stops at no hub`);
    th.forEach((h) => hubIds.has(h) || say(file, `${where} stops at unknown hub "${h}"`));
    list(t.related).forEach((r) => ids.has(r) || say(file, `${where} relates to unknown thing "${r}"`));
    for (const l of t.links ?? []) {
      if (!l.label || !l.url) say(file, `${where} has a link without a label or url`);
      else if (!/^(https:\/\/|\/)/.test(l.url)) say(file, `${where} links to "${l.url}"; use https:// or a path on this site`);
    }
    if (t.source && !/^https:\/\/github\.com\//.test(t.source)) say(file, `${where} source should be a github.com URL`);
    if (t.updated && !/^\d{4}(-\d{2})?$/.test(t.updated)) say(file, `${where} updated should look like 2026-09`);
  }
}

if (problems) {
  console.error(`\n${problems} problem(s). Nothing was built.`);
  process.exit(1);
}
console.log('atlas: every edition checks out.');
