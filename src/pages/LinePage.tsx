import type { Atlas } from '../atlas/load';
import type { Line } from '../atlas/types';
import { Link } from '../router';
import { plural } from '../components/bits';
import { Explorer } from '../components/Explorer';

export function LinePage({ atlas, line }: { atlas: Atlas; line: Line }) {
  const hubs = atlas.hubsListed(line.id);
  const things = atlas.thingsOn(line.id);
  const c = atlas.count(things);
  return (
    <>
      <div className="pact-section cs-intro">
        {hubs.length > 0 && <p className="cs-kicker">{plural(hubs.length, 'hub')}</p>}
        <h1 className="pact-h1">{line.name}.</h1>
        <p className="pact-lede">
          {line.blurb} {plural(c.all, 'thing')}, {c.live} live.
        </p>
      </div>

      {hubs.length > 0 && (
      <section className="pact-section" aria-labelledby="stops-h">
        <h2 id="stops-h" className="pact-h2">
          hubs
        </h2>
        <ul className="cs-tree-items cs-tree-items-flat">
          {hubs.map((h) => {
            const at = atlas.count(atlas.thingsAt(h.id));
            return (
              <li key={h.id}>
                <p className="cs-row-title">
                  <Link to={atlas.hubPath(h)}>{h.name}</Link>{' '}
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
      )}

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
