import React from 'react';
import { SocialBanner } from './SocialBanner';
import { TOOLS } from '../data';

const THOUGHTS = [
  // External links (live)
  { id: 't1', title: 'Bayes, Splines & 2024 US Election Polls', link: 'https://medium.com/cheap-sensationalism/bayes-splines-2024-us-election-polls-hierarchical-data-good-fun-9e6b79bb589f', status: 'live' as const },
  { id: 't2', title: 'Follow-Up on the Bayes/Splines Election Model', link: 'https://medium.com/cheap-sensationalism/quick-follow-up-on-the-bayes-splines-election-model-42358e4be1a1', status: 'live' as const },
  { id: 't10', title: "DORA's Inaugural AI Capabilities Model", link: 'https://cloud.google.com/blog/products/ai-machine-learning/introducing-doras-inaugural-ai-capabilities-model', status: 'live' as const },
  // Ready
  { id: 't-ww', title: 'Weird Weather', link: '#', status: 'live' as const },
  // WIP
  { id: 't-beatles', title: 'Just Another Silly Data Song', link: '#', status: 'wip' as const },
  { id: 't-elec1', title: '2024 Election: The Media Story', link: '#', status: 'wip' as const },
  { id: 't-elec2', title: '2024 Election: Party Alignment', link: '#', status: 'wip' as const },
  { id: 't-elec3', title: '2024 Election: Belief Systems', link: '#', status: 'wip' as const },
  { id: 't-paradox', title: 'The Paradox of Tragedy Ever So Lightly Explained', link: '#', status: 'wip' as const },
  { id: 't-virtue', title: 'Virtue, Vice, and Search Trends', link: '#', status: 'wip' as const },
  { id: 't-hammer', title: 'When the Only Tool You Have Is a Hammer: Copying Code to Predict a Different Election', link: '#', status: 'wip' as const },
  { id: 't-causal', title: 'Causal Inference: The Lifesaving Nerd', link: '#', status: 'wip' as const },
];

const getColorClasses = (index: number, isActive: boolean = false) => {
  const colors = [
    { base: 'text-[#00D4FF] border-[#00D4FF]', active: 'bg-[#00D4FF] text-[#0a0b10]', hover: 'hover:bg-[#00D4FF] hover:text-[#0a0b10]' }, // Cyan
    { base: 'text-[#E8E048] border-[#E8E048]', active: 'bg-[#E8E048] text-[#0a0b10]', hover: 'hover:bg-[#E8E048] hover:text-[#0a0b10]' }, // Amber
    { base: 'text-[#B388FF] border-[#B388FF]', active: 'bg-[#B388FF] text-[#0a0b10]', hover: 'hover:bg-[#B388FF] hover:text-[#0a0b10]' }, // Purple
    { base: 'text-[#FF5757] border-[#FF5757]', active: 'bg-[#FF5757] text-[#0a0b10]', hover: 'hover:bg-[#FF5757] hover:text-[#0a0b10]' }, // Coral (Red)
    { base: 'text-[#06D6A0] border-[#06D6A0]', active: 'bg-[#06D6A0] text-[#0a0b10]', hover: 'hover:bg-[#06D6A0] hover:text-[#0a0b10]' }, // Lime
  ];
  const pattern = [0, 3, 1, 2, 4, 1, 0, 3, 2, 4];
  const c = colors[pattern[index % pattern.length]];
  return `w-full h-10 px-2 py-1 text-[10px] sm:text-xs border rounded-full transition-colors flex items-center justify-center text-center font-bold tracking-widest uppercase ${c.base} ${isActive ? c.active : `bg-transparent ${c.hover}`}`;
};

export const HomeView = ({ onNavigate }: { onNavigate: (view: any, id?: string) => void }) => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const tickerItems = [
    { text: "NEWEST ALBUM: LISTEN HERE", action: () => window.open('https://open.spotify.com/album/7kjmvtW08iNlCKEU0qgKXN', '_blank') },
    { text: "MORE COMING SOON", action: () => scrollToSection('noises') },
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

        {/* Navigation Pills */}
        <div className="grid grid-cols-4 gap-3 mb-16 pb-8 border-b border-white/5">
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

            {/* Cheap Sensationalism — READY */}
            <h2 className="text-lg font-bold text-[#f0ede6] mb-4">cheap sensationalism</h2>
            <ul className="space-y-4 list-none p-0 mb-10">
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
                <span className="text-[#8a8680]">Chords & Lyrics <span className="text-[#E8E048] text-xs font-bold ml-2">[WIP]</span></span>
              </li>
            </ul>

            {/* Philadelphia Demos — WIP */}
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-lg font-bold text-[#8a8680]">philadelphia demos</h2>
              <span className="text-[#E8E048] text-xs font-bold">[WIP]</span>
            </div>
            <p className="text-[#8a8680] text-sm mb-8 italic">Gritty, historic, and revolutionary. Coming soon.</p>

            {/* Slop — WIP */}
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-lg font-bold text-[#8a8680]">slop</h2>
              <span className="text-[#E8E048] text-xs font-bold">[WIP]</span>
            </div>
            <p className="text-[#8a8680] text-sm mb-4 italic">A chaotic, unrefined exploration of sonic debris and digital excess. Coming soon.</p>
          </section>

          {/* thoughts */}
          <section id="thoughts">
            <h1 className="text-2xl text-[#f0ede6] mb-6">thoughts</h1>
            <ul className="space-y-3 list-disc list-inside text-[#8a8680]">
              {THOUGHTS.map(t => (
                <li key={t.id} className="leading-relaxed">
                  {t.status === 'live' && t.link !== '#' ? (
                    <a href={t.link} target="_blank" rel="noreferrer" className="text-[#007BFF] hover:underline text-left text-lg">
                      {t.title}
                    </a>
                  ) : t.status === 'live' ? (
                    <span className="text-[#f0ede6] text-lg">{t.title}</span>
                  ) : (
                    <span className="text-[#8a8680] text-lg">
                      {t.title}
                      <span className="text-[#E8E048] text-xs font-bold ml-2">[WIP]</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>

          {/* tools */}
          <section id="tools">
            <h1 className="text-2xl text-[#f0ede6] mb-6">tools</h1>
            <ul className="space-y-3 list-disc list-inside text-[#8a8680]">
              {TOOLS.map(t => (
                <li key={t.id}>
                  {t.status ? (
                    <span className="text-[#8a8680] text-lg">
                      {t.title}
                      <span className="text-[#E8E048] text-xs font-bold ml-2">[{t.status === 'wip' ? 'WIP' : 'Coming Soon'}]</span>
                    </span>
                  ) : (
                    <a href={t.link} className="text-[#007BFF] hover:underline text-lg">{t.title}</a>
                  )}
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
