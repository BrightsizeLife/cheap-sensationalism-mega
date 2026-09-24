import type { Atlas } from '../atlas/load';
import type { Line } from '../atlas/types';
import { Link } from '../router';
import { Bullet, plural } from '../components/bits';
import { Explorer } from '../components/Explorer';

export function LinePage({ atlas, line }: { atlas: Atlas; line: Line }) {
  const hubs = atlas.hubsOn(line.id);
  const things = atlas.thingsOn(line.id);
  const c = atlas.count(things);
  return (
    <>
      <div className="pact-section cs-intro pact-dim-section" data-dimension={line.hue}>
        <p className="cs-kicker">
          <Bullet line={line} /> the {line.name} line · {plural(hubs.length, 'stop')}
        </p>
        <h1 className="pact-h1">{line.name}.</h1>
        <p className="pact-lede">
          {line.blurb} {plural(c.all, 'station')}, {c.live} in service.
        </p>
      </div>

      <section className="pact-section" aria-labelledby="stops-h">
        <h2 id="stops-h" className="pact-h2">
          stops on this line
        </h2>
        <ul className="pact-rows cs-hubrows">
          {hubs.map((h) => {
            const at = atlas.count(atlas.thingsAt(h.id));
            return (
              <li key={h.id}>
                <p className="cs-row-title">
                  <Link to={`/${h.id}`}>{h.name}</Link>{' '}
                  <span className="pact-small pact-muted">
                    <span className="pact-num">{at.all}</span> stations, <span className="pact-num">{at.live}</span> in
                    service
                  </span>
                </p>
                <p className="pact-small pact-muted">{h.lede}</p>
              </li>
            );
          })}
        </ul>
      </section>

      <Explorer
        atlas={atlas}
        things={things}
        caption={`every station on the ${line.name} line`}
        headingId="line-things-h"
        heading="every station on the line"
      />
    </>
  );
}
