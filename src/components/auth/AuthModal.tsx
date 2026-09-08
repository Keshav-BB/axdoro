import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { DEMO_USER, DEMO_USER_CREDENTIALS } from '../../data/demoAccounts';
import { 
  X, 
  Phone, 
  Mail, 
  Eye, 
  EyeOff, 
  MessageCircle, 
  MessageSquare, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
} from 'lucide-react';
import { TShirtSize, User } from '../../types';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalMode, 
    setAuthModalMode, 
    login, 
    showToast 
  } = useStore();

  // Primary Channel: 'phone' vs 'email'
  const [channel, setChannel] = useState<'phone' | 'email'>('phone');
  
  // Method within Channel:
  // For phone: 'password' | 'sms-otp' | 'whatsapp-otp'
  // For email: 'password' | 'email-otp'
  const [phoneMethod, setPhoneMethod] = useState<'password' | 'sms-otp' | 'whatsapp-otp'>('sms-otp');
  const [emailMethod, setEmailMethod] = useState<'password' | 'email-otp'>('email-otp');

  // Input States
  const [phoneInput, setPhoneInput] = useState('9840123456');
  const [emailInput, setEmailInput] = useState('karthik.sub@gmail.com');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Registration Inputs
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPreferredSize, setRegPreferredSize] = useState<TShirtSize>('L');

  // OTP Flow States
  const [otpSent, setOtpSent] = useState(false);
  const [otpChannelUsed, setOtpChannelUsed] = useState<'sms' | 'whatsapp' | 'email'>('sms');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(30);
  const canResend = countdown === 0;
  const [simulatedNotification, setSimulatedNotification] = useState<string | null>(null);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsAuthModalOpen(false);
    };
    if (isAuthModalOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAuthModalOpen, setIsAuthModalOpen]);

  // Resend Timer Countdown
  useEffect(() => {
    let timer: any;
    if (otpSent && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpSent, countdown]);

  if (!isAuthModalOpen) return null;

  // Trigger Send OTP
  const handleSendOTP = (type: 'sms' | 'whatsapp' | 'email') => {
    setOtpChannelUsed(type);
    setOtpSent(true);
    setCountdown(30);
    setOtpDigits(['', '', '', '', '', '']);

    const generatedCode = type === 'whatsapp' ? '849201' : type === 'email' ? '742918' : '123456';

    if (type === 'whatsapp') {
      setSimulatedNotification(`AXDORO WhatsApp OTP: Your security code is ${generatedCode}. Valid for 10 mins.`);
      showToast('WhatsApp verification code sent to +91 ' + phoneInput, 'success');
    } else if (type === 'email') {
      setSimulatedNotification(`AXDORO Email Passcode: Your verification code is ${generatedCode}`);
      showToast('Magic login code dispatched to ' + emailInput, 'success');
    } else {
      setSimulatedNotification(`AXDORO SMS OTP: Use ${generatedCode} to verify your phone number.`);
      showToast('SMS OTP delivered to +91 ' + phoneInput, 'success');
    }

    setTimeout(() => {
      otpInputRefs.current[0]?.focus();
    }, 150);
  };

  // Handle OTP digit changes
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // User pasted full code
      const pasted = value.replace(/\D/g, '').slice(0, 6).split('');
      const newDigits = [...otpDigits];
      pasted.forEach((char, i) => {
        if (i < 6) newDigits[i] = char;
      });
      setOtpDigits(newDigits);
      if (pasted.length === 6) {
        verifyAndLogin(newDigits.join(''));
      }
      return;
    }

    const newDigits = [...otpDigits];
    newDigits[index] = value.replace(/\D/g, '');
    setOtpDigits(newDigits);

    // Auto advance focus
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // If all 6 digits are entered, auto verify
    if (newDigits.every((d) => d !== '')) {
      verifyAndLogin(newDigits.join(''));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const autoFillCode = (code: string) => {
    const chars = code.split('');
    setOtpDigits(chars);
    verifyAndLogin(code);
  };

  const verifyAndLogin = (_code?: string) => {
    // Authenticate user
    const loggedUser: User = {
      ...DEMO_USER,
      phone: channel === 'phone' ? phoneInput : DEMO_USER.phone,
      email: channel === 'email' ? emailInput : DEMO_USER.email,
    };
    login(loggedUser);
  };

  // Handle Password Submit
  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput) {
      showToast('Please enter your password', 'error');
      return;
    }
    const loggedUser: User = {
      ...DEMO_USER,
      phone: channel === 'phone' ? phoneInput : DEMO_USER.phone,
      email: channel === 'email' ? emailInput : DEMO_USER.email,
    };
    login(loggedUser);
  };

  // Handle Registration Submit
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regPhone || !regEmail) {
      showToast('Please fill all required registration fields', 'error');
      return;
    }
    const newUser: User = {
      id: `usr_${Date.now().toString().slice(-6)}`,
      name: regName,
      phone: regPhone,
      email: regEmail,
      avatar: regName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      loyaltyPoints: 100, // Welcome reward bonus
      tier: 'Bronze',
      preferredSize: regPreferredSize,
      addresses: [],
      joinedDate: 'September 2026',
    };
    login(newUser);
    showToast(`Welcome to AXDORO, ${regName}! +100 Welcome Points awarded`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-[#faf9f6] text-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-950 text-amber-400 flex items-center justify-center font-serif text-base font-bold shadow-md">
              AX
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight font-serif text-zinc-950">
                {authModalMode === 'login' ? 'Customer Sign In' : 'Join AXDORO Circle'}
              </h2>
              <p className="text-[11px] text-zinc-500 font-sans">
                {authModalMode === 'login'
                  ? 'Access orders, wishlist & 1-tap Razorpay checkout'
                  : 'Get personalized 240 GSM size drops & loyalty rewards'}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher: Sign In vs Sign Up */}
        <div className="p-1.5 mx-6 mt-4 bg-zinc-200/70 rounded-xl flex items-center gap-1 text-xs font-semibold">
          <button
            onClick={() => {
              setAuthModalMode('login');
              setOtpSent(false);
            }}
            className={`flex-1 py-1.5 rounded-lg transition-all text-center ${
              authModalMode === 'login'
                ? 'bg-white text-zinc-950 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setAuthModalMode('signup');
              setOtpSent(false);
            }}
            className={`flex-1 py-1.5 rounded-lg transition-all text-center ${
              authModalMode === 'signup'
                ? 'bg-white text-zinc-950 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Test Customer Account Box */}
        {authModalMode === 'login' && !otpSent && (
          <div className="mx-6 mt-3 p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-transparent border border-amber-400/30 text-xs font-mono space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-amber-950">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>TEST CUSTOMER ACCOUNT</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-900 font-semibold border border-amber-400/30">
                Obsidian VIP
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] bg-white/90 p-2.5 rounded-xl border border-amber-300/40 font-sans">
              <div>
                <span className="text-[10px] text-zinc-400 font-mono block">PHONE / SMS / WA</span>
                <span className="font-semibold text-zinc-900 font-mono select-all">{DEMO_USER_CREDENTIALS.phone}</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 font-mono block">PASSWORD</span>
                <span className="font-semibold text-zinc-900 font-mono select-all">{DEMO_USER_CREDENTIALS.password}</span>
              </div>
              <div className="col-span-2 pt-1 border-t border-zinc-100 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <span>Email: {DEMO_USER_CREDENTIALS.email}</span>
                <span className="text-amber-800 font-bold">OTP: 123456</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => login(DEMO_USER)}
                className="flex-1 py-1.5 px-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>⚡ 1-Click Login (Karthik)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setPhoneInput(DEMO_USER_CREDENTIALS.phone);
                  setEmailInput(DEMO_USER_CREDENTIALS.email);
                  setPasswordInput(DEMO_USER_CREDENTIALS.password);
                  showToast('Test customer credentials populated', 'info');
                }}
                className="py-1.5 px-2.5 bg-white hover:bg-zinc-100 text-zinc-700 text-xs rounded-xl border border-zinc-200 transition-colors cursor-pointer"
              >
                Fill
              </button>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {authModalMode === 'login' ? (
            <>
              {/* Channel Selector: Phone vs Email */}
              {!otpSent && (
                <div className="space-y-3">
                  <div className="flex border-b border-zinc-200">
                    <button
                      onClick={() => setChannel('phone')}
                      className={`pb-2 text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 border-b-2 transition-all px-3 ${
                        channel === 'phone'
                          ? 'border-zinc-950 text-zinc-950'
                          : 'border-transparent text-zinc-400 hover:text-zinc-700'
                      }`}
                    >
                      <Phone className="w-3.5 h-3.5" /> Mobile Number
                    </button>
                    <button
                      onClick={() => setChannel('email')}
                      className={`pb-2 text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 border-b-2 transition-all px-3 ${
                        channel === 'email'
                          ? 'border-zinc-950 text-zinc-950'
                          : 'border-transparent text-zinc-400 hover:text-zinc-700'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" /> Email Address
                    </button>
                  </div>

                  {/* CHANNEL 1: PHONE LOGIN */}
                  {channel === 'phone' && (
                    <div className="space-y-3.5 pt-1">
                      {/* Method Selector */}
                      <div className="grid grid-cols-3 gap-1.5 p-1 bg-zinc-100 rounded-lg text-[11px] font-medium">
                        <button
                          onClick={() => setPhoneMethod('sms-otp')}
                          className={`py-1 rounded text-center transition-all ${
                            phoneMethod === 'sms-otp'
                              ? 'bg-white font-bold text-zinc-900 shadow-xs'
                              : 'text-zinc-500 hover:text-zinc-900'
                          }`}
                        >
                          SMS OTP
                        </button>
                        <button
                          onClick={() => setPhoneMethod('whatsapp-otp')}
                          className={`py-1 rounded text-center transition-all flex items-center justify-center gap-1 ${
                            phoneMethod === 'whatsapp-otp'
                              ? 'bg-emerald-600 font-bold text-white shadow-xs'
                              : 'text-zinc-500 hover:text-zinc-900'
                          }`}
                        >
                          <MessageCircle className="w-3 h-3" /> WhatsApp
                        </button>
                        <button
                          onClick={() => setPhoneMethod('password')}
                          className={`py-1 rounded text-center transition-all ${
                            phoneMethod === 'password'
                              ? 'bg-white font-bold text-zinc-900 shadow-xs'
                              : 'text-zinc-500 hover:text-zinc-900'
                          }`}
                        >
                          Password
                        </button>
                      </div>

                      {/* Phone Input */}
                      <div>
                        <label className="block text-[11px] font-semibold text-zinc-600 uppercase font-mono mb-1">
                          Mobile Number
                        </label>
                        <div className="flex items-center bg-white border border-zinc-300 rounded-xl overflow-hidden focus-within:border-zinc-950 shadow-xs">
                          <span className="px-3 py-2.5 bg-zinc-50 text-xs font-mono font-bold text-zinc-600 border-r border-zinc-200">
                            +91
                          </span>
                          <input
                            type="tel"
                            maxLength={10}
                            value={phoneInput}
                            onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, ''))}
                            placeholder="Enter 10-digit number"
                            className="flex-1 px-3 py-2 text-xs font-mono text-zinc-900 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Phone Password Form */}
                      {phoneMethod === 'password' && (
                        <form onSubmit={handlePasswordLogin} className="space-y-3">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className="text-[11px] font-semibold text-zinc-600 uppercase font-mono">
                                Password
                              </label>
                              <button
                                type="button"
                                onClick={() => handleSendOTP('sms')}
                                className="text-[10px] text-amber-700 hover:underline"
                              >
                                Login with SMS OTP instead
                              </button>
                            </div>
                            <div className="relative">
                              <input
                                type={showPassword ? 'text' : 'password'}
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full px-3 py-2.5 pr-10 text-xs bg-white border border-zinc-300 rounded-xl text-zinc-900 focus:outline-none focus:border-zinc-950 shadow-xs"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
                              >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>

                          <button
                            type="submit"
                            className="w-full py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all shadow-md"
                          >
                            Sign In with Password
                          </button>
                        </form>
                      )}

                      {/* Phone SMS OTP Trigger */}
                      {phoneMethod === 'sms-otp' && (
                        <div className="space-y-2 pt-1">
                          <button
                            onClick={() => handleSendOTP('sms')}
                            disabled={phoneInput.length !== 10}
                            className="w-full py-2.5 bg-zinc-950 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span>Send SMS Verification Code</span>
                          </button>
                          <p className="text-[10px] text-zinc-400 text-center">
                            We'll send a 6-digit verification code via fast SMS gateway
                          </p>
                        </div>
                      )}

                      {/* Phone WhatsApp OTP Trigger */}
                      {phoneMethod === 'whatsapp-otp' && (
                        <div className="space-y-2 pt-1">
                          <button
                            onClick={() => handleSendOTP('whatsapp')}
                            disabled={phoneInput.length !== 10}
                            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>Send OTP via WhatsApp</span>
                          </button>
                          <div className="flex items-center justify-center gap-1 text-[10px] text-emerald-700">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Instant WhatsApp OTP • Zero network delay</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* CHANNEL 2: EMAIL LOGIN */}
                  {channel === 'email' && (
                    <div className="space-y-3.5 pt-1">
                      {/* Method Selector */}
                      <div className="grid grid-cols-2 gap-1.5 p-1 bg-zinc-100 rounded-lg text-[11px] font-medium">
                        <button
                          onClick={() => setEmailMethod('email-otp')}
                          className={`py-1 rounded text-center transition-all ${
                            emailMethod === 'email-otp'
                              ? 'bg-white font-bold text-zinc-900 shadow-xs'
                              : 'text-zinc-500 hover:text-zinc-900'
                          }`}
                        >
                          Email Magic OTP
                        </button>
                        <button
                          onClick={() => setEmailMethod('password')}
                          className={`py-1 rounded text-center transition-all ${
                            emailMethod === 'password'
                              ? 'bg-white font-bold text-zinc-900 shadow-xs'
                              : 'text-zinc-500 hover:text-zinc-900'
                          }`}
                        >
                          Email Password
                        </button>
                      </div>

                      {/* Email Input */}
                      <div>
                        <label className="block text-[11px] font-semibold text-zinc-600 uppercase font-mono mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          placeholder="e.g. karthik.sub@gmail.com"
                          className="w-full px-3 py-2.5 text-xs bg-white border border-zinc-300 rounded-xl text-zinc-900 focus:outline-none focus:border-zinc-950 shadow-xs font-mono"
                        />
                      </div>

                      {/* Email Password Form */}
                      {emailMethod === 'password' && (
                        <form onSubmit={handlePasswordLogin} className="space-y-3">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className="text-[11px] font-semibold text-zinc-600 uppercase font-mono">
                                Password
                              </label>
                              <button
                                type="button"
                                onClick={() => handleSendOTP('email')}
                                className="text-[10px] text-amber-700 hover:underline"
                              >
                                Login with Email OTP
                              </button>
                            </div>
                            <div className="relative">
                              <input
                                type={showPassword ? 'text' : 'password'}
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full px-3 py-2.5 pr-10 text-xs bg-white border border-zinc-300 rounded-xl text-zinc-900 focus:outline-none focus:border-zinc-950 shadow-xs"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
                              >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>

                          <button
                            type="submit"
                            className="w-full py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all shadow-md"
                          >
                            Sign In with Password
                          </button>
                        </form>
                      )}

                      {/* Email OTP Trigger */}
                      {emailMethod === 'email-otp' && (
                        <div className="space-y-2 pt-1">
                          <button
                            onClick={() => handleSendOTP('email')}
                            disabled={!emailInput.includes('@')}
                            className="w-full py-2.5 bg-zinc-950 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                          >
                            <Mail className="w-4 h-4" />
                            <span>Send Magic Login Code</span>
                          </button>
                          <p className="text-[10px] text-zinc-400 text-center">
                            A 6-digit login passcode will be sent to your inbox
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* OTP VERIFICATION VIEW */}
              {otpSent && (
                <div className="space-y-4 pt-1 animate-fadeIn">
                  {/* Channel Alert Banner */}
                  <div className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                    otpChannelUsed === 'whatsapp'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : otpChannelUsed === 'email'
                      ? 'bg-blue-50 border-blue-300 text-blue-900'
                      : 'bg-amber-50 border-amber-300 text-amber-900'
                  }`}>
                    <div className="flex items-center gap-2">
                      {otpChannelUsed === 'whatsapp' && <MessageCircle className="w-4 h-4 text-emerald-600" />}
                      {otpChannelUsed === 'email' && <Mail className="w-4 h-4 text-blue-600" />}
                      {otpChannelUsed === 'sms' && <MessageSquare className="w-4 h-4 text-amber-600" />}
                      <span className="font-medium">
                        Sent to {otpChannelUsed === 'email' ? emailInput : `+91 ${phoneInput}`}
                      </span>
                    </div>
                    <button
                      onClick={() => setOtpSent(false)}
                      className="text-[11px] underline font-bold"
                    >
                      Change
                    </button>
                  </div>

                  {/* Simulated Notification Preview */}
                  {simulatedNotification && (
                    <div className="p-2.5 bg-white rounded-xl border border-zinc-300 shadow-sm text-xs space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-zinc-400">
                        <span className="font-bold text-zinc-700">Simulated Alert:</span>
                        <span className="text-emerald-600 font-mono">Just Now</span>
                      </div>
                      <p className="text-[11px] font-mono text-zinc-800">
                        {simulatedNotification}
                      </p>
                      <button
                        type="button"
                        onClick={() => autoFillCode(otpChannelUsed === 'whatsapp' ? '849201' : otpChannelUsed === 'email' ? '742918' : '123456')}
                        className="text-[10px] text-amber-700 font-bold hover:underline flex items-center gap-1 pt-0.5"
                      >
                        ⚡ Click to Auto-Fill Code ({otpChannelUsed === 'whatsapp' ? '849201' : otpChannelUsed === 'email' ? '742918' : '123456'})
                      </button>
                    </div>
                  )}

                  {/* 6-Digit Boxes */}
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-600 uppercase font-mono mb-2 text-center">
                      Enter 6-Digit Code
                    </label>
                    <div className="flex justify-between gap-1.5 sm:gap-2">
                      {otpDigits.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => { otpInputRefs.current[index] = el; }}
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className="w-11 h-12 text-center text-lg font-mono font-bold bg-white border border-zinc-300 rounded-xl focus:outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 shadow-xs"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Verify Action & Resend Timer */}
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => verifyAndLogin(otpDigits.join(''))}
                      disabled={otpDigits.some((d) => d === '')}
                      className="w-full py-2.5 bg-zinc-950 hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all shadow-md"
                    >
                      Confirm & Verify Sign In
                    </button>

                    <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
                      <span>Didn't receive code?</span>
                      {canResend ? (
                        <button
                          onClick={() => handleSendOTP(otpChannelUsed)}
                          className="text-amber-700 font-bold hover:underline"
                        >
                          Resend Code Now
                        </button>
                      ) : (
                        <span className="font-mono text-zinc-400">
                          Resend in {countdown}s
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* CREATE ACCOUNT / SIGN UP VIEW */
            <form onSubmit={handleRegister} className="space-y-3 animate-fadeIn">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-600 uppercase font-mono mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Vignesh Ramachandran"
                  className="w-full px-3 py-2 text-xs bg-white border border-zinc-300 rounded-xl text-zinc-900 focus:outline-none focus:border-zinc-950 shadow-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-600 uppercase font-mono mb-1">
                    Phone (+91) *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="10 digits"
                    className="w-full px-3 py-2 text-xs bg-white border border-zinc-300 rounded-xl text-zinc-900 focus:outline-none focus:border-zinc-950 font-mono shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-600 uppercase font-mono mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@gmail.com"
                    className="w-full px-3 py-2 text-xs bg-white border border-zinc-300 rounded-xl text-zinc-900 focus:outline-none focus:border-zinc-950 font-mono shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-600 uppercase font-mono mb-1">
                  Create Password
                </label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-3 py-2 text-xs bg-white border border-zinc-300 rounded-xl text-zinc-900 focus:outline-none focus:border-zinc-950 shadow-xs"
                />
              </div>

              {/* Preferred 240 GSM Size selector */}
              <div>
                <label className="block text-[11px] font-semibold text-zinc-600 uppercase font-mono mb-1">
                  Your Preferred 240 GSM Cut Size
                </label>
                <div className="grid grid-cols-6 gap-1.5">
                  {(['XS', 'S', 'M', 'L', 'XL', 'XXL'] as TShirtSize[]).map((sz) => (
                    <button
                      type="button"
                      key={sz}
                      onClick={() => setRegPreferredSize(sz)}
                      className={`py-1.5 rounded-lg font-mono text-xs font-bold transition-all ${
                        regPreferredSize === sz
                          ? 'bg-zinc-950 text-white shadow-xs'
                          : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
                <span className="text-[10px] text-zinc-400 block mt-1">
                  We'll prioritize size {regPreferredSize} availability across all 200 drops
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 mt-2 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all shadow-md"
              >
                Create Account & Claim +100 Points
              </button>
            </form>
          )}

          {/* 1-Click Demo Profiles for Rapid Testing */}
          <div className="pt-3 border-t border-zinc-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-zinc-400">
                ⚡ 1-Click Test Profiles
              </span>
              <span className="text-[10px] text-amber-700 font-mono font-semibold">Demo Sandbox</span>
            </div>
            <button
              onClick={() => login(DEMO_USER)}
              className="w-full p-2.5 rounded-xl border border-amber-300 bg-amber-50/60 hover:bg-amber-100/70 transition-all text-left flex items-center justify-between text-xs group"
            >
              <div>
                <div className="font-bold text-zinc-900 group-hover:text-amber-800 transition-colors">
                  Karthik Subramanian (Obsidian VIP Member)
                </div>
                <div className="text-[10px] text-zinc-500 font-mono">
                  +91 98401 23456 • Chennai • Size L
                </div>
              </div>
              <span className="px-2 py-0.5 bg-white text-zinc-800 text-[10px] font-mono rounded font-bold border border-amber-200">
                Instant Log In →
              </span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-zinc-100/80 border-t border-zinc-200 text-center text-[10px] text-zinc-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Secured with 256-bit tokenized session encryption • DPDP Act 2023 Compliant</span>
        </div>
      </div>
    </div>
  );
};
