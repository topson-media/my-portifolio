import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, User as UserIcon, KeyRound, CheckCircle, ShieldCheck } from 'lucide-react';
import { User } from '../types';
import { TOPSON_PROFILE_IMAGE } from '../data/mockData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  initialMode?: 'signin' | 'signup' | 'admin';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'signin',
}) => {
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup');
  const [identifier, setIdentifier] = useState(''); // Email or Username for Login
  const [email, setEmail] = useState('');           // For Register
  const [username, setUsername] = useState('');     // For Register
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsSignUp(initialMode === 'signup');
    setError(null);
  }, [initialMode, isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      if (isSignUp) {
        // Validation: Email, Username, Password required
        if (!email.trim() || !username.trim() || !password.trim()) {
          setError('Email, Username, and Password are all required.');
          setIsSubmitting(false);
          return;
        }
        if (!email.includes('@')) {
          setError('Please provide a valid email address.');
          setIsSubmitting(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters.');
          setIsSubmitting(false);
          return;
        }

        const newUser: User = {
          id: 'user-' + Date.now(),
          username: username.trim(),
          email: email.trim(),
          role: 'member',
          joinedDate: 'Joined today',
          avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username.trim())}`,
        };

        setIsSubmitting(false);
        onSuccess(newUser);
        onClose();
      } else {
        // Validation: [Email OR Username] + Password
        if (!identifier.trim() || !password.trim()) {
          setError('Please enter your Email or Username, and your Password.');
          setIsSubmitting(false);
          return;
        }

        const isUserAdmin = identifier.toLowerCase() === 'topson' || identifier.toLowerCase() === 'admin';
        const loggedUser: User = {
          id: isUserAdmin ? 'admin-1' : 'user-' + Date.now(),
          username: isUserAdmin ? 'Topson Media' : (identifier.includes('@') ? identifier.split('@')[0] : identifier.trim()),
          email: isUserAdmin ? 'admin@topsonmedia.com' : (identifier.includes('@') ? identifier.trim() : `${identifier.trim()}@example.com`),
          role: isUserAdmin ? 'admin' : 'member',
          joinedDate: isUserAdmin ? 'Channel Creator' : 'Joined today',
          avatarUrl: isUserAdmin ? TOPSON_PROFILE_IMAGE : `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(identifier.trim())}`,
        };

        setIsSubmitting(false);
        onSuccess(loggedUser);
        onClose();
      }
    }, 400);
  };

  const handleAdminLogin = () => {
    const adminUser: User = {
      id: 'admin-topson',
      username: 'Topson Media',
      email: 'admin@topsonmedia.com',
      role: 'admin',
      joinedDate: 'Channel Creator & Host',
      avatarUrl: TOPSON_PROFILE_IMAGE,
    };
    onSuccess(adminUser);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white border border-neutral-200 p-6 sm:p-8 shadow-2xl shadow-neutral-900/15 text-neutral-900"
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent blur-xs" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/25 flex items-center justify-center mb-3 text-orange-500">
            <Lock className="w-6 h-6" />
          </div>
          <h2 id="auth-modal-title" className="text-2xl font-black tracking-tight text-neutral-900">
            {isSignUp ? 'Join Topson Media' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-neutral-600 mt-1 font-medium">
            {isSignUp
              ? 'Unlock real-time studio chat and community discussions'
              : 'Sign in to chat live with Topson and submit community feedback'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 p-1 mb-6 rounded-xl bg-neutral-100 border border-neutral-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setError(null);
            }}
            className={`py-2.5 rounded-lg transition-all ${
              !isSignUp
                ? 'bg-white text-orange-600 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-950'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setError(null);
            }}
            className={`py-2.5 rounded-lg transition-all ${
              isSignUp
                ? 'bg-white text-orange-600 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-950'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp ? (
            <>
              {/* Registration: Email */}
              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                  Email Address <span className="text-orange-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-colors"
                  />
                </div>
              </div>

              {/* Registration: Username */}
              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                  Username <span className="text-orange-500">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-colors"
                  />
                </div>
              </div>
            </>
          ) : (
            /* Login: [Email OR Username] */
            <div>
              <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                Email OR Username <span className="text-orange-500">*</span>
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter email or username"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Password (Both) */}
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
              Password <span className="text-orange-500">*</span>
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-colors"
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 px-4 font-bold text-sm text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 rounded-xl shadow-lg shadow-orange-500/25 active:scale-98 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>{isSignUp ? 'Create Free Account' : 'Sign In Now'}</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Admin Demo Login Option */}
        <div className="mt-5 pt-5 border-t border-neutral-100 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-neutral-600">
            <span>Instant Admin Access:</span>
            <span className="text-[11px] text-orange-600 font-bold">1-Click Test</span>
          </div>

          {/* Admin 1-Click Login Button */}
          <button
            type="button"
            onClick={handleAdminLogin}
            className="w-full py-2.5 px-3 text-xs font-bold rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-700 border border-orange-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            <ShieldCheck className="w-4 h-4 text-orange-500" />
            <span>Log in as Topson Media (Admin · Video Upload Rights)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
