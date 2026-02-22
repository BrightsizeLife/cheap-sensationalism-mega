import React from 'react';
import { CollectionItem } from '../types';

interface CollectionCardProps {
  item: CollectionItem;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({ item }) => {
  const isIdeas = item.type === 'ideas';
  const accentColor = isIdeas ? '#ff00ff' : '#00ffff';
  const bgAccent = isIdeas ? 'bg-[#ff00ff]/10' : 'bg-[#00ffff]/10';
  const shadowClass = isIdeas ? 'hover:shadow-[#ff00ff]/30' : 'hover:shadow-[#00ffff]/30';

  return (
    <a 
      href={item.link || '#'} 
      target={item.link ? "_blank" : "_self"}
      rel="noopener noreferrer"
      className={`group block bg-white border border-zinc-100 rounded-[3rem] overflow-hidden transition-all duration-700 hover:shadow-2xl ${shadowClass} hover:-translate-y-3`}
    >
      <div className="flex flex-col h-full">
        <div className="relative h-72 md:h-80 overflow-hidden">
          <img 
            src={item.imageUrl} 
            alt={item.title} 
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" 
          />
          <div className={`absolute inset-0 ${bgAccent} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
          <div className="absolute top-8 left-8">
            <span 
              className="px-5 py-2 rounded-full text-[10px] font-black tracking-widest uppercase border border-white/40 backdrop-blur-md text-white"
              style={{ backgroundColor: `${accentColor}44` }}
            >
              {item.type}
            </span>
          </div>
        </div>
        <div className="p-12 space-y-6">
          <h3 className="text-4xl font-display font-bold transition-all duration-500 group-hover:tracking-tight group-hover:text-zinc-900" style={{ color: item.color }}>
            {item.title}
          </h3>
          <p className="text-zinc-500 text-lg leading-relaxed font-medium">
            {item.description}
          </p>
          <div className="pt-8 flex items-center gap-6">
            <span className="text-xs font-black tracking-[0.4em] uppercase transition-colors" style={{ color: item.color }}>
              EXPLORE {item.type}
            </span>
            <div className="h-[2px] flex-grow transition-all duration-700 group-hover:w-20 bg-zinc-100" style={{ backgroundColor: `${item.color}44` }}>
              <div className="h-full w-0 group-hover:w-full transition-all duration-700" style={{ backgroundColor: item.color }}></div>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
};