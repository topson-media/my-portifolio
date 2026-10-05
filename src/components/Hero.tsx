import React from 'react';
import { Play, ArrowRight, Smartphone, ArrowDown } from 'lucide-react';
import { TOPSON_HERO_BADGE, TOPSON_PROFILE_IMAGE } from '../data/mockData';

interface HeroProps {
  onWatchTutorials: () => void;
  onLiveChat: () => void;
  onExploreScroll: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onWatchTutorials,
  onLiveChat,
  onExploreScroll,
}) => {
  // Word arrays for word-by-word animation
  const kickerWords = ['THE', 'EVERYDAY', 'TECH', 'ADVANTAGE'];
  const headingLine1Words = ['Tech', 'that'];
  const headingLine2Words = ['moves', 'you.'];
  const subtextWords = [
    'Empowering',
    'you',
    'with',
    'Phone',
    '&',
    'PC',
    'tutorials,',
    'tips,',
    'and',
    'digital',
    'skills.',
  ];

  return (
    <section id="hero" className="relative overflow-hidden pt-10 pb-16 lg:py-20 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Bold Headline & Animated Copy */}
          <div className="lg:col-span-6 flex flex-col items-start space-y-7">
            
            {/* Kicker: • THE EVERYDAY TECH ADVANTAGE (word-by-word) */}
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-neutral-800">
              <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
              <div className="flex flex-wrap gap-x-1.5">
                {kickerWords.map((word, idx) => (
                  <span
                    key={idx}
                    className="animate-word"
                    style={{ animationDelay: `${idx * 90}ms` }}
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>

            {/* Headline: Tech that moves you. (word-by-word) */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-neutral-900 tracking-tight leading-[0.98]">
              <span className="block">
                {headingLine1Words.map((word, idx) => (
                  <span
                    key={idx}
                    className="animate-word mr-3.5"
                    style={{ animationDelay: `${400 + idx * 100}ms` }}
                  >
                    {word}
                  </span>
                ))}
              </span>
              <span className="block text-orange-500">
                {headingLine2Words.map((word, idx) => (
                  <span
                    key={idx}
                    className="animate-word mr-3.5"
                    style={{ animationDelay: `${620 + idx * 110}ms` }}
                  >
                    {word}
                  </span>
                ))}
              </span>
            </h1>

            {/* Subtext: Empowering you with Phone & PC tutorials... (word-by-word) */}
            <p className="text-base sm:text-lg text-neutral-800 max-w-lg leading-relaxed flex flex-wrap gap-x-1.5 gap-y-1">
              {subtextWords.map((word, idx) => {
                const isHighlight = ['Phone', '&', 'PC', 'tutorials,'].includes(word);
                return (
                  <span
                    key={idx}
                    className={`animate-word ${
                      isHighlight
                        ? 'font-bold text-neutral-950'
                        : 'text-neutral-700'
                    }`}
                    style={{ animationDelay: `${880 + idx * 60}ms` }}
                  >
                    {word}
                  </span>
                );
              })}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={onWatchTutorials}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 active:scale-95 rounded-xl shadow-lg shadow-orange-500/25 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Watch tutorials</span>
              </button>

              <button
                type="button"
                onClick={onLiveChat}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 active:scale-95 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 cursor-pointer"
              >
                <span>Live Chat</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Bottom-left micro badge */}
            <div className="pt-6 border-t border-neutral-200 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-orange-500/80 p-0.5 bg-white shadow-sm">
                    <img
                      src={TOPSON_PROFILE_IMAGE}
                      alt="Topson Media Profile"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-bold">
                    +
                  </span>
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-900">
                    Making tech feel easy
                  </div>
                  <div className="text-[11px] text-neutral-600 font-medium">
                    For curious minds everywhere
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onExploreScroll}
                className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-neutral-700 hover:text-orange-600 transition-colors cursor-pointer"
              >
                <span>SCROLL TO EXPLORE</span>
                <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
              </button>
            </div>

          </div>

          {/* Right Column: Welcome Image inside Circular Frame */}
          <div className="lg:col-span-6 flex justify-center items-center py-4">
            <div className="relative w-full max-w-[320px] sm:max-w-[400px] lg:max-w-[440px] flex items-center justify-center">
              
              {/* Ambient Glowing Background Aura */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-500/25 via-orange-400/10 to-transparent blur-2xl scale-110 pointer-events-none" />

              {/* Exact Circular Frame with Smooth Floating Animation */}
              <div className="animate-float-visibility w-full aspect-square rounded-full overflow-hidden bg-white border-4 border-white shadow-2xl shadow-orange-500/15 ring-4 ring-orange-500/25 relative group transition-all duration-500">
                
                {/* The Official Creator Portrait directly from https://postimg.cc/MvKQDfYp */}
                <img
                  src="https://i.postimg.cc/Hsb9TQcX/profile.png"
                  alt="Topson Media Creator Profile"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center rounded-full group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes('profile.png')) {
                      target.src = 'https://i.postimg.cc/Hsb9TQcX/profile.png';
                    }
                  }}
                />

                {/* Subtle Inner Circular Highlight */}
                <div className="absolute inset-0 rounded-full pointer-events-none ring-1 ring-inset ring-black/10" />
              </div>

              {/* Floating Badge Top-Left: PHONE MASTERY */}
              <div className="absolute -top-3 left-0 sm:left-1 bg-white/95 text-neutral-900 px-3.5 py-1.5 rounded-full shadow-lg border border-neutral-200 flex items-center gap-2 text-[11px] font-bold backdrop-blur-sm z-10 transition-transform hover:scale-105">
                <Smartphone className="w-3.5 h-3.5 text-orange-500" />
                <span className="tracking-wide uppercase text-[10px]">PHONE MASTERY</span>
              </div>

              {/* Floating Badge Top-Right: LEARN · CREATE · SHARE */}
              <div className="absolute top-2 -right-2 sm:right-0 bg-neutral-900/85 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest text-white shadow-md border border-neutral-800 z-10">
                LEARN · CREATE · SHARE
              </div>

              {/* Floating Badge Bottom-Right: NEW UPLOAD ▶ */}
              <div
                className="absolute -bottom-3 right-2 sm:right-4 bg-white text-neutral-900 px-4 py-2 rounded-full shadow-xl border border-neutral-200 flex items-center gap-2 text-[11px] font-bold cursor-pointer hover:bg-orange-50 transition-all hover:scale-105 active:scale-95 z-10"
                onClick={onWatchTutorials}
              >
                <span className="text-orange-600 uppercase text-[10px] tracking-wider font-extrabold">NEW UPLOAD</span>
                <Play className="w-3 h-3 fill-orange-600 text-orange-600" />
              </div>

              {/* Floating Badge Bottom-Left: TOPSON MEDIA */}
              <div className="absolute bottom-5 -left-2 sm:left-0 bg-neutral-900/90 backdrop-blur-md px-3.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase text-white shadow-md border border-neutral-700/60 z-10">
                TOPSON MEDIA
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
