import React from 'react';
import { SocialBanner } from './SocialBanner';
import { getByComponent, isWip, isExternal, StructureItem } from '../siteStructure';

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

const Item = ({ item, depth = 0 }: { item: StructureItem; depth?: number }) => {
  const wip = isWip(item.link);
  const external = isExternal(item.link);
  const sizeClass = depth === 0 ? 'text-lg' : 'text-base';
  if (wip) {
    return (
      <span className={`text-[#8a8680] ${sizeClass}`}>
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
        className={`text-[#007BFF] hover:underline ${sizeClass}`}
      >
        {item.displayName}
      </a>
    );
  }
  if (item.link.startsWith('#')) {
    return (
      <a href={item.link} className={`text-[#007BFF] hover:underline ${sizeClass}`}>
        {item.displayName}
      </a>
    );
  }
  return <span className={`text-[#f0ede6] ${sizeClass}`}>{item.displayName}</span>;
};

export const HomeView = ({ onNavigate: _onNavigate }: { onNavigate: (view: any, id?: string) => void }) => {
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

  const socialIcon = (name: string): string => {
    const n = name.toLowerCase();
    if (n.includes('github')) return 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
    if (n.includes('instagram')) return 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/instagram.svg';
    if (n.includes('facebook')) return 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/facebook.svg';
    if (n.includes('linkedin')) return 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/linkedin.svg';
    if (n.includes('email')) return 'https://em-content.zobj.net/source/google/412/envelope_2709-fe0f.png';
    return 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/medium.svg';
  };

  const noiseIcon = (name: string): string => {
    const n = name.toLowerCase();
    if (n.includes('spotify')) return 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg';
    if (n.includes('apple')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Apple_Computer_Logo_rainbow.svg/2560px-Apple_Computer_Logo_rainbow.svg.png';
    if (n.includes('youtube')) return 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Youtube_Music_icon.svg';
    if (n.includes('album')) return 'https://em-content.zobj.net/source/google/412/scroll_1f4dc.png';
    if (n.includes('chord') || n.includes('lyric')) return 'https://em-content.zobj.net/source/google/412/musical-notes_1f3b6.png';
    return 'https://em-content.zobj.net/source/google/412/musical-notes_1f3b6.png';
  };

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
                <h2 className="text-lg font-bold text-[#f0ede6] mb-2">{cs.displayName.toLowerCase()}</h2>
                {cs.description && (
                  <p className="text-[#8a8680] text-sm mb-4 italic">{cs.description}</p>
                )}
                <ul className="space-y-4 list-none p-0 mb-10">
                  {csLinks.map((link) => {
                    const wip = isWip(link.link);
                    const external = isExternal(link.link);
                    return (
                      <li key={link.position} className="flex items-center gap-3">
                        <img src={noiseIcon(link.displayName)} alt="" className="w-6 h-6" />
                        {wip ? (
                          <span className="text-[#8a8680]">
                            {link.displayName}
                            <WipTag />
                          </span>
                        ) : external ? (
                          <a href={link.link} target="_blank" rel="noreferrer" className="text-[#007BFF] hover:underline">
                            {link.displayName}
                          </a>
                        ) : (
                          <span className="text-[#8a8680]">
                            {link.displayName}
                            <WipTag />
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </>
            )}

            {philly && (
              <>
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h2 className="text-lg font-bold text-[#8a8680]">{philly.displayName.toLowerCase()}</h2>
                  <WipTag />
                </div>
                {philly.description && (
                  <p className="text-[#8a8680] text-sm mb-8 italic">{philly.description}</p>
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
                  <p className="text-[#8a8680] text-sm mb-4 italic">{slop.description}</p>
                )}
              </>
            )}
          </section>

          {/* thoughts */}
          <section id="thoughts">
            <h1 className="text-2xl text-[#f0ede6] mb-6">thoughts</h1>
            <ul className="space-y-3 list-disc list-inside text-[#8a8680] break-words">
              {thoughtItems.map((t) => {
                const depth = t.position.split('.').length - 2;
                const indent = depth > 0 ? `ml-${Math.min(depth * 4, 12)}` : '';
                const isHeader = !t.link && !isWip(t.link) && t.position.length <= 3;
                if (isHeader) {
                  return (
                    <li key={t.position} className={`list-none ${indent} mt-4`}>
                      <h3 className="text-[#f0ede6] text-base font-bold">{t.displayName}</h3>
                      {t.description && <p className="text-sm italic text-[#8a8680]">{t.description}</p>}
                    </li>
                  );
                }
                return (
                  <li key={t.position} className={`leading-relaxed ${indent}`}>
                    <Item item={t} depth={depth} />
                    {t.description && <span className="text-sm italic text-[#8a8680] block ml-6">{t.description}</span>}
                  </li>
                );
              })}
            </ul>
          </section>

          {/* tools */}
          <section id="tools">
            <h1 className="text-2xl text-[#f0ede6] mb-6">tools</h1>
            <ul className="space-y-3 list-disc list-inside text-[#8a8680] break-words">
              {toolItems.map((t) => (
                <li key={t.position}>
                  <Item item={t} />
                </li>
              ))}
            </ul>
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
                    <img
                      src={socialIcon(s.displayName)}
                      alt=""
                      className={`w-6 h-6 ${s.displayName.toLowerCase().includes('email') ? '' : 'invert opacity-70'}`}
                    />
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

        <footer className="mt-24 pt-8 border-t border-white/5 mb-8">
          <ul className="space-y-4 list-none p-0">
            <li className="flex items-center gap-3">
              <img src="https://em-content.zobj.net/source/google/412/envelope_2709-fe0f.png" alt="Email" className="w-6 h-6" />
              <a href="mailto:ddebellis@gmail.com" className="text-[#007BFF] hover:underline break-all">ddebellis@gmail.com</a>
            </li>
          </ul>
        </footer>
      </div>

      <p className="text-center text-[#8a8680] text-sm italic mb-4 px-4">(random things to make your visit somewhat worthwhile)</p>
      <SocialBanner />

      {/* Ko-fi embedded widget */}
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 mt-12 mb-24">
        <iframe
          id="kofiframe"
          src="https://ko-fi.com/cheapsensationalism/?hidefeed=true&widget=true&embed=true&preview=true"
          style={{ border: 'none', width: '100%', padding: '4px', background: '#f9f9f9' }}
          height={712}
          title="cheapsensationalism"
        />
      </div>
    </div>
  );
};
