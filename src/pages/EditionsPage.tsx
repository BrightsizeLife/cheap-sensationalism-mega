// Every version of the map, kept. A link with ?edition= shows that version
// and keeps showing it, however much the current map changes.

import { atlasFor, EDITIONS, previousEdition } from '../atlas/load';
import { Link } from '../router';
import { plural } from '../components/bits';

export function EditionsPage() {
  return (
    <>
      <div className="pact-section cs-intro">
        <p className="cs-kicker">{plural(EDITIONS.length, 'edition')}</p>
        <h1 className="pact-h1">editions.</h1>
        <p className="pact-lede">
          Every version of this map is kept. Open one and send the link: it will show that version for as long as the site
          exists.
        </p>
      </div>

      {EDITIONS.map((e) => {
        const a = atlasFor(e);
        const prev = previousEdition(e);
        const before = new Set(prev?.things.map((t) => t.id) ?? []);
        const now = new Set(e.things.map((t) => t.id));
        const added = prev ? e.things.filter((t) => !before.has(t.id)) : [];
        const removed = prev ? prev.things.filter((t) => !now.has(t.id)) : [];
        const c = a.count();
        return (
          <section key={e.id} className="pact-section cs-edition" aria-labelledby={`ed-${e.id}`}>
            <h2 id={`ed-${e.id}`} className="pact-h2">
              <span className="pact-num">{e.id}</span>
            </h2>
            <p className="pact-small pact-muted">
              published <span className="pact-num">{e.published}</span> · {plural(e.lines.length, 'line')} ·{' '}
              {plural(c.all, 'station')} · {c.live} in service
            </p>
            <p className="cs-measure">{e.note}</p>
            <p>
              <Link className="pact-cta" to={`/?edition=${e.id}`}>
                [open edition {e.id}]
              </Link>
            </p>
            {prev && (
              <details className="cs-changes">
                <summary className="pact-summary">
                  what changed since {prev.id}: {added.length} opened, {removed.length} closed or renamed
                </summary>
                {added.length > 0 && (
                  <>
                    <h3 className="cs-kicker cs-sub-h">opened</h3>
                    <ul className="cs-inline-list">
                      {added.map((t) => (
                        <li key={t.id}>
                          <Link to={`/station/${t.id}?edition=${e.id}`}>{t.title}</Link>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                {removed.length > 0 && (
                  <>
                    <h3 className="cs-kicker cs-sub-h">closed or renamed</h3>
                    <ul className="cs-inline-list">
                      {removed.map((t) => (
                        <li key={t.id}>
                          <Link to={`/station/${t.id}?edition=${prev.id}`}>{t.title}</Link>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </details>
            )}
          </section>
        );
      })}

      <section className="pact-section" aria-labelledby="before-h">
        <h2 id="before-h" className="pact-h2">
          before the editions
        </h2>
        <p className="cs-measure">
          The site existed before it kept its own history. These earlier systems are decommissioned and left standing, the
          way old stations are.
        </p>
        <ul className="pact-rows">
          <li>
            <p>
              <a href="https://github.com/BrightsizeLife/cheapsensationalism" rel="noopener">
                cheapsensationalism
              </a>{' '}
              <span className="pact-num pact-small pact-muted">2025-01</span>
            </p>
            <p className="pact-small pact-muted">The first band site: an index, noises, and scribbles, in plain HTML.</p>
          </li>
          <li>
            <p>
              <a href="https://github.com/BrightsizeLife/cheapsenseReboot" rel="noopener">
                cheapsenseReboot
              </a>{' '}
              <span className="pact-num pact-small pact-muted">2025-06</span>
            </p>
            <p className="pact-small pact-muted">The second: album notes, chords, lyrics, and a cover.</p>
          </li>
          <li>
            <p>
              <a href="https://github.com/BrightsizeLife/cheap-sensationalism-mega/commits/main" rel="noopener">
                every change to this site
              </a>
            </p>
            <p className="pact-small pact-muted">
              Every commit is a version too. The footer of each page says which build you are reading.
            </p>
          </li>
        </ul>
      </section>
    </>
  );
}
