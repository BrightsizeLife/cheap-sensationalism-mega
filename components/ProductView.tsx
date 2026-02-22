import React from 'react';

export const ProductView = ({ id, onBack }: { id: string, onBack: () => void }) => {
  const titles: Record<string, string> = {
    'g1': 'Sensationalist T-Shirt',
    'g2': 'Manifesto Zine (Print)',
    'g3': 'Limited Edition Cassette',
    'g4': 'Coffee Mug'
  };
  const title = titles[id] || `Product #${id}`;

  return (
    <div className="p-8 md:p-16 max-w-2xl mx-auto min-h-screen">
      <button onClick={onBack} className="text-[#007BFF] hover:underline mb-12 block w-fit">[back to index]</button>
      <div className="border border-white/10 p-8 bg-[#0a0b10] shadow-2xl">
        <div className="w-full h-80 bg-white/5 mb-8 flex items-center justify-center text-white/20 border border-white/5">
          [Product Image Placeholder]
        </div>
        <h1 className="text-3xl text-[#f0ede6] mb-2">{title}</h1>
        <p className="text-2xl text-[#00D4FF] mb-8">$25.00</p>
        <p className="text-[#8a8680] mb-10 leading-relaxed text-lg">
          A very basic product page where people can buy the product. High quality, sensational value. Limited run.
        </p>
        <button className="bg-[#007BFF] text-white px-8 py-3 hover:bg-[#0056b3] transition-colors text-lg w-full md:w-auto">
          [buy now]
        </button>
      </div>
    </div>
  );
};
