import React from 'react';
import type { Atlas } from '../atlas/load';
import { Link } from '../router';
import { Bullet, Go, plural } from '../components/bits';
import { Explorer } from '../components/Explorer';

const are = (n: number) => `${n} ${n === 1 ? 'is' : 'are'}`;

/** "21 are in service, 25 are under construction, and 3 have been shut down with dignity." */
function census(c: { live: number; wip: number; idea: number; retired: number }) {
  const parts = [`${are(c.live)} in service`];
  if (c.wip) parts.push(`${are(c.wip)} under construction`);
  if (c.idea) parts.push(`${are(c.idea)} planned, which means they have a name and not much else`);
  if (c.retired) parts.push(`${c.retired} ${c.retired === 1 ? 'has' : 'have'} been shut down with dignity`);
  const last = parts.pop()!;
  return (parts.length ? `${parts.join(', ')}, and ${last}` : last) + '.';
}

export function Landing({ atlas }: { atlas: Atlas }) {
  const e = atlas.edition;
  const c = atlas.count();
  const transfers = e.things.filter((t) => atlas.isTransfer(t)).length;
  const fresh = atlas.fresh.size;
  return (
    <>
      <div className="pact-section cs-intro">
        <p className="cs-kicker">
          edition {e.id} · {plural(e.lines.length, 'line')} · {plural(e.hubs.length, 'hub')}
        </p>
        <h1 className="pact-h1">everything I make, drawn as a subway map.</h1>
        <p className="pact-lede">
          {c.all} stations on {e.lines.length} lines. {census(c)}
        </p>
      </div>

      <Explorer
        atlas={atlas}
        things={e.things}
        caption="every station on the map"
        headingId="everything-h"
        heading="every station"
      />


      <section className="pact-section" aria-labelledby="lines-h">
        <h2 id="lines-h" className="pact-h2">
          the lines
        </h2>
        <ul className="cs-lines">
          {e.lines.map((l) => {
            const hubs = atlas.hubsOn(l.id);
            return (
              <li key={l.id} className="cs-line">
                <h3 className="cs-line-h">
                  <Bullet line={l} size="lg" />
                  <Link to={`/${l.id}`}>{l.name}</Link>
                </h3>
                <p className="pact-small cs-line-blurb">{l.blurb}</p>
                <p className="pact-small cs-line-hubs">
                  {hubs.map((h, i) => (
                    <React.Fragment key={h.id}>
                      {i > 0 && <span aria-hidden="true"> · </span>}
                      <Link to={`/${h.id}`}>{h.name}</Link>{' '}
                      <span className="pact-num pact-muted">{atlas.thingsAt(h.id).length}</span>
                    </React.Fragment>
                  ))}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      {e.advisories.length > 0 && (
        <section className="pact-section" aria-labelledby="advisories-h">
          <h2 id="advisories-h" className="cs-kicker">
            service advisories
          </h2>
          <ul className="pact-rows cs-advisories">
            {e.advisories.map((a, i) => (
              <li key={i}>
                <p>
                  {a.text} {a.link && <Go link={a.link} />}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}


      <section className="pact-section" aria-labelledby="counts-h">
        <h2 id="counts-h" className="pact-h2">
          the numbers
        </h2>
        <dl className="pact-stats">
          <div className="pact-stat">
            <dt className="cs-kicker">stations</dt>
            <dd>
              <span className="pact-num-big">{c.all}</span>
            </dd>
          </div>
          <div className="pact-stat">
            <dt className="cs-kicker">in service</dt>
            <dd>
              <span className="pact-num-big">{c.live}</span>
            </dd>
          </div>
          <div className="pact-stat pact-stat-live">
            <dt className="cs-kicker">not finished</dt>
            <dd>
              <span className="pact-num-big">{c.wip + c.idea}</span>
              <span className="pact-small pact-muted cs-stat-note">this is the number to watch</span>
            </dd>
          </div>
          <div className="pact-stat">
            <dt className="cs-kicker">transfers</dt>
            <dd>
              <span className="pact-num-big">{transfers}</span>
              <span className="pact-small pact-muted cs-stat-note">stations on two lines or more</span>
            </dd>
          </div>
        </dl>
        {fresh > 0 && (
          <p className="pact-small cs-fresh-note">
            {plural(fresh, 'station')} added to the map since the last edition. <Link to="/editions">[see what changed]</Link>
          </p>
        )}
      </section>

      <section className="pact-section" aria-labelledby="elsewhere-h">
        <h2 id="elsewhere-h" className="pact-h2">
          out-of-system transfers
        </h2>
        <p className="pact-small pact-muted cs-measure">
          Other networks. Some of them are mine and poorly maintained; the rest belong to other people and are better than
          anything here.
        </p>
        <div className="cs-elsewhere">
          <div>
            <h3 className="cs-kicker cs-sub-h">where I also am</h3>
            <ul className="pact-rows">
              {e.elsewhere.accounts.map((a) => (
                <li key={a.url}>
                  <Go link={a} className="cs-plain-link" />
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="cs-kicker cs-sub-h">where you should go instead</h3>
            <ul className="pact-rows">
              {e.elsewhere.detours.map((d) => (
                <li key={d.url}>
                  <p>
                    <Go link={d} className="cs-plain-link" />
                  </p>
                  <p className="pact-small pact-muted">{d.blurb}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
