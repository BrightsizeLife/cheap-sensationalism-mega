
import React, { useState, useEffect } from 'react';
import { Song } from '../types';

interface SongCardProps {
  song: Song;
}

export const SongCard: React.FC<SongCardProps> = ({ song }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full text-left py-4 px-4 flex items-center justify-between group hover:bg-white/90 transition-all rounded-2xl hover:shadow-xl hover:shadow-zinc-200/50"
      >
        <div className="flex items-center gap-4 md:gap-6">
          <span className="text-[10px] font-black text-zinc-300 group-hover:text-emerald-500 transition-colors tracking-tighter w-4">
            {song.id.split('-')[1]}
          </span>
          <h4 className="text-sm font-bold text-zinc-800 tracking-tight group-hover:translate-x-1 transition-transform truncate max-w-[150px] md:max-w-none group-hover:text-emerald-600">
            {song.title}
          </h4>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <span className="text-[10px] text-zinc-400 font-bold tabular-nums group-hover:text-zinc-900 transition-colors">
            {song.duration}
          </span>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-zinc-100 group-hover:border-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </button>

      {/* Overlay Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-zinc-950/80 backdrop-blur-xl transition-opacity animate-in fade-in duration-300"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="relative w-full max-w-4xl max-h-[85vh] bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col mx-auto border-4 border-emerald-500/10">
            {/* Modal Header */}
            <div className="p-8 md:p-12 border-b border-zinc-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/50 to-transparent sticky top-0 z-10 bg-white">
              <div className="pr-8">
                <span className="text-[10px] font-black tracking-[0.5em] text-emerald-500 uppercase">Input Stream</span>
                <h3 className="text-3xl md:text-5xl font-display font-extrabold text-zinc-900 mt-2 leading-none">{song.title}</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all border-2 border-zinc-100 hover:border-emerald-500"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-grow overflow-y-auto p-8 md:p-16 no-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
                {/* Lyrics Section */}
                <div className="space-y-8">
                  <div className="inline-block px-4 py-1.5 bg-emerald-500 text-white rounded-full text-[10px] font-black tracking-widest uppercase">
                    Raw Data
                  </div>
                  <div className="text-xl md:text-2xl text-zinc-800 leading-[1.4] font-bold italic whitespace-pre-line border-l-8 border-emerald-100 pl-8">
                    {song.lyrics}
                  </div>
                </div>

                {/* Details Section */}
                <div className="space-y-12">
                  <div className="space-y-6">
                    <div className="inline-block px-4 py-1.5 bg-violet-500 text-white rounded-full text-[10px] font-black tracking-widest uppercase">
                      Chord Structure
                    </div>
                    <div className="bg-zinc-950 p-8 rounded-3xl border border-zinc-800 font-mono text-sm text-emerald-400 leading-loose shadow-2xl">
                      {song.chords}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="inline-block px-4 py-1.5 bg-rose-500 text-white rounded-full text-[10px] font-black tracking-widest uppercase">
                      Streaming
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      <a href={song.links.spotify} className="flex items-center justify-between p-6 bg-zinc-900 text-white rounded-2xl hover:bg-emerald-500 transition-all group shadow-lg">
                        <span className="text-sm font-black tracking-widest uppercase">Spotify</span>
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.5 17.3c-.2.3-.6.4-.9.2-2.8-1.7-6.2-2.1-10.3-1.1-.3.1-.7-.1-.8-.4-.1-.3.1-.7.4-.8 4.5-1 8.3-.6 11.4 1.2.3.2.4.6.2.9zm1.5-3.3c-.3.4-.8.5-1.1.3-3.2-1.9-8-2.5-11.8-1.4-.4.1-.9-.1-1-.5-.1-.4.1-.9.5-1 4.3-1.3 9.6-.6 13.2 1.6.3.2.4.7.2 1zm.1-3.4C15.2 8.1 8.8 7.9 5.1 9c-.5.2-1.1-.1-1.3-.6-.2-.5.1-1.1.6-1.3 4.2-1.3 11.3-1 15.8 1.7.5.3.6.9.3 1.4-.3.5-.9.6-1.4.3z"/></svg>
                      </a>
                      <a href={song.links.appleMusic} className="flex items-center justify-between p-6 border-2 border-zinc-100 text-zinc-900 rounded-2xl hover:border-zinc-900 transition-all group">
                        <span className="text-sm font-black tracking-widest uppercase">Apple Music</span>
                        <svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
