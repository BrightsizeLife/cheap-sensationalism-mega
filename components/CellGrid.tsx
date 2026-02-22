
import React from 'react';
import { CellItem } from '../types';

interface CellGridProps {
  items: CellItem[];
  colorTheme: 'violet' | 'cyan';
}

export const CellGrid: React.FC<CellGridProps> = ({ items, colorTheme }) => {
  const borderColor = colorTheme === 'violet' ? 'hover:border-violet-500' : 'hover:border-cyan-500';
  const textColor = colorTheme === 'violet' ? 'group-hover:text-violet-500' : 'group-hover:text-cyan-500';
  const bgHover = colorTheme === 'violet' ? 'hover:bg-violet-50' : 'hover:bg-cyan-50';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mx-auto">
      {items.map((item) => (
        <a
          key={item.id}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className={`group border border-zinc-200 bg-white p-8 rounded-[2rem] transition-all duration-300 ${borderColor} ${bgHover} hover:-translate-y-1 hover:shadow-lg`}
        >
          <div className="flex items-start gap-6">
            <div className={`w-12 h-12 flex-shrink-0 flex items-center justify-center text-zinc-800 transition-colors duration-300 ${textColor}`}>
              {item.icon}
            </div>
            <div>
              <h3 className={`text-2xl font-display font-bold text-zinc-900 ${textColor} transition-colors mb-2`}>
                {item.title}
              </h3>
              <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
};
