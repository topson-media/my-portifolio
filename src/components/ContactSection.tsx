import React, { useState } from 'react';
import { Send, CheckCircle2, Mail, MessageSquare, Clock, Zap, ArrowRight, ShieldCheck, Sparkles, Phone, AlertCircle } from 'lucide-react';
import { EmailMessage } from '../types';
import { addContactSubmissionToDb } from '../services/firebase';
import { WhatsAppIcon } from './WhatsAppIcon';

interface ContactSectionProps {
  onJumpToChat: () => void;
  onSendMessageToAdmin?: (message: EmailMessage) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onJumpToChat, onSendMessageToAdmin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Question & Tutorial Request');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmittedName, setLastSubmittedName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!name.trim() || !email.trim() || !message.trim() || isSubmitting) return;

    // Retain current scroll position strictly to prevent any erratic page jumping
    const lockedScrollY = window.scrollY;
    setIsSubmitting(true);
    const submittedName = name.trim();
    setLastSubmittedName(submittedName);

    try {
      // 1. Route and save directly into Firebase Firestore collection 'contact_submissions'
      const newSubmission = await addContactSubmissionToDb({
        senderName: submittedName,
        senderEmail: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
      });

      // 2. Notify parent state so Admin Dashboard can see the submission instantly
      if (onSendMessageToAdmin) {
        onSendMessageToAdmin(newSubmission);
      }

      // 3. Clear inputs smoothly and show neon-orange success alert
      setName('');
      setEmail('');
      setMessage('');
      setSent(true);

      // Lock scroll position strictly on current viewport
      requestAnimationFrame(() => {
        if (Math.abs(window.scrollY - lockedScrollY) > 20) {
          window.scrollTo({ top: lockedScrollY, behavior: 'instant' as ScrollBehavior });
        }
      });

      setTimeout(() => {
        setSent(false);
      }, 7000);
    } catch (err) {
      console.error('Contact submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact-form"
      className="min-h-screen lg:min-h-screen lg:h-screen w-full flex flex-col justify-center border-t border-neutral-200 bg-white scroll-mt-0 relative px-4 sm:px-6 lg:px-8 py-8 lg:py-6"
    >
      <div className="max-w-6xl mx-auto w-full">
        
        {/* Kicker */}
        <div className="text-[10px] font-bold tracking-widest uppercase text-neutral-500 mb-1">
          GET IN TOUCH
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-5 gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight leading-tight flex flex-wrap items-center gap-2">
              <span>Get in Touch via Email</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold">
                Direct Studio Inbox
              </span>
            </h2>
            <p className="text-xs text-neutral-600 mt-1 max-w-xl font-medium leading-relaxed">
              Have a tech question, tutorial idea, or collaboration request? Send us a direct email message or jump into live chat for an instant studio answer.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-[11px] font-bold text-neutral-900 shadow-2xs shrink-0 self-start md:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Replies within ~24 hours</span>
          </div>
        </div>

        {/* 2-Column Split: Centered Grid - 3 side cards on left, compact form on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
          
          {/* Left Column (5 cols): 3 side information cards */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-2.5">
            
            {/* Card 1: DIRECT EMAIL */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-neutral-50 border border-neutral-200/90 shadow-2xs hover:border-orange-500/40 transition-all group">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-orange-500 shadow-2xs group-hover:scale-105 transition-transform shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                    DIRECT EMAIL
                  </div>
                  <a
                    href="mailto:topsonkenedy@gmail.com"
                    className="text-xs sm:text-sm font-bold text-neutral-900 hover:text-orange-600 transition-colors block truncate"
                    title="Click to email Topson Media"
                  >
                    topsonkenedy@gmail.com
                  </a>
                  <p className="text-[10px] text-neutral-600 mt-0.5 leading-snug font-medium">
                    Personal inbox checked daily for tech inquiries & tutorial requests.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: WHATSAPP & PHONE with Authentic Vector WhatsApp Logo */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-neutral-50 border border-neutral-200/90 shadow-2xs hover:border-emerald-500/40 transition-all group">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#25D366] flex items-center justify-center text-white shadow-2xs group-hover:scale-105 transition-transform shrink-0">
                  <WhatsAppIcon className="w-4 h-4 fill-white" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                    WHATSAPP & PHONE
                  </div>
                  <a
                    href="https://wa.me/250794903078"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm font-bold text-neutral-900 hover:text-emerald-600 transition-colors block"
                  >
                    0794903078
                  </a>
                  <p className="text-[10px] text-neutral-600 mt-0.5 leading-snug font-medium">
                    Fast messaging & calling directly to Etienne Topson Kenedy.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3: REAL-TIME OPTION */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-neutral-50 border border-neutral-200/90 shadow-2xs hover:border-orange-500/40 transition-all group">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-orange-500 shadow-2xs group-hover:scale-105 transition-transform shrink-0">
                  <MessageSquare className="w-4 h-4 text-orange-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1.5 mb-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                      REAL-TIME OPTION
                    </span>
                    <span className="text-[8px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-full">
                      Instant
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-neutral-900">
                    Jump into Live Chat
                  </h4>
                  <p className="text-[10px] text-neutral-600 mt-0.5 mb-1.5 leading-snug font-medium">
                    Chat directly with Topson Media in the studio room.
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onJumpToChat();
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-900 hover:text-orange-600 cursor-pointer transition-colors"
                  >
                    <span>Open chat studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Commitments Grid */}
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <div className="p-2.5 rounded-xl bg-white border border-neutral-200 shadow-2xs flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span className="text-[11px] font-semibold text-neutral-800">
                  Fast response time
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-neutral-200 shadow-2xs flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="text-[11px] font-semibold text-neutral-800">
                  No spam guaranteed
                </span>
              </div>
            </div>

          </div>

          {/* Right Column (7 cols): Compact & Attractive Form Card */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl p-5 sm:p-7 bg-white border border-neutral-200 shadow-sm relative flex flex-col justify-between h-full">
              
              <div>
                <div className="mb-4 pb-3 border-b border-neutral-100 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-neutral-900">
                      Send an email message
                    </h3>
                    <p className="text-xs text-neutral-600 font-medium mt-0.5">
                      Fill in your question and get a personalized reply directly to your inbox.
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>

                {/* Sleek Neon-Orange Success Alert Banner */}
                {sent && (
                  <div className="mb-4 p-3 rounded-2xl bg-gradient-to-r from-orange-500/15 via-amber-500/10 to-orange-600/15 border-2 border-orange-500 text-neutral-900 shadow-[0_0_25px_rgba(249,115,22,0.3)] flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-orange-500/40">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-black text-neutral-900 flex items-center gap-2">
                        <span>Message sent successfully!</span>
                        <span className="px-1.5 py-0.2 rounded-full bg-orange-500 text-white text-[9px] font-extrabold uppercase">
                          Delivered
                        </span>
                      </h4>
                      <p className="text-[11px] text-neutral-700 mt-0.5 font-medium leading-tight truncate">
                        Thank you{lastSubmittedName ? `, ${lastSubmittedName}` : ''}! Topson will reply directly to your inbox.
                      </p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                  {/* Name and Email 2-column input row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-800 mb-1">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Morgan"
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-neutral-800 mb-1">
                        Your Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex@example.com"
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Subject Category Select */}
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-800 mb-1">
                      Subject Topic
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white border border-neutral-300 text-neutral-900 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all shadow-2xs cursor-pointer"
                    >
                      <option value="Question & Tutorial Request">Question & Tutorial Request</option>
                      <option value="Phone Optimization Help">Phone Optimization Help (Android / iPhone)</option>
                      <option value="PC & Laptop Troubleshooting">PC & Laptop Troubleshooting (Windows / Mac)</option>
                      <option value="Collaboration & Sponsorship">Collaboration & Sponsorship</option>
                      <option value="Other Inquiries">Other Inquiries</option>
                    </select>
                  </div>

                  {/* Message Input */}
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-800 mb-1">
                      Your Message or Question
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe your tech issue, question, or tutorial request in detail..."
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all shadow-2xs resize-none"
                    />
                  </div>

                  <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-all shadow-sm active:scale-98 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Send email message</span>
                          <Send className="w-3.5 h-3.5 text-orange-500" />
                        </>
                      )}
                    </button>

                    <span className="text-[10px] text-neutral-500 font-medium">
                      Saved directly to database & sent to Topson Media.
                    </span>
                  </div>
                </form>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

