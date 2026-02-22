
import React, { useState } from 'react';
import { Album } from '../types';
import { SongCard } from './SongCard';

interface AlbumCardProps {
  album: Album;
}

export const AlbumCard: React.FC<AlbumCardProps> = ({ album }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="group bg-white/40 backdrop-blur-sm border border-white rounded-[2rem] md:rounded-[3rem] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-violet-200/20 hover:bg-white/60">
      <div className="flex flex-col lg:flex-row lg:h-[450px]">
        {/* Album Art Section */}
        <div className="lg:w-[450px] relative overflow-hidden group/art h-[300px] lg:h-full">
          <img 
            src={album.coverUrl} 
            alt={album.title} 
            className={`w-full h-full object-cover transition-transform duration-1000 group-hover/art:scale-110 ${isOpen ? 'scale-105' : 'scale-100'}`} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/art:opacity-100 transition-opacity flex items-end p-8">
            <span className="text-white text-[10px] font-bold tracking-[0.4em] uppercase">Limited Release</span>
          </div>
        </div>

        {/* Info Section */}
        <div className="flex-grow p-6 md:p-12 flex flex-col justify-between overflow-hidden">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-violet-500 tracking-[0.3em] uppercase bg-violet-50 px-3 py-1 rounded-full">{album.year} STUDIO</span>
                <h2 className="text-3xl md:text-5xl font-display font-bold text-zinc-900 leading-none mt-2 break-words">{album.title}</h2>
              </div>
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-2xl border-2 transition-all duration-500 shadow-lg shrink-0 ${isOpen ? 'bg-zinc-900 border-zinc-900 text-white translate-y-[-4px]' : 'bg-white border-zinc-100 text-zinc-400 hover:border-violet-400 hover:text-violet-500'}`}
              >
                <svg 
                  className={`w-6 h-6 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            <p className="text-sm md:text-base text-zinc-500 font-medium leading-relaxed max-w-xl line-clamp-3 lg:line-clamp-none">
              {album.description}
            </p>
          </div>

          <div className="mt-8 lg:mt-0 flex items-center justify-between border-t border-zinc-100 pt-6 md:pt-8">
            <div className="flex gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase">Tracks</span>
                <span className="text-xs md:text-sm font-bold text-zinc-800">{album.songs.length}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase">ID</span>
                <span className="text-xs md:text-sm font-bold text-zinc-800">#{album.id.padStart(2, '0')}</span>
              </div>
            </div>
            <button 
               onClick={() => setIsOpen(!isOpen)}
               className="group/btn flex items-center gap-2 md:gap-3 text-[10px] md:text-xs font-black tracking-widest text-zinc-900 hover:text-violet-600 transition-colors"
            >
              {isOpen ? 'COLLAPSE' : 'EXPAND TRACKLIST'}
              <div className="w-6 md:w-8 h-[2px] bg-zinc-900 group-hover/btn:bg-violet-600 group-hover/btn:w-10 md:group-hover/btn:w-12 transition-all"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Tracklist Section */}
      {isOpen && (
        <div className="border-t border-zinc-100 animate-in slide-in-from-top-4 duration-700 bg-zinc-50/10">
          <div className="p-4 md:p-12">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-200/50">
                <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase">Tracklist Collection</span>
                <span className="hidden md:block text-[10px] font-black tracking-widest text-zinc-400 uppercase">Select for Details</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                {album.songs.map((song) => (
                  <SongCard key={song.id} song={song} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
