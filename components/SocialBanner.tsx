
import React from 'react';
import { SocialPost } from '../types';
import { SOCIAL_POSTS } from '../data';

const SocialCard: React.FC<{ post: SocialPost }> = ({ post }) => {
  return (
    <div className="flex-shrink-0 w-72 h-48 bg-[#0a0b10] border border-white/10 p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden group">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase tracking-widest text-[#8a8680] font-medium">{post.platform}</span>
        <span className="text-[10px] text-[#44413b]">{post.date}</span>
      </div>
      <div className="flex-grow flex items-center">
        {post.imageUrl ? (
          <div className="flex items-center gap-3 w-full">
            <img src={post.imageUrl} alt="Social" className="w-16 h-16 object-cover rounded-sm grayscale group-hover:grayscale-0 transition-all opacity-80 group-hover:opacity-100" />
            <p className="text-xs text-[#f0ede6] line-clamp-3 leading-relaxed">{post.content}</p>
          </div>
        ) : (
          <p className="text-sm text-[#f0ede6] font-light leading-relaxed italic line-clamp-4">"{post.content}"</p>
        )}
      </div>
    </div>
  );
};

export const SocialBanner: React.FC = () => {
  // Triple the posts to ensure a smooth infinite loop
  const displayPosts = [...SOCIAL_POSTS, ...SOCIAL_POSTS, ...SOCIAL_POSTS];

  return (
    <div className="w-full overflow-hidden bg-[#0a0b10] border-t border-white/5 py-8 relative">
      <div className="flex animate-scroll hover:[animation-play-state:paused] gap-6 px-6">
        {displayPosts.map((post, index) => (
          <SocialCard key={`${post.id}-${index}`} post={post} />
        ))}
      </div>
      {/* Gradients for soft edges */}
      <div className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-[#0a0b10] to-transparent pointer-events-none z-10"></div>
      <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-[#0a0b10] to-transparent pointer-events-none z-10"></div>
    </div>
  );
};
