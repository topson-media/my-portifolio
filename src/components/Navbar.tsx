import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Sun, Moon, LogOut, ShieldCheck, Home, Film, Users, MessageSquare, Mail } from 'lucide-react';
import { User } from '../types';
import { TOPSON_PROFILE_IMAGE } from '../data/mockData';

export type NavSection = 'home' | 'tutorials' | 'community' | 'chat' | 'contact' | 'admin';

interface NavbarProps {
  currentUser: User | null;
  onOpenAuth: (mode?: 'signin' | 'signup' | 'admin') => void;
  onLogout: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  matchingCount: number;
  activeNav: NavSection;
  onNavClick: (section: NavSection) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenAuth,
  onLogout,
  searchQuery,
  onSearchChange,
  isDarkMode = false,
  onToggleDarkMode,
  matchingCount,
  activeNav,
  onNavClick,
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems: { label: string; id: NavSection; icon: React.ReactNode }[] = [
    { label: 'Home', id: 'home', icon: <Home className="w-3.5 h-3.5" /> },
    { label: 'Tutorials', id: 'tutorials', icon: <Film className="w-3.5 h-3.5" /> },
    { label: 'Community', id: 'community', icon: <Users className="w-3.5 h-3.5" /> },
    { label: 'Live Chat', id: 'chat', icon: <MessageSquare className="w-3.5 h-3.5" /> },
    { label: 'Contact', id: 'contact', icon: <Mail className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md transition-colors duration-200 border-b border-neutral-200 bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 flex-nowrap overflow-x-auto custom-scrollbar">
        
        {/* Left: Brand Logo & Wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onNavClick('home')}
            className="flex items-center gap-2.5 focus-visible:outline-none rounded-lg group text-left cursor-pointer"
            aria-label="Topson Media Home"
          >
            <div className="w-9 h-9 rounded-full overflow-hidden border border-neutral-300 bg-white shrink-0">
              <img
                src={TOPSON_PROFILE_IMAGE}
                alt="Topson Media Logo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <span className="text-sm sm:text-base font-black tracking-wider uppercase text-neutral-900 whitespace-nowrap">
              TOPSON MEDIA
            </span>
          </button>
        </div>

        {/* Center: Navigation Links in a SINGLE LINE with relevant icon before each nav */}
        <nav className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap shrink-0">
          {navItems.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavClick(item.id)}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-bold flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-neutral-900 text-white shadow-2xs'
                    : 'text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* ADMIN NAV (Only visible when logged in as admin) */}
          {currentUser?.role === 'admin' && (
            <button
              type="button"
              onClick={() => onNavClick('admin')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                activeNav === 'admin'
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-neutral-100 text-neutral-900 border-neutral-200 hover:border-neutral-400'
              }`}
              title="Admin Creator Studio"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />
              <span>Admin Studio</span>
            </button>
          )}
        </nav>

        {/* Right: Small-to-Big Search + Theme + Auth */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Functional Dynamic Search: placeholder="search" */}
          <div className="relative">
            <label htmlFor="nav-search-input" className="sr-only">search</label>
            <div className="relative flex items-center">
              <input
                id="nav-search-input"
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  if (activeNav !== 'tutorials') {
                    onNavClick('tutorials');
                  }
                }}
                placeholder="search"
                className={`py-1.5 sm:py-2 text-xs sm:text-sm rounded-full transition-all duration-300 ease-out focus:outline-none ${
                  isSearchFocused || searchQuery
                    ? 'w-48 sm:w-64 md:w-72 pl-9 pr-8 bg-white border border-neutral-900 text-neutral-900'
                    : 'w-24 sm:w-32 pl-8 pr-3 bg-neutral-100 border border-neutral-200 text-neutral-900 placeholder:text-neutral-500 hover:border-neutral-400 cursor-pointer font-medium'
                }`}
              />
              <Search className="absolute left-2.5 w-3.5 h-3.5 text-neutral-500 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 p-0.5 rounded-full text-neutral-400 hover:text-neutral-900 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick search match counter popup */}
            {searchQuery && (
              <div className="absolute top-full mt-1.5 right-0 w-52 py-2 px-3 bg-white rounded-xl shadow-lg border border-neutral-200 text-xs text-neutral-800 flex items-center justify-between z-50">
                <span className="font-medium">Matching tutorials:</span>
                <span className="font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded">
                  {matchingCount} found
                </span>
              </div>
            )}
          </div>

          {/* User Auth / Admin Account */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 pl-1.5 border-l border-neutral-200">
              <div
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white font-bold text-xs bg-neutral-900"
                title={currentUser.role === 'admin' ? 'Admin: Topson Media' : currentUser.username}
              >
                {currentUser.username.slice(0, 1).toUpperCase()}
              </div>
              <span className="hidden xl:inline-block text-xs font-bold text-neutral-900 max-w-[90px] truncate">
                {currentUser.username}
              </span>
              <button
                type="button"
                onClick={onLogout}
                title="Sign out"
                className="p-1 text-neutral-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                aria-label="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onOpenAuth('signin')}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-all shadow-2xs active:scale-95 cursor-pointer whitespace-nowrap"
              >
                Sign in
              </button>
            </div>
          )}

        </div>

      </div>
    </header>
  );
};
