/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar, NavSection } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { PlatformsSection } from './components/PlatformsSection';
import { VideoGallery } from './components/VideoGallery';
import { CommunitySection } from './components/CommunitySection';
import { LiveChat } from './components/LiveChat';
import { ContactSection } from './components/ContactSection';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import {
  INITIAL_VIDEOS,
  INITIAL_FEEDBACKS,
  INITIAL_CHAT_MESSAGES,
  TOPSON_PROFILE_IMAGE,
} from './data/mockData';
import { User, FeedbackItem, ChatMessage, VideoItem } from './types';

export default function App() {
  // Enforce white background on <html>, <body>, and localStorage
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark');
    localStorage.setItem('topson_theme', 'light');
  }, []);

  // Current view page: 'home' for the full on-page experience, 'admin' for Admin Studio
  const [currentPage, setCurrentPage] = useState<'home' | 'admin'>(() => {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    return hash === 'admin' ? 'admin' : 'home';
  });

  // Active section for Scroll-Spy (Home, Tutorials, Community, Live Chat, Contact)
  const [activeNav, setActiveNav] = useState<NavSection>('home');

  // User Authentication state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('topson_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'admin'>('signin');

  // Search state
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Interactive Videos state (persisted with valid videoUrls & sourceTypes)
  const [videoList, setVideoList] = useState<VideoItem[]>(() => {
    const saved = localStorage.getItem('topson_videos');
    if (saved) {
      try {
        const parsed: VideoItem[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item) => {
            const match = INITIAL_VIDEOS.find((v) => v.id === item.id);
            return {
              ...item,
              videoUrl: item.videoUrl || match?.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
              sourceType: item.sourceType || match?.sourceType || 'device',
            };
          });
        }
        return INITIAL_VIDEOS;
      } catch {
        return INITIAL_VIDEOS;
      }
    }
    return INITIAL_VIDEOS;
  });

  // Interactive Community Feedbacks
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(() => {
    const saved = localStorage.getItem('topson_feedbacks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_FEEDBACKS;
      }
    }
    return INITIAL_FEEDBACKS;
  });

  // Interactive Live Chat Messages
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('topson_chat_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_CHAT_MESSAGES;
      }
    }
    return INITIAL_CHAT_MESSAGES;
  });

  // Ensure dark class is never present
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  // Sync hash changes with page state
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'admin') {
        setCurrentPage('admin');
        setActiveNav('admin');
      } else {
        setCurrentPage('home');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // SCROLL-SPY: Watches sections as user scrolls and marks related nav as active
  useEffect(() => {
    if (currentPage !== 'home') return;

    const sections: { id: string; nav: NavSection }[] = [
      { id: 'hero', nav: 'home' },
      { id: 'videos', nav: 'tutorials' },
      { id: 'community', nav: 'community' },
      { id: 'live-chat', nav: 'chat' },
      { id: 'contact-form', nav: 'contact' },
    ];

    const handleScroll = () => {
      const scrollPos = window.scrollY + 220;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            setActiveNav(sections[i].nav);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage]);

  // Smooth scroll handler to target section
  const scrollToTargetSection = (section: NavSection) => {
    if (section === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const mapping: Record<string, string> = {
      tutorials: 'videos',
      community: 'community',
      chat: 'live-chat',
      contact: 'contact-form',
    };

    const targetId = mapping[section];
    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Nav click handler: directs home to welcome page, contact to GET IN TOUCH section, etc.
  const handleNavClick = (section: NavSection) => {
    setActiveNav(section);

    if (section === 'admin') {
      setCurrentPage('admin');
      window.location.hash = '#admin';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (currentPage !== 'home') {
      setCurrentPage('home');
      window.location.hash = '';
      setTimeout(() => {
        scrollToTargetSection(section);
      }, 100);
    } else {
      scrollToTargetSection(section);
    }
  };

  // Persist user auth to localStorage
  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('topson_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('topson_user');
    if (currentPage === 'admin') {
      setCurrentPage('home');
      window.location.hash = '';
    }
  };

  const handleOpenAuth = (mode: 'signin' | 'signup' | 'admin' = 'signin') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  // Add new feedback
  const handleAddFeedback = (newFb: FeedbackItem) => {
    const updated = [newFb, ...feedbacks];
    setFeedbacks(updated);
    localStorage.setItem('topson_feedbacks', JSON.stringify(updated));
  };

  // Toggle Like on Feedback Item
  const handleToggleLikeFeedback = (feedbackId: string) => {
    setFeedbacks((prev) => {
      const updated = prev.map((fb) => {
        if (fb.id === feedbackId) {
          const currentlyLiked = !!fb.userLiked;
          const currentCount = fb.likes ?? 0;
          return {
            ...fb,
            userLiked: !currentlyLiked,
            likes: currentlyLiked ? Math.max(0, currentCount - 1) : currentCount + 1,
          };
        }
        return fb;
      });
      localStorage.setItem('topson_feedbacks', JSON.stringify(updated));
      return updated;
    });
  };

  // Add Reply to Feedback Item
  const handleAddReplyFeedback = (feedbackId: string, reply: import('./types').FeedbackReply) => {
    setFeedbacks((prev) => {
      const updated = prev.map((fb) => {
        if (fb.id === feedbackId) {
          return {
            ...fb,
            replies: [...(fb.replies || []), reply],
          };
        }
        return fb;
      });
      localStorage.setItem('topson_feedbacks', JSON.stringify(updated));
      return updated;
    });
  };

  // Handle upload video (Admin only)
  const handleUploadVideo = (newVid: VideoItem) => {
    const updated = [newVid, ...videoList];
    setVideoList(updated);
    localStorage.setItem('topson_videos', JSON.stringify(updated));
  };

  // Handle user sending chat message
  const handleSendMessage = (msg: ChatMessage) => {
    const updated = [...chatMessages, msg];
    setChatMessages(updated);
    localStorage.setItem('topson_chat_messages', JSON.stringify(updated));
  };

  // Handle delete or un-send message
  const handleDeleteChatMessage = (msgId: string, mode: 'everyone' | 'me') => {
    setChatMessages((prev) => {
      let updated: ChatMessage[];
      if (mode === 'everyone') {
        // Direct un-send: removed for everyone (hoster and sender panel)
        updated = prev.filter((m) => m.id !== msgId);
      } else {
        // Deleted for me: sender's panel only
        updated = prev.filter((m) => m.id !== msgId);
      }
      localStorage.setItem('topson_chat_messages', JSON.stringify(updated));
      return updated;
    });
  };

  // Handle marking messages as read (turns white tick into double blue ticks)
  const handleMarkMessagesRead = (ids: string[]) => {
    setChatMessages((prev) => {
      const updated = prev.map((m) => (ids.includes(m.id) ? { ...m, isRead: true } : m));
      localStorage.setItem('topson_chat_messages', JSON.stringify(updated));
      return updated;
    });
  };

  // Handle Topson automatic response
  const handleTopsonReply = (replyText: string) => {
    const topsonMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'topson',
      senderName: 'Topson Media',
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatarUrl: TOPSON_PROFILE_IMAGE,
    };
    const updated = [...chatMessages, topsonMsg];
    setChatMessages(updated);
    localStorage.setItem('topson_chat_messages', JSON.stringify(updated));
  };

  // Calculate matching items count for search indicator in Video Gallery
  const matchingCount = useMemo(() => {
    if (!searchQuery.trim()) return 0;
    const q = searchQuery.toLowerCase();
    return videoList.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q) ||
        v.tags.some((t) => t.toLowerCase().includes(q))
    ).length;
  }, [searchQuery, videoList]);

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-orange-500 selection:text-white flex flex-col justify-between">
      <div>
        {/* Sticky Modern Top Navigation (With icons on every nav & Scroll-Spy active state) */}
        <Navbar
          currentUser={currentUser}
          onOpenAuth={handleOpenAuth}
          onLogout={handleLogout}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          matchingCount={matchingCount}
          activeNav={activeNav}
          onNavClick={handleNavClick}
        />

        {/* Main Content Area */}
        <main>
          {currentPage === 'home' ? (
            /* ALL SECTIONS INTEGRATED ON MAIN FLOW (Scrollable, with Scroll-Spy) */
            <div className="animate-in fade-in">
              {/* Welcome / Hero Section */}
              <Hero
                onWatchTutorials={() => handleNavClick('tutorials')}
                onLiveChat={() => handleNavClick('chat')}
                onExploreScroll={() => {
                  const el = document.getElementById('about');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
              />

              {/* About / Mission Section */}
              <AboutSection
                onExploreTutorials={() => handleNavClick('tutorials')}
              />

              {/* Social Media Channels */}
              <PlatformsSection />

              {/* Video Gallery Section (Tutorials) */}
              <VideoGallery
                videos={videoList}
                searchQuery={searchQuery}
                currentUser={currentUser}
                onOpenAdminAuth={() => handleOpenAuth('admin')}
                onUploadVideo={handleUploadVideo}
              />

              {/* Community Feedback Section (Unified Card) */}
              <CommunitySection
                feedbacks={feedbacks}
                currentUser={currentUser}
                onOpenAuth={() => handleOpenAuth('signup')}
                onSubmitFeedback={handleAddFeedback}
                onToggleLikeFeedback={handleToggleLikeFeedback}
                onAddReplyFeedback={handleAddReplyFeedback}
              />

              {/* Live Chat Section */}
              <LiveChat
                currentUser={currentUser}
                onOpenAuth={() => handleOpenAuth('signin')}
                messages={chatMessages}
                onSendMessage={handleSendMessage}
                onTopsonReply={handleTopsonReply}
                onMarkMessagesRead={handleMarkMessagesRead}
                onDeleteMessage={handleDeleteChatMessage}
              />

              {/* GET IN TOUCH Contact Section */}
              <ContactSection
                onJumpToChat={() => handleNavClick('chat')}
              />
            </div>
          ) : (
            /* ADMIN CREATOR STUDIO (Exclusively for admin account) */
            <div className="animate-in fade-in">
              <AdminDashboard
                currentUser={currentUser}
                videos={videoList}
                feedbacks={feedbacks}
                onUploadVideo={handleUploadVideo}
                onAdminLogin={() => handleOpenAuth('admin')}
                onNavigateHome={() => handleNavClick('home')}
              />
            </div>
          )}
        </main>
      </div>

      {/* Global Footer */}
      <Footer />

      {/* Glassmorphic Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        initialMode={authMode}
      />
    </div>
  );
}
