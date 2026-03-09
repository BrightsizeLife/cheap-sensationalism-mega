
import React from 'react';

const FUN_SITES = [
  { id: 'f1', name: 'Radio Garden', url: 'https://radio.garden', description: 'Spin a globe, tune into any radio station on Earth. Hours will vanish.' },
  { id: 'f2', name: 'Window Swap', url: 'https://window-swap.com', description: 'Look out a stranger\'s window somewhere in the world. Oddly calming.' },
  { id: 'f3', name: 'Every Noise at Once', url: 'https://everynoise.com', description: 'Every music genre mapped and playable. Algorithmic cartography of sound.' },
  { id: 'f4', name: 'Neal.fun', url: 'https://neal.fun', description: 'Delightful interactive toys. Spend a billion dollars. Draw a perfect circle.' },
  { id: 'f5', name: 'The Pudding', url: 'https://pudding.cool', description: 'Visual essays on culture. Data journalism that actually slaps.' },
];

const SiteCard: React.FC<{ site: typeof FUN_SITES[number] }> = ({ site }) => {
  return (
    <a
      href={site.url}
      target="_blank"
      rel="noreferrer"
      className="flex-shrink-0 w-72 h-48 bg-[#0a0b10] border border-white/10 p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden group hover:border-[#007BFF]/40 no-underline"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase tracking-widest text-[#8a8680] font-medium">{site.name}</span>
        <span className="text-[10px] text-[#44413b] group-hover:text-[#007BFF] transition-colors">&rarr;</span>
      </div>
      <div className="flex-grow flex items-center">
        <p className="text-sm text-[#f0ede6] font-light leading-relaxed line-clamp-4">{site.description}</p>
      </div>
      <div className="text-[10px] text-[#44413b] group-hover:text-[#007BFF] transition-colors truncate">{site.url.replace('https://', '')}</div>
    </a>
  );
};

export const SocialBanner: React.FC = () => {
  const displaySites = [...FUN_SITES, ...FUN_SITES, ...FUN_SITES];

  return (
    <div className="w-full overflow-hidden bg-[#0a0b10] border-t border-white/5 py-8 relative">
      <div className="flex animate-scroll hover:[animation-play-state:paused] gap-6 px-6">
        {displaySites.map((site, index) => (
          <SiteCard key={`${site.id}-${index}`} site={site} />
        ))}
      </div>
      {/* Gradients for soft edges */}
      <div className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-[#0a0b10] to-transparent pointer-events-none z-10"></div>
      <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-[#0a0b10] to-transparent pointer-events-none z-10"></div>
    </div>
  );
};
