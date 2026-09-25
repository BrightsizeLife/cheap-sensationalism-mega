// Small pieces used on every page.

import React from 'react';
import type { Line, LinkRef, Status, Thing } from '../atlas/types';
import { STATUS_WORDS } from '../atlas/state';
import type { Atlas } from '../atlas/load';
import { Link } from '../router';

/** A section's letter in a circle. Always sits next to the section's
 *  name, so it is hidden from screen readers unless `label` is set. */
export function Bullet({ line, label = false, size }: { line: Line; label?: boolean; size?: 'lg' }) {
  return (
    <span
      className={`cs-bullet${size === 'lg' ? ' cs-bullet-lg' : ''}`}
      data-hue={line.hue}
      {...(label ? { role: 'img', 'aria-label': `${line.name} section` } : { 'aria-hidden': true })}
    >
      {line.letter}
    </span>
  );
}

export function Bullets({ atlas, thing }: { atlas: Atlas; thing: Thing }) {
  const lines = atlas.linesOf(thing);
  return (
    <span className="cs-bullets">
      {lines.map((l) => (
        <Bullet key={l.id} line={l} />
      ))}
      <span className="pact-sr-only">in {lines.map((l) => l.name).join(' and ')}</span>
    </span>
  );
}

/** Status as a word. The chip's colour only echoes the word. */
export function StatusTag({ status, note }: { status: Status; note?: string }) {
  return (
    <span className="cs-status" data-status={status}>
      {STATUS_WORDS[status]}
      {note ? <span className="pact-sr-only">: {note}</span> : null}
    </span>
  );
}

export function NewTag() {
  return (
    <span className="cs-new-tag">
      new<span className="pact-sr-only"> since the last edition</span>
    </span>
  );
}

export function Wip({ why }: { why: string }) {
  return (
    <span className="cs-wip-tag">
      [WIP]<span className="pact-sr-only">: {why}</span>
    </span>
  );
}

const isExternal = (url: string) => /^(https?:|mailto:)/i.test(url);

/** A link that knows whether it leaves the site. */
export function Go({
  link,
  className = 'pact-cta',
  children,
  tabIndex,
}: {
  link: LinkRef;
  className?: string;
  children?: React.ReactNode;
  tabIndex?: number;
}) {
  const body = children ?? link.label;
  if (isExternal(link.url) || link.url.endsWith('.html')) {
    return (
      <a className={className} href={link.url} rel="noopener" tabIndex={tabIndex}>
        {body}
      </a>
    );
  }
  return (
    <Link className={className} to={link.url} tabIndex={tabIndex}>
      {body}
    </Link>
  );
}

export function ThingLinks({ thing, limit }: { thing: Thing; limit?: number }) {
  const links = limit ? thing.links.slice(0, limit) : thing.links;
  if (!links.length) return null;
  return (
    <span className="cs-links">
      {links.map((l) => (
        <Go key={l.url} link={l} />
      ))}
    </span>
  );
}

/** "3 things" / "1 thing". Digits always. */
export function plural(n: number, one: string, many = `${one}s`) {
  return `${n} ${n === 1 ? one : many}`;
}
