// The list: line, then hub, then stations. A transfer station appears on
// every line it stops at, the way it does on a subway map.

import React from 'react';
import type { Atlas } from '../atlas/load';
import type { Hub, Thing } from '../atlas/types';
import { STATUS_ORDER } from '../atlas/state';
import { Link } from '../router';
import { Bullet, Bullets, NewTag, StatusTag, ThingLinks } from '../components/bits';

const byService = (a: Thing, b: Thing) =>
  STATUS_ORDER[a.status] - STATUS_ORDER[b.status] || (b.updated ?? '').localeCompare(a.updated ?? '');

export function ThingRow({ atlas, thing, here }: { atlas: Atlas; thing: Thing; here?: Hub }) {
  const elsewhere = thing.hubs
    .filter((h) => h !== here?.id)
    .map((h) => atlas.hubById.get(h))
    .filter((h): h is Hub => !!h);
  return (
    <li className="cs-row">
      <p className="cs-row-title">
        <Bullets atlas={atlas} thing={thing} />
        <Link to={`/station/${thing.id}`}>{thing.title}</Link>
        {atlas.fresh.has(thing.id) && <NewTag />}
      </p>
      <p className="pact-small cs-row-meta">
        <span>{thing.kind}</span>
        <StatusTag status={thing.status} note={thing.note} />
        {thing.year && <span className="pact-num">{thing.year}</span>}
        {thing.note && <span className="pact-muted">{thing.note}</span>}
      </p>
      <p className="pact-small pact-muted cs-row-blurb">{thing.blurb}</p>
      {(thing.links.length > 0 || (here && elsewhere.length > 0)) && (
        <p className="pact-small cs-row-go">
          <ThingLinks thing={thing} limit={2} />
          {here && elsewhere.length > 0 && (
            <span className="pact-muted cs-transfer">
              transfer to{' '}
              {elsewhere.map((h, i) => (
                <React.Fragment key={h.id}>
                  {i > 0 && ', '}
                  <Link to={`/${h.id}`}>{h.name}</Link>
                </React.Fragment>
              ))}
            </span>
          )}
        </p>
      )}
    </li>
  );
}

/** Grouped by line and hub. Used on the landing and on line pages. */
export function ListView({ atlas, things, headingLevel = 3 }: { atlas: Atlas; things: Thing[]; headingLevel?: 3 | 4 }) {
  const shown = new Set(things.map((t) => t.id));
  const H = `h${headingLevel}` as 'h3';
  const H2 = `h${headingLevel + 1}` as 'h4';
  const lines = atlas.edition.lines.filter((l) => atlas.hubsOn(l.id).some((h) => atlas.thingsAt(h.id).some((t) => shown.has(t.id))));
  if (!lines.length) return <p className="pact-muted">Nothing matches. Loosen a filter.</p>;
  return (
    <div className="cs-list">
      {lines.map((line) => (
        <section key={line.id} className="cs-list-line pact-dim-section" data-dimension={line.hue} aria-labelledby={`list-${line.id}`}>
          <H id={`list-${line.id}`} className="pact-h2 cs-list-line-h">
            <Bullet line={line} /> <Link to={`/${line.id}`}>{line.name}</Link>
          </H>
          <p className="pact-small pact-muted cs-list-line-blurb">{line.blurb}</p>
          {atlas.hubsOn(line.id).map((hub) => {
            const here = atlas.thingsAt(hub.id).filter((t) => shown.has(t.id)).sort(byService);
            if (!here.length) return null;
            return (
              <div key={hub.id} className="cs-list-hub">
                <H2 className="cs-list-hub-h">
                  <Link to={`/${hub.id}`}>{hub.name}</Link>{' '}
                  <span className="pact-small pact-muted">
                    <span className="pact-num">{here.length}</span> {here.length === 1 ? 'station' : 'stations'}
                  </span>
                </H2>
                <ul className="pact-rows">
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
  if (!things.length) return <p className="pact-muted">Nothing matches. Loosen a filter.</p>;
  return (
    <ul className="pact-rows">
      {[...things].sort(byService).map((t) => (
        <ThingRow key={t.id} atlas={atlas} thing={t} here={hub} />
      ))}
    </ul>
  );
}
