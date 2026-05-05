import React from 'react';

export const ThoughtView = ({ id, onBack }: { id: string, onBack: () => void }) => {
  const titles: Record<string, string> = {
    't1': 'The End of History',
    't2': 'Bayesian Priors in Media',
    't3': 'Building the Network Graph',
    't4': 'A Critique of Pure Reason',
    't5': 'The Algorithmic Self'
  };
  const title = titles[id] || `Thought #${id}`;

  return (
    <div className="p-8 md:p-16 max-w-2xl mx-auto min-h-screen flex flex-col">
      <button onClick={onBack} className="cs-text-link hover:underline mb-12 block w-fit font-mono text-sm">[back to index]</button>
      <article className="flex-grow cs-essay-body">
        <h1 className="cs-display text-3xl md:text-5xl cs-text-primary mb-10 font-normal italic leading-tight">{title}</h1>
        <div className="space-y-6 text-lg">
          <p>This is a stationary page for the selected thought. The context is dead, but the text remains.</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </div>
      </article>
    </div>
  );
};
