import React, { useState } from 'react';
import { Star, Lock, CheckCircle2, ChevronLeft, ChevronRight, Quote, MessageSquare, Send, Heart, Trash2, Eye, EyeOff } from 'lucide-react';
import { FeedbackItem, FeedbackReply, User } from '../types';

interface CommunitySectionProps {
  feedbacks: FeedbackItem[];
  currentUser: User | null;
  onOpenAuth: () => void;
  onSubmitFeedback: (item: FeedbackItem) => void;
  onToggleLikeFeedback?: (feedbackId: string) => void;
  onAddReplyFeedback?: (feedbackId: string, reply: FeedbackReply) => void;
  onDeleteFeedback?: (feedbackId: string) => void;
  onHideFeedback?: (feedbackId: string, hidden: boolean) => void;
  isStandalonePage?: boolean;
}

export const CommunitySection: React.FC<CommunitySectionProps> = ({
  feedbacks,
  currentUser,
  onOpenAuth,
  onSubmitFeedback,
  onToggleLikeFeedback,
  onAddReplyFeedback,
  onDeleteFeedback,
  onHideFeedback,
  isStandalonePage = false,
}) => {
  const [name, setName] = useState<string>(currentUser?.username ?? '');
  const [role, setRole] = useState<string>('');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [message, setMessage] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // Filter out hidden reviews for regular visitors; Admin sees all
  const visibleFeedbacks = React.useMemo(() => {
    if (currentUser?.role === 'admin') return feedbacks;
    return feedbacks.filter((fb) => !fb.hidden);
  }, [feedbacks, currentUser]);

  // Sync author name if currentUser changes (e.g. login/logout)
  React.useEffect(() => {
    if (currentUser?.username) {
      setName(currentUser.username);
    }
  }, [currentUser?.username]);

  // Reset index if visible feedbacks change
  React.useEffect(() => {
    if (activeIndex >= visibleFeedbacks.length && visibleFeedbacks.length > 0) {
      setActiveIndex(0);
    }
  }, [visibleFeedbacks.length, activeIndex]);

  // Local state for replying to the current feedback
  const [replyText, setReplyText] = useState<string>('');
  const [showReplyBox, setShowReplyBox] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const author = name.trim() || currentUser?.username || 'Community Member';
    const newFeedback: FeedbackItem = {
      id: 'fb-' + Date.now(),
      authorName: author,
      authorHandle: `@${author.toLowerCase().replace(/\s+/g, '')}`,
      authorRole: role.trim() || 'Tech Enthusiast',
      avatarUrl: currentUser?.avatarUrl || '',
      rating,
      date: 'Just now',
      content: message.trim(),
      verified: true,
      likes: 0,
      userLiked: false,
      hidden: false,
      replies: [],
    };

    onSubmitFeedback(newFeedback);
    setMessage('');
    setSubmitted(true);
    setActiveIndex(0);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const currentFeedback = visibleFeedbacks[activeIndex] || visibleFeedbacks[0];

  const handlePrev = () => {
    setShowReplyBox(false);
    setActiveIndex((prev) => (prev === 0 ? visibleFeedbacks.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setShowReplyBox(false);
    setActiveIndex((prev) => (prev === visibleFeedbacks.length - 1 ? 0 : prev + 1));
  };

  const handleLikeClick = () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (onToggleLikeFeedback && currentFeedback) {
      onToggleLikeFeedback(currentFeedback.id);
    }
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !currentFeedback) return;
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    const newReply: FeedbackReply = {
      id: 'rep-' + Date.now(),
      authorName: currentUser.username,
      authorRole: currentUser.role === 'admin' ? 'Host / Creator' : 'Community Member',
      avatarUrl: currentUser.avatarUrl || '',
      content: replyText.trim(),
      date: 'Just now',
    };

    if (onAddReplyFeedback) {
      onAddReplyFeedback(currentFeedback.id, newReply);
    }
    setReplyText('');
    setShowReplyBox(false);
  };

  const likesCount = currentFeedback?.likes ?? 0;
  const isLiked = !!currentFeedback?.userLiked;
  const replies = currentFeedback?.replies || [];

  return (
    <section id="community" className={`py-16 sm:py-20 scroll-mt-20 ${!isStandalonePage ? 'border-t border-neutral-200' : ''} bg-white`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Kicker */}
        <div className="text-xs font-bold tracking-widest uppercase text-neutral-800 mb-6">
          COMMUNITY HUB {isStandalonePage ? '· ALL REVIEWS' : ''}
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 tracking-tight leading-[1.05]">
              Hear from the community
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-600 md:text-right max-w-sm font-medium">
            Genuine experiences from viewers and learners worldwide.
          </p>
        </div>

        {/* 2-Column Split: Unified Interactive Review Card on Left, Post Form on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column 1 (7 cols): THE UNIFIED REVIEWS CARD WITH OVER-CONTENT ICONS & REPLIES */}
          <div className="lg:col-span-7">
            {visibleFeedbacks.length === 0 ? (
              <div className="rounded-3xl p-10 bg-white border border-neutral-200 shadow-sm text-center flex flex-col items-center justify-center min-h-[340px] space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400">
                  <MessageSquare className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-black text-neutral-900">No reviews yet</h3>
                <p className="text-xs sm:text-sm text-neutral-600 max-w-sm mx-auto">
                  Be the first learner or viewer to share feedback on our tutorials and walkthroughs!
                </p>
                <div className="pt-2 text-xs font-semibold text-neutral-500">
                  {currentUser ? 'Submit your feedback using the form on the right.' : 'Sign in on the right to leave the first review.'}
                </div>
              </div>
            ) : (
              <div className="rounded-3xl p-6 sm:p-8 bg-white border border-neutral-200 shadow-sm relative overflow-hidden flex flex-col justify-between h-auto transition-all duration-300">
                
                <div>
                  {/* 1. Card Header: User Who Sent Feedback PROMINENTLY VISIBLE */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-neutral-200">
                    
                    {/* Visibly displays the user identity who sent the feedback */}
                    <div className="flex items-center gap-3.5">
                      {currentFeedback?.avatarUrl ? (
                        <img
                          src={currentFeedback.avatarUrl}
                          alt={currentFeedback.authorName}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-full object-cover border border-neutral-200 shadow-2xs"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-neutral-900 text-white font-bold flex items-center justify-center text-sm shadow-2xs">
                          {currentFeedback?.authorName ? currentFeedback.authorName.slice(0, 1).toUpperCase() : 'U'}
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-neutral-900">
                            {currentFeedback?.authorName}
                          </span>
                          {currentFeedback?.verified && (
                            <span title="Verified Member" className="inline-flex">
                              <CheckCircle2 className="w-4 h-4 text-orange-500" />
                            </span>
                          )}
                          {currentFeedback?.hidden && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                              Hidden from Public
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-neutral-600 font-medium">
                          <span>{currentFeedback?.authorRole || 'Community Member'}</span>
                          {currentFeedback?.authorHandle && (
                            <>
                              <span>·</span>
                              <span>{currentFeedback.authorHandle}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Rating & Date */}
                    <div className="flex flex-col sm:items-end">
                      <div className="flex items-center gap-1 text-amber-500">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= (currentFeedback?.rating || 5)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-neutral-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-neutral-600 font-semibold mt-1">
                        {currentFeedback?.date}
                      </span>
                    </div>
                  </div>

                  {/* 2. FEEDBACK ICONS OVER THE FEEDBACK CONTENTS */}
                  <div className="pt-4 pb-2 flex items-center justify-between gap-3 relative z-10 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Like / Unlike Button */}
                      <button
                        type="button"
                        onClick={handleLikeClick}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                          isLiked
                            ? 'bg-rose-50 text-rose-600 border-rose-200 shadow-2xs scale-102'
                            : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200 hover:text-rose-600'
                        }`}
                        title={isLiked ? 'Unlike this review' : 'Like this review'}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                        <span>{likesCount}</span>
                        <span className="hidden xs:inline">{isLiked ? 'Liked' : 'Like'}</span>
                      </button>

                      {/* Reply Action Button */}
                      <button
                        type="button"
                        onClick={() => {
                          if (!currentUser) {
                            onOpenAuth();
                            return;
                          }
                          setShowReplyBox(!showReplyBox);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border border-neutral-200 transition-colors cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-neutral-500" />
                        <span>{replies.length}</span>
                        <span className="hidden xs:inline">Replies</span>
                      </button>

                      {/* Admin Moderation Actions: Delete & Hide/Unhide */}
                      {currentUser?.role === 'admin' && currentFeedback && (
                        <div className="flex items-center gap-1.5">
                          {onHideFeedback && (
                            <button
                              type="button"
                              onClick={() => {
                                onHideFeedback(currentFeedback.id, !currentFeedback.hidden);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition-colors cursor-pointer"
                              title={currentFeedback.hidden ? "Unhide review" : "Hide review from public"}
                            >
                              {currentFeedback.hidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                              <span>{currentFeedback.hidden ? 'Unhide' : 'Hide'}</span>
                            </button>
                          )}

                          {onDeleteFeedback && (
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Delete review from "${currentFeedback.authorName}"?`)) {
                                  onDeleteFeedback(currentFeedback.id);
                                  if (activeIndex > 0) {
                                    setActiveIndex(activeIndex - 1);
                                  }
                                }
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors cursor-pointer"
                              title="Delete feedback permanently"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span className="hidden xs:inline">Delete</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                      Viewer Feedback
                    </span>
                  </div>

                  {/* 3. Feedback Body Content */}
                  <div className="pt-4 pb-3 relative min-h-[90px]">
                    <Quote className="w-10 h-10 text-neutral-100 absolute top-2 right-1 -z-0 pointer-events-none select-none opacity-80" />
                    <p className="text-base sm:text-lg text-neutral-800 leading-relaxed italic relative z-10 font-medium break-words">
                      &ldquo;{currentFeedback?.content}&rdquo;
                    </p>
                  </div>

                  {/* 4. Replies Thread List & Reply Composer */}
                  <div className="mt-2 space-y-3">
                    {replies.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-neutral-100 max-h-48 overflow-y-auto pr-1">
                        <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                          Thread replies ({replies.length}):
                        </div>
                        {replies.map((rep) => (
                          <div
                            key={rep.id}
                            className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/60 text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between font-bold text-neutral-800">
                              <span>{rep.authorName}</span>
                              <span className="text-[10px] text-neutral-400 font-normal">{rep.date}</span>
                            </div>
                            <p className="text-neutral-600 text-[11px] leading-relaxed">
                              {rep.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Inline Reply Form */}
                    {showReplyBox && (
                      <form onSubmit={handleReplySubmit} className="pt-2 animate-in fade-in">
                        <div className="flex items-center gap-2">
                          {currentUser && (
                            <div className="w-7 h-7 rounded-full overflow-hidden border border-neutral-300 shrink-0 shadow-2xs">
                              {currentUser.avatarUrl ? (
                                <img src={currentUser.avatarUrl} alt={currentUser.username} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-neutral-900 text-white text-[10px] font-bold flex items-center justify-center">
                                  {currentUser.username.slice(0, 1).toUpperCase()}
                                </div>
                              )}
                            </div>
                          )}
                          <input
                            type="text"
                            required
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder={`Reply to ${currentFeedback?.authorName}...`}
                            className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:border-neutral-900"
                          />
                          <button
                            type="submit"
                            disabled={!replyText.trim()}
                            className="px-4 py-2 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                          >
                            <span>Reply</span>
                            <Send className="w-3 h-3" />
                          </button>
                        </div>
                      </form>
                    )}
                  </div>

                </div>

                {/* Card Footer: Interactive Navigator */}
                {visibleFeedbacks.length > 1 && (
                  <div className="pt-4 mt-4 border-t border-neutral-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-neutral-700 font-bold">
                        Review {activeIndex + 1} of {visibleFeedbacks.length}
                      </span>
                    </div>

                    {/* Arrow Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="p-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-700 transition-colors cursor-pointer"
                        aria-label="Previous review"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      {/* Dot Indicators */}
                      <div className="hidden sm:flex items-center gap-1.5 px-2">
                        {visibleFeedbacks.map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setShowReplyBox(false);
                              setActiveIndex(idx);
                            }}
                            className={`h-2 rounded-full transition-all cursor-pointer ${
                              activeIndex === idx
                                ? 'w-6 bg-neutral-900'
                                : 'w-2 bg-neutral-300 hover:bg-neutral-400'
                            }`}
                            aria-label={`Jump to review ${idx + 1}`}
                          />
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={handleNext}
                        className="p-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-700 transition-colors cursor-pointer"
                        aria-label="Next review"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>

          {/* Column 2 (5 cols): Submit Feedback Form with clean, visible inputs */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl p-6 sm:p-8 bg-white border border-neutral-200 shadow-sm">
              <h3 className="text-xl font-bold text-neutral-900 mb-1">
                Leave your review
              </h3>
              <p className="text-xs text-neutral-600 mb-6 font-medium">
                Share how a phone or PC tutorial helped you out.
              </p>

              {currentUser ? (
                submitted ? (
                  <div className="py-8 text-center space-y-2 animate-in fade-in">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-bold text-neutral-900">Review published!</h4>
                    <p className="text-xs text-neutral-600 font-medium">
                      Your feedback is now live on the community card.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Logged in User Profile Info */}
                    <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-neutral-50 border border-neutral-200">
                      <div className="w-9 h-9 rounded-full overflow-hidden border border-neutral-300 bg-white shrink-0 shadow-2xs">
                        {currentUser.avatarUrl ? (
                          <img
                            src={currentUser.avatarUrl}
                            alt={currentUser.username}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <div className="w-full h-full bg-neutral-900 text-white font-bold text-xs flex items-center justify-center">
                            {currentUser.username.slice(0, 1).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-neutral-900 truncate">
                          Posting as {currentUser.username}
                        </div>
                        <div className="text-[10px] text-neutral-500 font-medium truncate">
                          {currentUser.email}
                        </div>
                      </div>
                    </div>

                    {/* Rating stars */}
                    <div>
                      <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                        Your Rating
                      </label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 text-neutral-300 hover:text-amber-400 transition-colors cursor-pointer"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                star <= (hoverRating || rating)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-neutral-300'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="text-xs font-bold text-neutral-700 ml-2">
                          {rating} / 5 stars
                        </span>
                      </div>
                    </div>

                    {/* Display name */}
                    <div>
                      <label className="block text-xs font-bold text-neutral-800 mb-1">
                        Display Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name ?? ''}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-white border border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                      />
                    </div>

                    {/* Role / Profession */}
                    <div>
                      <label className="block text-xs font-bold text-neutral-800 mb-1">
                        Your Role / Device
                      </label>
                      <input
                        type="text"
                        value={role ?? ''}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="e.g. Android User, Student, Developer"
                        className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-white border border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                      />
                    </div>

                    {/* Review text */}
                    <div>
                      <label className="block text-xs font-bold text-neutral-800 mb-1">
                        Your Feedback
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={message ?? ''}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Write your review..."
                        className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-white border border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 font-bold text-xs sm:text-sm text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-all shadow-sm active:scale-98 cursor-pointer"
                    >
                      Post Review
                    </button>
                  </form>
                )
              ) : (
                <div className="py-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 mx-auto mb-3">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-neutral-900 mb-1">
                    Sign in to leave feedback
                  </h4>
                  <p className="text-xs text-neutral-600 font-medium mb-4">
                    Join the community to post your review on the card.
                  </p>
                  <button
                    type="button"
                    onClick={onOpenAuth}
                    className="px-5 py-2 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-all cursor-pointer"
                  >
                    Sign in / Sign up
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
