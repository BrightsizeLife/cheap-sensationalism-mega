import React, { useState } from 'react';

const PROJECTS = [
  { id: 'p1', title: 'Research Proposal A', desc: 'A thorough investigation into the question nobody asked but everyone secretly wonders about. Methodology: rigorous. Budget: optimistic. Timeline: aspirational.' },
  { id: 'p2', title: 'Research Proposal B', desc: 'An interdisciplinary study combining two fields that have never been combined for very good reasons. We intend to find out what those reasons are.' },
  { id: 'p3', title: 'Research Proposal C', desc: 'A longitudinal analysis that will take exactly as long as the funding lasts. Preliminary results suggest we will need more funding.' },
];

export const VoteView = ({ onBack, onNavigate }: { onBack: () => void, onNavigate: (view: any, id?: string) => void }) => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>('5');
  const [voted, setVoted] = useState(false);

  const handleVote = (e: React.FormEvent) => {
    e.preventDefault();
    setVoted(true);
  };

  return (
    <div className="p-8 md:p-16 max-w-2xl mx-auto min-h-screen flex flex-col">
      <button onClick={onBack} className="text-[#007BFF] hover:underline mb-12 block w-fit">[back to index]</button>

      <h1 className="text-3xl md:text-4xl text-[#f0ede6] mb-6">Vote for the Next Project</h1>

      <p className="text-[#8a8680] italic mb-8 text-lg border-l-2 border-[#E8E048] pl-4">
        "Area Website's Voting System Technically Functional, Statistically Irrelevant"
      </p>

      <div className="text-[#8a8680] space-y-4 mb-12 leading-relaxed text-lg">
        <p>We have limited bandwidth. You decide what we build next.</p>
        <p>Review the candidate projects below. Cast your vote and optionally add funding to accelerate development. The project with the most support by the deadline wins.</p>
        <p className="text-[#f0ede6] border-l-2 border-[#007BFF] pl-4 italic">
          Once you vote, your money will be used for whatever project wins. Money is almost exclusively used for recruitment and keeping this site going, unless I quit my job, in which case I will also use it to support the foundations of a family.
        </p>
        <p className="text-[#E8E048] font-bold mt-4">Voting Deadline: October 31, 2026</p>
      </div>

      <div className="mb-12">
        <button onClick={() => onNavigate('propose')} className="text-[#007BFF] hover:underline text-lg">
          [propose a new project]
        </button>
      </div>

      {voted ? (
        <div className="border border-[#06D6A0] text-[#06D6A0] p-8 text-center text-lg bg-[#06D6A0]/5">
          <p className="mb-6">Thank you for voting and funding our next endeavor.</p>
          <button onClick={() => setVoted(false)} className="text-[#007BFF] hover:underline text-sm">
            [return to projects]
          </button>
        </div>
      ) : (
        <div className="space-y-4 flex-grow">
          {PROJECTS.map(p => (
            <div key={p.id} className="border border-white/10 p-2 bg-white/5">
              <button
                onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                className="w-full text-left flex justify-between items-center text-[#f0ede6] hover:text-[#007BFF] p-4"
              >
                <span className="text-xl">{p.title}</span>
                <span className="text-[#8a8680]">{expanded === p.id ? '[-]' : '[+]'}</span>
              </button>

              {expanded === p.id && (
                <div className="p-4 pt-2 border-t border-white/5 mt-2">
                  <p className="text-[#8a8680] mb-8 text-lg">{p.desc}</p>
                  <form onSubmit={handleVote} className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="flex items-center text-[#f0ede6] bg-black/30 border border-white/20 p-2">
                      <span className="mr-2 text-[#8a8680]">$</span>
                      <input
                        type="number"
                        min="1"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-transparent w-24 text-[#f0ede6] focus:outline-none"
                      />
                    </div>
                    <button type="submit" className="bg-[#007BFF] text-white px-6 py-2 hover:bg-[#0056b3] transition-colors w-full md:w-auto">
                      [vote & fund]
                    </button>
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-16 pt-8 border-t border-white/5">
        <h2 className="text-lg text-[#8a8680] mb-4">while you deliberate</h2>
        <ul className="space-y-3 list-disc list-inside text-[#8a8680]">
          <li>
            <a href="https://radio.garden" target="_blank" rel="noreferrer" className="text-[#007BFF] hover:underline">Radio Garden</a>
            <span className="text-sm ml-2 opacity-60">- spin a globe, hear a station</span>
          </li>
          <li>
            <a href="https://window-swap.com" target="_blank" rel="noreferrer" className="text-[#007BFF] hover:underline">Window Swap</a>
            <span className="text-sm ml-2 opacity-60">- look out someone else's window</span>
          </li>
          <li>
            <a href="https://everynoise.com" target="_blank" rel="noreferrer" className="text-[#007BFF] hover:underline">Every Noise at Once</a>
            <span className="text-sm ml-2 opacity-60">- every genre mapped</span>
          </li>
          <li>
            <a href="https://neal.fun" target="_blank" rel="noreferrer" className="text-[#007BFF] hover:underline">Neal.fun</a>
            <span className="text-sm ml-2 opacity-60">- delightful interactive things</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
