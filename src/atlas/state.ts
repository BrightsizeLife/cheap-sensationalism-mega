// URL state. Everything that decides what is on screen lives in the query
// string, so any view can be copied and sent:
//
//   ?edition=2026-05   an old edition (sticky: internal links keep it)
//   ?view=table        list | table | network
//   ?line=listen,play  only these lines
//   ?status=all        show the unfinished things too. Without it only
//                      finished (live) things show, by the owner's choice;
//                      status=wip shows only unfinished ones (wip and idea)
//   ?sort=updated      table sort: title | line | status | updated
//   ?node=fog          the selected station in the network view

import { useMemo } from 'react';
import { useParams } from '../router';
import { atlasFor, getEdition, LATEST, type Atlas } from './load';
import type { Status, Thing } from './types';

export type View = 'list' | 'table' | 'network';
export const VIEWS: View[] = ['list', 'table', 'network'];

export type StatusFilter = 'live' | 'all' | 'wip';
export type Sort = 'title' | 'line' | 'status' | 'updated';
export const SORTS: Sort[] = ['title', 'line', 'status', 'updated'];

export function useAtlas(): { atlas: Atlas; pinned: boolean; unknownEdition: string | null } {
  const params = useParams();
  const requested = params.get('edition');
  const edition = getEdition(requested);
  const atlas = atlasFor(edition ?? LATEST);
  return {
    atlas,
    pinned: !!requested && !!edition,
    unknownEdition: requested && !edition ? requested : null,
  };
}

export function useViewState() {
  const params = useParams();
  const view = (VIEWS as string[]).includes(params.get('view') ?? '') ? (params.get('view') as View) : 'list';
  const lines = (params.get('line') ?? '').split(',').filter(Boolean);
  const statusRaw = params.get('status');
  const status: StatusFilter = statusRaw === 'all' || statusRaw === 'wip' ? statusRaw : 'live';
  const sort = (SORTS as string[]).includes(params.get('sort') ?? '') ? (params.get('sort') as Sort) : 'line';
  const node = params.get('node');
  return { view, lines, status, sort, node };
}

/** Not finished: [WIP] and planned. Hidden unless the reader asks. */
export const isUnfinished = (t: Thing) => t.status !== 'live';

/** The things on screen, and how many unfinished ones the section filter
 *  lets through, so the button can say how many it would show or hide. */
export function useFiltered(atlas: Atlas, things: Thing[]) {
  const { lines, status } = useViewState();
  return useMemo(() => {
    const inLines = lines.length ? things.filter((t) => atlas.linesOf(t).some((l) => lines.includes(l.id))) : things;
    const shown = inLines.filter((t) =>
      status === 'all' ? true : status === 'wip' ? isUnfinished(t) : !isUnfinished(t),
    );
    return { shown, unfinished: inLines.filter(isUnfinished).length };
  }, [atlas, things, lines.join(','), status]);
}

/** Status in words. The word is always shown; nothing relies on colour. */
export const STATUS_WORDS: Record<Status, string> = {
  live: 'live',
  wip: '[WIP]',
  idea: 'planned',
};

export const STATUS_ORDER: Record<Status, number> = { live: 0, wip: 1, idea: 2 };
