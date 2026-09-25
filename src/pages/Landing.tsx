// The front page, kept as simple as the first version of the site: the
// name, the moving banner, and everything in one list (or a table, or a
// network, picked at the top). Then the accounts and the detours.

import type { Atlas } from '../atlas/load';
import { Go } from '../components/bits';
import { Explorer } from '../components/Explorer';
import { Ticker } from '../components/Ticker';

export function Landing({ atlas }: { atlas: Atlas }) {
  const e = atlas.edition;
  const c = atlas.count();
  return (
    <>
      <div className="cs-intro cs-front">
        <h1 className="cs-title">cheap sensationalism</h1>
        <p className="pact-small pact-muted cs-front-lede">
          Everything I make. <span className="pact-num">{c.all}</span> things,{' '}
          <span className="pact-num">{c.live}</span> of them finished.
        </p>
      </div>

      <Ticker items={e.banner} />

      <Explorer atlas={atlas} things={e.things} caption="everything" headingId="everything-h" heading="everything" />

      <section className="pact-section" aria-labelledby="sociality-h">
        <h2 id="sociality-h" className="pact-h2">
          perverse sociality
        </h2>
        <ul className="cs-dash-list">
          {e.elsewhere.accounts.map((a) => (
            <li key={a.url}>
              <span className="cs-dash" aria-hidden="true">
                —
              </span>
              <span>
                <Go link={a} className="cs-plain-link" />
                {a.blurb && <span className="pact-small pact-muted"> {a.blurb}</span>}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="pact-section" aria-labelledby="random-h">
        <h2 id="random-h" className="pact-h2">
          random things
        </h2>
        <p className="pact-small pact-muted cs-measure">to make your visit somewhat worthwhile</p>
        <ul className="cs-dash-list">
          {e.elsewhere.detours.map((d) => (
            <li key={d.url}>
              <span className="cs-dash" aria-hidden="true">
                —
              </span>
              <span>
                <Go link={d} className="cs-plain-link" /> <span className="pact-small pact-muted">{d.blurb}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
