// The controls at the top of every map: how you want to see it (list,
// table, network) and what to leave out. Every choice is written to the
// URL, so the link in the address bar always reproduces the screen.

import type { Atlas } from '../atlas/load';
import { useViewState, VIEWS, type View } from '../atlas/state';
import { Link, setParams, useLocation } from '../router';
import { plural } from './bits';

const VIEW_WORDS: Record<View, string> = { list: 'list', table: 'table', network: 'network' };

export function ViewSwitch() {
  const { view } = useViewState();
  const { path, search } = useLocation();
  const hrefFor = (v: View) => {
    const p = new URLSearchParams(search);
    if (v === 'list') p.delete('view');
    else p.set('view', v);
    if (v !== 'network') p.delete('node');
    if (v !== 'table') p.delete('sort');
    const qs = p.toString();
    return path + (qs ? `?${qs}` : '');
  };
  return (
    <nav className="pact-tabs cs-viewswitch" aria-label="how to see it">
      <ul>
        {VIEWS.map((v) => (
          <li key={v}>
            <Link to={hrefFor(v)} replace aria-current={v === view ? 'page' : undefined}>
              {VIEW_WORDS[v]}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Unfinished things ([WIP] and planned) are hidden until the reader asks
 *  for them, by the owner's choice. One button, always in the same place,
 *  saying how many it will show or hide. The choice goes in the URL. */
function UnfinishedToggle({ unfinished }: { unfinished: number }) {
  const { status } = useViewState();
  const things = unfinished === 1 ? 'thing' : 'things';
  const [label, next] =
    status === 'all'
      ? [`[hide the ${unfinished} unfinished ${things}]`, null]
      : status === 'wip'
        ? ['[show the finished things too]', 'all']
        : [`[show the ${unfinished} unfinished ${things}]`, 'all'];
  return (
    <button type="button" className="pact-cta cs-unfinished-toggle" onClick={() => setParams({ status: next })}>
      {label}
    </button>
  );
}

export function Filters({
  atlas,
  showLines = true,
  shown,
  total,
  unfinished,
}: {
  atlas: Atlas;
  showLines?: boolean;
  shown: number;
  total: number;
  /** Unfinished things the section filter lets through. */
  unfinished: number;
}) {
  const { lines } = useViewState();
  const toggleLine = (id: string) => {
    const next = lines.includes(id) ? lines.filter((l) => l !== id) : [...lines, id];
    setParams({ line: next.length ? next.join(',') : null });
  };
  const active = lines.length > 0;
  return (
    <div className="cs-filters">
      <div className="cs-filter-row">
        {showLines && (
          /* Closed unless a filter is on: the first screen stays as plain as the list. */
          <details className="cs-filter-box" open={active || undefined}>
            <summary className="pact-cta cs-filter-summary">[filter]</summary>
            <fieldset className="pact-fieldset cs-filter-group">
              <legend className="cs-kicker">sections</legend>
              <div className="cs-toggles">
                {atlas.edition.lines.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    className="cs-toggle"
                    aria-pressed={lines.includes(l.id)}
                    onClick={() => toggleLine(l.id)}
                  >
                    {l.name}
                  </button>
                ))}
              </div>
            </fieldset>
            {active && (
              <p>
                <button type="button" className="pact-cta" onClick={() => setParams({ line: null })}>
                  [clear the filter]
                </button>
              </p>
            )}
          </details>
        )}
        {unfinished > 0 && <UnfinishedToggle unfinished={unfinished} />}
      </div>
      <p className="pact-small pact-muted cs-count" role="status">
        {active ? (
          <>
            showing <span className="pact-num">{shown}</span> of {plural(total, 'thing')}
          </>
        ) : null}
      </p>
    </div>
  );
}
