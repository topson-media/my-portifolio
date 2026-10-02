import React, { useState, useRef } from 'react';
import {
  ShieldCheck,
  UploadCloud,
  ArrowLeft,
  CheckCircle,
  Link as LinkIcon,
  HardDrive,
  Film,
  Trash2,
  Mail,
  Send,
  Users,
  Activity,
  Eye,
  MessageSquare,
  Sparkles,
  Search,
  ExternalLink,
  Clock,
  KeyRound,
  Check,
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';
import { User, VideoItem, FeedbackItem, EmailMessage, VisitorActivity } from '../types';
import { TOPSON_PROFILE_IMAGE } from '../data/mockData';

interface AdminDashboardProps {
  currentUser: User | null;
  videos: VideoItem[];
  feedbacks: FeedbackItem[];
  emailMessages: EmailMessage[];
  visitorActivities: VisitorActivity[];
  totalVisitorsCount: number;
  onUploadVideo: (video: VideoItem) => void;
  onDeleteFeedback: (feedbackId: string) => void;
  onReplyEmailMessage: (emailId: string, replyText: string) => void;
  onAdminLogin: () => void;
  onNavigateHome: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  videos,
  feedbacks,
  emailMessages,
  visitorActivities,
  totalVisitorsCount,
  onUploadVideo,
  onDeleteFeedback,
  onReplyEmailMessage,
  onAdminLogin,
  onNavigateHome,
}) => {
  // Navigation tabs within Admin Studio
  const [activeTab, setActiveTab] = useState<'overview' | 'messages' | 'reviews' | 'upload' | 'security'>('overview');

  // Video upload state
  const [uploadType, setUploadType] = useState<'link' | 'device'>('link');
  const [videoLink, setVideoLink] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [deviceFilePreviewUrl, setDeviceFilePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [videoTitle, setVideoTitle] = useState('');
  const [videoCategory, setVideoCategory] = useState<'Dev Workflows' | 'Desk & Gear' | 'Full Stack'>('Dev Workflows');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoDuration, setVideoDuration] = useState('11:45');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Email replies state: map of emailId -> draft reply text
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [sendingReplyId, setSendingReplyId] = useState<string | null>(null);
  const [replySentSuccessId, setReplySentSuccessId] = useState<string | null>(null);

  const isAdmin = currentUser?.role === 'admin';

  const handleDeviceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      if (!videoTitle.trim()) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setVideoTitle(cleanName);
      }
      const previewUrl = URL.createObjectURL(file);
      setDeviceFilePreviewUrl(previewUrl);
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle.trim()) return;

    const categoryTag =
      videoCategory === 'Dev Workflows'
        ? 'Phone Mastery'
        : videoCategory === 'Desk & Gear'
        ? 'PC Performance'
        : 'Digital Skills';

    const newVid: VideoItem = {
      id: 'vid-' + Date.now(),
      title: videoTitle.trim(),
      category: videoCategory,
      duration: videoDuration.trim() || '10:00',
      views: '1.5K views',
      date: 'Just now',
      thumbnail: '/src/assets/images/thumb_ai_workflow_1790770861253.jpg',
      videoUrl: uploadType === 'link' ? videoLink.trim() : deviceFilePreviewUrl || '',
      sourceType: uploadType,
      description: videoDescription.trim() || `Practical guide on ${videoTitle.trim()}`,
      tags: [categoryTag, uploadType === 'device' ? 'From Device' : 'Web Link'],
    };

    onUploadVideo(newVid);
    setVideoTitle('');
    setVideoLink('');
    setSelectedFileName('');
    setDeviceFilePreviewUrl(null);
    setVideoDescription('');
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  const handleSendReply = (emailItem: EmailMessage) => {
    const draft = replyDrafts[emailItem.id]?.trim();
    if (!draft) return;

    setSendingReplyId(emailItem.id);

    setTimeout(() => {
      onReplyEmailMessage(emailItem.id, draft);
      setSendingReplyId(null);
      setReplySentSuccessId(emailItem.id);
      setReplyDrafts((prev) => ({ ...prev, [emailItem.id]: '' }));

      // Also trigger browser mailto client so it sends directly via real email
      const subjectEncoded = encodeURIComponent(`Re: ${emailItem.subject} [Topson Media]`);
      const bodyEncoded = encodeURIComponent(
        `Hi ${emailItem.senderName},\n\n${draft}\n\nBest regards,\nTopson Media\nChannel Creator`
      );
      window.open(`mailto:${emailItem.senderEmail}?subject=${subjectEncoded}&body=${bodyEncoded}`, '_blank');

      setTimeout(() => {
        setReplySentSuccessId(null);
      }, 3500);
    }, 400);
  };

  return (
    <div className="py-8 sm:py-12 bg-neutral-50/60 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb & Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-5 border-b border-neutral-200">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onNavigateHome}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-neutral-200 text-xs sm:text-sm font-bold text-neutral-800 hover:text-neutral-950 hover:border-neutral-300 transition-all shadow-2xs cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-orange-500" />
              <span>Back to Home</span>
            </button>
            <div className="h-4 w-px bg-neutral-300" />
            <h1 className="text-lg sm:text-xl font-black text-neutral-900 tracking-tight flex items-center gap-2">
              <span>Admin Creator Studio</span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
                Primary Control
              </span>
            </h1>
          </div>

          {isAdmin && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500 font-medium">Logged in as:</span>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-neutral-200 shadow-2xs">
                <div className="w-5 h-5 rounded-full overflow-hidden border border-orange-500">
                  <img src={TOPSON_PROFILE_IMAGE} alt="Admin" className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-bold text-neutral-900">Topson Media</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>
          )}
        </div>

        {isAdmin ? (
          /* ========================================================================= */
          /* ADMIN IS FULLY AUTHORIZED: ATTRACTIVE DASHBOARD SUITE                     */
          /* ========================================================================= */
          <div className="space-y-8 animate-in fade-in">
            
            {/* 1. METRICS & VISITOR OVERVIEW CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              
              {/* Traffic Overview Card with Total Visitors & Trend Indicator */}
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-white to-orange-50/30 border border-neutral-200 shadow-sm relative overflow-hidden group hover:border-orange-500/50 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                    Traffic Overview
                  </span>
                  <div className="w-9 h-9 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex items-baseline justify-between gap-2 mt-1">
                  <div className="text-3xl font-black text-neutral-900 tracking-tight">
                    {totalVisitorsCount.toLocaleString()}
                  </div>
                  {/* Trend Indicator */}
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold shrink-0">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    <span>+18.4%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-neutral-500 font-medium mt-2 pt-2 border-t border-neutral-100">
                  <span>vs. last 7 days</span>
                  <span className="text-neutral-800 font-bold">2.4k views/day</span>
                </div>
              </div>

              {/* Total Email Messages */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white border border-neutral-200 shadow-sm relative overflow-hidden group hover:border-orange-500/40 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Inbound Emails
                  </span>
                  <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
                  {emailMessages.length}
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-[11px] text-blue-600 font-bold">
                  <span>To: topsonkenedy@gmail.com</span>
                </div>
              </div>

              {/* Community Reviews */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white border border-neutral-200 shadow-sm relative overflow-hidden group hover:border-orange-500/40 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Feedbacks
                  </span>
                  <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
                  {feedbacks.length}
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-[11px] text-neutral-600 font-semibold">
                  <span>Full deletion control enabled</span>
                </div>
              </div>

              {/* Published Videos */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white border border-neutral-200 shadow-sm relative overflow-hidden group hover:border-orange-500/40 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Tutorials
                  </span>
                  <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Film className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
                  {videos.length}
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-[11px] text-neutral-600 font-semibold">
                  <span>Public gallery synced</span>
                </div>
              </div>

            </div>

            {/* 2. TAB CONTROLS */}
            <div className="flex items-center gap-2 border-b border-neutral-200 overflow-x-auto custom-scrollbar pb-2">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                  activeTab === 'overview'
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200'
                }`}
              >
                <Activity className="w-4 h-4 text-orange-500" />
                <span>Live Activity & Visitors</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('messages')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                  activeTab === 'messages'
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200'
                }`}
              >
                <Mail className="w-4 h-4 text-orange-500" />
                <span>Inbound Email Messages</span>
                {emailMessages.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-orange-500 text-white font-bold">
                    {emailMessages.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('reviews')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                  activeTab === 'reviews'
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-orange-500" />
                <span>Manage Community Feedbacks</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                  activeTab === 'upload'
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200'
                }`}
              >
                <UploadCloud className="w-4 h-4 text-orange-500" />
                <span>Upload New Tutorial</span>
              </button>
            </div>

            {/* 3. TAB CONTENT */}

            {/* TAB: LIVE ACTIVITY & VISITORS */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left 8 Cols: Real-time Activity Stream */}
                <div className="lg:col-span-8 rounded-3xl p-6 sm:p-8 bg-white border border-neutral-200 shadow-sm space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-neutral-900">
                        Live User Traffic & Actions
                      </h3>
                      <p className="text-xs text-neutral-600 font-medium">
                        Real-time visitor logs, tutorial watches, chat interactions, and inquiries.
                      </p>
                    </div>
                    <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      Live Stream
                    </span>
                  </div>

                  <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1 custom-scrollbar">
                    {visitorActivities.map((act) => (
                      <div
                        key={act.id}
                        className="p-3.5 rounded-2xl bg-neutral-50 hover:bg-neutral-100/70 border border-neutral-200/80 flex items-start gap-3 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-orange-500 shrink-0 shadow-2xs mt-0.5">
                          {act.type === 'visit' && <Users className="w-4 h-4 text-blue-500" />}
                          {act.type === 'watch' && <Film className="w-4 h-4 text-purple-500" />}
                          {act.type === 'comment' && <MessageSquare className="w-4 h-4 text-amber-500" />}
                          {act.type === 'chat' && <Sparkles className="w-4 h-4 text-orange-500" />}
                          {act.type === 'email' && <Mail className="w-4 h-4 text-emerald-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-neutral-900">
                              {act.userIpOrName || 'Visitor'}
                            </span>
                            <span className="text-[11px] text-neutral-600 font-semibold shrink-0">
                              {act.timestamp}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-600 font-medium mt-0.5">
                            {act.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right 4 Cols: Quick Creator Info & Quick Actions */}
                <div className="lg:col-span-4 space-y-5">
                  <div className="rounded-3xl p-6 bg-white border border-neutral-200 shadow-sm space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                      Channel Creator Status
                    </h4>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-orange-500 p-0.5 bg-white shrink-0">
                        <img src={TOPSON_PROFILE_IMAGE} alt="Topson Media" className="w-full h-full object-cover rounded-full" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-neutral-900">Topson Media</div>
                        <div className="text-xs text-neutral-600 font-medium">Administrator & Host</div>
                        <div className="text-[11px] text-emerald-600 font-bold mt-0.5">Verified Channels Owner</div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-neutral-100 space-y-2 text-xs">
                      <div className="flex justify-between text-neutral-600 font-medium">
                        <span>WhatsApp Contact:</span>
                        <span className="text-neutral-900 font-bold">0794903078</span>
                      </div>
                      <div className="flex justify-between text-neutral-600 font-medium">
                        <span>Receiving Email:</span>
                        <span className="text-neutral-900 font-bold">topsonkenedy@gmail.com</span>
                      </div>
                    </div>
                  </div>

                  {/* Switch to Upload */}
                  <div className="rounded-3xl p-6 bg-gradient-to-br from-neutral-900 to-neutral-800 text-white shadow-sm space-y-3">
                    <h4 className="text-sm font-black">Publish New Content</h4>
                    <p className="text-xs text-neutral-300 font-medium leading-relaxed">
                      Upload directly from your phone/PC or paste YouTube links to feature them instantly.
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('upload')}
                      className="w-full py-2.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                    >
                      <UploadCloud className="w-4 h-4" />
                      <span>Upload Tutorial Now</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* TAB: INBOUND EMAIL MESSAGES WITH REPLY CAPABILITY */}
            {activeTab === 'messages' && (
              <div className="rounded-3xl p-6 sm:p-8 bg-white border border-neutral-200 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
                  <div>
                    <h3 className="text-lg font-black text-neutral-900 flex items-center gap-2">
                      <span>Messages Sent to topsonkenedy@gmail.com</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold">
                        {emailMessages.length} received
                      </span>
                    </h3>
                    <p className="text-xs text-neutral-600 font-medium mt-0.5">
                      Messages submitted by visitors through the contact form are stored here and sent to your email. You can reply directly below.
                    </p>
                  </div>
                </div>

                {emailMessages.length === 0 ? (
                  <div className="py-12 text-center bg-neutral-50 rounded-2xl border border-neutral-200">
                    <Mail className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                    <p className="text-sm font-bold text-neutral-700">No email messages yet</p>
                    <p className="text-xs text-neutral-500 font-medium mt-1">
                      When visitors send emails from the contact section, they will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {emailMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className="rounded-2xl p-5 bg-neutral-50 border border-neutral-200 shadow-2xs space-y-4"
                      >
                        {/* Header: Sender details */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-200/80">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-black text-neutral-900">
                                {msg.senderName}
                              </span>
                              <span className="text-xs font-semibold text-neutral-500">
                                ({msg.senderEmail})
                              </span>
                            </div>
                            <div className="text-xs font-bold text-orange-600 mt-0.5">
                              Subject: {msg.subject}
                            </div>
                          </div>
                          <span className="text-xs text-neutral-500 font-medium self-start sm:self-auto">
                            {msg.timestamp}
                          </span>
                        </div>

                        {/* Body Message */}
                        <div className="text-xs sm:text-sm text-neutral-800 leading-relaxed whitespace-pre-wrap font-medium bg-white p-4 rounded-xl border border-neutral-200">
                          {msg.message}
                        </div>

                        {/* Thread Replies */}
                        {msg.replies && msg.replies.length > 0 && (
                          <div className="space-y-2 pl-4 border-l-2 border-orange-500">
                            <span className="text-[11px] font-bold text-neutral-500 uppercase">
                              Admin Replies Sent via Email:
                            </span>
                            {msg.replies.map((rep) => (
                              <div key={rep.id} className="p-3 bg-orange-50/60 rounded-xl border border-orange-200/60 text-xs">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <span className="font-bold text-orange-900">Topson Media (Admin)</span>
                                  <span className="text-[10px] text-neutral-500">{rep.timestamp}</span>
                                </div>
                                <p className="text-neutral-800 font-medium whitespace-pre-wrap">{rep.text}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Reply Form */}
                        <div className="pt-2">
                          <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                            Reply to {msg.senderName} (will send via email):
                          </label>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <textarea
                              rows={2}
                              value={replyDrafts[msg.id] ?? ''}
                              onChange={(e) =>
                                setReplyDrafts((prev) => ({ ...prev, [msg.id]: e.target.value }))
                              }
                              placeholder={`Type your reply to ${msg.senderEmail}...`}
                              className="flex-1 p-3 text-xs sm:text-sm rounded-xl bg-white border border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                            />
                            <button
                              type="button"
                              onClick={() => handleSendReply(msg)}
                              disabled={!replyDrafts[msg.id]?.trim() || sendingReplyId === msg.id}
                              className="px-5 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0 self-end sm:self-auto"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>{sendingReplyId === msg.id ? 'Sending...' : 'Send Reply'}</span>
                            </button>
                          </div>

                          {replySentSuccessId === msg.id && (
                            <div className="mt-2 text-xs font-bold text-emerald-600 flex items-center gap-1 animate-in fade-in">
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Reply recorded & email client dispatched to {msg.senderEmail}!</span>
                            </div>
                          )}
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: MANAGE COMMUNITY FEEDBACKS (WITH FULL DELETION CONTROL) */}
            {activeTab === 'reviews' && (
              <div className="rounded-3xl p-6 sm:p-8 bg-white border border-neutral-200 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
                  <div>
                    <h3 className="text-lg font-black text-neutral-900 flex items-center gap-2">
                      <span>Community Feedback Control</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                        {feedbacks.length} reviews
                      </span>
                    </h3>
                    <p className="text-xs text-neutral-600 font-medium mt-0.5">
                      As admin, you have full deletion rights over any inappropriate or outdated feedback.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {feedbacks.map((fb) => (
                    <div
                      key={fb.id}
                      className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/90 shadow-2xs flex flex-col justify-between gap-3 relative group"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2.5">
                            {fb.avatarUrl ? (
                              <img src={fb.avatarUrl} alt={fb.authorName} className="w-8 h-8 rounded-full object-cover" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-neutral-900 text-white font-bold text-xs flex items-center justify-center">
                                {fb.authorName.slice(0, 1)}
                              </div>
                            )}
                            <div>
                              <div className="text-xs font-bold text-neutral-900">{fb.authorName}</div>
                              <div className="text-[10px] text-neutral-500 font-medium">{fb.authorRole} · {fb.date}</div>
                            </div>
                          </div>

                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete review from "${fb.authorName}"?`)) {
                                onDeleteFeedback(fb.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
                            title="Delete this feedback"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-xs sm:text-sm text-neutral-800 font-medium leading-relaxed italic bg-white p-3 rounded-xl border border-neutral-200/80">
                          &ldquo;{fb.content}&rdquo;
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-neutral-500 font-medium pt-2 border-t border-neutral-200/60">
                        <span>Rating: {fb.rating}/5 stars</span>
                        <span>{fb.likes || 0} likes · {fb.replies?.length || 0} replies</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: UPLOAD NEW TUTORIAL */}
            {activeTab === 'upload' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Upload Form (7 cols) */}
                <div className="lg:col-span-7 rounded-3xl p-6 sm:p-8 bg-white border border-neutral-200 shadow-sm space-y-6">
                  <div>
                    <h3 className="text-lg font-black text-neutral-900">
                      Upload Video Tutorial
                    </h3>
                    <p className="text-xs text-neutral-600 font-medium mt-0.5">
                      Publish a new walkthrough directly from your phone/PC or paste an external link.
                    </p>
                  </div>

                  {uploadSuccess && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Video published successfully! It is now live in the tutorial section.</span>
                    </div>
                  )}

                  <form onSubmit={handleUpload} className="space-y-4">
                    {/* Method Toggle */}
                    <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-100 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setUploadType('link')}
                        className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          uploadType === 'link'
                            ? 'bg-white text-neutral-900 shadow-2xs'
                            : 'text-neutral-600 hover:text-neutral-950'
                        }`}
                      >
                        <LinkIcon className="w-3.5 h-3.5" />
                        <span>Paste Video Link</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setUploadType('device')}
                        className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          uploadType === 'device'
                            ? 'bg-white text-neutral-900 shadow-2xs'
                            : 'text-neutral-600 hover:text-neutral-950'
                        }`}
                      >
                        <HardDrive className="w-3.5 h-3.5" />
                        <span>Upload from Device</span>
                      </button>
                    </div>

                    {uploadType === 'link' ? (
                      <div>
                        <label className="block text-xs font-bold text-neutral-800 mb-1">
                          Video URL / Link
                        </label>
                        <input
                          type="url"
                          required
                          value={videoLink ?? ''}
                          onChange={(e) => setVideoLink(e.target.value)}
                          placeholder="https://youtube.com/watch?v=..."
                          className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-500 text-xs sm:text-sm focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-bold text-neutral-800 mb-1">
                          Video File from Device
                        </label>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="video/*,.mp4,.mov,.webm"
                          onChange={handleDeviceFileChange}
                          className="hidden"
                        />
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full p-4 rounded-xl border-2 border-dashed border-neutral-300 hover:border-neutral-500 bg-neutral-50 text-center cursor-pointer transition-colors"
                        >
                          <Film className="w-6 h-6 mx-auto mb-2 text-neutral-500" />
                          {selectedFileName ? (
                            <div className="text-xs font-bold text-neutral-900">
                              Selected file: {selectedFileName}
                            </div>
                          ) : (
                            <div>
                              <span className="text-xs font-bold text-neutral-900">
                                Click to choose video from phone or PC
                              </span>
                              <p className="text-[11px] text-neutral-500 mt-0.5">MP4, WebM, MOV supported</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-neutral-800 mb-1">
                        Tutorial Title
                      </label>
                      <input
                        type="text"
                        required
                        value={videoTitle ?? ''}
                        onChange={(e) => setVideoTitle(e.target.value)}
                        placeholder="Title of tutorial"
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-500 text-xs sm:text-sm focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-neutral-800 mb-1">
                          Category
                        </label>
                        <select
                          value={videoCategory ?? 'Dev Workflows'}
                          onChange={(e) => setVideoCategory(e.target.value as any)}
                          className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-neutral-900 text-xs sm:text-sm focus:outline-none focus:border-neutral-900"
                        >
                          <option value="Dev Workflows">Phone Mastery (Android/iOS)</option>
                          <option value="Desk & Gear">PC Performance (Win/Mac)</option>
                          <option value="Full Stack">Digital Skills & Tools</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-800 mb-1">
                          Duration
                        </label>
                        <input
                          type="text"
                          value={videoDuration ?? ''}
                          onChange={(e) => setVideoDuration(e.target.value)}
                          placeholder="10:30"
                          className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-neutral-900 text-xs sm:text-sm focus:outline-none focus:border-neutral-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-800 mb-1">
                        Description & Takeaways
                      </label>
                      <textarea
                        rows={2}
                        value={videoDescription ?? ''}
                        onChange={(e) => setVideoDescription(e.target.value)}
                        placeholder="Brief walkthrough summary"
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-500 text-xs sm:text-sm focus:outline-none focus:border-neutral-900"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 px-4 rounded-xl text-white font-bold text-xs sm:text-sm bg-neutral-900 hover:bg-neutral-800 transition-all shadow-sm active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <UploadCloud className="w-4 h-4 text-orange-500" />
                      <span>Publish Tutorial</span>
                    </button>
                  </form>
                </div>

                {/* Published Tutorials Feed (5 cols) */}
                <div className="lg:col-span-5 rounded-3xl p-6 sm:p-8 bg-white border border-neutral-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                    <h4 className="text-sm font-black text-neutral-900">
                      Live Gallery ({videos.length})
                    </h4>
                    <span className="text-xs font-bold text-orange-600">Active</span>
                  </div>

                  <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1 custom-scrollbar">
                    {videos.map((v) => (
                      <div
                        key={v.id}
                        className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-center gap-3"
                      >
                        <div className="w-14 h-9 rounded-xl overflow-hidden bg-neutral-950 shrink-0 relative">
                          <img
                            src={v.thumbnail}
                            alt={v.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-neutral-900 truncate">
                            {v.title}
                          </div>
                          <div className="text-[10px] text-neutral-600 flex items-center gap-1.5 mt-0.5 font-medium">
                            <span className="font-bold text-neutral-800">{v.duration}</span>
                            <span>·</span>
                            <span>{v.views}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>
        ) : (
          /* ========================================================================= */
          /* NOT LOGGED IN AS ADMIN: CLEAN SIGN IN GATEWAY                             */
          /* ========================================================================= */
          <div className="rounded-3xl p-8 sm:p-12 bg-white border border-neutral-200 shadow-sm text-center max-w-md mx-auto my-12 animate-in fade-in">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-200/60 flex items-center justify-center text-orange-500 mx-auto mb-4 shadow-2xs">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black text-neutral-900 mb-2">
              Admin Access Only
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 mb-6 font-medium leading-relaxed">
              Only the channel administrator can access the creator studio. Please sign in with your Admin credentials.
            </p>
            <button
              type="button"
              onClick={onAdminLogin}
              className="w-full py-3.5 px-6 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-neutral-900/10 cursor-pointer flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4 text-orange-500" />
              <span>Admin Sign In</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
