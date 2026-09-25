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
          <Bullet line={line} /> {plural(hubs.length, 'hub')}
        </p>
        <h1 className="pact-h1">{line.name}.</h1>
        <p className="pact-lede">
          {line.blurb} {plural(c.all, 'thing')}, {c.live} live.
        </p>
      </div>

      <section className="pact-section" aria-labelledby="stops-h">
        <h2 id="stops-h" className="pact-h2">
          hubs
        </h2>
        <ul className="pact-rows cs-hubrows">
          {hubs.map((h) => {
            const at = atlas.count(atlas.thingsAt(h.id));
            return (
              <li key={h.id}>
                <p className="cs-row-title">
                  <Link to={`/${h.id}`}>{h.name}</Link>{' '}
                  <span className="pact-small pact-muted">
                    <span className="pact-num">{at.all}</span> things, <span className="pact-num">{at.live}</span> live
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
        caption={`everything in ${line.name}`}
        headingId="line-things-h"
        heading="everything here"
      />
    </>
  );
}
