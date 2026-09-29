// The [display] panel from the PACT design (v2): colours, text size,
// motion, open spacing and underlined links. Inline under the header,
// never a modal; Escape closes it. Saved in this browser only.
//
// public/pact-display.js (the design system's own file, unchanged) runs in
// <head> and applies the saved choices before the first paint. This is the
// panel that changes them. Both use the same storage key and set the same
// attributes on <html>, which tokens.css and pact.css read, so they agree.
// The toggle leaves out data-pact-display-toggle on purpose, so the script
// does not also wire it.

import { useEffect, useRef, useState } from 'react';

type Settings = { theme: string; size: string; motion: string; spacing: boolean; links: boolean };

const KEY = 'pact-display-v1';
const DEFAULTS: Settings = { theme: 'system', size: '100', motion: 'system', spacing: false, links: false };

function load(): Settings {
  const s = { ...DEFAULTS };
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
    for (const k of Object.keys(DEFAULTS) as (keyof Settings)[]) {
      if (k in saved) (s as Record<string, unknown>)[k] = saved[k];
    }
  } catch {
    // Storage blocked or unreadable: the page follows the device.
  }
  return s;
}

function apply(s: Settings) {
  const root = document.documentElement;
  const set = (attr: string, value: string | null) =>
    value === null ? root.removeAttribute(attr) : root.setAttribute(attr, value);
  set('data-pact-theme', s.theme === 'system' ? null : s.theme);
  set('data-pact-size', s.size === '100' ? null : s.size);
  set('data-pact-motion', s.motion === 'system' ? null : s.motion);
  set('data-pact-spacing', s.spacing ? 'open' : null);
  set('data-pact-links', s.links ? 'underline' : null);
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    // Not saved, but still applied to this page.
  }
}

const CHOICES: { name: 'theme' | 'size' | 'motion'; legend: string; options: [string, string][] }[] = [
  {
    name: 'theme',
    legend: 'colours',
    options: [
      ['system', 'follow my device'],
      ['paper', 'paper'],
      ['night', 'night'],
      ['contrast', 'high contrast'],
    ],
  },
  {
    name: 'size',
    legend: 'text size',
    options: [
      ['100', '100%'],
      ['115', '115%'],
      ['130', '130%'],
    ],
  },
  {
    name: 'motion',
    legend: 'motion',
    options: [
      ['system', 'follow my device'],
      ['reduce', 'less'],
      ['full', 'all of it'],
    ],
  },
];

/** The toggle for the header and the panel that goes straight after it. */
export function useDisplay() {
  const [open, setOpen] = useState(false);
  const [s, setS] = useState<Settings>(load);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  // Focus moves only after the reader opens or closes the panel, never on load.
  const moved = useRef(false);

  useEffect(() => {
    if (!moved.current) return;
    moved.current = false;
    if (open) headRef.current?.focus();
    else toggleRef.current?.focus();
  }, [open]);

  const show = (next: boolean) => {
    moved.current = true;
    setOpen(next);
  };
  const change = (patch: Partial<Settings>) => {
    const next = { ...s, ...patch };
    setS(next);
    apply(next);
  };

  const toggle = (
    <button
      ref={toggleRef}
      type="button"
      className="pact-cta pact-display-toggle"
      aria-expanded={open}
      aria-controls="display"
      onClick={() => show(!open)}
    >
      [display]
    </button>
  );

  const panel = (
    <section
      className="pact-display"
      id="display"
      aria-labelledby="display-h"
      hidden={!open}
      onKeyDown={(e) => {
        if (e.key === 'Escape') show(false);
      }}
    >
      <div className="pact-page">
        <h2 id="display-h" className="cs-kicker" tabIndex={-1} ref={headRef}>
          display
        </h2>
        <div className="pact-display-grid">
          {CHOICES.map((c) => (
            <fieldset key={c.name} className="pact-fieldset">
              <legend>{c.legend}</legend>
              {c.options.map(([value, label]) => (
                <label key={value} className="pact-radio">
                  <input
                    type="radio"
                    name={`pact-${c.name}`}
                    value={value}
                    checked={s[c.name] === value}
                    onChange={() => change({ [c.name]: value })}
                  />{' '}
                  {label}
                </label>
              ))}
            </fieldset>
          ))}
          <fieldset className="pact-fieldset">
            <legend>reading</legend>
            <label className="pact-radio">
              <input
                type="checkbox"
                name="pact-spacing"
                checked={s.spacing}
                onChange={(e) => change({ spacing: e.currentTarget.checked })}
              />{' '}
              open spacing
            </label>
            <label className="pact-radio">
              <input
                type="checkbox"
                name="pact-links"
                checked={s.links}
                onChange={(e) => change({ links: e.currentTarget.checked })}
              />{' '}
              underline every link
            </label>
          </fieldset>
        </div>
        <p className="pact-small pact-muted cs-display-note">
          Saved in this browser only. The page already follows your device's own settings; this is for when you want
          something else.
        </p>
        <p>
          <button type="button" className="pact-cta" onClick={() => show(false)}>
            [close display settings]
          </button>
        </p>
      </div>
    </section>
  );

  return { toggle, panel };
}
