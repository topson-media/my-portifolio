import React, { useState } from 'react';
import { Send, CheckCircle2, Mail, MessageSquare, Clock, Zap, ArrowRight, ShieldCheck, Sparkles, Phone, AlertCircle } from 'lucide-react';
import { EmailMessage } from '../types';
import { addContactSubmissionToDb } from '../services/firebase';

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
    <section id="contact-form" className="py-16 sm:py-24 scroll-mt-20 border-t border-neutral-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Kicker */}
        <div className="text-xs font-bold tracking-widest uppercase text-neutral-800 mb-6">
          GET IN TOUCH
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 tracking-tight leading-[1.05]">
              contact us .ask .get right all on email
            </h2>
            <p className="text-sm sm:text-base text-neutral-700 mt-3 max-w-2xl font-normal leading-relaxed">
              Have a tech question, tutorial idea, or collaboration request? Send us a direct email message or jump into live chat for an instant studio answer.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-bold text-neutral-900 shadow-2xs shrink-0 self-start md:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Replies within ~24 hours</span>
          </div>
        </div>

        {/* 2-Column Split: Well-Arranged Contact Methods on Left, Crisp Form on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column (5 cols): Organized Channels & Quick Cards */}
          <div className="lg:col-span-5 space-y-3">
            
            {/* Card 1: Direct Email Channel */}
            <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50 border border-neutral-200/90 shadow-2xs hover:border-orange-500/40 transition-all group">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-orange-500 shadow-2xs group-hover:scale-105 transition-transform shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                    Direct Email
                  </div>
                  <a
                    href="mailto:topsonkenedy@gmail.com"
                    className="text-sm sm:text-base font-bold text-neutral-900 hover:text-orange-600 transition-colors block"
                    title="Click to email Topson Media"
                  >
                    mail topson media
                  </a>
                  <p className="text-[11px] text-neutral-600 mt-0.5 leading-snug font-medium">
                    Personal inbox checked daily for questions & suggestions.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: WhatsApp & Direct Phone */}
            <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50 border border-neutral-200/90 shadow-2xs hover:border-emerald-500/40 transition-all group">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#25D366] flex items-center justify-center text-white shadow-2xs group-hover:scale-105 transition-transform shrink-0">
                  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.983.538 1.848.814 2.791.814 3.182 0 5.768-2.587 5.769-5.766.001-3.182-2.585-5.8-5.77-5.8zm3.385 8.214c-.141.398-.718.73-1.009.774-.282.043-.645.068-1.047-.061-.403-.129-.929-.304-1.603-.601-1.396-.615-2.3-2.029-2.37-2.122-.07-.093-.568-.756-.568-1.442 0-.685.358-1.022.486-1.163.128-.141.28-.176.374-.176.094 0 .188.001.27.006.088.005.205-.033.32.245.118.283.403.985.438 1.057.036.071.059.155.012.248-.047.094-.07.153-.14.236-.07.082-.149.183-.212.246-.071.07-.145.146-.062.289.083.142.368.608.79 0.984.544.485 1.003.636 1.145.706.142.071.225.059.309-.035.083-.094.356-.414.451-.556.094-.141.189-.118.318-.071.129.047.82.386.961.457.142.07.236.106.271.165.035.059.035.341-.106.739zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.66 1.434 5.176L2 22l4.957-1.399C8.423 21.493 10.155 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                    WhatsApp & Phone
                  </div>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.whatsapp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm sm:text-base font-bold text-neutral-900 hover:text-emerald-600 transition-colors block"
                  >
                    0794903078
                  </a>
                  <p className="text-[11px] text-neutral-600 mt-0.5 leading-snug font-medium">
                    Fast messaging & calling for tech advice.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3: Interactive Live Chat Shortcut */}
            <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50 border border-neutral-200/90 shadow-2xs hover:border-orange-500/40 transition-all group">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-orange-500 shadow-2xs group-hover:scale-105 transition-transform shrink-0">
                  <MessageSquare className="w-5 h-5 text-orange-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1.5 mb-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                      Real-time Option
                    </span>
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                      Instant
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-neutral-900">
                    Jump into Live Chat
                  </h4>
                  <p className="text-[11px] text-neutral-600 mt-0.5 mb-2 leading-snug font-medium">
                    Chat directly with Topson Media in the studio room.
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
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
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-2xs flex items-center gap-3">
                <Clock className="w-4 h-4 text-orange-500 shrink-0" />
                <span className="text-xs font-semibold text-neutral-800">
                  Fast response time
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-2xs flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-semibold text-neutral-800">
                  No spam guaranteed
                </span>
              </div>
            </div>

          </div>

          {/* Right Column (7 cols): Clean, Spacious Contact Card Form with Stable Height */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl p-6 sm:p-10 bg-white border border-neutral-200 shadow-sm relative min-h-[460px] flex flex-col justify-between">
              
              <div>
                <div className="mb-6 pb-4 border-b border-neutral-100 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900">
                      Send an email message
                    </h3>
                    <p className="text-xs text-neutral-600 font-medium mt-0.5">
                      Fill in your question and get a personalized reply directly to your inbox.
                    </p>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>

                {/* Neon-Orange Success Alert Banner */}
                {sent && (
                  <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-orange-500/15 via-amber-500/10 to-orange-600/15 border-2 border-orange-500 text-neutral-900 shadow-[0_0_30px_rgba(249,115,22,0.35)] flex items-center gap-3.5 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/40">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-black text-neutral-900 flex items-center gap-2">
                        <span>Message sent successfully!</span>
                        <span className="px-2 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-extrabold uppercase tracking-wider">
                          Delivered
                        </span>
                      </h4>
                      <p className="text-xs text-neutral-700 mt-0.5 font-medium leading-relaxed">
                        Thank you{lastSubmittedName ? `, ${lastSubmittedName}` : ''}! Your message has been saved to the database. Topson will reply directly to your email shortly.
                      </p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name and Email 2-column input row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Morgan"
                        className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                        Your Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex@example.com"
                        className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Subject Category Select */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                      Subject Topic
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl bg-white border border-neutral-300 text-neutral-900 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all shadow-2xs cursor-pointer"
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
                    <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                      Your Message or Question
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe your tech issue, question, or tutorial request in detail..."
                      className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all shadow-2xs"
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 text-xs sm:text-sm font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-all shadow-sm active:scale-98 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Send email message</span>
                          <Send className="w-4 h-4 text-orange-500" />
                        </>
                      )}
                    </button>

                    <span className="text-[11px] text-neutral-500 font-medium">
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
