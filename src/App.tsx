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
import { User, FeedbackItem, ChatMessage, VideoItem, EmailMessage, VisitorActivity, VideoComment } from './types';
import {
  subscribeToVideos,
  addVideoToDb,
  updateVideoInDb,
  deleteVideoFromDb,
  toggleLikeVideoInDb,
  addVideoCommentInDb,
  incrementVideoViewsInDb,
  subscribeToFeedbacks,
  addFeedbackToDb,
  deleteFeedbackFromDb,
  toggleLikeFeedbackInDb,
  hideFeedbackInDb,
  subscribeToMessages,
  sendMessageToDb,
  deleteMessageFromDb,
  markMessagesReadInDb,
  testFirestoreConnection,
  verifyConfirmationEmail,
  subscribeToContactSubmissions,
  replyToContactSubmissionInDb,
} from './services/firebase';

export default function App() {
  // Enforce white background on <html>, <body>, and localStorage
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark');
    localStorage.setItem('topson_theme', 'light');
    testFirestoreConnection();
  }, []);

  // Current view page: always default to 'home' when user opens website
  const [currentPage, setCurrentPage] = useState<'home' | 'admin'>('home');

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

  // Interactive Videos state (Loaded dynamically via Firestore real-time listener)
  const [videoList, setVideoList] = useState<VideoItem[]>(() => {
    const saved = localStorage.getItem('topson_videos');
    if (saved) {
      try {
        const parsed: VideoItem[] = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        return INITIAL_VIDEOS;
      }
    }
    return INITIAL_VIDEOS;
  });

  // Interactive Community Feedbacks (Loaded dynamically via Firestore real-time listener)
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(() => {
    const saved = localStorage.getItem('topson_feedbacks');
    if (saved) {
      try {
        const parsed: FeedbackItem[] = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        return INITIAL_FEEDBACKS;
      }
    }
    return INITIAL_FEEDBACKS;
  });

  // Inbound Email Messages to topsonkenedy@gmail.com
  const [emailMessages, setEmailMessages] = useState<EmailMessage[]>(() => {
    const saved = localStorage.getItem('topson_email_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  // Real-time Visitor & User Traffic Activities
  const [visitorActivities, setVisitorActivities] = useState<VisitorActivity[]>([]);

  const [totalVisitorsCount, setTotalVisitorsCount] = useState<number>(() => {
    const saved = localStorage.getItem('topson_visitor_count');
    return saved ? parseInt(saved, 10) : 1;
  });

  useEffect(() => {
    const incremented = sessionStorage.getItem('topson_visited');
    if (!incremented) {
      setTotalVisitorsCount((prev) => {
        const next = prev + 1;
        localStorage.setItem('topson_visitor_count', next.toString());
        return next;
      });
      sessionStorage.setItem('topson_visited', 'true');
    }
  }, []);

  // Interactive Live Chat Messages (Loaded dynamically via Firestore real-time listener)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('topson_chat_messages');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        return INITIAL_CHAT_MESSAGES;
      }
    }
    return INITIAL_CHAT_MESSAGES;
  });

  // Real-time Firestore Subscriptions for Videos, Feedbacks, Messages, and Contact Submissions
  useEffect(() => {
    const unsubVideos = subscribeToVideos((vids) => {
      setVideoList(vids);
      localStorage.setItem('topson_videos', JSON.stringify(vids));
    });

    const unsubFeedbacks = subscribeToFeedbacks((fbs) => {
      setFeedbacks(fbs);
      localStorage.setItem('topson_feedbacks', JSON.stringify(fbs));
    });

    const unsubMessages = subscribeToMessages((msgs) => {
      setChatMessages(msgs);
      localStorage.setItem('topson_chat_messages', JSON.stringify(msgs));
    });

    const unsubContacts = subscribeToContactSubmissions((submissions) => {
      if (submissions && submissions.length > 0) {
        setEmailMessages(submissions);
        localStorage.setItem('topson_email_messages', JSON.stringify(submissions));
      }
    });

    return () => {
      unsubVideos();
      unsubFeedbacks();
      unsubMessages();
      unsubContacts();
    };
  }, []);

  // Ensure dark class is never present
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  // FIX INITIAL LOAD ROUTING BUG:
  // Ensure that when website loads or is refreshed, viewport strictly starts at the very top of Hero/Home
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    const hash = window.location.hash.toLowerCase();
    if (hash === '#admin') {
      return;
    }
    // Clean any unwanted contact or other hash that would auto-scroll the page
    if (hash && !hash.startsWith('#verify')) {
      window.history.replaceState(null, '', window.location.pathname);
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Toast notification for email verification success
  const [verificationToast, setVerificationToast] = useState<{ show: boolean; message: string } | null>(null);

  // Sync hash changes with page state & check incoming verification links
  useEffect(() => {
    const handleHashChange = async () => {
      const rawHash = window.location.hash;

      // Handle email verification links e.g. #verify?email=...&code=...&token=...
      if (rawHash.startsWith('#verify')) {
        const queryPart = rawHash.includes('?') ? rawHash.split('?')[1] : '';
        const params = new URLSearchParams(queryPart);
        const verifyEmail = params.get('email');
        const verifyCode = params.get('code');
        const verifyToken = params.get('token');

        if (verifyEmail && (verifyCode || verifyToken)) {
          const res = await verifyConfirmationEmail(verifyEmail, verifyToken || verifyCode || '');
          if (res.success && res.user) {
            setCurrentUser(res.user);
            setAuthModalOpen(false);
            setVerificationToast({
              show: true,
              message: `🎉 Real email verified! Welcome to Topson Media, ${res.user.username}! Your account is now active.`,
            });
            window.history.replaceState(null, '', window.location.pathname);
            setTimeout(() => {
              setVerificationToast(null);
            }, 6500);
            return;
          }
        }
      }

      const hash = rawHash.replace('#', '').toLowerCase();
      if (hash === 'admin') {
        setCurrentPage('admin');
        setActiveNav('admin');
      } else {
        setCurrentPage('home');
      }
    };

    handleHashChange();
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
      if (window.scrollY < 120) {
        setActiveNav('home');
        return;
      }
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

  // Add new feedback (persists to Firestore database & local state)
  const handleAddFeedback = async (newFb: FeedbackItem) => {
    const updated = [newFb, ...feedbacks];
    setFeedbacks(updated);
    localStorage.setItem('topson_feedbacks', JSON.stringify(updated));

    try {
      await addFeedbackToDb(newFb);
    } catch (err) {
      console.warn('Firestore addFeedback fallback:', err);
    }

    setVisitorActivities((prev) => [
      {
        id: 'act-' + Date.now(),
        type: 'comment',
        description: `New community review published by "${newFb.authorName}" (${newFb.rating} stars)`,
        timestamp: 'Just now',
        userIpOrName: newFb.authorName,
      },
      ...prev,
    ]);
  };

  // Delete feedback (Admin control, deletes from Firestore)
  const handleDeleteFeedback = async (feedbackId: string) => {
    const updated = feedbacks.filter((fb) => fb.id !== feedbackId);
    setFeedbacks(updated);
    localStorage.setItem('topson_feedbacks', JSON.stringify(updated));

    try {
      await deleteFeedbackFromDb(feedbackId);
    } catch (err) {
      console.warn('Firestore deleteFeedback fallback:', err);
    }

    setVisitorActivities((prev) => [
      {
        id: 'act-' + Date.now(),
        type: 'comment',
        description: 'Admin deleted a feedback review',
        timestamp: 'Just now',
        userIpOrName: 'Admin Control',
      },
      ...prev,
    ]);
  };

  // Hide or unhide feedback (Admin moderation, updates Firestore)
  const handleHideFeedback = async (feedbackId: string, hidden: boolean) => {
    const updated = feedbacks.map((fb) => (fb.id === feedbackId ? { ...fb, hidden } : fb));
    setFeedbacks(updated);
    localStorage.setItem('topson_feedbacks', JSON.stringify(updated));

    try {
      await hideFeedbackInDb(feedbackId, hidden);
    } catch (err) {
      console.warn('Firestore hideFeedback fallback:', err);
    }
  };

  // Inbound message sent to admin (topsonkenedy@gmail.com)
  const handleSendMessageToAdmin = (message: EmailMessage) => {
    const updated = [message, ...emailMessages];
    setEmailMessages(updated);
    localStorage.setItem('topson_email_messages', JSON.stringify(updated));

    setVisitorActivities((prev) => [
      {
        id: 'act-' + Date.now(),
        type: 'email',
        description: `Email inquiry received from "${message.senderName}" (${message.subject})`,
        timestamp: 'Just now',
        userIpOrName: message.senderName,
      },
      ...prev,
    ]);
  };

  // Admin reply to inbound message (will send via email & sync to Firestore)
  const handleReplyEmailMessage = async (emailId: string, replyText: string) => {
    try {
      await replyToContactSubmissionInDb(emailId, replyText);
    } catch (err) {
      console.warn('Firestore replyToContactSubmission fallback:', err);
    }

    setEmailMessages((prev) => {
      const updated = prev.map((msg) => {
        if (msg.id === emailId) {
          const currentReplies = msg.replies || [];
          return {
            ...msg,
            replies: [
              ...currentReplies,
              {
                id: 'rep-' + Date.now(),
                text: replyText,
                timestamp: 'Just now',
              },
            ],
          };
        }
        return msg;
      });
      localStorage.setItem('topson_email_messages', JSON.stringify(updated));
      return updated;
    });

    setVisitorActivities((prev) => [
      {
        id: 'act-' + Date.now(),
        type: 'email',
        description: 'Admin sent email reply to inquirer',
        timestamp: 'Just now',
        userIpOrName: 'Topson Media',
      },
      ...prev,
    ]);
  };

  // Toggle Like on Feedback Item (persisted to Firestore)
  const handleToggleLikeFeedback = async (feedbackId: string) => {
    let newLikes = 0;
    setFeedbacks((prev) => {
      const updated = prev.map((fb) => {
        if (fb.id === feedbackId) {
          const currentlyLiked = !fb.userLiked;
          const currentCount = fb.likes ?? 0;
          newLikes = currentlyLiked ? currentCount + 1 : Math.max(0, currentCount - 1);
          return {
            ...fb,
            userLiked: currentlyLiked,
            likes: newLikes,
          };
        }
        return fb;
      });
      localStorage.setItem('topson_feedbacks', JSON.stringify(updated));
      return updated;
    });

    try {
      await toggleLikeFeedbackInDb(feedbackId, newLikes);
    } catch (err) {
      console.warn('Firestore toggleLike fallback:', err);
    }
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

  // Handle upload video (Admin only, persists to Firestore)
  const handleUploadVideo = async (newVid: VideoItem) => {
    const updated = [newVid, ...videoList];
    setVideoList(updated);
    localStorage.setItem('topson_videos', JSON.stringify(updated));

    try {
      await addVideoToDb(newVid);
    } catch (err) {
      console.warn('Firestore addVideo fallback:', err);
    }

    setVisitorActivities((prev) => [
      {
        id: 'act-' + Date.now(),
        type: 'watch',
        description: `Admin published new tutorial "${newVid.title}"`,
        timestamp: 'Just now',
        userIpOrName: 'Topson Media',
      },
      ...prev,
    ]);
  };

  // Handle delete video (Admin only, deletes from Firestore)
  const handleDeleteVideo = async (videoId: string) => {
    const updated = videoList.filter((v) => v.id !== videoId);
    setVideoList(updated);
    localStorage.setItem('topson_videos', JSON.stringify(updated));

    try {
      await deleteVideoFromDb(videoId);
    } catch (err) {
      console.warn('Firestore deleteVideo fallback:', err);
    }

    setVisitorActivities((prev) => [
      {
        id: 'act-' + Date.now(),
        type: 'watch',
        description: `Admin deleted tutorial`,
        timestamp: 'Just now',
        userIpOrName: 'Topson Media',
      },
      ...prev,
    ]);
  };

  // Handle update/edit video details (Admin only, updates Firestore)
  const handleUpdateVideo = async (updatedVid: VideoItem) => {
    const updated = videoList.map((v) => (v.id === updatedVid.id ? updatedVid : v));
    setVideoList(updated);
    localStorage.setItem('topson_videos', JSON.stringify(updated));

    try {
      await updateVideoInDb(updatedVid);
    } catch (err) {
      console.warn('Firestore updateVideo fallback:', err);
    }

    setVisitorActivities((prev) => [
      {
        id: 'act-' + Date.now(),
        type: 'watch',
        description: `Admin updated details for "${updatedVid.title}"`,
        timestamp: 'Just now',
        userIpOrName: 'Topson Media',
      },
      ...prev,
    ]);
  };

  // Handle user liking a video
  const handleToggleLikeVideo = async (videoId: string) => {
    const userId = currentUser?.id || 'guest-' + Date.now();
    setVideoList((prev) =>
      prev.map((vid) => {
        if (vid.id !== videoId) return vid;
        const likedBy = vid.likedBy || [];
        const isLiked = likedBy.includes(userId);
        const nextLikedBy = isLiked ? likedBy.filter((u) => u !== userId) : [...likedBy, userId];
        const nextLikes = Math.max(0, (vid.likes || 0) + (isLiked ? -1 : 1));
        return {
          ...vid,
          likes: nextLikes,
          likedBy: nextLikedBy,
        };
      })
    );

    try {
      await toggleLikeVideoInDb(videoId, userId);
    } catch (err) {
      console.warn('Firestore toggleLikeVideo fallback:', err);
    }
  };

  // Handle user adding comment to video
  const handleAddCommentToVideo = async (videoId: string, comment: VideoComment) => {
    setVideoList((prev) =>
      prev.map((vid) => {
        if (vid.id !== videoId) return vid;
        const comments = vid.comments || [];
        return {
          ...vid,
          comments: [comment, ...comments],
        };
      })
    );

    try {
      await addVideoCommentInDb(videoId, comment);
    } catch (err) {
      console.warn('Firestore addVideoComment fallback:', err);
    }
  };

  // Handle user watching/playing video to increment views
  const handleIncrementVideoViews = async (videoId: string) => {
    try {
      const updatedCount = await incrementVideoViewsInDb(videoId);
      setVideoList((prev) =>
        prev.map((vid) => {
          if (vid.id !== videoId) return vid;
          const formatted =
            updatedCount >= 1000
              ? `${(updatedCount / 1000).toFixed(1)}K views`
              : `${updatedCount} views`;
          return {
            ...vid,
            viewsCount: updatedCount,
            views: formatted,
          };
        })
      );
    } catch (err) {
      console.warn('Firestore incrementViews fallback:', err);
    }
  };

  // Handle user sending chat message (hits Firestore real-time collection)
  const handleSendMessage = async (msg: ChatMessage) => {
    const updated = [...chatMessages, msg];
    setChatMessages(updated);
    localStorage.setItem('topson_chat_messages', JSON.stringify(updated));

    try {
      await sendMessageToDb(msg);
    } catch (err) {
      console.warn('Firestore sendMessage fallback:', err);
    }
  };

  // Handle delete or un-send message (deletes from Firestore)
  const handleDeleteChatMessage = async (msgId: string, _mode: 'everyone' | 'me') => {
    setChatMessages((prev) => {
      const updated = prev.filter((m) => m.id !== msgId);
      localStorage.setItem('topson_chat_messages', JSON.stringify(updated));
      return updated;
    });

    try {
      await deleteMessageFromDb(msgId);
    } catch (err) {
      console.warn('Firestore deleteMessage fallback:', err);
    }
  };

  // Handle marking messages as read in Firestore
  const handleMarkMessagesRead = async (ids: string[]) => {
    setChatMessages((prev) => {
      const updated = prev.map((m) => (ids.includes(m.id) ? { ...m, isRead: true } : m));
      localStorage.setItem('topson_chat_messages', JSON.stringify(updated));
      return updated;
    });

    try {
      await markMessagesReadInDb(ids);
    } catch (err) {
      console.warn('Firestore markMessagesRead fallback:', err);
    }
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
    <div className="min-h-screen w-full overflow-x-hidden bg-white text-neutral-900 font-sans selection:bg-orange-500 selection:text-white flex flex-col justify-between relative">
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

        {/* Real Email Verification Success Toast */}
        {verificationToast?.show && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-lg w-[92%] animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="p-4 rounded-2xl bg-emerald-600 text-white shadow-xl shadow-emerald-900/20 border border-emerald-500 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">🎉</span>
                <p className="text-xs sm:text-sm font-bold leading-snug">
                  {verificationToast.message}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setVerificationToast(null)}
                className="p-1 hover:bg-emerald-700 rounded-lg text-white/80 hover:text-white transition-colors cursor-pointer shrink-0"
              >
                ✕
              </button>
            </div>
          </div>
        )}

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
                onDeleteVideo={handleDeleteVideo}
                onUpdateVideo={handleUpdateVideo}
                onLikeVideo={handleToggleLikeVideo}
                onAddComment={handleAddCommentToVideo}
                onIncrementViews={handleIncrementVideoViews}
              />

              {/* Community Feedback Section (Unified Card) */}
              <CommunitySection
                feedbacks={feedbacks}
                currentUser={currentUser}
                onOpenAuth={() => handleOpenAuth('signup')}
                onSubmitFeedback={handleAddFeedback}
                onToggleLikeFeedback={handleToggleLikeFeedback}
                onAddReplyFeedback={handleAddReplyFeedback}
                onDeleteFeedback={handleDeleteFeedback}
                onHideFeedback={handleHideFeedback}
              />

              {/* Live Chat Section */}
              <LiveChat
                currentUser={currentUser}
                onOpenAuth={() => handleOpenAuth('signin')}
                messages={chatMessages}
                onSendMessage={handleSendMessage}
                onMarkMessagesRead={handleMarkMessagesRead}
                onDeleteMessage={handleDeleteChatMessage}
              />

              {/* GET IN TOUCH Contact Section */}
              <ContactSection
                onJumpToChat={() => handleNavClick('chat')}
                onSendMessageToAdmin={handleSendMessageToAdmin}
              />
            </div>
          ) : (
            /* ADMIN CREATOR STUDIO (Exclusively for admin account) */
            <div className="animate-in fade-in">
              <AdminDashboard
                currentUser={currentUser}
                videos={videoList}
                feedbacks={feedbacks}
                emailMessages={emailMessages}
                visitorActivities={visitorActivities}
                totalVisitorsCount={totalVisitorsCount}
                chatMessages={chatMessages}
                onSendMessage={handleSendMessage}
                onDeleteChatMessage={handleDeleteChatMessage}
                onMarkMessagesRead={handleMarkMessagesRead}
                onUploadVideo={handleUploadVideo}
                onDeleteVideo={handleDeleteVideo}
                onUpdateVideo={handleUpdateVideo}
                onDeleteFeedback={handleDeleteFeedback}
                onHideFeedback={handleHideFeedback}
                onReplyEmailMessage={handleReplyEmailMessage}
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
