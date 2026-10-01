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

          {/* Right Column: Welcome Image moving repeatedly top to bottom with breathing visibility */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="animate-float-visibility w-full max-w-lg aspect-square rounded-3xl overflow-hidden bg-white border-2 border-neutral-200 shadow-2xl shadow-neutral-900/10 relative group transition-all duration-500">
              
              {/* The Official Creator Portrait from the new link */}
              <img
                src={TOPSON_HERO_BADGE}
                alt="Topson Media Welcome Image"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
              />

              {/* Ambient Glowing Ring Pulse Overlay */}
              <div className="absolute inset-0 rounded-3xl pointer-events-none ring-1 ring-inset ring-orange-500/30" />

              {/* Top Left Floating Tag: PHONE MASTERY */}
              <div className="absolute top-5 left-5 bg-white/95 text-neutral-900 px-3 py-1.5 rounded-lg shadow-lg border border-neutral-200 flex items-center gap-2 text-[11px] font-bold backdrop-blur-sm">
                <Smartphone className="w-3.5 h-3.5 text-orange-500" />
                <span className="tracking-wide uppercase text-[10px]">PHONE MASTERY</span>
              </div>

              {/* Top Right Tag: LEARN · CREATE · SHARE */}
              <div className="absolute top-5 right-5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-widest text-white shadow-sm">
                LEARN · CREATE · SHARE
              </div>

              {/* Bottom Right Floating Tag: NEW UPLOAD ▶ */}
              <div
                className="absolute bottom-6 right-5 bg-white text-neutral-900 px-3 py-1.5 rounded-lg shadow-lg border border-neutral-200 flex items-center gap-2 text-[11px] font-bold cursor-pointer hover:bg-orange-50 transition-colors"
                onClick={onWatchTutorials}
              >
                <span className="text-orange-600 uppercase text-[10px] tracking-wider font-extrabold">NEW UPLOAD</span>
                <Play className="w-3 h-3 fill-orange-600 text-orange-600" />
              </div>

              {/* Bottom Left Corner: TOPSON MEDIA */}
              <div className="absolute bottom-4 left-5 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase text-white shadow-xs">
                TOPSON MEDIA
              </div>

              {/* Bottom Right Corner Text: EST. 2024 */}
              <div className="absolute bottom-1 right-5 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-bold tracking-widest uppercase text-white shadow-xs">
                EST. 2024
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
