// A launching page: one hub, its stations, and where you can change.

import React from 'react';
import type { Atlas } from '../atlas/load';
import type { Hub } from '../atlas/types';
import { Link } from '../router';
import { Go, plural } from '../components/bits';
import { Explorer } from '../components/Explorer';

export function HubPage({ atlas, hub }: { atlas: Atlas; hub: Hub }) {
  const line = atlas.lineById.get(hub.line)!;
  const things = atlas.thingsAt(hub.id);
  const c = atlas.count(things);
  const transfers = atlas.transfersFrom(hub.id);
  const siblings = atlas.hubsListed(line.id).filter((h) => h.id !== hub.id);
  return (
    <>
      <div className="pact-section cs-intro">
        <p className="cs-kicker">
          <Link to={`/${line.id}`}>{line.name}</Link> · {hub.name}
        </p>
        <h1 className="pact-h1">{hub.h1}</h1>
        <p className="pact-lede">{hub.lede}</p>
        {hub.action && (
          <p className="cs-action">
            <Go link={hub.action} className="pact-btn" />
          </p>
        )}
      </div>

      <section className="pact-section" aria-labelledby="hub-counts-h">
        <h2 id="hub-counts-h" className="pact-sr-only">
          the numbers
        </h2>
        <dl className="pact-stats">
          <div className="pact-stat">
            <dt className="cs-kicker">things</dt>
            <dd>
              <span className="pact-num-big">{c.all}</span>
            </dd>
          </div>
          <div className="pact-stat">
            <dt className="cs-kicker">live</dt>
            <dd>
              <span className="pact-num-big">{c.live}</span>
            </dd>
          </div>
          <div className="pact-stat">
            <dt className="cs-kicker">not finished</dt>
            <dd>
              <span className="pact-num-big">{c.wip + c.idea}</span>
            </dd>
          </div>
        </dl>
      </section>

      <Explorer
        atlas={atlas}
        things={things}
        hub={hub}
        caption={`everything in ${hub.name}`}
        headingId="hub-things-h"
        heading="everything here"
      />

      {transfers.length > 0 && (
        <section className="pact-section" aria-labelledby="transfers-h">
          <h2 id="transfers-h" className="pact-h2">
            also connects to
          </h2>
          <ul className="cs-tree-items cs-tree-items-flat">
            {transfers.map(({ hub: other, via }) => {
              const otherLine = atlas.lineById.get(other.line)!;
              return (
                <li key={other.id}>
                  <p className="cs-row-title">
                    <Link to={atlas.hubPath(other)}>{other.name}</Link>
                    {!other.loose && <span className="pact-small pact-muted"> in {otherLine.name}</span>}
                  </p>
                  <p className="pact-small pact-muted">
                    via{' '}
                    {via.map((t, i) => (
                      <React.Fragment key={t.id}>
                        {i > 0 && ', '}
                        <Link to={`/thing/${t.id}`}>{t.title}</Link>
                      </React.Fragment>
                    ))}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {siblings.length > 0 && (
        <section className="pact-section" aria-labelledby="siblings-h">
          <h2 id="siblings-h" className="cs-kicker">
            more in {line.name}
          </h2>
          <p className="cs-links">
            {siblings.map((h) => (
              <Link key={h.id} className="pact-cta" to={atlas.hubPath(h)}>
                [{h.name}: {plural(atlas.thingsAt(h.id).length, 'thing')}]
              </Link>
            ))}
          </p>
        </section>
      )}
    </>
  );
}
