import React, { useState, useEffect } from 'react';
import {
  X,
  Heart,
  Phone,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
  ShieldCheck,
  Sparkles,
  Smartphone,
  Wallet,
  Receipt,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  Radio
} from 'lucide-react';
import { SupportDonation } from '../services/firebase';
import {
  triggerRealMoMoPush,
  detectRwandaTelecom,
  verifyMoMoTransactionStatus,
  MoMoPushResponse
} from '../services/paymentGateway';

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
  // 3 Safe Stages (No PIN on web!):
  // Step 1: Input Sender Number -> Continue
  // Step 2: Select Amount -> Click "Send Money Now" (Triggers Real STK Push HTTPS request)
  // Step 3: Waiting for user to confirm & enter PIN on their physical phone ("Please check your phone...")
  // Step 4: Celebration screen ("Thank you for supporting Topson Media!")
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [senderPhone, setSenderPhone] = useState('');
  const [amount, setAmount] = useState<number | ''>(2000);
  const [customAmount, setCustomAmount] = useState('');

  // Push Transaction State
  const [pushResponse, setPushResponse] = useState<MoMoPushResponse | null>(null);
  const [countdown, setCountdown] = useState(60);
  const [isTriggeringPush, setIsTriggeringPush] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedDonation, setCompletedDonation] = useState<SupportDonation | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setError(null);
      setIsTriggeringPush(false);
      setCompletedDonation(null);
      setPushResponse(null);
      setCountdown(60);
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

  // Countdown timer while waiting for user to type PIN on their phone in Step 3
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 3 && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (step === 3 && countdown === 0) {
      // Timeout reached
      setError('MoMo push request timed out. If you did not receive the prompt on your phone, click "Resend Push".');
    }
    return () => clearTimeout(timer);
  }, [step, countdown]);

  if (!isOpen) return null;

  const detectedProvider = detectRwandaTelecom(senderPhone);

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

  // Step 2: Trigger REAL Mobile Money Push (STK PUSH) via Payment Gateway API
  const handleTriggerMoMoPush = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const finalAmount = typeof amount === 'number' ? amount : parseInt(customAmount, 10);
    if (!finalAmount || isNaN(finalAmount) || finalAmount <= 0) {
      setError('Please select or enter a valid amount of money.');
      return;
    }

    setIsTriggeringPush(true);
    setAmount(finalAmount);

    try {
      // Real HTTPS POST request to payment gateway (Paypack / Flutterwave)
      const res = await triggerRealMoMoPush({
        senderPhone: senderPhone.trim(),
        amount: finalAmount,
        currency: 'RWF',
        recipientPhone: '0794903078',
        recipientName: 'Etienne Topson Kenedy (Topson Media)',
      });

      setPushResponse(res);
      setIsTriggeringPush(false);
      setStep(3); // Transition to "Please check your phone" waiting stage
      setCountdown(60);

      // Begin checking for authorization confirmation from gateway
      const verificationDelay = setTimeout(async () => {
        try {
          const verifyRes = await verifyMoMoTransactionStatus(res.reference);
          if (verifyRes.status === 'successful') {
            const donationData: SupportDonation = {
              id: res.transactionId || `DON-${Date.now()}`,
              senderPhone: senderPhone.trim(),
              recipientPhone: '0794903078',
              amount: finalAmount,
              currency: 'RWF',
              reference: res.reference,
              timestamp: new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }),
              status: 'completed',
            };
            setCompletedDonation(donationData);
            setStep(4);
            if (onSuccess) {
              onSuccess(donationData);
            }
          }
        } catch (verifyErr) {
          console.warn('Status verification error:', verifyErr);
        }
      }, 3500);

      return () => clearTimeout(verificationDelay);
    } catch (err) {
      console.error('Trigger MoMo push error:', err);
      setIsTriggeringPush(false);
      setError('Failed to dispatch MoMo push notification. Please check your phone number and network connection.');
    }
  };

  // Resend MoMo Push
  const handleResendPush = () => {
    setError(null);
    setCountdown(60);
    handleTriggerMoMoPush({ preventDefault: () => {} } as React.FormEvent);
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
            <span>Direct Recipient Account:</span>
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
              <span className="text-[11px] font-bold text-neutral-700 hidden sm:inline">Phone Number</span>
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
                step === 3 ? 'bg-orange-500 text-white animate-pulse' : 'bg-neutral-100 text-neutral-400'
              }`}>
                3
              </span>
              <span className="text-[11px] font-bold text-neutral-700 hidden sm:inline">Phone Push</span>
            </div>
          </div>
        )}

        {/* Error notification */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <p className="flex-1">{error}</p>
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
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                  Etienne Topson Kenedy
                </span>
              </div>
              <p className="text-[11px] text-neutral-500">
                Official Rwanda Mobile Money channel account (MTN MoMo / Airtel Money).
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-neutral-800">
                  Your Phone Number <span className="text-orange-500">*</span>
                </label>
                {senderPhone.trim().length >= 3 && (
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                    detectedProvider === 'MTN'
                      ? 'bg-amber-50 text-amber-700 border-amber-300'
                      : 'bg-red-50 text-red-600 border-red-200'
                  }`}>
                    {detectedProvider === 'MTN' ? 'MTN MoMo Rwanda' : 'Airtel Money Rwanda'}
                  </span>
                )}
              </div>
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
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all font-medium"
                />
              </div>
              <p className="text-[10px] text-neutral-500 mt-1">
                Enter your mobile number where the STK Push notification prompt will pop up.
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
        {/* STEP 2: AMOUNT SELECTION & TRIGGER REAL STK PUSH                     */}
        {/* ==================================================================== */}
        {step === 2 && (
          <form onSubmit={handleTriggerMoMoPush} className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <span className="text-xs text-neutral-500">Sending from:</span>
              <span className="text-xs font-extrabold text-neutral-900 flex items-center gap-1.5">
                <span>{senderPhone}</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-600 font-bold uppercase">
                  {detectedProvider}
                </span>
              </span>
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
                  className="w-full pl-10 pr-14 py-2.5 text-sm rounded-xl bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all font-semibold"
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
                disabled={isTriggeringPush}
                className="flex-1 py-3 px-4 font-bold text-sm text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 rounded-xl shadow-md shadow-orange-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isTriggeringPush ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Triggering MoMo Push...</span>
                  </>
                ) : (
                  <>
                    <span>Send Money Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ==================================================================== */}
        {/* STEP 3: REAL STK PUSH TRIGGERED - WAITING FOR PIN ON USER'S PHONE    */}
        {/* ==================================================================== */}
        {step === 3 && (
          <div className="text-center space-y-4 animate-in fade-in duration-200">
            {/* Animated Phone / Push Prompt Graphic */}
            <div className="relative mx-auto w-20 h-20 rounded-3xl bg-orange-50 border-2 border-orange-400 flex items-center justify-center text-orange-600 shadow-lg shadow-orange-500/15">
              <Smartphone className="w-10 h-10 animate-bounce" />
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-sm">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
              </div>
            </div>

            <div>
              <h4 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight">
                Please check your phone to confirm the MoMo push prompt...
              </h4>
              <p className="text-xs text-neutral-600 mt-1 max-w-sm mx-auto leading-relaxed">
                A secure USSD prompt has been dispatched to <span className="font-bold text-neutral-900">{senderPhone}</span>.
                Input your PIN on your mobile device to authorize the transaction.
              </p>
            </div>

            {/* Realistic Simulated Handset USSD Prompt Card */}
            <div className="p-3.5 rounded-2xl bg-neutral-900 text-white text-left space-y-2 border border-neutral-800 shadow-md">
              <div className="flex items-center justify-between text-[10px] text-neutral-400 pb-1 border-b border-neutral-800">
                <span className="font-mono">{detectedProvider} Mobile Money Rwanda</span>
                <span className="text-orange-400 font-bold">STK PUSH</span>
              </div>
              <div className="text-xs sm:text-sm font-semibold text-neutral-200 leading-snug">
                "{pushResponse?.ussdPromptText || `Do you want to pay ${(amount as number).toLocaleString()} RWF to Etienne Topson Kenedy (0794903078)?`}"
              </div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1.5 pt-1">
                <Lock className="w-3 h-3" />
                <span>Enter PIN on your physical phone keyboard</span>
              </div>
            </div>

            {/* Spinner Status Banner */}
            <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-between text-xs text-orange-900">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin shrink-0" />
                <span className="font-semibold">Waiting for phone PIN confirmation...</span>
              </div>
              <span className="font-mono font-bold text-orange-700">{countdown}s</span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleResendPush}
                className="flex-1 py-2.5 px-3 rounded-xl border border-neutral-300 text-neutral-700 hover:bg-neutral-100 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Resend Push</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="py-2.5 px-3 rounded-xl text-neutral-500 hover:text-neutral-900 text-xs font-semibold cursor-pointer"
              >
                Change Amount
              </button>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* STEP 4: VERIFIED SUCCESS & CELEBRATION RECEIPT                       */}
        {/* ==================================================================== */}
        {step === 4 && (
          <div className="text-center space-y-4 animate-in zoom-in-95 duration-200">
            {/* Animated Verified Checkmark */}
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center text-emerald-600 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10 animate-in spin-in-180 duration-500" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold mb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Payment Verified on MoMo Gateway</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                Thank you for supporting Topson Media! 🎉
              </h4>
              <p className="text-xs text-neutral-600 mt-1 max-w-sm mx-auto">
                Your support payment has been received directly on <span className="font-bold text-orange-600">0794903078</span>.
              </p>
            </div>

            {/* Official Digital Receipt Card */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-left space-y-2 text-xs shadow-2xs">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                <span className="text-[11px] font-bold text-neutral-500 uppercase flex items-center gap-1">
                  <Receipt className="w-3.5 h-3.5" />
                  Official Transaction Receipt
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase flex items-center gap-1">
                  <Check className="w-3 h-3 stroke-[3]" />
                  Verified
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Amount Sent:</span>
                <span className="text-base font-black text-neutral-900">
                  {(amount as number).toLocaleString()} RWF
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Recipient:</span>
                <span className="font-extrabold text-neutral-900">0794903078 (Etienne Topson Kenedy)</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-500">From Account:</span>
                <span className="font-bold text-neutral-900">{senderPhone} ({detectedProvider})</span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-neutral-200">
                <span className="text-neutral-500">Ref Code:</span>
                <button
                  type="button"
                  onClick={handleCopyRef}
                  className="font-mono font-bold text-neutral-800 flex items-center gap-1 hover:text-orange-600 cursor-pointer"
                  title="Copy reference code"
                >
                  <span>{completedDonation?.reference || pushResponse?.reference || 'MOMO-VERIFIED'}</span>
                  {copiedRef ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-neutral-400" />}
                </button>
              </div>
            </div>

            <p className="text-[11px] text-neutral-500 italic bg-orange-50/50 p-2.5 rounded-xl border border-orange-200/50">
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
