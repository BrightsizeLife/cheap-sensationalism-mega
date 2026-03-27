
import React, { useState } from 'react';
import { HomeView } from './components/HomeView';
import { ThoughtView } from './components/ThoughtView';

export type ViewState = 'home' | 'thought';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('home');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const navigate = (newView: ViewState, id?: string) => {
    setSelectedId(id || null);
    setView(newView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0a0b10] text-[#60665f] font-mono selection:bg-purple-500/30 selection:text-purple-200">
      {view === 'home' && <HomeView onNavigate={navigate} />}
      {view === 'thought' && <ThoughtView id={selectedId!} onBack={() => navigate('home')} />}
    </div>
  );
};

export default App;
