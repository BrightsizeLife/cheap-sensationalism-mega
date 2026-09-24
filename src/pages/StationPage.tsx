// One station: what it is, whether it runs, where it goes, and what it
// connects to. Every station has its own address, so it can be sent.

import React from 'react';
import type { Atlas } from '../atlas/load';
import type { Thing } from '../atlas/types';
import { STATUS_ORDER } from '../atlas/state';
import { Link } from '../router';
import { Bullet, Go, NewTag, StatusTag } from '../components/bits';
import { ThingRow } from '../views/ListView';

export function StationPage({ atlas, thing }: { atlas: Atlas; thing: Thing }) {
  const lines = atlas.linesOf(thing);
  const hubs = thing.hubs.map((h) => atlas.hubById.get(h)).filter((h) => !!h);
  const home = hubs[0];
  const [first, ...rest] = thing.links;
  const neighbours = atlas.neighbours(thing);

  // Previous and next stop on the home hub, in the order its page lists them.
  const route = home
    ? atlas
        .thingsAt(home.id)
        .sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status] || (b.updated ?? '').localeCompare(a.updated ?? ''))
    : [];
  const i = route.findIndex((t) => t.id === thing.id);
  const prev = i > 0 ? route[i - 1] : undefined;
  const next = i >= 0 && i < route.length - 1 ? route[i + 1] : undefined;

  return (
    <>
      <div className="pact-section cs-intro pact-dim-section" data-dimension={lines[0]?.hue}>
        <p className="cs-kicker">
          {lines.map((l) => (
            <React.Fragment key={l.id}>
              <Bullet line={l} /> {l.name}{' '}
            </React.Fragment>
          ))}
          · station
        </p>
        <h1 className="pact-h1">{thing.title}</h1>
        <p className="pact-lede">{thing.blurb}</p>
        <p className="cs-station-status">
          <StatusTag status={thing.status} /> {atlas.fresh.has(thing.id) && <NewTag />}
          {thing.note && <span className="pact-small pact-muted"> {thing.note}</span>}
        </p>
        {first && (
          <p className="cs-action cs-links">
            <Go link={first} className="pact-btn" />
            {rest.map((l) => (
              <Go key={l.url} link={l} />
            ))}
          </p>
        )}
      </div>

      <section className="pact-section" aria-labelledby="facts-h">
        <h2 id="facts-h" className="cs-kicker">
          the facts
        </h2>
        <dl className="cs-facts">
          <div>
            <dt>kind</dt>
            <dd>{thing.kind}</dd>
          </div>
          <div>
            <dt>stops at</dt>
            <dd>
              {hubs.map((h, k) => (
                <React.Fragment key={h!.id}>
                  {k > 0 && ', '}
                  <Link to={`/${h!.id}`}>{h!.name}</Link>
                </React.Fragment>
              ))}
              {hubs.length > 1 && <span className="pact-muted"> (a transfer station)</span>}
            </dd>
          </div>
          {thing.year && (
            <div>
              <dt>opened</dt>
              <dd className="pact-num">{thing.year}</dd>
            </div>
          )}
          {thing.updated && (
            <div>
              <dt>last worked on</dt>
              <dd className="pact-num">{thing.updated}</dd>
            </div>
          )}
          {thing.made && (
            <div>
              <dt>made with</dt>
              <dd>{thing.made}</dd>
            </div>
          )}
          <div>
            <dt>source</dt>
            <dd>
              {thing.source ? (
                <a href={thing.source} rel="noopener">
                  {thing.source.replace(/^https:\/\//, '')}
                </a>
              ) : (
                <span className="pact-muted">not public</span>
              )}
            </dd>
          </div>
        </dl>
      </section>

      {neighbours.length > 0 && (
        <section className="pact-section" aria-labelledby="connections-h">
          <h2 id="connections-h" className="pact-h2">
            connects to
          </h2>
          <p className="pact-small pact-muted cs-measure">
            Stations this one talks to, whatever line they are on. This is the part of the map that ignores the map.
          </p>
          <ul className="pact-rows">
            {neighbours.map((t) => (
              <ThingRow key={t.id} atlas={atlas} thing={t} />
            ))}
          </ul>
        </section>
      )}

      {(prev || next) && home && (
        <nav className="pact-section cs-nextstop" aria-label={`stops at ${home.name}`}>
          {prev && (
            <p>
              <span className="cs-kicker">previous stop</span>
              <Link className="pact-cta" to={`/station/${prev.id}`}>
                [{prev.title}]
              </Link>
            </p>
          )}
          {next && (
            <p>
              <span className="cs-kicker">next stop</span>
              <Link className="pact-cta" to={`/station/${next.id}`}>
                [{next.title}]
              </Link>
            </p>
          )}
          <p>
            <span className="cs-kicker">this line</span>
            <Link className="pact-cta" to={`/${home.id}`}>
              [back to {home.name}]
            </Link>
          </p>
        </nav>
      )}
    </>
  );
}
