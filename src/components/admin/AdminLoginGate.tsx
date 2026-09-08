import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  KeyRound, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Server
} from 'lucide-react';
import { useStore, DEMO_ADMIN_CREDENTIALS } from '../../context/StoreContext';

export const AdminLoginGate: React.FC = () => {
  const { adminLogin, setCurrentView, showToast } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFillCredentials = (autoSubmit = false) => {
    setEmail(DEMO_ADMIN_CREDENTIALS.email);
    setPassword(DEMO_ADMIN_CREDENTIALS.password);
    setPin(DEMO_ADMIN_CREDENTIALS.pin);
    setErrorMsg(null);

    if (autoSubmit) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        adminLogin(
          DEMO_ADMIN_CREDENTIALS.email,
          DEMO_ADMIN_CREDENTIALS.password,
          DEMO_ADMIN_CREDENTIALS.pin
        );
      }, 400);
    } else {
      showToast('Admin test credentials populated. Click Sign In to continue.', 'info');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim()) {
      setErrorMsg('Please enter your administrator work email.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your security access password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const success = adminLogin(email, password, pin);
      if (!success) {
        setErrorMsg('Invalid administrator credentials. Use the 1-click test credentials.');
      }
    }, 450);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Brand & Portal Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-zinc-950 text-amber-400 border border-amber-400/30 shadow-xl mb-2 font-serif text-2xl font-bold tracking-tight">
            AX
          </div>
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono font-bold tracking-widest text-amber-700 uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>AXDORO Enterprise Intelligence Suite</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-950 tracking-tight">
            Admin Staff Gate
          </h1>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Restricted to authorized store directors, operations team & logistics managers.
          </p>
        </div>

        {/* 1-Click Test Credentials Callout */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-transparent border border-amber-400/30 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>TEST ADMIN ACCOUNT</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-900 font-semibold border border-amber-400/30">
              Root Operations
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-white/80 p-2.5 rounded-xl border border-amber-300/40">
            <div>
              <span className="text-[10px] text-zinc-400 block">ADMIN EMAIL</span>
              <span className="font-semibold text-zinc-900 select-all">{DEMO_ADMIN_CREDENTIALS.email}</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 block">PASSWORD</span>
              <span className="font-semibold text-zinc-900 select-all">{DEMO_ADMIN_CREDENTIALS.password}</span>
            </div>
            <div className="col-span-2 pt-1 border-t border-zinc-100 flex items-center justify-between text-[11px]">
              <div>
                <span className="text-[10px] text-zinc-400">PIN: </span>
                <span className="font-semibold text-zinc-900">{DEMO_ADMIN_CREDENTIALS.pin}</span>
              </div>
              <div className="text-[11px] text-zinc-500">
                Director: {DEMO_ADMIN_CREDENTIALS.name}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleFillCredentials(true)}
              className="flex-1 py-2 px-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-mono font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>⚡ 1-Click Auto Login</span>
            </button>
            <button
              type="button"
              onClick={() => handleFillCredentials(false)}
              className="py-2 px-3 bg-white hover:bg-zinc-100 text-zinc-700 font-mono text-xs rounded-xl border border-zinc-200 transition-colors cursor-pointer"
            >
              Autofill Form
            </button>
          </div>
        </div>

        {/* Authentication Card Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-zinc-200/80 space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-mono flex items-center gap-2 animate-fadeIn">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Work Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@axdoro.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 outline-none text-sm font-sans bg-zinc-50/50 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider">
                  Security Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-zinc-300 focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 outline-none text-sm font-sans bg-zinc-50/50 focus:bg-white transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Security PIN */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider">
                  4-Digit Security PIN
                </label>
                <span className="text-[10px] text-zinc-400 font-mono">Default: 9922</span>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="9922"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 outline-none text-sm font-mono tracking-widest bg-zinc-50/50 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-zinc-300 text-zinc-950 focus:ring-zinc-950 w-4 h-4"
                />
                <span>Remember this workstation</span>
              </label>
              <span className="text-[11px] font-mono text-zinc-400">256-Bit SSL</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-zinc-950 hover:bg-zinc-800 disabled:opacity-70 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Executive Console</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </>
              )}
            </button>
          </form>

          {/* Return to Customer Storefront */}
          <div className="pt-2 border-t border-zinc-100 text-center">
            <button
              type="button"
              onClick={() => {
                setCurrentView('home');
                window.location.hash = '';
              }}
              className="inline-flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-950 font-mono transition-colors cursor-pointer py-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Customer Storefront</span>
            </button>
          </div>
        </div>

        {/* Security Audit Badge */}
        <div className="flex items-center justify-center gap-3 text-[11px] text-zinc-400 font-mono">
          <div className="flex items-center gap-1">
            <Server className="w-3 h-3 text-emerald-600" />
            <span>Primary Node: Chennai (TN-IN)</span>
          </div>
          <span>•</span>
          <span>Role-Based Access Control</span>
        </div>
      </div>
    </div>
  );
};
