// The table: one row per thing, sortable, for people who like to see
// everything at once and then argue with the order.

import type { Atlas } from '../atlas/load';
import type { Thing } from '../atlas/types';
import { STATUS_ORDER, useViewState, type Sort } from '../atlas/state';
import { Link, setParams } from '../router';
import { Bullets, NewTag, StatusTag, ThingLinks } from '../components/bits';

const COLUMNS: { key: Sort | null; label: string; num?: boolean }[] = [
  { key: 'title', label: 'thing' },
  { key: 'line', label: 'section' },
  { key: null, label: 'kind' },
  { key: 'status', label: 'status' },
  { key: 'updated', label: 'updated', num: true },
  { key: null, label: 'go' },
];

export function TableView({ atlas, things, caption }: { atlas: Atlas; things: Thing[]; caption: string }) {
  const { sort } = useViewState();
  const lineIndex = (t: Thing) => atlas.edition.lines.indexOf(atlas.lineOf(t)!);
  const hubIndex = (t: Thing) => atlas.edition.hubs.findIndex((h) => h.id === t.hubs[0]);
  const rows = [...things].sort((a, b) => {
    switch (sort) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'status':
        return STATUS_ORDER[a.status] - STATUS_ORDER[b.status] || a.title.localeCompare(b.title);
      case 'updated':
        return (b.updated ?? '').localeCompare(a.updated ?? '') || a.title.localeCompare(b.title);
      default:
        return lineIndex(a) - lineIndex(b) || hubIndex(a) - hubIndex(b) || a.title.localeCompare(b.title);
    }
  });
  if (!rows.length) return <p className="pact-muted">Nothing matches. Loosen a filter.</p>;
  return (
    <div className="pact-table-wrap" tabIndex={0} role="region" aria-label={`${caption}, scrolls sideways on small screens`}>
      <table className="pact-table cs-table">
        <caption>
          {caption}
          <span className="pact-sr-only">, sorted by {sort === 'line' ? 'section' : sort}</span>
        </caption>
        <thead>
          <tr>
            {COLUMNS.map((c) => (
              <th
                key={c.label}
                scope="col"
                className={c.num ? 'pact-num' : undefined}
                aria-sort={c.key && c.key === sort ? (c.key === 'updated' ? 'descending' : 'ascending') : undefined}
              >
                {c.key ? (
                  <button
                    type="button"
                    className="cs-sort"
                    onClick={() => setParams({ sort: c.key === 'line' ? null : c.key })}
                  >
                    {c.label}
                    <span aria-hidden="true">{c.key === sort ? (c.key === 'updated' ? ' ↓' : ' ↑') : ''}</span>
                    <span className="pact-sr-only">{c.key === sort ? '' : ', sort by this'}</span>
                  </button>
                ) : (
                  c.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((t) => (
            <tr key={t.id}>
              <td>
                <Link to={`/thing/${t.id}`}>{t.title}</Link>
                {atlas.fresh.has(t.id) && <NewTag />}
              </td>
              <td className="cs-nowrap">
                <Bullets atlas={atlas} thing={t} />
              </td>
              <td>{t.kind}</td>
              <td>
                <StatusTag status={t.status} note={t.note} />
              </td>
              <td className="pact-num">{t.updated ?? t.year ?? '—'}</td>
              <td>
                <ThingLinks thing={t} limit={1} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
