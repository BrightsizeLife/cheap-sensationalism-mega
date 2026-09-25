// The chrome every page shares: skip link, header, main, footer, and the
// banner that tells you when you are looking at an old edition.

import React, { useState } from 'react';
import type { Atlas } from '../atlas/load';
import { LATEST } from '../atlas/load';
import { Link, useLocation } from '../router';
import { Bullet } from './bits';

declare const __BUILD__: { sha: string; date: string };

export function Shell({
  atlas,
  pinned,
  current,
  children,
}: {
  atlas: Atlas;
  pinned: boolean;
  /** The nav item for this page, if it has one. */
  current?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <a className="pact-skip" href="#main">
        skip to the content
      </a>
      <header className="pact-header">
        <div className="pact-page pact-header-inner">
          <Link to="/" className="pact-wordmark cs-wordmark" aria-current={current === 'map' ? 'page' : undefined}>
            CHEAP SENSATIONALISM
          </Link>
          <nav className="pact-nav" aria-label="sections">
            <ul>
              {atlas.edition.lines.map((l) => (
                <li key={l.id}>
                  <Link to={`/${l.id}`} aria-current={current === l.id ? 'page' : undefined}>
                    <Bullet line={l} /> {l.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/editions" aria-current={current === 'editions' ? 'page' : undefined}>
                  editions
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main id="main" tabIndex={-1} className="pact-page">
        {pinned && <EditionBanner atlas={atlas} />}
        {children}
      </main>
      <Footer atlas={atlas} />
    </>
  );
}

function EditionBanner({ atlas }: { atlas: Atlas }) {
  const { path } = useLocation();
  const isLatest = atlas.edition.id === LATEST.id;
  return (
    <div className="pact-banner" role="note">
      <p>
        <span className="cs-kicker">edition {atlas.edition.id}</span>
        {isLatest
          ? 'This link is pinned to the current edition. It will keep showing this edition after the site changes.'
          : `You are looking at the site as it was on ${atlas.edition.published}. It will not change.`}{' '}
        {!isLatest && (
          <a className="pact-cta" href={path}>
            [see the current site]
          </a>
        )}
      </p>
    </div>
  );
}

/** Copies a link that reproduces this exact screen, with the edition
 *  pinned, so it still shows the same thing after the site changes. */
function Permalink({ atlas }: { atlas: Atlas }) {
  const { path, search } = useLocation();
  const [said, setSaid] = useState('');
  const [manual, setManual] = useState<string | null>(null);
  const p = new URLSearchParams(search);
  p.set('edition', atlas.edition.id);
  const url = `${window.location.origin}${path}?${p.toString()}`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setManual(null);
      setSaid(`Copied. The link is pinned to edition ${atlas.edition.id}, so it will keep showing exactly this.`);
    } catch {
      setManual(url);
      setSaid('Your browser would not let the page copy. The link is in the box below.');
    }
  };
  return (
    <div className="cs-permalink">
      <button type="button" className="pact-cta" onClick={copy}>
        [copy a link to exactly this]
      </button>
      <span className="pact-small cs-permalink-said" role="status">
        {said}
      </span>
      {manual && (
        <p className="pact-field">
          <label className="pact-field-label" htmlFor="permalink">
            the link
          </label>
          <input id="permalink" className="pact-input" readOnly value={manual} onFocus={(e) => e.currentTarget.select()} />
        </p>
      )}
    </div>
  );
}

function Footer({ atlas }: { atlas: Atlas }) {
  const sha = __BUILD__.sha;
  return (
    <footer className="pact-footer">
      <div className="pact-page">
        <Permalink atlas={atlas} />
        <p>
          cheap sensationalism is independent. it is not affiliated with or endorsed by anyone, which you could probably tell.
        </p>
        <ul>
          <li>
            <Link to="/editions">editions</Link>
          </li>
          <li>
            <a href="https://github.com/BrightsizeLife/cheap-sensationalism-mega" rel="noopener">
              source
            </a>
          </li>
          <li>
            <a href="https://ko-fi.com/cheapsensationalism" rel="noopener">
              ko-fi
            </a>
          </li>
        </ul>
        <p className="pact-small cs-build">
          edition <span className="pact-num">{atlas.edition.id}</span> · build{' '}
          {sha ? (
            <a className="pact-num" href={`https://github.com/BrightsizeLife/cheap-sensationalism-mega/commit/${sha}`} rel="noopener">
              {sha.slice(0, 7)}
            </a>
          ) : (
            <span className="pact-num">local</span>
          )}{' '}
          · no cookies, no trackers, no fonts from anyone else
        </p>
      </div>
    </footer>
  );
}
