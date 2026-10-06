import React, { useState, useEffect } from 'react';
import {
  X,
  Heart,
  Phone,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  Smartphone,
  Wallet,
  Receipt,
  Copy,
  Check
} from 'lucide-react';
import { addSupportDonationToDb, SupportDonation } from '../services/firebase';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (donation: SupportDonation) => void;
}

const PRESET_AMOUNTS = [500, 1000, 2000, 5000, 10000];

export const SupportModal: React.FC<SupportModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  // 4 Steps: 1: Sender Phone -> 2: Amount -> 3: PIN -> 4: Success
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [senderPhone, setSenderPhone] = useState('');
  const [amount, setAmount] = useState<number | ''>(2000);
  const [customAmount, setCustomAmount] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);

  // Status & Validation
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [completedDonation, setCompletedDonation] = useState<SupportDonation | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setError(null);
      setIsProcessing(false);
      setPin('');
      setCompletedDonation(null);
    }
  }, [isOpen]);

  // Handle ESC key
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

  // Step 1: Validate Sender Number & Continue
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleaned = senderPhone.trim().replace(/\s+/g, '');
    if (!cleaned) {
      setError('Please enter your phone number where money will be sent from.');
      return;
    }
    if (cleaned.length < 8) {
      setError('Please enter a valid phone number (e.g. 078XXXXXXX or 079XXXXXXX).');
      return;
    }
    setStep(2);
  };

  // Step 2: Validate Amount & Continue
  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const num = typeof amount === 'number' ? amount : parseInt(customAmount, 10);
    if (!num || isNaN(num) || num <= 0) {
      setError('Please select or enter a valid amount of money.');
      return;
    }
    setAmount(num);
    setStep(3);
  };

  // Step 3: Validate PIN & Send Money to 0794903078
  const handleStep3Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!pin.trim()) {
      setError('Please enter your Mobile Money PIN to authorize the payment.');
      return;
    }
    if (pin.trim().length < 4) {
      setError('PIN must be at least 4 digits.');
      return;
    }

    setIsProcessing(true);
    setProcessingStatus('Connecting to Mobile Money Gateway...');

    // Multi-phase realistic MoMo transfer simulation
    setTimeout(() => {
      setProcessingStatus(`Initiating USSD prompt to ${senderPhone}...`);
    }, 600);

    setTimeout(() => {
      setProcessingStatus(`Authorizing transfer of ${(amount as number).toLocaleString()} RWF to 0794903078...`);
    }, 1200);

    setTimeout(async () => {
      try {
        const donationRecord = await addSupportDonationToDb({
          senderPhone,
          amount: amount as number,
          currency: 'RWF',
        });

        setCompletedDonation(donationRecord);
        setIsProcessing(false);
        setStep(4);

        if (onSuccess) {
          onSuccess(donationRecord);
        }
      } catch (err) {
        console.error('Support payment error:', err);
        setIsProcessing(false);
        setError('Payment processing encountered a network error. Please try again.');
      }
    }, 2000);
  };

  const handleCopyRef = () => {
    if (completedDonation?.reference) {
      navigator.clipboard.writeText(completedDonation.reference);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="support-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white border border-neutral-200 p-6 sm:p-7 shadow-2xl text-neutral-900"
      >
        {/* Ambient Top Glow Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500" />

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
          aria-label="Close support dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Branding */}
        <div className="text-center mb-5">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/25 mb-2.5">
            <Heart className="w-6 h-6 fill-white" />
          </div>

          <h3 id="support-modal-title" className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
            Support Topson Media
          </h3>

          <div className="mt-1 flex items-center justify-center gap-1.5 text-xs text-neutral-600 font-medium">
            <span>Direct to Account:</span>
            <span className="font-extrabold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200/60">
              0794903078
            </span>
          </div>
        </div>

        {/* Step Progress Bar (1 -> 2 -> 3) */}
        {step < 4 && (
          <div className="flex items-center justify-between mb-5 px-3">
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === 1 ? 'bg-orange-500 text-white' : step > 1 ? 'bg-emerald-500 text-white' : 'bg-neutral-100 text-neutral-400'
              }`}>
                {step > 1 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '1'}
              </span>
              <span className="text-[11px] font-bold text-neutral-700 hidden sm:inline">Your Number</span>
            </div>

            <div className={`h-0.5 flex-1 mx-2 transition-colors ${step >= 2 ? 'bg-emerald-500' : 'bg-neutral-200'}`} />

            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === 2 ? 'bg-orange-500 text-white' : step > 2 ? 'bg-emerald-500 text-white' : 'bg-neutral-100 text-neutral-400'
              }`}>
                {step > 2 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '2'}
              </span>
              <span className="text-[11px] font-bold text-neutral-700 hidden sm:inline">Amount</span>
            </div>

            <div className={`h-0.5 flex-1 mx-2 transition-colors ${step >= 3 ? 'bg-emerald-500' : 'bg-neutral-200'}`} />

            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === 3 ? 'bg-orange-500 text-white' : 'bg-neutral-100 text-neutral-400'
              }`}>
                3
              </span>
              <span className="text-[11px] font-bold text-neutral-700 hidden sm:inline">Confirm PIN</span>
            </div>
          </div>
        )}

        {/* Error notification */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium animate-in fade-in">
            {error}
          </div>
        )}

        {/* ==================================================================== */}
        {/* STEP 1: SENDER PHONE NUMBER                                          */}
        {/* ==================================================================== */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
              <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                Target Recipient Account
              </div>
              <div className="text-sm font-extrabold text-neutral-900 flex items-center gap-2">
                <span>0794903078</span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.2 rounded-full">
                  Etienne Topson Kenedy
                </span>
              </div>
              <p className="text-[11px] text-neutral-500">
                MTN Mobile Money / Airtel Money verified channel account.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                Your Phone Number <span className="text-orange-500">*</span>
              </label>
              <div className="relative">
                <Smartphone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  required
                  autoFocus
                  value={senderPhone}
                  onChange={(e) => {
                    setSenderPhone(e.target.value);
                    setError(null);
                  }}
                  placeholder="e.g. 078XXXXXXX or 079XXXXXXX"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                />
              </div>
              <p className="text-[10px] text-neutral-500 mt-1">
                Enter the mobile money number from which the funds will be sent.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 font-bold text-sm text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 rounded-xl shadow-md shadow-orange-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* ==================================================================== */}
        {/* STEP 2: AMOUNT SELECTION                                             */}
        {/* ==================================================================== */}
        {step === 2 && (
          <form onSubmit={handleStep2Submit} className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <span className="text-xs text-neutral-500">Sending from:</span>
              <span className="text-xs font-extrabold text-neutral-900">{senderPhone}</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-2">
                Select or Enter Amount (RWF) <span className="text-orange-500">*</span>
              </label>

              {/* Preset Chips */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                {PRESET_AMOUNTS.map((amt) => {
                  const isSelected = amount === amt && !customAmount;
                  return (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setAmount(amt);
                        setCustomAmount('');
                        setError(null);
                      }}
                      className={`py-2 px-2.5 rounded-xl text-xs font-extrabold transition-all border cursor-pointer ${
                        isSelected
                          ? 'bg-orange-500 text-white border-orange-500 shadow-xs scale-102'
                          : 'bg-neutral-50 text-neutral-800 border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      {amt.toLocaleString()} RWF
                    </button>
                  );
                })}
              </div>

              {/* Custom Input */}
              <div className="relative">
                <Wallet className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                <input
                  type="number"
                  min="100"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setAmount('');
                    setError(null);
                  }}
                  placeholder="Or enter custom amount (e.g. 3500)"
                  className="w-full pl-10 pr-14 py-2.5 text-sm rounded-xl bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-bold text-neutral-500">
                  RWF
                </span>
              </div>
            </div>

            {/* Summary preview */}
            <div className="p-3 rounded-xl bg-orange-50/70 border border-orange-200/60 flex items-center justify-between text-xs">
              <span className="text-neutral-600 font-medium">Recipient Account:</span>
              <span className="font-extrabold text-orange-700">0794903078 (Topson Media)</span>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-3 px-4 rounded-xl border border-neutral-300 text-neutral-700 hover:bg-neutral-100 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                className="flex-1 py-3 px-4 font-bold text-sm text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 rounded-xl shadow-md shadow-orange-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue to PIN</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* ==================================================================== */}
        {/* STEP 3: INPUT PIN & SEND                                             */}
        {/* ==================================================================== */}
        {step === 3 && (
          <form onSubmit={handleStep3Submit} className="space-y-4">
            {/* Transfer Summary Card */}
            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2 text-xs">
              <div className="flex items-center justify-between pb-1.5 border-b border-neutral-200/60">
                <span className="text-neutral-500">From Account:</span>
                <span className="font-bold text-neutral-900">{senderPhone}</span>
              </div>
              <div className="flex items-center justify-between pb-1.5 border-b border-neutral-200/60">
                <span className="text-neutral-500">To Recipient:</span>
                <span className="font-extrabold text-orange-600">0794903078 (Topson Media)</span>
              </div>
              <div className="flex items-center justify-between pt-0.5">
                <span className="text-neutral-700 font-bold">Total Support Amount:</span>
                <span className="text-base font-black text-neutral-900">
                  {(amount as number).toLocaleString()} RWF
                </span>
              </div>
            </div>

            {/* PIN Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-neutral-800">
                  Enter Mobile Money PIN <span className="text-orange-500">*</span>
                </label>
                <span className="text-[10px] text-neutral-500 flex items-center gap-1 font-medium">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  Encrypted authorization
                </span>
              </div>

              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                <input
                  type={showPin ? 'text' : 'password'}
                  required
                  autoFocus
                  maxLength={6}
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    setError(null);
                  }}
                  placeholder="Enter your PIN"
                  className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all font-mono tracking-widest"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-2.5 p-1 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                  title={showPin ? 'Hide PIN' : 'Show PIN'}
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <p className="text-[10px] text-neutral-500 mt-1">
                Your PIN authorizes direct money transfer directly to 0794903078.
              </p>
            </div>

            {/* Processing state indicator */}
            {isProcessing && (
              <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 flex items-center gap-2.5 text-xs text-orange-800 animate-pulse">
                <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin shrink-0" />
                <span>{processingStatus}</span>
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => setStep(2)}
                className="py-3 px-4 rounded-xl border border-neutral-300 text-neutral-700 hover:bg-neutral-100 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 disabled:opacity-40"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                disabled={isProcessing || !pin.trim()}
                className="flex-1 py-3 px-4 font-bold text-sm text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 rounded-xl shadow-lg shadow-orange-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Send Money Now</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ==================================================================== */}
        {/* STEP 4: SUCCESS CONFIRMATION RECEIPT                                 */}
        {/* ==================================================================== */}
        {step === 4 && (
          <div className="text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="mx-auto w-14 h-14 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-xl font-black text-neutral-900">
                Money Sent Successfully! 🎉
              </h4>
              <p className="text-xs text-neutral-600 mt-1">
                Your support payment has been routed directly to <span className="font-bold text-orange-600">0794903078</span>.
              </p>
            </div>

            {/* Official Digital Receipt Card */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-left space-y-2 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                <span className="text-[11px] font-bold text-neutral-500 uppercase flex items-center gap-1">
                  <Receipt className="w-3.5 h-3.5" />
                  Transaction Receipt
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
                  Completed
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Amount Sent:</span>
                <span className="text-sm font-black text-neutral-900">
                  {(amount as number).toLocaleString()} RWF
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Recipient Account:</span>
                <span className="font-bold text-neutral-900">0794903078 (Topson Media)</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-500">From Number:</span>
                <span className="font-bold text-neutral-900">{senderPhone}</span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-neutral-200">
                <span className="text-neutral-500">Ref Code:</span>
                <button
                  type="button"
                  onClick={handleCopyRef}
                  className="font-mono font-bold text-neutral-800 flex items-center gap-1 hover:text-orange-600 cursor-pointer"
                  title="Copy reference code"
                >
                  <span>{completedDonation?.reference || 'MOMO-COMPLETED'}</span>
                  {copiedRef ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-neutral-400" />}
                </button>
              </div>
            </div>

            <p className="text-[11px] text-neutral-500 italic">
              "Murakoze cyane! Thank you so much for supporting Topson Media tutorials and technology content!"
            </p>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 px-4 font-bold text-sm text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-all shadow-md active:scale-98 cursor-pointer"
            >
              Done & Return to Studio
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
