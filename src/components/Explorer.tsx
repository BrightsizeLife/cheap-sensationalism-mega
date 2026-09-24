// View switch + filters + the chosen view, over any set of stations.
// The landing, line pages, and hub pages all use it with a different set.

import React from 'react';
import type { Atlas } from '../atlas/load';
import type { Hub, Thing } from '../atlas/types';
import { useFiltered, useViewState } from '../atlas/state';
import { Filters, ViewSwitch } from './Controls';
import { HubList, ListView } from '../views/ListView';
import { TableView } from '../views/TableView';
import { NetworkView } from '../views/NetworkView';

export function Explorer({
  atlas,
  things,
  hub,
  caption,
  headingId,
  heading,
}: {
  atlas: Atlas;
  things: Thing[];
  /** On a hub page: list flat, and centre the network on this hub. */
  hub?: Hub;
  caption: string;
  headingId: string;
  heading: React.ReactNode;
}) {
  const { view } = useViewState();
  const shown = useFiltered(atlas, things);
  const multiLine = new Set(things.flatMap((t) => atlas.linesOf(t).map((l) => l.id))).size > 1;
  return (
    <section className="pact-section cs-explorer" aria-labelledby={headingId}>
      <div className="cs-explorer-head">
        <h2 id={headingId} className="pact-h2">
          {heading}
        </h2>
        <ViewSwitch />
      </div>
      <Filters atlas={atlas} showLines={multiLine && !hub} shown={shown.length} total={things.length} />
      {view === 'list' &&
        (hub ? <HubList atlas={atlas} hub={hub} things={shown} /> : <ListView atlas={atlas} things={shown} />)}
      {view === 'table' && <TableView atlas={atlas} things={shown} caption={caption} />}
      {view === 'network' && <NetworkView atlas={atlas} things={shown} focusHub={hub?.id} />}
    </section>
  );
}
