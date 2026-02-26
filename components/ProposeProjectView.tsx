import React, { useState } from 'react';

export const ProposeProjectView = ({ onBack }: { onBack: () => void }) => {
  const [submitted, setSubmitted] = useState(false);
  const [proposalType, setProposalType] = useState<'research' | 'writing' | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const typeLabel = proposalType === 'research' ? 'Research' : 'Writing';

  return (
    <div className="p-8 md:p-16 max-w-2xl mx-auto min-h-screen">
      <button onClick={onBack} className="text-[#007BFF] hover:underline mb-12 block w-fit">[back to index]</button>

      <h1 className="text-3xl md:text-4xl text-[#f0ede6] mb-6">
        {proposalType ? `Propose: ${typeLabel}` : 'Propose a Project'}
      </h1>

      <div className="text-[#8a8680] space-y-4 mb-12 leading-relaxed text-lg">
        <p className="text-[#f0ede6] border-l-2 border-[#007BFF] pl-4 italic">
          This proposal is based on work that I do. It should be something we can work on together, or something that I could handle independently.
        </p>
        <p>Describe what you want to work on and what it should accomplish.</p>
      </div>

      {submitted ? (
        <div className="border border-[#06D6A0] text-[#06D6A0] p-8 text-center text-lg bg-[#06D6A0]/5">
          Proposal submitted successfully. I'll review it and get back to you.
        </div>
      ) : !proposalType ? (
        <div className="space-y-4">
          <p className="text-[#f0ede6] mb-4">What kind of proposal is this?</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setProposalType('research')}
              className="border-2 border-[#00D4FF] p-6 text-left hover:bg-[#00D4FF]/10 transition-colors"
            >
              <h3 className="text-[#00D4FF] text-xl mb-2">Proposal for Research</h3>
              <p className="text-[#8a8680] text-sm">A question to investigate, data to analyze, or a hypothesis to test.</p>
            </button>
            <button
              onClick={() => setProposalType('writing')}
              className="border-2 border-[#E8E048] p-6 text-left hover:bg-[#E8E048]/10 transition-colors"
            >
              <h3 className="text-[#E8E048] text-xl mb-2">Proposal for You Writing Something</h3>
              <p className="text-[#8a8680] text-sm">An article, essay, analysis, or other written piece you want to see.</p>
            </button>
          </div>
        </div>
      ) : (
        <>
          <button
            onClick={() => setProposalType(null)}
            className="text-[#007BFF] hover:underline mb-8 block text-sm"
          >
            [change type]
          </button>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[#f0ede6] mb-2">Project Title</label>
              <input required type="text" className="w-full bg-black/30 border border-white/20 p-3 text-[#f0ede6] focus:outline-none focus:border-[#007BFF]" />
            </div>
            <div>
              <label className="block text-[#f0ede6] mb-2">Description & Goals</label>
              <textarea required rows={6} className="w-full bg-black/30 border border-white/20 p-3 text-[#f0ede6] focus:outline-none focus:border-[#007BFF]" placeholder="What do you want to build? What will it accomplish?"></textarea>
            </div>
            <div>
              <label className="block text-[#f0ede6] mb-2">Your Contact Info</label>
              <input required type="text" className="w-full bg-black/30 border border-white/20 p-3 text-[#f0ede6] focus:outline-none focus:border-[#007BFF]" />
            </div>
            <div>
              <label className="block text-[#f0ede6] mb-2">Extent of Your Involvement</label>
              <select required className="w-full bg-black/30 border border-white/20 p-3 text-[#f0ede6] focus:outline-none focus:border-[#007BFF] appearance-none">
                <option value="">Select your desired involvement...</option>
                <option value="none">None - just an idea for you</option>
                <option value="advisory">Advisory - happy to chat occasionally</option>
                <option value="collaborator">Collaborator - want to actively build this together</option>
                <option value="lead">Lead - I want to build this, just need your platform/help</option>
              </select>
            </div>
            <button type="submit" className="bg-[#007BFF] text-white px-8 py-3 hover:bg-[#0056b3] transition-colors w-full md:w-auto text-lg">
              [submit proposal]
            </button>
          </form>
        </>
      )}
    </div>
  );
};
