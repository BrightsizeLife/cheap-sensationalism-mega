import React, { useState } from 'react';

export const ProposeProjectView = ({ onBack }: { onBack: () => void }) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="p-8 md:p-16 max-w-2xl mx-auto min-h-screen">
      <button onClick={onBack} className="text-[#007BFF] hover:underline mb-12 block w-fit">[back to index]</button>
      
      <h1 className="text-3xl md:text-4xl text-[#f0ede6] mb-6">Propose a Project</h1>
      
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
      ) : (
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
      )}
    </div>
  );
};
