import React, { useState } from 'react';
import { Star, Lock, CheckCircle2, ChevronLeft, ChevronRight, Quote, ThumbsUp, MessageSquare, CornerDownRight, Send, Heart, User as UserIcon } from 'lucide-react';
import { FeedbackItem, FeedbackReply, User } from '../types';

interface CommunitySectionProps {
  feedbacks: FeedbackItem[];
  currentUser: User | null;
  onOpenAuth: () => void;
  onSubmitFeedback: (item: FeedbackItem) => void;
  onToggleLikeFeedback?: (feedbackId: string) => void;
  onAddReplyFeedback?: (feedbackId: string, reply: FeedbackReply) => void;
  isStandalonePage?: boolean;
}

export const CommunitySection: React.FC<CommunitySectionProps> = ({
  feedbacks,
  currentUser,
  onOpenAuth,
  onSubmitFeedback,
  onToggleLikeFeedback,
  onAddReplyFeedback,
  isStandalonePage = false,
}) => {
  const [name, setName] = useState<string>(currentUser?.username || '');
  const [role, setRole] = useState<string>('');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [message, setMessage] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);

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
      replies: [],
    };

    onSubmitFeedback(newFeedback);
    setMessage('');
    setSubmitted(true);
    setActiveIndex(0);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const currentFeedback = feedbacks[activeIndex] || feedbacks[0];

  const handlePrev = () => {
    setShowReplyBox(false);
    setActiveIndex((prev) => (prev === 0 ? feedbacks.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setShowReplyBox(false);
    setActiveIndex((prev) => (prev === feedbacks.length - 1 ? 0 : prev + 1));
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
            Genuine experiences from viewers and learners. Read, like, and reply in real time.
          </p>
        </div>

        {/* 2-Column Split: Unified Interactive Review Card on Left, Post Form on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column 1 (7 cols): THE UNIFIED REVIEWS CARD WITH OVER-CONTENT ICONS & REPLIES */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl p-6 sm:p-8 bg-white border border-neutral-200 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[460px]">
              
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
                <div className="pt-4 pb-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
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
                  </div>

                  <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                    Viewer Feedback
                  </span>
                </div>

                {/* 3. Feedback Body Content */}
                <div className="py-4 relative">
                  <Quote className="w-8 h-8 text-neutral-200 absolute top-2 left-0 -z-0 pointer-events-none" />
                  <p className="text-base sm:text-lg text-neutral-800 leading-relaxed italic relative z-10 pl-2 font-medium">
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
                          className="flex items-start gap-2.5 p-3 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-xs"
                        >
                          <CornerDownRight className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="font-bold text-neutral-900">
                                {rep.authorName}
                              </span>
                              <span className="text-[10px] text-neutral-500 font-medium">
                                {rep.date}
                              </span>
                            </div>
                            <p className="text-neutral-700 font-medium leading-relaxed">
                              {rep.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Inline Reply Form */}
                  {showReplyBox && (
                    <form onSubmit={handleReplySubmit} className="pt-2 animate-in fade-in">
                      <div className="flex items-center gap-2">
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
              <div className="pt-4 mt-4 border-t border-neutral-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-700 font-bold">
                    Review {activeIndex + 1} of {feedbacks.length}
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
                    {feedbacks.map((_, idx) => (
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

            </div>
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
                    {/* Star Rating Select */}
                    <div>
                      <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                        Your Rating
                      </label>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 text-amber-500 hover:scale-110 transition-transform cursor-pointer"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                star <= (hoverRating || rating)
                                    ? 'fill-amber-400 text-amber-400'
                                  : 'text-neutral-300'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="text-xs text-neutral-700 font-bold ml-2">
                          {rating} of 5 stars
                        </span>
                      </div>
                    </div>

                    {/* Author Name */}
                    <div>
                      <label className="block text-xs font-bold text-neutral-800 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
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
                        value={role}
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
                        value={message}
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
