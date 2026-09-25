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

export function Filters({
  atlas,
  showLines = true,
  shown,
  total,
}: {
  atlas: Atlas;
  showLines?: boolean;
  shown: number;
  total: number;
}) {
  const { lines, status } = useViewState();
  const toggleLine = (id: string) => {
    const next = lines.includes(id) ? lines.filter((l) => l !== id) : [...lines, id];
    setParams({ line: next.length ? next.join(',') : null });
  };
  const active = lines.length > 0 || status !== 'all';
  return (
    <div className="cs-filters">
      {/* Closed unless a filter is on: the first screen stays as plain as the list. */}
      <details className="cs-filter-box" open={active || undefined}>
        <summary className="pact-cta cs-filter-summary">[filter]</summary>
        {showLines && (
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
        )}
        <fieldset className="pact-fieldset cs-filter-group">
          <legend className="cs-kicker">status</legend>
          <div className="cs-toggles">
            {(
              [
                ['all', 'everything'],
                ['live', 'live'],
                ['wip', 'not finished'],
              ] as const
            ).map(([value, word]) => (
              <label key={value} className="pact-radio cs-radio">
                <input
                  type="radio"
                  name="status"
                  value={value}
                  checked={status === value}
                  onChange={() => setParams({ status: value === 'all' ? null : value })}
                />
                {word}
              </label>
            ))}
          </div>
        </fieldset>
        {active && (
          <p>
            <button type="button" className="pact-cta" onClick={() => setParams({ line: null, status: null })}>
              [clear the filters]
            </button>
          </p>
        )}
      </details>
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
