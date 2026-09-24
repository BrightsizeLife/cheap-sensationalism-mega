// The controls at the top of every map: how you want to see it (list,
// table, network) and what to leave out. Every choice is written to the
// URL, so the link in the address bar always reproduces the screen.

import type { Atlas } from '../atlas/load';
import { useViewState, VIEWS, type View } from '../atlas/state';
import { Link, setParams, useLocation } from '../router';
import { Bullet, plural } from './bits';

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
  return (
    <div className="cs-filters">
      {showLines && (
        <fieldset className="pact-fieldset cs-filter-group">
          <legend className="cs-kicker">lines</legend>
          <div className="cs-toggles">
            {atlas.edition.lines.map((l) => (
              <button
                key={l.id}
                type="button"
                className="cs-toggle"
                aria-pressed={lines.includes(l.id)}
                onClick={() => toggleLine(l.id)}
              >
                <Bullet line={l} /> {l.name}
              </button>
            ))}
            {lines.length > 0 && (
              <button type="button" className="pact-cta" onClick={() => setParams({ line: null })}>
                [show every line]
              </button>
            )}
          </div>
        </fieldset>
      )}
      <fieldset className="pact-fieldset cs-filter-group">
        <legend className="cs-kicker">service</legend>
        <div className="cs-toggles">
          {(
            [
              ['all', 'everything'],
              ['live', 'in service'],
              ['wip', 'under construction'],
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
      <p className="pact-small pact-muted cs-count" role="status">
        showing <span className="pact-num">{shown}</span> of {plural(total, 'station')}
      </p>
    </div>
  );
}
