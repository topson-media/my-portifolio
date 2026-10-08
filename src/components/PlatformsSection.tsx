import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { TOPSON_PROFILE_IMAGE } from '../data/mockData';

export const PlatformsSection: React.FC = () => {
  const [activePlatform, setActivePlatform] = useState<string>('YouTube');

  const platforms = [
    {
      id: 'youtube',
      name: 'YouTube',
      channelName: 'Topson Media',
      description: 'In-depth phone & PC walkthroughs',
      handle: '@topson-media1',
      stats: 'Subscribe',
      url: 'https://www.youtube.com/@topson-media1',
      badgeColor: 'bg-red-50 text-red-600 border-red-200',
      accentGlow: 'from-red-500/10 via-transparent to-transparent',
      cardHoverClasses:
        'hover:border-red-500/70 hover:shadow-[0_16px_36px_rgba(255,0,0,0.16)] hover:-translate-y-2',
      icon: (
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#FF0000] flex items-center justify-center text-white shrink-0 shadow-md shadow-red-500/30 group-hover:scale-110 transition-transform">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        </div>
      ),
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      channelName: 'Topson Media',
      description: 'Quick phone shortcuts & tricks',
      handle: '@topsonmedia',
      stats: 'Follow',
      url: 'https://www.tiktok.com/@topsonmedia',
      badgeColor: 'bg-neutral-100 text-neutral-900 border-neutral-300',
      accentGlow: 'from-cyan-500/10 via-pink-500/10 to-transparent',
      cardHoverClasses:
        'hover:border-neutral-900 hover:shadow-[0_16px_36px_rgba(0,242,254,0.18),0_4px_20px_rgba(254,9,121,0.18)] hover:-translate-y-2',
      icon: (
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-black flex items-center justify-center shrink-0 shadow-md border border-neutral-800 ring-2 ring-[#00f2fe]/40 group-hover:ring-[#fe0979]/80 group-hover:scale-110 transition-all">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-white" viewBox="0 0 24 24">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
          </svg>
        </div>
      ),
    },
    {
      id: 'instagram',
      name: 'Instagram',
      channelName: 'Topson Media',
      description: 'Reels, setup tips & daily stories',
      handle: 'topson_media',
      stats: 'Follow',
      url: 'https://instagram.com/topson_media',
      badgeColor: 'bg-pink-50 text-pink-600 border-pink-200',
      accentGlow: 'from-pink-500/10 via-purple-500/10 to-transparent',
      cardHoverClasses:
        'hover:border-pink-500/60 hover:shadow-[0_16px_36px_rgba(225,48,108,0.2)] hover:-translate-y-2',
      icon: (
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shrink-0 shadow-md shadow-pink-500/30 group-hover:scale-110 transition-transform">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </div>
      ),
    },
    {
      id: 'facebook',
      name: 'Facebook',
      channelName: 'Etienne Topson Kenedy',
      description: 'Discussions & updates',
      handle: 'Etienne Topson Kenedy',
      stats: 'Connect',
      url: 'https://www.facebook.com/etienne.topson.kenedy',
      badgeColor: 'bg-blue-50 text-blue-600 border-blue-200',
      accentGlow: 'from-blue-500/10 via-transparent to-transparent',
      cardHoverClasses:
        'hover:border-[#1877F2]/70 hover:shadow-[0_16px_36px_rgba(24,119,242,0.2)] hover:-translate-y-2',
      icon: (
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#1877F2] flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-500/30 group-hover:scale-110 transition-transform">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </div>
      ),
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      channelName: 'Topson Direct',
      description: 'Direct mobile chat & updates',
      handle: '0794903078',
      stats: 'Connect',
      url: 'https://play.google.com/store/apps/details?id=com.whatsapp',
      badgeColor: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      accentGlow: 'from-emerald-500/10 via-transparent to-transparent',
      cardHoverClasses:
        'hover:border-emerald-500/70 hover:shadow-[0_16px_36px_rgba(16,185,129,0.22)] hover:-translate-y-2',
      icon: (
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#25D366] flex items-center justify-center text-white shrink-0 shadow-md shadow-emerald-500/30 group-hover:scale-110 transition-transform">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.983.538 1.848.814 2.791.814 3.182 0 5.768-2.587 5.769-5.766.001-3.182-2.585-5.8-5.77-5.8zm3.385 8.214c-.141.398-.718.73-1.009.774-.282.043-.645.068-1.047-.061-.403-.129-.929-.304-1.603-.601-1.396-.615-2.3-2.029-2.37-2.122-.07-.093-.568-.756-.568-1.442 0-.685.358-1.022.486-1.163.128-.141.28-.176.374-.176.094 0 .188.001.27.006.088.005.205-.033.32.245.118.283.403.985.438 1.057.036.071.059.155.012.248-.047.094-.07.153-.14.236-.07.082-.149.183-.212.246-.071.07-.145.146-.062.289.083.142.368.608.79 0.984.544.485 1.003.636 1.145.706.142.071.225.059.309-.035.083-.094.356-.414.451-.556.094-.141.189-.118.318-.071.129.047.82.386.961.457.142.07.236.106.271.165.035.059.035.341-.106.739zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.66 1.434 5.176L2 22l4.957-1.399C8.423 21.493 10.155 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
          </svg>
        </div>
      ),
    },
  ];

  return (
    <section id="platforms" className="py-12 sm:py-20 scroll-mt-20 border-t border-neutral-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Kicker */}
        <div className="text-[11px] sm:text-xs font-bold tracking-widest uppercase text-neutral-800 mb-4 sm:mb-6">
          CONNECT ON SOCIAL
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-10 gap-3">
          <div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-neutral-900 tracking-tight leading-[1.05]">
              Dive in my social medias
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-xs md:text-right font-medium">
            Follow along on your preferred channel.
          </p>
        </div>

        {/* Integrated Grid: Compact & Tightly Tiled 2-col grid on Mobile, 5-col on Desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5 lg:gap-5 [&>*:last-child]:col-span-2 sm:[&>*:last-child]:col-span-1 md:[&>*:last-child]:col-span-1">
          {platforms.map((p) => {
            const isSelected = activePlatform === p.name;
            return (
              <a
                key={p.id}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setActivePlatform(p.name)}
                className={`group rounded-xl sm:rounded-3xl p-2.5 sm:p-5 transition-all duration-300 ease-out flex flex-col justify-between cursor-pointer relative overflow-hidden ${p.cardHoverClasses} ${
                  isSelected
                    ? 'bg-neutral-50/90 border-2 border-neutral-900 shadow-md'
                    : 'bg-white border border-neutral-200 shadow-xs hover:bg-neutral-50/50'
                }`}
              >
                {/* Subtle gradient backdrop reflection */}
                <div className={`absolute inset-0 bg-gradient-to-b ${p.accentGlow} pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity`} />

                <div className="relative z-10 space-y-2 sm:space-y-4">
                  {/* PROFILE IMAGE + CHANNEL HEADER ABOVE PLATFORM ICON */}
                  <div className="flex items-center justify-between pb-1.5 sm:pb-3.5 border-b border-neutral-100">
                    <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
                      <div className="w-6 h-6 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-white ring-2 ring-orange-500/80 shrink-0 shadow-xs bg-white group-hover:scale-105 transition-transform">
                        <img
                          src={TOPSON_PROFILE_IMAGE}
                          alt="Topson Media Creator Profile"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] sm:text-xs font-black text-neutral-900 truncate group-hover:text-orange-600 transition-colors">
                          Topson
                        </div>
                        <div className="text-[8px] sm:text-[10px] text-neutral-500 font-semibold truncate flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block shrink-0 animate-pulse" />
                          <span className="hidden sm:inline">Official</span>
                        </div>
                      </div>
                    </div>

                    <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-neutral-100 group-hover:bg-neutral-900 group-hover:text-white text-neutral-500 flex items-center justify-center transition-all duration-200 shadow-2xs shrink-0">
                      <ArrowUpRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>

                  {/* PLATFORM BRAND ICON + NAME */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="shrink-0">
                      {p.icon}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs sm:text-base font-black text-neutral-900 group-hover:text-neutral-950 transition-colors truncate">
                        {p.name}
                      </h3>
                      <p className="text-[9px] sm:text-[11px] text-neutral-500 font-semibold truncate">
                        {p.handle}
                      </p>
                    </div>
                  </div>

                  {/* DESCRIPTION (Hidden on mobile to keep single-screen tile compact) */}
                  <p className="hidden sm:block text-xs text-neutral-600 leading-relaxed font-medium line-clamp-2">
                    {p.description}
                  </p>
                </div>

                {/* BOTTOM ACTION BAR with minimalist action buttons */}
                <div className="relative z-10 flex items-center justify-between pt-1.5 sm:pt-3.5 mt-1.5 sm:mt-3 border-t border-neutral-200/80 text-[9px] sm:text-xs font-semibold">
                  <span className="hidden sm:inline text-[11px] text-neutral-500 group-hover:text-neutral-900 transition-colors">
                    Join Channel
                  </span>
                  <span className="text-neutral-900 text-[9px] sm:text-[11px] font-bold px-2 sm:px-2.5 py-0.5 rounded-full bg-neutral-100 group-hover:bg-neutral-900 group-hover:text-white transition-all shadow-2xs ml-auto sm:ml-0">
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
