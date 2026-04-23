import raw from './site_structure.json';

export interface StructureItem {
  component: string;
  position: string;
  displayName: string;
  description: string;
  link: string;
  display: boolean;
  notes: string;
}

const items: StructureItem[] = (raw.items as any[])
  .map((r) => ({
    component: r['Component'] ?? '',
    position: String(r['Position'] ?? ''),
    displayName: r['Display Name'] ?? '',
    description: r['Description'] ?? '',
    link: r['Link'] ?? '',
    display: String(r['Display'] ?? '').toLowerCase() === 'yes',
    notes: r['Notes'] ?? '',
  }))
  .filter((x) => x.display);

export const getByComponent = (component: string) =>
  items
    .filter((x) => x.component === component)
    .sort((a, b) => {
      const pa = a.position.split('.').map((n) => parseInt(n, 10) || 0);
      const pb = b.position.split('.').map((n) => parseInt(n, 10) || 0);
      for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
        const da = pa[i] ?? 0;
        const db = pb[i] ?? 0;
        if (da !== db) return da - db;
      }
      return 0;
    });

export const isWip = (link: string) =>
  !link || link.trim().toUpperCase() === 'WIP' || link.trim() === '[WIP]';

export const isExternal = (link: string) =>
  /^(https?:|mailto:)/i.test(link.trim());

export const depthOf = (position: string): number => {
  const parts = position.split('.');
  if (parts.length < 2) return 0;
  return parts[1].length;
};

export const isHeader = (item: StructureItem, all: StructureItem[]): boolean =>
  all.some((o) => o.position !== item.position && o.position.startsWith(item.position));
