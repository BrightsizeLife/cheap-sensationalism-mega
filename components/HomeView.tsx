import React, { useState } from 'react';
import { SocialBanner } from './SocialBanner';

const TAGS = [
  'AI', 'stats', 'philosophy', 'social sci', 'essays',
  'code', 'proposals', 'design', 'music', 'culture'
];
const THOUGHTS = [
  { id: 't1', title: 'The End of History', tags: ['philosophy', 'essays'] },
  { id: 't2', title: 'Bayesian Priors in Media', tags: ['stats', 'social science'] },
  { id: 't3', title: 'Building the Network Graph', tags: ['code', 'AI'] },
  { id: 't4', title: 'A Critique of Pure Reason', tags: ['philosophy'] },
  { id: 't5', title: 'The Algorithmic Self', tags: ['AI', 'social science'] },
  { id: 'p1', title: 'Proposal: The Data Cave', tags: ['proposals', 'code'] },
  { id: 'p2', title: 'Proposal: Silent Album', tags: ['proposals', 'essays'] },
  { id: 'p3', title: 'Proposal: Print Manifesto', tags: ['proposals', 'philosophy'] },
];
const TOOLS = [
  { id: 'tool1', title: 'Data Scraper v2' },
  { id: 'tool2', title: 'Noise Generator' },
  { id: 'tool3', title: 'Text Analyzer' },
  { id: 'tool4', title: 'Syntax Highlighter' },
];
const GOODS = [
  { id: 'g1', title: 'Sensationalist T-Shirt' },
  { id: 'g2', title: 'Manifesto Zine (Print)' },
  { id: 'g3', title: 'Limited Edition Cassette' },
  { id: 'g4', title: 'Coffee Mug' },
];

const getColorClasses = (index: number, isActive: boolean = false) => {
  const colors = [
    { base: 'text-[#00D4FF] border-[#00D4FF]', active: 'bg-[#00D4FF] text-[#0a0b10]', hover: 'hover:bg-[#00D4FF] hover:text-[#0a0b10]' }, // Cyan
    { base: 'text-[#E8E048] border-[#E8E048]', active: 'bg-[#E8E048] text-[#0a0b10]', hover: 'hover:bg-[#E8E048] hover:text-[#0a0b10]' }, // Amber
    { base: 'text-[#B388FF] border-[#B388FF]', active: 'bg-[#B388FF] text-[#0a0b10]', hover: 'hover:bg-[#B388FF] hover:text-[#0a0b10]' }, // Purple
    { base: 'text-[#FF5757] border-[#FF5757]', active: 'bg-[#FF5757] text-[#0a0b10]', hover: 'hover:bg-[#FF5757] hover:text-[#0a0b10]' }, // Coral (Red)
    { base: 'text-[#06D6A0] border-[#06D6A0]', active: 'bg-[#06D6A0] text-[#0a0b10]', hover: 'hover:bg-[#06D6A0] hover:text-[#0a0b10]' }, // Lime
  ];
  const pattern = [0, 3, 1, 2, 4, 1, 0, 3, 2, 4]; // More complex pattern
  const c = colors[pattern[index % pattern.length]];
  return `w-full h-10 px-2 py-1 text-[10px] sm:text-xs border rounded-full transition-colors flex items-center justify-center text-center font-bold tracking-widest uppercase ${c.base} ${isActive ? c.active : `bg-transparent ${c.hover}`}`;
};

const TICKER_MESSAGES = [
  "NEWEST ALBUM: LISTEN HERE",
  "NEW ARTICLE ON CHEESE MONGERING",
  "HURRY! PROPOSE BEFORE OCTOBER DEADLINE",
  "FOX NEWS: NOT RACIST, BUT #1 WITH RACISTS"
];

export const HomeView = ({ onNavigate }: { onNavigate: (view: any, id?: string) => void }) => {
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  const toggleTag = (tag: string) => {
    const next = new Set(selectedTags);
    if (next.has(tag)) next.delete(tag);
    else next.add(tag);
    setSelectedTags(next);
  };

  const filteredThoughts = THOUGHTS.filter(t => 
    selectedTags.size === 0 || t.tags.some(tag => selectedTags.has(tag))
  );

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const tickerItems = [
    { text: "NEWEST ALBUM: LISTEN HERE", action: () => window.open('https://open.spotify.com/album/7kjmvtW08iNlCKEU0qgKXN', '_blank') },
    { text: "NEW ARTICLE ON CHEESE MONGERING", action: () => scrollToSection('thoughts') },
    { text: "HURRY! PROPOSE BEFORE OCTOBER DEADLINE", action: () => onNavigate('propose') },
    { text: "FOX NEWS: NOT RACIST, BUT #1 WITH RACISTS", action: () => {} }
  ];
  const displayTicker = [...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow w-full max-w-3xl mx-auto p-8 md:p-16">
        <header className="mb-8 flex flex-col gap-4 border-b border-white/5 pb-6">
          <h1 className="text-3xl md:text-5xl font-normal text-[#f0ede6] m-0 text-center md:text-left">CHEAP SENSATIONALISM</h1>
        </header>

        {/* Flashing Ticker Banner */}
        <div className="mb-6 border border-white/10 rounded-full overflow-hidden h-8 flex items-center animate-flash-bg font-bold tracking-widest text-xs uppercase relative group">
          <div className="flex animate-scroll-slow group-hover:[animation-play-state:paused] whitespace-nowrap w-max">
            {displayTicker.map((item, i) => (
              <React.Fragment key={i}>
                <button onClick={item.action} className="mx-4 hover:underline cursor-pointer tracking-widest uppercase font-bold">{item.text}</button>
                <span className="mx-2 opacity-50">✦</span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Unified Grid of Pills */}
        <div className="grid grid-cols-3 gap-3 mb-16 pb-8 border-b border-white/5">
          <button onClick={() => onNavigate('vote')} className={getColorClasses(0)}>
            Vote
          </button>
          <button onClick={() => window.open('https://open.spotify.com/album/7kjmvtW08iNlCKEU0qgKXN', '_blank')} className={getColorClasses(1)}>
            Listen
          </button>
          <button onClick={() => onNavigate('propose')} className={getColorClasses(2)}>
            Propose
          </button>
          <button onClick={() => window.open('#', '_blank')} className={getColorClasses(3)}>
            Slack
          </button>
          {['noises', 'thoughts', 'tools', 'goods', 'sociality'].map((section, i) => (
            <button key={section} onClick={() => scrollToSection(section)} className={getColorClasses(i + 4)}>
              {section}
            </button>
          ))}
        </div>

        <main className="space-y-16">
          {/* noises */}
          <section id="noises">
            <h1 className="text-2xl text-[#f0ede6] mb-6">noises</h1>
            <h2 className="text-lg font-bold text-[#f0ede6] mb-4">cheap sensationalism</h2>
            <ul className="space-y-4 list-none p-0">
              <li className="flex items-center gap-3">
                <img src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg" alt="Spotify" className="w-6 h-6" />
                <a href="https://open.spotify.com/album/7kjmvtW08iNlCKEU0qgKXN" target="_blank" rel="noreferrer" className="text-[#007BFF] hover:underline">Spotify</a>
              </li>
              <li className="flex items-center gap-3">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Apple_Computer_Logo_rainbow.svg/2560px-Apple_Computer_Logo_rainbow.svg.png" alt="Apple Music" className="w-6 h-6" />
                <a href="https://music.apple.com/us/album/cheap-sensationalism/1773687566" target="_blank" rel="noreferrer" className="text-[#007BFF] hover:underline">Apple Music</a>
              </li>
              <li className="flex items-center gap-3">
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6a/Youtube_Music_icon.svg" alt="YouTube Music" className="w-6 h-6" />
                <a href="https://music.youtube.com/playlist?list=OLAK5uy_l_jEZiq2LYmeKp6hQvg6if0eislc_NRJA" target="_blank" rel="noreferrer" className="text-[#007BFF] hover:underline">YouTube Music</a>
              </li>
              <li className="flex items-center gap-3 mt-8">
                <img src="https://em-content.zobj.net/source/google/412/scroll_1f4dc.png" alt="note icon" className="w-6 h-6" />
                <a href="#" className="text-[#007BFF] hover:underline">Album Notes</a>
              </li>
              <li className="flex items-center gap-3">
                <img src="https://em-content.zobj.net/source/google/412/musical-notes_1f3b6.png" alt="note icon" className="w-6 h-6" />
                <a href="#" className="text-[#007BFF] hover:underline">Chords & Lyrics</a>
              </li>
            </ul>
          </section>

          {/* thoughts */}
          <section id="thoughts">
            <h1 className="text-2xl text-[#f0ede6] mb-6">thoughts</h1>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-8">
              {TAGS.map((tag, i) => (
                <button 
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={getColorClasses(i, selectedTags.has(tag))}
                >
                  <span className="truncate w-full">{tag}</span>
                </button>
              ))}
            </div>
            <ul className="space-y-3 list-disc list-inside text-[#8a8680]">
              {filteredThoughts.map(t => (
                <li key={t.id} className="leading-relaxed">
                  <button onClick={() => onNavigate('thought', t.id)} className="text-[#007BFF] hover:underline text-left text-lg">
                    {t.title}
                  </button>
                  <span className="text-sm ml-3 opacity-60">[{t.tags.join(', ')}]</span>
                </li>
              ))}
              {filteredThoughts.length === 0 && <li className="list-none italic">No thoughts found for these filters.</li>}
            </ul>
          </section>

          {/* tools */}
          <section id="tools">
            <h1 className="text-2xl text-[#f0ede6] mb-6">tools</h1>
            <ul className="space-y-3 list-disc list-inside text-[#8a8680]">
              {TOOLS.map(t => (
                <li key={t.id}>
                  <a href="#" className="text-[#007BFF] hover:underline text-lg">{t.title}</a>
                </li>
              ))}
            </ul>
          </section>

          {/* goods */}
          <section id="goods">
            <h1 className="text-2xl text-[#f0ede6] mb-6">goods, wares, and trinkets</h1>
            <ul className="space-y-3 list-disc list-inside text-[#8a8680]">
              {GOODS.map(g => (
                <li key={g.id}>
                  <button onClick={() => onNavigate('product', g.id)} className="text-[#007BFF] hover:underline text-left text-lg">
                    {g.title}
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {/* perverse sociality */}
          <section id="sociality">
            <h1 className="text-2xl text-[#f0ede6] mb-6">perverse sociality</h1>
            <ul className="space-y-4 list-none p-0">
              <li className="flex items-center gap-3">
                <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/instagram.svg" alt="Instagram" className="w-6 h-6 invert opacity-70" />
                <a href="#" className="text-[#007BFF] hover:underline">instagram</a>
              </li>
              <li className="flex items-center gap-3">
                <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/facebook.svg" alt="Facebook" className="w-6 h-6 invert opacity-70" />
                <a href="#" className="text-[#007BFF] hover:underline">facebook</a>
              </li>
              <li className="flex items-center gap-3">
                <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/tiktok.svg" alt="TikTok" className="w-6 h-6 invert opacity-70" />
                <a href="#" className="text-[#007BFF] hover:underline">tiktok</a>
              </li>
              <li className="flex items-center gap-3">
                <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/bluesky.svg" alt="Bluesky" className="w-6 h-6 invert opacity-70" />
                <a href="#" className="text-[#007BFF] hover:underline">bluesky</a>
              </li>
              <li className="flex items-center gap-3">
                <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/medium.svg" alt="Medium" className="w-6 h-6 invert opacity-70" />
                <a href="#" className="text-[#007BFF] hover:underline">medium</a>
              </li>
              <li className="flex items-center gap-3">
                <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/substack.svg" alt="Substack" className="w-6 h-6 invert opacity-70" />
                <a href="#" className="text-[#007BFF] hover:underline">substack</a>
              </li>
            </ul>
          </section>
        </main>

        <footer className="mt-24 pt-8 border-t border-white/5 mb-16">
          <ul className="space-y-4 list-none p-0">
            <li className="flex items-center gap-3">
              <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub" className="w-6 h-6 invert opacity-70" />
              <a href="#" className="text-[#007BFF] hover:underline">GitHub</a>
            </li>
            <li className="flex items-center gap-3">
              <img src="https://em-content.zobj.net/source/google/412/envelope_2709-fe0f.png" alt="Email" className="w-6 h-6" />
              <a href="mailto:ddebellis@gmail.com" className="text-[#007BFF] hover:underline">example@yourdomain.com</a>
            </li>
          </ul>
        </footer>
      </div>
      
      <SocialBanner />
    </div>
  );
}
