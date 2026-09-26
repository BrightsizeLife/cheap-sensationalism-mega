// The list: section, then hub, then one line per thing. The hierarchy is
// shown by space, size and indent and nothing else: no markers, no colour.
// A section's loose things come first, one step in, with no hub heading.
// Something filed under two hubs appears under both, with a note saying
// where else it lives.

import React from 'react';
import type { Atlas } from '../atlas/load';
import type { Hub, Thing } from '../atlas/types';
import { STATUS_ORDER } from '../atlas/state';
import { Link } from '../router';
import { Go, StatusTag, linksFor } from '../components/bits';

const byService = (a: Thing, b: Thing) =>
  STATUS_ORDER[a.status] - STATUS_ORDER[b.status] || (b.updated ?? '').localeCompare(a.updated ?? '');

/** One thing, one line: the name, its status if it isn't finished, and
 *  the way in if there is one. `detail` adds the one-sentence blurb. */
export function ThingRow({ atlas, thing, here, detail }: { atlas: Atlas; thing: Thing; here?: Hub; detail?: boolean }) {
  const elsewhere = thing.hubs
    .filter((h) => h !== here?.id)
    .map((h) => atlas.hubById.get(h))
    .filter((h): h is Hub => !!h);
  // Short labels ([2025], [2024], ...) all fit on the line, the way the
  // first site listed the DORA years; otherwise just the main way in.
  const links = linksFor(thing);
  const shortLinks = links.length > 1 && links.every((l) => l.label.length <= 8);
  const shown = shortLinks ? links : links.slice(0, 1);
  return (
    <li className="cs-row">
      <span className="cs-row-body">
        <Link to={`/thing/${thing.id}`} className="cs-row-title">
          {thing.title}
        </Link>
        {thing.status !== 'live' && (
          <>
            {' '}
            <StatusTag status={thing.status} note={thing.note} />
          </>
        )}
        {shown.map((l) => (
          <React.Fragment key={l.url}>
            {' '}
            <Go link={l} className="cs-row-go" />
          </React.Fragment>
        ))}
        {here && elsewhere.length > 0 && (
          <span className="pact-small pact-muted cs-also">
            {' '}
            also in{' '}
            {elsewhere.map((h, i) => (
              <React.Fragment key={h.id}>
                {i > 0 && ', '}
                <Link to={atlas.hubPath(h)}>{h.name}</Link>
              </React.Fragment>
            ))}
          </span>
        )}
        {detail && <span className="pact-small pact-muted cs-row-blurb">{thing.blurb}</span>}
      </span>
    </li>
  );
}

/** Grouped by section and hub. Used on the landing and on section pages. */
export function ListView({ atlas, things, headingLevel = 3 }: { atlas: Atlas; things: Thing[]; headingLevel?: 3 | 4 }) {
  const shown = new Set(things.map((t) => t.id));
  const H = `h${headingLevel}` as 'h3';
  const H2 = `h${headingLevel + 1}` as 'h4';
  const lines = atlas.edition.lines.filter((l) => atlas.hubsOn(l.id).some((h) => atlas.thingsAt(h.id).some((t) => shown.has(t.id))));
  if (!lines.length) return <p className="pact-muted">Nothing matches these filters.</p>;
  return (
    <div className="cs-tree">
      {lines.map((line) => (
        <section key={line.id} className="cs-tree-section" aria-labelledby={`list-${line.id}`}>
          <H id={`list-${line.id}`} className="cs-tree-section-h">
            <Link to={`/${line.id}`}>{line.name}</Link>
          </H>
          {atlas.hubsOn(line.id).map((hub) => {
            const here = atlas.thingsAt(hub.id).filter((t) => shown.has(t.id)).sort(byService);
            if (!here.length) return null;
            if (hub.loose) {
              return (
                <div key={hub.id} className="cs-tree-hub cs-tree-hub-loose">
                  <ul className="cs-tree-items">
                    {here.map((t) => (
                      <ThingRow key={t.id} atlas={atlas} thing={t} here={hub} />
                    ))}
                  </ul>
                </div>
              );
            }
            return (
              <div key={hub.id} className="cs-tree-hub">
                <H2 className="cs-tree-hub-h">
                  <Link to={atlas.hubPath(hub)}>{hub.name}</Link>
                </H2>
                <ul className="cs-tree-items">
                  {here.map((t) => (
                    <ThingRow key={t.id} atlas={atlas} thing={t} here={hub} />
                  ))}
                </ul>
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
}

/** A flat list for one hub's launching page. */
export function HubList({ atlas, hub, things }: { atlas: Atlas; hub: Hub; things: Thing[] }) {
  if (!things.length) return <p className="pact-muted">Nothing matches these filters.</p>;
  return (
    <ul className="cs-tree-items cs-tree-items-flat">
      {[...things].sort(byService).map((t) => (
        <ThingRow key={t.id} atlas={atlas} thing={t} here={hub} />
      ))}
    </ul>
  );
}
