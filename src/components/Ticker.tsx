// The moving banner. It is the loudest thing on the site on purpose: the
// studio is called Cheap Sensationalism, and a scrolling, colour-changing
// strip of announcements is the most honest way to say so.
//
// Loud, not hostile:
// - it stops while a pointer or keyboard focus is on it, and the button
//   under it stops it for good (WCAG 2.2.2, anything that moves for more
//   than 5 seconds needs a way to stop it);
// - the colour changes once every 2 seconds, far below the 3-flashes-a-
//   second line (WCAG 2.3.1);
// - with reduced motion on, nothing moves or changes colour and the items
//   sit still in a row;
// - the second copy that makes the loop seamless is hidden from screen
//   readers and the tab order, so each item is announced and focused once.

import { useState } from 'react';
import type { BannerItem } from '../atlas/types';
import { Go } from './bits';

function Items({ items, copy }: { items: BannerItem[]; copy?: boolean }) {
  return (
    <ul className="cs-ticker-items" aria-hidden={copy || undefined}>
      {items.map((b, i) => (
        <li key={i}>
          {b.link ? (
            <Go link={{ label: b.text, url: b.link.url }} className="cs-ticker-link" tabIndex={copy ? -1 : undefined}>
              {b.text}
            </Go>
          ) : (
            <span>{b.text}</span>
          )}
          <span className="cs-ticker-sep" aria-hidden="true">
            ✦
          </span>
        </li>
      ))}
    </ul>
  );
}

export function Ticker({ items }: { items: BannerItem[] }) {
  const [stopped, setStopped] = useState(false);
  if (!items.length) return null;
  return (
    <section className="cs-ticker-wrap" aria-labelledby="ticker-h">
      <h2 id="ticker-h" className="pact-sr-only">
        announcements
      </h2>
      <div className="cs-ticker" data-stopped={stopped || undefined}>
        <div className="cs-ticker-track">
          <Items items={items} />
          <Items items={items} copy />
        </div>
      </div>
      <p className="cs-ticker-control">
        <button type="button" className="pact-cta" aria-pressed={stopped} onClick={() => setStopped(!stopped)}>
          {stopped ? '[start the banner]' : '[stop the banner]'}
        </button>
      </p>
    </section>
  );
}
