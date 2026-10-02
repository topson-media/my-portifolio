import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

export const PlatformsSection: React.FC = () => {
  const [activePlatform, setActivePlatform] = useState<string>('YouTube');

  const platforms = [
    {
      id: 'youtube',
      name: 'YouTube',
      description: 'In-depth phone & PC walkthroughs',
      handle: '@topson-media1',
      stats: 'Subscribe',
      url: 'https://www.youtube.com/@topson-media1',
      cardHoverClasses:
        'hover:border-red-500/60 hover:shadow-[0_12px_30px_rgba(255,0,0,0.14)] hover:bg-red-50/20',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-[#FF0000] flex items-center justify-center text-white shrink-0 shadow-sm shadow-red-500/30 group-hover:scale-105 transition-transform">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
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
      stats: 'Follow',
      url: 'https://www.tiktok.com/@topsonmedia',
      cardHoverClasses:
        'hover:border-neutral-900 hover:shadow-[0_12px_30px_rgba(0,242,254,0.18),0_4px_16px_rgba(254,9,121,0.18)] hover:bg-neutral-50/50',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center shrink-0 shadow-sm border border-neutral-800 ring-2 ring-[#00f2fe]/40 group-hover:ring-[#fe0979]/70 group-hover:scale-105 transition-all">
          <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
          </svg>
        </div>
      ),
    },
    {
      id: 'instagram',
      name: 'Instagram',
      description: 'Reels, setup tips & daily stories',
      handle: 'topson_media',
      stats: 'Follow',
      url: 'https://instagram.com/topson_media',
      cardHoverClasses:
        'hover:border-pink-500/50 hover:shadow-[0_12px_30px_rgba(225,48,108,0.18)] hover:bg-pink-50/20',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shrink-0 shadow-sm shadow-pink-500/30 group-hover:scale-105 transition-transform">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </div>
      ),
    },
    {
      id: 'facebook',
      name: 'Facebook',
      description: 'Discussions & updates',
      handle: 'Etienne Topson Kenedy',
      stats: 'Connect',
      url: 'https://facebook.com/topsonmedia',
      cardHoverClasses:
        'hover:border-[#1877F2]/60 hover:shadow-[0_12px_30px_rgba(24,119,242,0.18)] hover:bg-blue-50/20',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-[#1877F2] flex items-center justify-center text-white shrink-0 shadow-sm shadow-blue-500/30 group-hover:scale-105 transition-transform">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </div>
      ),
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      description: 'Direct mobile chat & updates',
      handle: '0794903078',
      stats: 'Online',
      url: 'https://play.google.com/store/apps/details?id=com.whatsapp',
      cardHoverClasses:
        'hover:border-emerald-500/60 hover:shadow-[0_12px_30px_rgba(16,185,129,0.2)] hover:bg-emerald-50/20',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-[#25D366] flex items-center justify-center text-white shrink-0 shadow-sm shadow-emerald-500/30 group-hover:scale-105 transition-transform">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.983.538 1.848.814 2.791.814 3.182 0 5.768-2.587 5.769-5.766.001-3.182-2.585-5.8-5.77-5.8zm3.385 8.214c-.141.398-.718.73-1.009.774-.282.043-.645.068-1.047-.061-.403-.129-.929-.304-1.603-.601-1.396-.615-2.3-2.029-2.37-2.122-.07-.093-.568-.756-.568-1.442 0-.685.358-1.022.486-1.163.128-.141.28-.176.374-.176.094 0 .188.001.27.006.088.005.205-.033.32.245.118.283.403.985.438 1.057.036.071.059.155.012.248-.047.094-.07.153-.14.236-.07.082-.149.183-.212.246-.071.07-.145.146-.062.289.083.142.368.608.79 0.984.544.485 1.003.636 1.145.706.142.071.225.059.309-.035.083-.094.356-.414.451-.556.094-.141.189-.118.318-.071.129.047.82.386.961.457.142.07.236.106.271.165.035.059.035.341-.106.739zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.66 1.434 5.176L2 22l4.957-1.399C8.423 21.493 10.155 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
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

        {/* 5 Cards Grid with Fluid Lifting and Scaling Hover Effects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {platforms.map((p) => {
            const isSelected = activePlatform === p.name;
            return (
              <a
                key={p.id}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setActivePlatform(p.name)}
                className={`group rounded-3xl p-6 transition-all duration-300 ease-out flex flex-col justify-between h-52 cursor-pointer transform hover:scale-[1.02] hover:-translate-y-1.5 active:scale-[0.99] ${p.cardHoverClasses} ${
                  isSelected
                    ? 'bg-neutral-50 border-2 border-neutral-900 shadow-sm'
                    : 'bg-white border border-neutral-200 shadow-2xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    {p.icon}
                    <div className="w-8 h-8 rounded-full bg-neutral-50 group-hover:bg-neutral-900 group-hover:text-white text-neutral-500 flex items-center justify-center transition-all duration-200 shadow-2xs">
                      <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-black text-neutral-900 group-hover:text-neutral-950 transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-xs text-neutral-600 mt-1 leading-relaxed font-medium">
                    {p.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3.5 border-t border-neutral-200/80 text-xs text-neutral-600 font-semibold">
                  <span className="group-hover:text-neutral-900 transition-colors">{p.handle}</span>
                  <span className="text-neutral-900 font-bold px-2 py-0.5 rounded-full bg-neutral-100 group-hover:bg-neutral-200/80 transition-colors">
                    {p.stats}
                  </span>
                </div>
              </a>
            );
          })}
        </div>

      </div>
    </section>
  );
};
