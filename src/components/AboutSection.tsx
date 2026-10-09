import React from 'react';
import { ArrowRight } from 'lucide-react';

interface AboutSectionProps {
  onExploreTutorials: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onExploreTutorials }) => {
  return (
    <section id="about" className="hidden md:block py-16 sm:py-20 scroll-mt-20 border-t border-neutral-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Kicker: Clean without underlines or numbers */}
        <div className="text-xs font-bold tracking-widest uppercase text-neutral-800 mb-6">
          ABOUT THE MISSION
        </div>

        {/* 2-Column Split: Punchy Headline on Left, Concise Story on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start mb-12">
          <div className="lg:col-span-5">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 tracking-tight leading-[1.05]">
              Make tech work for you
            </h2>
          </div>

          <div className="lg:col-span-7 space-y-4 text-neutral-800 text-sm sm:text-base leading-relaxed font-normal">
            <p>
              I exclusively teach about <strong className="font-bold text-neutral-950">new and trending technology</strong> through hands-on <strong className="font-bold text-neutral-950">phone and PC tutorials</strong>.
            </p>
            <p>
              Learn hidden smartphone settings, speed up slow laptops, and master everyday digital tools. Simple walkthroughs with zero fluff.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onExploreTutorials}
                className="inline-flex items-center gap-2 font-bold text-neutral-900 hover:text-orange-600 group text-sm cursor-pointer"
              >
                <span>Explore the tutorials</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-orange-500" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
