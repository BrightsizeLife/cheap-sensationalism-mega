import React, { useState } from 'react';
import { SocialBanner } from './SocialBanner';
import { TOOLS } from '../data';

const TAGS = [
  'writing', 'DORA', 'research', 'politics', 'teams', 'scrollytelling', 'AI', 'data'
];
const THOUGHTS = [
  { id: 't1', title: 'Bayes, Splines & 2024 US Election Polls', tags: ['writing', 'research', 'data', 'politics'], link: 'https://medium.com/cheap-sensationalism/bayes-splines-2024-us-election-polls-hierarchical-data-good-fun-9e6b79bb589f' },
  { id: 't2', title: 'Follow-Up on the Bayes/Splines Election Model', tags: ['writing', 'research', 'data', 'politics'], link: 'https://medium.com/cheap-sensationalism/quick-follow-up-on-the-bayes-splines-election-model-42358e4be1a1' },
  { id: 't3', title: 'Scrollytelling Article', tags: ['writing', 'scrollytelling'], link: '#' },
  { id: 't4', title: 'Documents Are Like Sunshine', tags: ['writing', 'teams'], link: '#' },
  { id: 't5', title: 'DORA Report 2025', tags: ['DORA', 'research'], link: '#' },
  { id: 't6', title: 'DORA Report 2024', tags: ['DORA', 'research'], link: '#' },
  { id: 't7', title: 'DORA Report 2023', tags: ['DORA', 'research'], link: '#' },
  { id: 't8', title: 'DORA Report 2022', tags: ['DORA', 'research'], link: '#' },
  { id: 't9', title: 'Team Archetypes', tags: ['teams', 'research'], link: '#' },
  { id: 't10', title: "DORA's Inaugural AI Capabilities Model", tags: ['DORA', 'research', 'AI'], link: 'https://cloud.google.com/blog/products/ai-machine-learning/introducing-doras-inaugural-ai-capabilities-model' },
  { id: 't11', title: '2026 Mayoral Race Predictions', tags: ['politics'], link: '#' },
];
const GOODS = [
  { id: 'g1', title: 'The Table Mic' },
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
    { text: "HAVE AN IDEA? PROPOSE IT", action: () => onNavigate('propose') },
    { text: "VOTE ON THE NEXT PROJECT", action: () => onNavigate('vote') },
    { text: "THE TABLE MIC: COMING SOON", action: () => onNavigate('product', 'g1') }
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
                <span className="mx-2 opacity-50">&#x2726;</span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Unified Grid of Pills */}
        <div className="grid grid-cols-4 gap-3 mb-16 pb-8 border-b border-white/5">
          <button onClick={() => onNavigate('vote')} className={getColorClasses(0)}>
            Vote
          </button>
          <button onClick={() => window.open('https://open.spotify.com/album/7kjmvtW08iNlCKEU0qgKXN', '_blank')} className={getColorClasses(1)}>
            Listen
          </button>
          <button onClick={() => onNavigate('propose')} className={getColorClasses(2)}>
            Propose
          </button>
          {['noises', 'thoughts', 'tools', 'goods', 'sociality'].map((section, i) => (
            <button key={section} onClick={() => scrollToSection(section)} className={getColorClasses(i + 3)}>
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
            <div className="grid grid-cols-4 gap-2 mb-8">
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
                  <a href={t.link} className="text-[#007BFF] hover:underline text-left text-lg">
                    {t.title}
                  </a>
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
                  <a href={t.link} className="text-[#007BFF] hover:underline text-lg">{t.title}</a>
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
                <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub" className="w-6 h-6 invert opacity-70" />
                <a href="#" className="text-[#007BFF] hover:underline">GitHub</a>
              </li>
              <li className="flex items-center gap-3">
                <img src="https://em-content.zobj.net/source/google/412/envelope_2709-fe0f.png" alt="Email" className="w-6 h-6" />
                <a href="mailto:ddebellis@gmail.com" className="text-[#007BFF] hover:underline">email</a>
              </li>
              <li className="flex items-center gap-3">
                <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/instagram.svg" alt="Instagram" className="w-6 h-6 invert opacity-70" />
                <a href="#" className="text-[#007BFF] hover:underline">instagram</a>
              </li>
              <li className="flex items-center gap-3">
                <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/facebook.svg" alt="Facebook" className="w-6 h-6 invert opacity-70" />
                <a href="#" className="text-[#007BFF] hover:underline">facebook</a>
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
              <img src="https://em-content.zobj.net/source/google/412/envelope_2709-fe0f.png" alt="Email" className="w-6 h-6" />
              <a href="mailto:ddebellis@gmail.com" className="text-[#007BFF] hover:underline">ddebellis@gmail.com</a>
            </li>
          </ul>
        </footer>
      </div>

      <p className="text-center text-[#8a8680] text-sm italic mb-4">(random things to make your visit somewhat worthwhile)</p>
      <SocialBanner />
    </div>
  );
}
