import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

export const PlatformsSection: React.FC = () => {
  const [activePlatform, setActivePlatform] = useState<string>('YouTube');

  const platforms = [
    {
      id: 'youtube',
      name: 'YouTube',
      description: 'In-depth phone & PC walkthroughs',
      handle: '@topsonmedia',
      stats: '12.8K subs',
      url: 'https://youtube.com/@topsonmedia',
      icon: (
        <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-white shrink-0">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        </div>
      ),
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      description: 'Quick phone shortcuts & tricks',
      handle: '@topsonmedia',
      stats: '8.4K followers',
      url: 'https://tiktok.com/@topsonmedia',
      icon: (
        <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-white shrink-0">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
          </svg>
        </div>
      ),
    },
    {
      id: 'instagram',
      name: 'Instagram',
      description: 'Reels, setup tips & daily stories',
      handle: '@topson.media',
      stats: '3.2K followers',
      url: 'https://instagram.com/topson.media',
      icon: (
        <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-white shrink-0">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </div>
      ),
    },
    {
      id: 'facebook',
      name: 'Facebook',
      description: 'Discussions & community updates',
      handle: 'Topson Media',
      stats: '2.1K members',
      url: 'https://facebook.com/topsonmedia',
      icon: (
        <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-white shrink-0">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </div>
      ),
    },
  ];

  return (
    <section id="platforms" className="py-16 sm:py-20 scroll-mt-20 border-t border-neutral-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Kicker */}
        <div className="text-xs font-bold tracking-widest uppercase text-neutral-800 mb-6">
          CONNECT ON SOCIAL
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 tracking-tight leading-[1.05]">
              Dive in my social medias
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-700 max-w-xs md:text-right font-medium">
            Follow along on your preferred channel.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {platforms.map((p) => {
            const isSelected = activePlatform === p.name;
            return (
              <a
                key={p.id}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setActivePlatform(p.name)}
                className={`group rounded-2xl p-5 transition-all duration-200 flex flex-col justify-between h-48 cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-50 border-2 border-neutral-900 shadow-sm'
                    : 'bg-white border border-neutral-200 hover:border-neutral-400 hover:shadow-md shadow-2xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    {p.icon}
                    <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-neutral-900 transition-colors" />
                  </div>

                  <h3 className="text-base font-bold text-neutral-900 group-hover:text-orange-500 transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-xs text-neutral-700 mt-1 leading-relaxed font-medium">
                    {p.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-neutral-200 text-xs text-neutral-700 font-semibold">
                  <span>{p.handle}</span>
                  <span className="text-neutral-900 font-bold">{p.stats}</span>
                </div>
              </a>
            );
          })}
        </div>

      </div>
    </section>
  );
};
