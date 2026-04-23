
import React from 'react';
import { getByComponent } from '../siteStructure';

const FUN_SITES = getByComponent('6 Random Things').map((x) => ({
  id: x.position,
  name: x.displayName,
  url: x.link,
  description: x.description,
}));

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
  if (FUN_SITES.length === 0) return null;
  const displaySites = [...FUN_SITES, ...FUN_SITES, ...FUN_SITES];

  return (
    <div className="w-full overflow-hidden bg-[#0a0b10] border-t border-white/5 py-8 relative">
      <div className="flex animate-scroll hover:[animation-play-state:paused] gap-6 px-6">
        {displaySites.map((site, index) => (
          <SiteCard key={`${site.id}-${index}`} site={site} />
        ))}
      </div>
      <div className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-[#0a0b10] to-transparent pointer-events-none z-10"></div>
      <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-[#0a0b10] to-transparent pointer-events-none z-10"></div>
    </div>
  );
};
