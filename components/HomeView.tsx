import React, { useEffect } from 'react';
import { SocialBanner } from './SocialBanner';
import {
  getByComponent,
  isWip,
  isExternal,
  depthOf,
  isHeader,
  StructureItem,
} from '../siteStructure';

const getColorClasses = (index: number, isActive: boolean = false) => {
  const colors = [
    { base: 'text-[#00D4FF] border-[#00D4FF]', active: 'bg-[#00D4FF] text-[#0a0b10]', hover: 'hover:bg-[#00D4FF] hover:text-[#0a0b10]' },
    { base: 'text-[#E8E048] border-[#E8E048]', active: 'bg-[#E8E048] text-[#0a0b10]', hover: 'hover:bg-[#E8E048] hover:text-[#0a0b10]' },
    { base: 'text-[#B388FF] border-[#B388FF]', active: 'bg-[#B388FF] text-[#0a0b10]', hover: 'hover:bg-[#B388FF] hover:text-[#0a0b10]' },
    { base: 'text-[#FF5757] border-[#FF5757]', active: 'bg-[#FF5757] text-[#0a0b10]', hover: 'hover:bg-[#FF5757] hover:text-[#0a0b10]' },
    { base: 'text-[#06D6A0] border-[#06D6A0]', active: 'bg-[#06D6A0] text-[#0a0b10]', hover: 'hover:bg-[#06D6A0] hover:text-[#0a0b10]' },
  ];
  const pattern = [0, 3, 1, 2, 4, 1, 0, 3, 2, 4];
  const c = colors[pattern[index % pattern.length]];
  return `w-full h-10 px-2 py-1 text-[10px] sm:text-xs border rounded-full transition-colors flex items-center justify-center text-center font-bold tracking-widest uppercase ${c.base} ${isActive ? c.active : `bg-transparent ${c.hover}`}`;
};

const WipTag = () => (
  <span className="text-[#E8E048] text-xs font-bold ml-2">[WIP]</span>
);

const indentFor = (depth: number) =>
  depth <= 1 ? '' : depth === 2 ? 'ml-4' : depth === 3 ? 'ml-8' : 'ml-12';

const Leaf: React.FC<{ item: StructureItem }> = ({ item }) => {
  const wip = isWip(item.link);
  const external = isExternal(item.link);
  if (wip) {
    return (
      <span className="text-[#8a8680]">
        {item.displayName}
        <WipTag />
      </span>
    );
  }
  if (external) {
    return (
      <a
        href={item.link}
        target={item.link.startsWith('mailto:') ? undefined : '_blank'}
        rel="noreferrer"
        className="text-[#007BFF] hover:underline break-words"
      >
        {item.displayName}
      </a>
    );
  }
  if (item.link.startsWith('#')) {
    return (
      <a href={item.link} className="text-[#007BFF] hover:underline">
        {item.displayName}
      </a>
    );
  }
  if (item.link.startsWith('/')) {
    return (
      <a href={item.link} className="text-[#007BFF] hover:underline break-words">
        {item.displayName}
      </a>
    );
  }
  return <span className="text-[#f0ede6]">{item.displayName}</span>;
};

const directChildren = (pos: string, all: StructureItem[]) =>
  all.filter(
    (c) =>
      c.position !== pos &&
      c.position.startsWith(pos) &&
      depthOf(c.position) === depthOf(pos) + 1,
  );

const TractatusList: React.FC<{ items: StructureItem[] }> = ({ items }) => {
  const absorbed = new Set<string>();

  return (
    <div className="space-y-2 break-words">
      {items.map((item) => {
        if (absorbed.has(item.position)) return null;
        const depth = depthOf(item.position);
        const indent = indentFor(depth);
        const header = isHeader(item, items);

        if (header) {
          const children = directChildren(item.position, items);
          const isInlineGroup =
            children.length > 0 &&
            children.every((c) => c.displayName.length <= 6 && !isWip(c.link));

          if (isInlineGroup) {
            children.forEach((c) => absorbed.add(c.position));
            return (
              <div key={item.position} className={`${indent} text-[15px] leading-relaxed flex gap-2 flex-wrap items-baseline`}>
                <span className="text-[#44413b] select-none flex-shrink-0">—</span>
                <span className="text-[#8a8680] font-semibold lowercase">{item.displayName}</span>
                <span className="text-[#44413b]">[</span>
                {children.map((c, i) => (
                  <React.Fragment key={c.position}>
                    <Leaf item={c} />
                    {i < children.length - 1 && <span className="text-[#44413b]">,</span>}
                  </React.Fragment>
                ))}
                <span className="text-[#44413b]">]</span>
              </div>
            );
          }

          const headerCls =
            depth === 1
              ? 'text-lg font-bold text-[#f0ede6] mt-6 mb-2 lowercase tracking-wide'
              : 'text-sm font-semibold text-[#8a8680] mt-4 mb-1 uppercase tracking-widest';
          return (
            <div key={item.position} className={indent}>
              <h3 className={headerCls}>{item.displayName}</h3>
              {item.description && (
                <p className="text-xs italic text-[#8a8680] -mt-1 mb-2">{item.description}</p>
              )}
            </div>
          );
        }

        return (
          <div key={item.position} className={`${indent} text-[15px] leading-relaxed flex gap-2`}>
            <span className="text-[#44413b] select-none flex-shrink-0">—</span>
            <div className="flex-1 min-w-0">
              <Leaf item={item} />
              {item.description && (
                <span className="text-xs italic text-[#8a8680] block">{item.description}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const ICON_BASE = 'https://cdn.jsdelivr.net/npm/simple-icons@v14/icons';
const LINKEDIN_SVG = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23f0ede6'><path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'/></svg>`;
const socialIcon = (name: string): { src: string; invert: boolean } => {
  const n = name.toLowerCase();
  if (n.includes('linkedin')) return { src: LINKEDIN_SVG, invert: false };
  if (n.includes('github')) return { src: `${ICON_BASE}/github.svg`, invert: true };
  if (n.includes('instagram')) return { src: `${ICON_BASE}/instagram.svg`, invert: true };
  if (n.includes('facebook')) return { src: `${ICON_BASE}/facebook.svg`, invert: true };
  return { src: `${ICON_BASE}/medium.svg`, invert: true };
};

const noiseIcon = (name: string): string => {
  const n = name.toLowerCase();
  if (n.includes('spotify')) return 'https://cdn.simpleicons.org/spotify/1DB954';
  if (n.includes('apple')) return 'https://cdn.simpleicons.org/applemusic/FA243C';
  if (n.includes('youtube')) return 'https://cdn.simpleicons.org/youtubemusic/FF0000';
  if (n.includes('album')) return 'https://em-content.zobj.net/source/google/412/scroll_1f4dc.png';
  return 'https://em-content.zobj.net/source/google/412/musical-notes_1f3b6.png';
};

export const HomeView = ({ onNavigate: _onNavigate }: { onNavigate: (view: any, id?: string) => void }) => {
  useEffect(() => {
    const process = () => (window as any).instgrm?.Embeds?.process();
    process();
    const t = setTimeout(process, 1200);
    return () => clearTimeout(t);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const bannerItems = getByComponent('0 Banner');
  const thoughtItems = getByComponent('2 Thoughts').filter((x) => x.position !== '2');
  const toolItems = getByComponent('3 Tools').filter((x) => x.position !== '3');
  const socialItems = getByComponent('4 Perverse Sociality').filter((x) => x.position !== '4');
  const noiseItems = getByComponent('1 Noise');
  const cs = noiseItems.find((x) => x.position === '1.1');
  const csLinks = noiseItems.filter((x) => x.position.startsWith('1.1') && x.position !== '1.1');
  const philly = noiseItems.find((x) => x.position === '2');
  const slop = noiseItems.find((x) => x.position === '3');

  const handleBannerClick = (item: StructureItem) => {
    if (!item.link) return;
    if (item.link.startsWith('#')) scrollToSection(item.link.slice(1));
    else window.open(item.link, '_blank');
  };

  const displayTicker = [...bannerItems, ...bannerItems, ...bannerItems, ...bannerItems];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow w-full max-w-3xl mx-auto p-6 sm:p-8 md:p-16">
        <header className="mb-8 flex flex-col gap-4 border-b border-white/5 pb-6">
          <h1 className="text-3xl md:text-5xl font-normal text-[#f0ede6] m-0 text-center">CHEAP SENSATIONALISM</h1>
        </header>

        {/* Flashing Ticker Banner */}
        <div className="mb-6 border border-white/10 rounded-full overflow-hidden h-8 flex items-center animate-flash-bg font-bold tracking-widest text-xs uppercase relative group">
          <div className="flex animate-scroll-slow group-hover:[animation-play-state:paused] whitespace-nowrap w-max">
            {displayTicker.map((item, i) => (
              <React.Fragment key={i}>
                <button
                  onClick={() => handleBannerClick(item)}
                  className="mx-4 hover:underline cursor-pointer tracking-widest uppercase font-bold"
                >
                  {item.displayName}
                </button>
                <span className="mx-2 opacity-50">&#x2726;</span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Navigation Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-16 pb-8 border-b border-white/5">
          {['noises', 'thoughts', 'tools', 'sociality'].map((section, i) => (
            <button key={section} onClick={() => scrollToSection(section)} className={getColorClasses(i)}>
              {section}
            </button>
          ))}
        </div>

        <main className="space-y-16">
          {/* noises */}
          <section id="noises">
            <h1 className="text-2xl text-[#f0ede6] mb-6">noises</h1>

            {cs && (
              <>
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <h2 className="text-lg font-bold text-[#f0ede6]">{cs.displayName.toLowerCase()}</h2>
                  {csLinks.map((link) => {
                    const wip = isWip(link.link);
                    const external = isExternal(link.link);
                    const local = !wip && link.link.startsWith('/');
                    const img = (
                      <img
                        src={noiseIcon(link.displayName)}
                        alt={link.displayName}
                        className="w-5 h-5 block"
                        style={wip ? { filter: 'grayscale(1)', opacity: 0.25 } : undefined}
                      />
                    );
                    if (wip) return (
                      <span key={link.position} title={link.displayName}>{img}</span>
                    );
                    if (external) return (
                      <a key={link.position} href={link.link} target="_blank" rel="noreferrer"
                         title={link.displayName} className="opacity-70 hover:opacity-100 transition-opacity">
                        {img}
                      </a>
                    );
                    if (local) return (
                      <a key={link.position} href={link.link}
                         title={link.displayName} className="opacity-70 hover:opacity-100 transition-opacity">
                        {img}
                      </a>
                    );
                    return <span key={link.position} title={link.displayName}>{img}</span>;
                  })}
                </div>
                {cs.description && (
                  <p className="text-[#8a8680] text-xs mb-10 italic">{cs.description}</p>
                )}
              </>
            )}

            {philly && (
              <>
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h2 className="text-lg font-bold text-[#8a8680]">{philly.displayName.toLowerCase()}</h2>
                  <WipTag />
                </div>
                {philly.description && (
                  <p className="text-[#8a8680] text-xs mb-8 italic">{philly.description}</p>
                )}
              </>
            )}

            {slop && (
              <>
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h2 className="text-lg font-bold text-[#8a8680]">{slop.displayName.toLowerCase()}</h2>
                  <WipTag />
                </div>
                {slop.description && (
                  <p className="text-[#8a8680] text-xs mb-4 italic">{slop.description}</p>
                )}
              </>
            )}
          </section>

          {/* thoughts */}
          <section id="thoughts">
            <h1 className="text-2xl text-[#f0ede6] mb-6">thoughts</h1>
            <TractatusList items={thoughtItems} />
          </section>

          {/* tools */}
          <section id="tools">
            <h1 className="text-2xl text-[#f0ede6] mb-6">tools</h1>
            <TractatusList items={toolItems} />
          </section>

          {/* perverse sociality */}
          <section id="sociality">
            <h1 className="text-2xl text-[#f0ede6] mb-6">perverse sociality</h1>
            <ul className="space-y-4 list-none p-0">
              {socialItems.map((s) => {
                const wip = isWip(s.link);
                const external = isExternal(s.link);
                return (
                  <li key={s.position} className="flex items-center gap-3">
                    {(() => { const ic = socialIcon(s.displayName); return (
                      <img
                        src={ic.src}
                        alt=""
                        className="w-5 h-5"
                        style={ic.invert ? { filter: 'brightness(0) invert(0.75)' } : { opacity: 0.75 }}
                      />
                    ); })()}
                    {wip ? (
                      <span className="text-[#8a8680]">
                        {s.displayName}
                        <WipTag />
                      </span>
                    ) : external ? (
                      <a
                        href={s.link}
                        target={s.link.startsWith('mailto:') ? undefined : '_blank'}
                        rel="noreferrer"
                        className="text-[#007BFF] hover:underline break-all"
                      >
                        {s.displayName}
                      </a>
                    ) : (
                      <span className="text-[#f0ede6]">{s.displayName}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        </main>

        <div className="mt-24 mb-8" />
      </div>

      <p className="text-center text-[#8a8680] text-sm italic mb-4 px-4">(random things to make your visit somewhat worthwhile)</p>
      <SocialBanner />

      {/* Instagram reels */}
      <div className="w-full border-t border-white/5 py-12 px-4">
        <div className="flex flex-col md:flex-row gap-6 justify-center items-start max-w-3xl mx-auto">
          <div className="w-full md:w-1/2 flex justify-center">
            <blockquote
              className="instagram-media"
              data-instgrm-captioned
              data-instgrm-permalink="https://www.instagram.com/reel/DBxQo_nx5V0/?utm_source=ig_embed&utm_campaign=loading"
              data-instgrm-version="14"
              style={{ background: '#FFF', border: 0, borderRadius: '3px', boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)', margin: '1px', maxWidth: '540px', minWidth: '280px', padding: 0, width: '100%' }}
            />
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
            <blockquote
              className="instagram-media"
              data-instgrm-captioned
              data-instgrm-permalink="https://www.instagram.com/reel/DCPWD37RyR9/?utm_source=ig_embed&utm_campaign=loading"
              data-instgrm-version="14"
              style={{ background: '#FFF', border: 0, borderRadius: '3px', boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)', margin: '1px', maxWidth: '540px', minWidth: '280px', padding: 0, width: '100%' }}
            />
          </div>
        </div>
      </div>

      {/* Ko-fi embedded widget — framed in a dark section so the white iframe reads as intentional */}
      <section className="w-full border-t border-white/5 py-16 px-6 mt-8">
        <div className="w-full max-w-md mx-auto">
          <p className="text-xs text-[#8a8680] text-center mb-6 italic leading-relaxed px-2">a small tip goes a long way in providing me with the means to launch more studies and a super happy moment that will likely last longer than I should admit</p>
          <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg">
            <iframe
              id="kofiframe"
              src="https://ko-fi.com/cheapsensationalism/?hidefeed=true&widget=true&embed=true&preview=true"
              style={{ border: 'none', width: '100%', display: 'block', background: '#f9f9f9' }}
              height={560}
              title="cheapsensationalism"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
