import React, { useState } from 'react';
import { Send, CheckCircle2, Mail, MessageSquare, Clock, Zap, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface ContactSectionProps {
  onJumpToChat: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onJumpToChat }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Question & Tutorial Request');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setSent(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
      setSent(false);
    }, 3500);
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
          <div className="lg:col-span-5 space-y-4">
            
            {/* Card 1: Direct Email Channel */}
            <div className="p-6 rounded-3xl bg-neutral-50 border border-neutral-200 shadow-2xs hover:border-orange-500/40 transition-all group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-200 flex items-center justify-center text-orange-500 shadow-2xs group-hover:scale-105 transition-transform shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                    Direct Email
                  </div>
                  <a
                    href="mailto:hello@topsonmedia.com"
                    className="text-base sm:text-lg font-black text-neutral-900 hover:text-orange-600 transition-colors block mt-0.5"
                  >
                    hello@topsonmedia.com
                  </a>
                  <p className="text-xs text-neutral-600 mt-1 font-medium leading-relaxed">
                    Personal inbox monitored daily for video suggestions, tech problem questions, and inquiries.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Interactive Live Chat Shortcut */}
            <div className="p-6 rounded-3xl bg-neutral-50 border border-neutral-200 shadow-2xs hover:border-orange-500/40 transition-all group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-200 flex items-center justify-center text-neutral-900 shadow-2xs group-hover:scale-105 transition-transform shrink-0">
                  <MessageSquare className="w-6 h-6 text-orange-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                      Real-time Option
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Instant
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-neutral-900 mt-0.5">
                    Jump into Live Chat
                  </h4>
                  <p className="text-xs text-neutral-600 mt-1 font-medium leading-relaxed mb-3">
                    Chat directly with Topson Media in the studio room above with fast responses.
                  </p>
                  <button
                    type="button"
                    onClick={onJumpToChat}
                    className="inline-flex items-center gap-2 text-xs font-bold text-neutral-900 hover:text-orange-600 cursor-pointer transition-colors"
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

          {/* Right Column (7 cols): Clean, Spacious Contact Card Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl p-6 sm:p-10 bg-white border border-neutral-200 shadow-sm relative">
              
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

              {sent ? (
                <div className="py-12 text-center space-y-3 animate-in fade-in">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-2xs">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-xl font-bold text-neutral-900">Message sent successfully!</h4>
                  <p className="text-xs sm:text-sm text-neutral-600 font-medium max-w-sm mx-auto leading-relaxed">
                    Thank you! Your question has been delivered. Topson will reply directly to your email address shortly.
                  </p>
                </div>
              ) : (
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
                        className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-colors shadow-2xs"
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
                        className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-colors shadow-2xs"
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
                      className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl bg-white border border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-colors shadow-2xs cursor-pointer"
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
                      className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-colors shadow-2xs"
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 text-xs sm:text-sm font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-all shadow-sm active:scale-98 cursor-pointer"
                    >
                      <span>Send email message</span>
                      <Send className="w-4 h-4 text-orange-500" />
                    </button>

                    <span className="text-[11px] text-neutral-500 font-medium">
                      All communications are private & secure.
                    </span>
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
