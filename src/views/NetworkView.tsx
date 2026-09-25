// The network: every hub on a ring, every station pulled toward the hubs it
// stops at, and dashed lines for connections that ignore the hierarchy.
// A station with two hubs ends up between them, which is the whole point.
//
// The layout is computed once, synchronously, and drawn still: nothing
// drifts or settles on screen. d3's force simulation seeds its randomness
// deterministically, so the same edition at the same width draws the same
// picture every time and a shared link shows what the sender saw.
//
// The SVG's viewBox matches its pixel size, so 12px text is 12px on a
// phone too. Every node is a real link (?node=id) that selects it; the
// details appear in HTML under the drawing, never in a tooltip.

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { forceCollide, forceLink, forceManyBody, forceSimulation, forceX, forceY } from 'd3';
import type { Atlas } from '../atlas/load';
import type { Hub, Line, Thing } from '../atlas/types';
import { useViewState } from '../atlas/state';
import { Link, setParams, useLocation } from '../router';
import { NewTag, StatusTag, ThingLinks } from '../components/bits';

type Node = {
  id: string;
  hub?: Hub;
  thing?: Thing;
  line: Line;
  r: number;
  x: number;
  y: number;
  fx?: number;
  fy?: number;
};
type Edge = { source: string; target: string; kind: 'stop' | 'related'; line?: Line };

const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return ((h >>> 0) % 1000) / 1000;
};

const permutations = <T,>(xs: T[]): T[][] =>
  xs.length <= 1 ? [xs] : xs.flatMap((x, i) => permutations([...xs.slice(0, i), ...xs.slice(i + 1)]).map((p) => [x, ...p]));

/** Order the ring so hubs that share stations sit next to each other,
 *  keeping each line's hubs together. Brute force: five lines and a few
 *  hubs each is a few thousand orders, which is nothing. The first order
 *  found wins ties, so the result is the same every time. */
function ringOrder(atlas: Atlas, hubs: Hub[], things: Thing[]): Hub[] {
  const shared = new Map<string, number>();
  const key = (a: string, b: string) => (a < b ? `${a}|${b}` : `${b}|${a}`);
  things.forEach((t) =>
    t.hubs.forEach((a, i) => t.hubs.slice(i + 1).forEach((b) => shared.set(key(a, b), (shared.get(key(a, b)) ?? 0) + 1))),
  );
  const groups = atlas.edition.lines.map((l) => hubs.filter((h) => h.line === l.id)).filter((g) => g.length);
  const inner = groups.map((g) => (g.length <= 4 ? permutations(g) : [g]));
  const total = permutations(groups.map((_, i) => i)).length * inner.reduce((n, o) => n * o.length, 1);
  if (total > 20000 || hubs.length < 3) return hubs;
  const score = (order: Hub[]) =>
    order.reduce((s, h, i) => s + (shared.get(key(h.id, order[(i + 1) % order.length].id)) ?? 0), 0);
  let best = hubs;
  let bestScore = -1;
  for (const lineOrder of permutations(groups.map((_, i) => i))) {
    if (lineOrder[0] !== 0) continue; // rotations of a ring are the same ring
    const walk = (k: number, acc: Hub[]) => {
      if (k === lineOrder.length) {
        const sc = score(acc);
        if (sc > bestScore) {
          bestScore = sc;
          best = acc;
        }
        return;
      }
      for (const option of inner[lineOrder[k]]) walk(k + 1, [...acc, ...option]);
    };
    walk(0, []);
  }
  return best;
}

function layout(atlas: Atlas, things: Thing[], width: number, height: number, focusHub?: string) {
  const hubIds = new Set<string>();
  things.forEach((t) => t.hubs.forEach((h) => hubIds.add(h)));
  const hubs = ringOrder(
    atlas,
    atlas.edition.hubs.filter((h) => hubIds.has(h.id) && h.id !== focusHub),
    things,
  );
  const cx = width / 2;
  const cy = height / 2;
  const margin = width < 500 ? 36 : 70;
  const rx = cx - margin;
  const ry = cy - margin;

  const nodes: Node[] = [];
  const byId = new Map<string, Node>();
  // Each hub gets a slice of the ring in proportion to how many stations
  // it has, so a busy hub is not crammed between two quiet ones.
  const weight = (h: Hub) => 1 + things.filter((t) => t.hubs.includes(h.id)).length / 4;
  const totalWeight = hubs.reduce((s, h) => s + weight(h), 0) || 1;
  let walked = 0;
  hubs.forEach((hub) => {
    const w = weight(hub);
    const a = -Math.PI / 2 + ((walked + w / 2) / totalWeight) * Math.PI * 2;
    walked += w;
    const x = cx + rx * Math.cos(a);
    const y = cy + ry * Math.sin(a);
    const n: Node = { id: `hub:${hub.id}`, hub, line: atlas.lineById.get(hub.line)!, r: 14, x, y, fx: x, fy: y };
    nodes.push(n);
    byId.set(n.id, n);
  });
  if (focusHub) {
    const hub = atlas.hubById.get(focusHub)!;
    const n: Node = { id: `hub:${hub.id}`, hub, line: atlas.lineById.get(hub.line)!, r: 18, x: cx, y: cy, fx: cx, fy: cy };
    nodes.push(n);
    byId.set(n.id, n);
  }

  const edges: Edge[] = [];
  things.forEach((t) => {
    const homes = t.hubs.map((h) => byId.get(`hub:${h}`)).filter((n): n is Node => !!n);
    const mx = homes.reduce((s, n) => s + n.x, 0) / (homes.length || 1);
    const my = homes.reduce((s, n) => s + n.y, 0) / (homes.length || 1);
    const n: Node = {
      id: t.id,
      thing: t,
      line: atlas.lineOf(t)!,
      r: t.hubs.length > 1 ? 7 : 6,
      // Start near home, nudged by a hash of the id so no two start stacked.
      x: mx + (hash(t.id) - 0.5) * 60 + (cx - mx) * 0.25,
      y: my + (hash(t.id + '.') - 0.5) * 60 + (cy - my) * 0.25,
    };
    nodes.push(n);
    byId.set(n.id, n);
    homes.forEach((h) => edges.push({ source: t.id, target: h.id, kind: 'stop', line: h.line }));
  });
  const seen = new Set<string>();
  things.forEach((t) =>
    t.related.forEach((r) => {
      if (!byId.has(r)) return;
      const key = [t.id, r].sort().join('|');
      if (seen.has(key)) return;
      seen.add(key);
      edges.push({ source: t.id, target: r, kind: 'related' });
    }),
  );

  const links = edges.map((e) => ({ ...e }));
  const sim = forceSimulation(nodes as any)
    .force(
      'link',
      forceLink(links as any)
        .id((d: any) => d.id)
        .distance((l: any) => (l.kind === 'stop' ? (width < 500 ? 44 : 70) : 90))
        .strength((l: any) => (l.kind === 'stop' ? 0.6 : 0.04)),
    )
    .force('charge', forceManyBody().strength(width < 500 ? -18 : -55))
    .force('collide', forceCollide((d: any) => d.r + (width < 500 ? 4 : 9)))
    .force('x', forceX(cx).strength(0.02))
    .force('y', forceY(cy).strength(0.02))
    .stop();
  for (let i = 0; i < 300; i++) sim.tick();
  nodes.forEach((n) => {
    n.x = Math.max(n.r + 4, Math.min(width - n.r - 4, n.x));
    n.y = Math.max(n.r + 4, Math.min(height - n.r - 4, n.y));
  });
  return { nodes, edges, byId };
}

function useWidth(ref: React.RefObject<HTMLElement | null>) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setW(Math.round(el.clientWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return w;
}

export function NetworkView({ atlas, things, focusHub }: { atlas: Atlas; things: Thing[]; focusHub?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const width = useWidth(box);
  const height = width < 600 ? 640 : Math.round(Math.min(860, Math.max(560, width * 0.8)));
  const { node: selected } = useViewState();
  const { path, search } = useLocation();
  const [said, setSaid] = useState('');

  const { nodes, edges, byId } = useMemo(
    () => (width ? layout(atlas, things, width, height, focusHub) : { nodes: [], edges: [], byId: new Map() }),
    [atlas, things, width, height, focusHub],
  );

  const sel = selected ? byId.get(selected) : undefined;
  const near = new Set<string>();
  if (sel) {
    near.add(sel.id);
    edges.forEach((e) => {
      const s = typeof e.source === 'string' ? e.source : (e.source as any).id;
      const t = typeof e.target === 'string' ? e.target : (e.target as any).id;
      if (s === sel.id) near.add(t);
      if (t === sel.id) near.add(s);
    });
  }
  const labelAll = width >= 720;

  const hrefFor = (id: string) => {
    const p = new URLSearchParams(search);
    p.set('view', 'network');
    p.set('node', id);
    return `${path}?${p.toString()}`;
  };
  const pick = (e: React.MouseEvent, n: Node) => {
    e.preventDefault();
    setParams({ view: 'network', node: n.id === selected ? null : n.id });
    setSaid(n.id === selected ? 'Selection cleared.' : `${n.thing?.title ?? n.hub?.name} selected. Details are under the drawing.`);
  };
  const listHref = (() => {
    const p = new URLSearchParams(search);
    p.delete('view');
    p.delete('node');
    const qs = p.toString();
    return path + (qs ? `?${qs}` : '');
  })();

  const pos = (id: any) => byId.get(typeof id === 'string' ? id : id.id)!;

  return (
    <figure className="pact-chart cs-network">
      <ul className="pact-legend cs-net-legend" aria-label="how to read the network">
        <li>
          <svg width="14" height="14" aria-hidden="true"><circle cx="7" cy="7" r="5" className="cs-net-dot" /></svg>
          live
        </li>
        <li>
          <svg width="14" height="14" aria-hidden="true"><circle cx="7" cy="7" r="5" className="cs-net-dot cs-net-hollow" /></svg>
          not finished, planned, or retired
        </li>
        <li>
          <svg width="18" height="18" aria-hidden="true"><circle cx="9" cy="9" r="5" className="cs-net-dot" /><circle cx="9" cy="9" r="8" className="cs-net-ring" /></svg>
          filed in two places or more
        </li>
        <li>
          <svg width="26" height="10" aria-hidden="true"><line x1="1" y1="5" x2="25" y2="5" className="cs-net-related" /></svg>
          a connection across sections
        </li>
        {atlas.edition.lines.map((l) => (
          <li key={l.id}>
            <svg width="26" height="10" aria-hidden="true"><line x1="1" y1="5" x2="25" y2="5" className="cs-net-stop" data-hue={l.hue} /></svg>
            {l.name}
          </li>
        ))}
      </ul>
      <p className="pact-small">
        <Link className="pact-cta" to={listHref} replace>
          [read this as a list instead]
        </Link>
      </p>
      <div ref={box} className="cs-net-box">
        {width > 0 && (
          <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            role="group"
            aria-label={`network of ${things.length} things. each one is a link that selects it.`}
            className="cs-net-svg"
          >
            <g>
              {edges.map((e, i) => {
                const a = pos(e.source);
                const b = pos(e.target);
                const dim = sel && !(near.has(a.id) && near.has(b.id));
                return (
                  <line
                    key={i}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    className={e.kind === 'stop' ? 'cs-net-stop' : 'cs-net-related'}
                    data-hue={e.line?.hue}
                    data-dim={dim || undefined}
                  />
                );
              })}
            </g>
            <g>
              {nodes.map((n) => {
                const dim = sel && !near.has(n.id);
                const label = n.hub ? n.hub.name : n.thing!.title;
                const showLabel = !!n.hub || labelAll || near.has(n.id);
                const right = n.x < width * 0.62;
                const aria = n.hub
                  ? `${n.hub.name}, a hub in ${n.line.name}`
                  : `${n.thing!.title}, ${n.thing!.kind}, in ${atlas.linesOf(n.thing!).map((l) => l.name).join(' and ')}`;
                return (
                  <a
                    key={n.id}
                    href={hrefFor(n.id)}
                    onClick={(e) => pick(e, n)}
                    aria-label={aria}
                    aria-current={n.id === selected ? 'true' : undefined}
                    className="cs-net-node"
                    data-dim={dim || undefined}
                  >
                    {n.hub ? (
                      <>
                        <circle cx={n.x} cy={n.y} r={n.r * 0.7} className="cs-net-hub" data-hue={n.line.hue} />
                      </>
                    ) : (
                      <>
                        {n.thing!.hubs.length > 1 && <circle cx={n.x} cy={n.y} r={n.r + 3} className="cs-net-ring" />}
                        <circle
                          cx={n.x}
                          cy={n.y}
                          r={n.r}
                          className={`cs-net-dot${n.thing!.status === 'live' ? '' : ' cs-net-hollow'}`}
                          data-hue={n.line.hue}
                        />
                      </>
                    )}
                    {n.id === selected && <circle cx={n.x} cy={n.y} r={n.r + 7} className="cs-net-selected" />}
                    {/* A bigger invisible target than the dot, for thumbs. */}
                    <circle cx={n.x} cy={n.y} r={Math.max(n.r, 12)} className="cs-net-hit" />
                    {showLabel && (
                      <text
                        x={right ? n.x + n.r + 5 : n.x - n.r - 5}
                        y={n.y}
                        dy="0.35em"
                        textAnchor={right ? 'start' : 'end'}
                        className={n.hub ? 'cs-net-label cs-net-label-hub' : 'cs-net-label'}
                        aria-hidden="true"
                      >
                        {label.length > 26 && !n.hub && n.id !== selected ? `${label.slice(0, 24).trimEnd()}…` : label}
                      </text>
                    )}
                  </a>
                );
              })}
            </g>
          </svg>
        )}
      </div>
      <p className="pact-sr-only" aria-live="polite" aria-atomic="true">
        {said}
      </p>
      <figcaption>
        {sel ? (
          <Selected atlas={atlas} n={sel} />
        ) : (
          <>
            {things.length} things. Pick one to see what it connects to.{' '}
            {labelAll ? '' : 'Names appear when you pick one, or on a wider screen.'}
          </>
        )}
      </figcaption>
    </figure>
  );
}

function Selected({ atlas, n }: { atlas: Atlas; n: Node }) {
  const clear = (
    <button type="button" className="pact-cta" onClick={() => setParams({ node: null })}>
      [clear the selection]
    </button>
  );
  if (n.hub) {
    const count = atlas.thingsAt(n.hub.id).length;
    return (
      <div className="cs-net-panel">
        <p className="cs-kicker">
          {n.line.name} · hub · {count} things
        </p>
        <p className="pact-h3 cs-net-panel-title">{n.hub.name}</p>
        <p className="pact-small">{n.hub.lede}</p>
        <p className="cs-links">
          <Link className="pact-cta" to={`/${n.hub.id}`}>
            [open the {n.hub.name} page]
          </Link>
          {clear}
        </p>
      </div>
    );
  }
  const t = n.thing!;
  return (
    <div className="cs-net-panel">
      <p className="cs-kicker">
        {atlas.linesOf(t).map((l) => l.name).join(', ')} · {t.kind}
      </p>
      <p className="pact-h3 cs-net-panel-title">
        {t.title} {atlas.fresh.has(t.id) && <NewTag />}
      </p>
      <p className="pact-small">
        <StatusTag status={t.status} /> {t.note && <span className="pact-muted">{t.note}</span>}
      </p>
      <p className="pact-small">{t.blurb}</p>
      <p className="cs-links">
        <Link className="pact-cta" to={`/thing/${t.id}`}>
          [open it]
        </Link>
        <ThingLinks thing={t} limit={1} />
        {clear}
      </p>
    </div>
  );
}

