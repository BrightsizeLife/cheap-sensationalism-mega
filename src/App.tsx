// Which page is this? Paths are matched against the edition being viewed,
// so /music means "the music hub in this edition", and an old link to a
// thing that has since been removed still says something useful.

import React, { useEffect } from 'react';
import { atlasFor, LATEST } from './atlas/load';
import { useAtlas } from './atlas/state';
import { Link, navigate, useLocation } from './router';
import { Shell } from './components/Shell';
import { Landing } from './pages/Landing';
import { LinePage } from './pages/LinePage';
import { HubPage } from './pages/HubPage';
import { StationPage } from './pages/StationPage';
import { EditionsPage } from './pages/EditionsPage';

const SITE = 'cheap sensationalism';

export default function App() {
  const { path, search } = useLocation();
  const { atlas, pinned, unknownEdition } = useAtlas();
  const [first, second] = path.split('/').filter(Boolean).map(decodeURIComponent);

  let title = SITE;
  let current: string | undefined;
  let page: React.ReactNode;

  const hub = first ? atlas.hubForSlug(first) : undefined;
  const line = first ? atlas.lineById.get(first) : undefined;

  if (!first) {
    current = 'map';
    page = <Landing atlas={atlas} />;
  } else if ((first === 'thing' || first === 'station') && second) {
    const thing = atlas.thingById.get(second);
    if (thing) {
      title = `${thing.title} · ${SITE}`;
      page = <StationPage atlas={atlas} thing={thing} />;
    } else {
      const inLatest = atlasFor(LATEST).thingById.get(second);
      title = `not found · ${SITE}`;
      page = (
        <Closed
          what={`There is nothing called “${second}” in edition ${atlas.edition.id}.`}
          alt={inLatest && pinned ? { to: `/thing/${second}?edition=${LATEST.id}`, label: `[see it in the current edition]` } : undefined}
        />
      );
    }
  } else if (first === 'editions') {
    current = 'editions';
    title = `editions · ${SITE}`;
    page = <EditionsPage />;
  } else if (line) {
    current = line.id;
    title = `${line.name} · ${SITE}`;
    page = <LinePage atlas={atlas} line={line} />;
  } else if (hub) {
    current = hub.line;
    title = `${hub.name} · ${SITE}`;
    page = <HubPage atlas={atlas} hub={hub} />;
  } else {
    title = `not found · ${SITE}`;
    page = <Closed what={`There is nothing at /${first} in edition ${atlas.edition.id}.`} />;
  }

  // Old names land on the current ones, keeping the query string.
  useEffect(() => {
    if (first === 'station' && second) navigate(`/thing/${second}${search}`, { replace: true });
    else if (hub && first !== hub.id) navigate(`/${hub.id}${search}`, { replace: true });
  }, [hub, first, second, search]);

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <Shell atlas={atlas} pinned={pinned} current={current}>
      {unknownEdition && (
        <div className="pact-banner" role="note">
          <p>
            <span className="cs-kicker">no such edition</span>
            There is no edition called “{unknownEdition}”. This is the current map instead.{' '}
            <Link className="pact-cta" to="/editions">
              [see every edition]
            </Link>
          </p>
        </div>
      )}
      {page}
    </Shell>
  );
}

function Closed({ what, alt }: { what: string; alt?: { to: string; label: string } }) {
  return (
    <div className="pact-section cs-intro">
      <p className="cs-kicker">404</p>
      <h1 className="pact-h1">nothing here.</h1>
      <p className="pact-lede">{what} It may have been renamed, merged, or never made.</p>
      <p className="cs-links">
        {alt && (
          <Link className="pact-cta" to={alt.to}>
            {alt.label}
          </Link>
        )}
        <Link className="pact-cta" to="/">
          [back to everything]
        </Link>
      </p>
    </div>
  );
}
