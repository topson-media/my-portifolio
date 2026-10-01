import React, { useState } from 'react';
import { Mail, Phone, Check, Copy } from 'lucide-react';
import { TOPSON_PROFILE_IMAGE } from '../data/mockData';

export const Footer: React.FC = () => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const socialLinks = [
    {
      name: 'TikTok',
      url: 'https://tiktok.com/@topsonmedia',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800 hover:text-[#00f2fe] hover:border-[#00f2fe]/60 hover:scale-105 transition-all shadow-2xs">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
          </svg>
        </div>
      ),
    },
    {
      name: 'YouTube',
      url: 'https://youtube.com/@topsonmedia',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800 hover:text-[#FF0000] hover:border-[#FF0000]/60 hover:scale-105 transition-all shadow-2xs">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        </div>
      ),
    },
    {
      name: 'Facebook',
      url: 'https://facebook.com/topsonmedia',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800 hover:text-[#1877F2] hover:border-[#1877F2]/60 hover:scale-105 transition-all shadow-2xs">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </div>
      ),
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com/topson.media',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800 hover:text-[#dc2743] hover:border-[#dc2743]/60 hover:scale-105 transition-all shadow-2xs">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </div>
      ),
    },
  ];

  const email = 'hello@topsonmedia.com';
  const phone = '+1(000) 000-0000';

  return (
    <footer className="border-t border-neutral-200 bg-white py-16 text-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 4-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12">
          
          {/* Column 1 (4 cols): Logo and Brand Mission */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-orange-500/90 p-0.5 bg-white shrink-0 shadow-sm">
                <img
                  src={TOPSON_PROFILE_IMAGE}
                  alt="Topson Media Logo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="text-base font-black tracking-wider uppercase text-neutral-900">
                TOPSON MEDIA
              </span>
            </div>

            <p className="text-xs sm:text-sm text-neutral-700 max-w-sm leading-relaxed font-normal">
              Empowering you with tech, one useful tip at a time. From phone shortcuts to PC performance and digital skills that keep you ahead.
            </p>
          </div>

          {/* Column 2 (3 cols): Follow us on */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold text-neutral-900 mb-4 uppercase tracking-wider">
              Follow us on
            </h4>
            <div className="flex items-center gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 3 (3 cols): Contact us on (with subtle fluid orange glowing animation on hover) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold text-neutral-900 mb-4 uppercase tracking-wider">
              Contact us on
            </h4>
            <div className="space-y-3">
              
              {/* Email with fluid orange glow */}
              <div
                onClick={() => handleCopy(email, 'email')}
                className="group cursor-pointer flex items-center gap-3 contact-hover-glow"
              >
                <div className="w-9 h-9 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-orange-500 shrink-0 group-hover:border-orange-500/50 transition-colors shadow-2xs">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-neutral-800">
                  <span>{email}</span>
                  {copiedType === 'email' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3 h-3 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              </div>

              {/* Phone with fluid orange glow */}
              <div
                onClick={() => handleCopy(phone, 'phone')}
                className="group cursor-pointer flex items-center gap-3 contact-hover-glow"
              >
                <div className="w-9 h-9 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-orange-500 shrink-0 group-hover:border-orange-500/50 transition-colors shadow-2xs">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-neutral-800">
                  <span>{phone}</span>
                  {copiedType === 'phone' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3 h-3 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Column 4 (2 cols): Explore */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold text-neutral-900 mb-4 uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-700 font-semibold">
              <li>
                <a href="#about" className="hover:text-orange-600 transition-colors">About</a>
              </li>
              <li>
                <a href="#videos" className="hover:text-orange-600 transition-colors">Videos</a>
              </li>
              <li>
                <a href="#community" className="hover:text-orange-600 transition-colors">Community</a>
              </li>
              <li>
                <a href="#live-chat" className="hover:text-orange-600 transition-colors">Live Chat</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright line */}
        <div className="pt-8 border-t border-neutral-200 text-xs text-neutral-700 font-semibold flex items-center justify-between">
          <span>© 2024 Topson Media. All rights reserved.</span>
          <span className="text-[11px] text-orange-600 font-bold">Tech That Moves You</span>
        </div>

      </div>
    </footer>
  );
};
