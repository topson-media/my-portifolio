import React, { useState } from 'react';
import { Star, Lock, CheckCircle2, Quote, MessageSquare, Send, Heart, Trash2, Eye, EyeOff, Plus, X } from 'lucide-react';
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
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  // Track active reply boxes per feedback id
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});

  // Filter out hidden reviews for regular visitors; Admin sees all
  const visibleFeedbacks = React.useMemo(() => {
    if (currentUser?.role === 'admin') return feedbacks;
    return feedbacks.filter((fb) => !fb.hidden);
  }, [feedbacks, currentUser]);

  // Sync author name if currentUser changes
  React.useEffect(() => {
    if (currentUser?.username) {
      setName(currentUser.username);
    }
  }, [currentUser?.username]);

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
    setTimeout(() => {
      setSubmitted(false);
      setIsFormOpen(false);
    }, 2000);
  };

  const handleLikeClick = (feedbackId: string) => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (onToggleLikeFeedback) {
      onToggleLikeFeedback(feedbackId);
    }
  };

  const handleReplySubmit = (feedbackId: string, e: React.FormEvent) => {
    e.preventDefault();
    const replyText = replyTextMap[feedbackId];
    if (!replyText?.trim()) return;
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
      onAddReplyFeedback(feedbackId, newReply);
    }
    setReplyTextMap((prev) => ({ ...prev, [feedbackId]: '' }));
    setActiveReplyId(null);
  };

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
            <p className="text-xs sm:text-sm text-neutral-600 mt-1 font-medium">
              Genuine experiences from viewers and learners worldwide.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (!currentUser) {
                  onOpenAuth();
                } else {
                  setIsFormOpen(!isFormOpen);
                }
              }}
              className="h-12 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-neutral-900 hover:bg-neutral-800 active:scale-95 transition-all shadow-sm flex items-center gap-2 cursor-pointer shrink-0"
            >
              {isFormOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4 text-orange-500" />}
              <span>{isFormOpen ? 'Close Form' : 'Leave your review'}</span>
            </button>
          </div>
        </div>

        {/* Expandable Review Form Box */}
        {isFormOpen && (
          <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-neutral-50 border border-neutral-200/80 shadow-md animate-in fade-in max-w-2xl mx-auto">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-200">
              <h3 className="text-lg font-bold text-neutral-900">
                Share your experience
              </h3>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitted ? (
              <div className="py-6 text-center space-y-2 animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-neutral-900">Review published!</h4>
                <p className="text-xs text-neutral-600 font-medium">
                  Your feedback is now visible in the community showcase below.
                </p>
              </div>
            ) : currentUser ? (
              <form onSubmit={handleSubmit} className="space-y-4">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full h-11 px-3.5 text-xs rounded-xl bg-white border border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-1">
                      Your Role or Device
                    </label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. Android User, Learner"
                      className="w-full h-11 px-3.5 text-xs rounded-xl bg-white border border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Your Feedback
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe how a phone or PC tutorial helped you..."
                    className="w-full p-3 text-xs rounded-xl bg-white border border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-900 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-12 py-3 px-4 font-bold text-xs sm:text-sm text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-all shadow-sm active:scale-98 cursor-pointer"
                >
                  Post Review
                </button>
              </form>
            ) : (
              <div className="py-6 text-center space-y-3">
                <Lock className="w-8 h-8 text-neutral-400 mx-auto" />
                <p className="text-xs text-neutral-600">Please sign in to submit feedback.</p>
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="h-11 px-5 rounded-xl bg-neutral-900 text-white text-xs font-bold cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        )}

        {/* 3. AUTOMATIC MULTI-COLUMN COMPACT GRID (1 col mobile, 3 col tablet & desktop) */}
        {visibleFeedbacks.length === 0 ? (
          <div className="rounded-3xl p-10 bg-white border border-neutral-200 shadow-sm text-center flex flex-col items-center justify-center min-h-[260px] space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400">
              <MessageSquare className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black text-neutral-900">No reviews yet</h3>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-sm mx-auto">
              Be the first learner or viewer to share feedback on our tutorials and walkthroughs!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 w-full">
            {visibleFeedbacks.map((fb) => {
              const isLiked = !!fb.userLiked;
              const likesCount = fb.likes || 0;
              const replies = fb.replies || [];
              const isReplying = activeReplyId === fb.id;
              const currentReplyText = replyTextMap[fb.id] || '';

              return (
                <div
                  key={fb.id}
                  className="w-full group rounded-3xl p-4 sm:p-6 bg-white border border-neutral-200/90 shadow-[0_4px_20px_rgba(249,115,22,0.12)] hover:shadow-[0_6px_28px_rgba(249,115,22,0.2)] hover:border-orange-500/40 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Author Identity & Rating (Centered on mobile per design spec) */}
                    <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left justify-between gap-2.5 sm:gap-3 pb-3 border-b border-neutral-100">
                      <div className="flex flex-col items-center sm:flex-row sm:items-center gap-2 sm:gap-3 min-w-0">
                        {fb.avatarUrl ? (
                          <img
                            src={fb.avatarUrl}
                            alt={fb.authorName}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-full object-cover border-2 border-orange-500/40 shrink-0 shadow-2xs"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-neutral-900 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs ring-2 ring-orange-500/30">
                            {fb.authorName.slice(0, 1).toUpperCase()}
                          </div>
                        )}

                        <div className="min-w-0">
                          <div className="flex items-center justify-center sm:justify-start gap-1.5">
                            <span className="text-xs sm:text-sm font-bold text-neutral-900 truncate">
                              {fb.authorName}
                            </span>
                            {fb.verified && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                            )}
                          </div>
                          <div className="text-[10px] sm:text-[11px] text-neutral-500 font-medium truncate">
                            {fb.authorRole || 'Community Member'}
                          </div>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-0.5 text-amber-400 shrink-0">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              star <= (fb.rating || 5)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-neutral-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Content Quote (Shrunk font on mobile) */}
                    <div className="pt-3 pb-2 relative text-center sm:text-left">
                      <Quote className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-200/60 absolute -top-1 left-0 sm:-left-1 -z-0 pointer-events-none" />
                      <p className="text-[11px] sm:text-sm text-neutral-800 leading-relaxed font-normal relative z-10 break-words px-1 sm:px-0">
                        &ldquo;{fb.content}&rdquo;
                      </p>
                    </div>

                    {/* Replies Thread (if any) */}
                    {replies.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-neutral-100 space-y-1.5 max-h-36 overflow-y-auto">
                        <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                          Replies ({replies.length})
                        </div>
                        {replies.map((rep) => (
                          <div
                            key={rep.id}
                            className="p-2 rounded-xl bg-neutral-50 border border-neutral-200/60 text-[11px] space-y-0.5"
                          >
                            <div className="flex items-center justify-between font-bold text-neutral-800">
                              <span>{rep.authorName}</span>
                              <span className="text-[9px] text-neutral-400 font-normal">{rep.date}</span>
                            </div>
                            <p className="text-neutral-600 leading-snug">{rep.content}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Inline Reply Input Form */}
                    {isReplying && (
                      <form
                        onSubmit={(e) => handleReplySubmit(fb.id, e)}
                        className="mt-3 pt-2 border-t border-neutral-100 animate-in fade-in"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            required
                            value={currentReplyText}
                            onChange={(e) =>
                              setReplyTextMap((prev) => ({ ...prev, [fb.id]: e.target.value }))
                            }
                            placeholder="Write a reply..."
                            className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900"
                          />
                          <button
                            type="submit"
                            disabled={!currentReplyText.trim()}
                            className="px-3 py-1.5 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 rounded-xl transition-all cursor-pointer shrink-0"
                          >
                            <Send className="w-3 h-3" />
                          </button>
                        </div>
                      </form>
                    )}
                  </div>

                  {/* Card Footer Actions */}
                  <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {/* Like button */}
                      <button
                        type="button"
                        onClick={() => handleLikeClick(fb.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                          isLiked
                            ? 'bg-rose-50 text-rose-600 border border-rose-200'
                            : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-600 border border-neutral-200'
                        }`}
                      >
                        <Heart className={`w-3 h-3 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                        <span>{likesCount}</span>
                      </button>

                      {/* Reply button */}
                      <button
                        type="button"
                        onClick={() => {
                          if (!currentUser) {
                            onOpenAuth();
                            return;
                          }
                          setActiveReplyId(isReplying ? null : fb.id);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-50 hover:bg-neutral-100 text-neutral-600 border border-neutral-200 transition-colors cursor-pointer"
                      >
                        <MessageSquare className="w-3 h-3 text-neutral-500" />
                        <span>{replies.length}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-neutral-400 font-medium">
                        {fb.date}
                      </span>

                      {/* Admin moderation */}
                      {currentUser?.role === 'admin' && (
                        <div className="flex items-center gap-1">
                          {onHideFeedback && (
                            <button
                              type="button"
                              onClick={() => onHideFeedback(fb.id, !fb.hidden)}
                              className="p-1 rounded-md text-neutral-500 hover:text-amber-600 hover:bg-neutral-100 cursor-pointer"
                              title={fb.hidden ? 'Unhide' : 'Hide'}
                            >
                              {fb.hidden ? <Eye className="w-3.5 h-3.5 text-amber-600" /> : <EyeOff className="w-3.5 h-3.5" />}
                            </button>
                          )}
                          {onDeleteFeedback && (
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Delete review from "${fb.authorName}"?`)) {
                                  onDeleteFeedback(fb.id);
                                }
                              }}
                              className="p-1 rounded-md text-neutral-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-500" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
