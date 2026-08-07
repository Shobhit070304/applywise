'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { Eye, EyeOff, Sparkles, KeyRound, ShieldAlert } from 'lucide-react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Password rules validation
  const passwordRules = [
    { label: 'At least 8 characters', met: newPassword.length >= 8 },
    { label: 'One uppercase letter (A-Z)', met: /[A-Z]/.test(newPassword) },
    { label: 'One lowercase letter (a-z)', met: /[a-z]/.test(newPassword) },
    { label: 'One number (0-9)', met: /[0-9]/.test(newPassword) },
    { label: 'One special character (!@#$%^&*)', met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword) },
  ];

  // Handle Request OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !EMAIL_REGEX.test(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    const res = await apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email: cleanEmail }),
    });
    setLoading(false);

    if (res.status === 200) {
      setMessage('OTP has been sent to your email.');
      setStep(2);
    } else {
      setError(res.message || res.error || 'Failed to send OTP.');
    }
  };

  // Handle Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!otp || otp.length !== 6) {
      setError('Please enter the 6-digit OTP code.');
      return;
    }

    const allRulesMet = passwordRules.every((r) => r.met);
    if (!allRulesMet) {
      setError('Please make sure your new password meets all strength requirements.');
      return;
    }

    setLoading(true);
    const res = await apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        email: cleanEmail,
        otp: otp.trim(),
        newPassword,
      }),
    });
    setLoading(false);

    if (res.status === 200) {
      setStep(3);
      setMessage('Password reset successfully! Redirecting to login page...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } else {
      setError(res.message || res.error || 'Failed to reset password. OTP may be invalid or expired.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-3xl glass-panel shadow-2xl overflow-hidden my-auto border border-zinc-800/80">
          {/* Left Side: Artwork & Visual Showcase (Hidden on Mobile, Visible on MD+) */}
          <div className="hidden md:flex flex-col justify-between p-8 lg:p-10 relative overflow-hidden bg-zinc-950/40 border-r border-zinc-800/60">
            {/* Ambient Background Glow Orbs */}
            <div className="absolute -top-10 -right-10 w-56 h-56 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow"></div>
            <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-amber-600/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" style={{ animationDelay: '2s' }}></div>

            {/* Top Brand Tag */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium tracking-wide">
                <Sparkles size={13} className="text-amber-400" />
                <span>Account Recovery</span>
              </div>
            </div>

            {/* Center Showcase Card */}
            <div className="relative z-10 my-8 space-y-4">
              <h2 className="font-serif-classic text-2xl lg:text-3xl text-zinc-100 font-normal leading-tight">
                Regain access to your <span className="italic text-amber-400 font-serif-classic">workspace</span>.
              </h2>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">
                Securely reset your password using a 6-digit one-time code sent directly to your verified email.
              </p>

              {/* Status Card */}
              <div className="glass-card p-4 rounded-xl shadow-xl space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <KeyRound size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-zinc-200">Encrypted Password Reset</p>
                    <p className="text-[10px] text-zinc-500">10-Minute Expiring OTP & Hash Verification</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Info */}
            <div className="relative z-10 pt-4 border-t border-zinc-800/60 flex items-center gap-2 text-xs text-zinc-400">
              <ShieldAlert size={16} className="text-amber-400" />
              <span>Strict Brute-Force Rate Limiting Protected</span>
            </div>
          </div>

          {/* Right Side: Form Panel (Full width on Mobile, Half width on MD+) */}
          <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center min-h-[520px] bg-zinc-950/60">
            {/* Mobile Top Brand Logo */}
            <div className="md:hidden text-center mb-6">
              <Link href="/" className="inline-flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-zinc-950 font-bold text-sm">
                  W
                </div>
                <span className="font-serif-classic text-lg text-zinc-100">
                  Apply<span className="italic text-amber-400 font-serif-classic">Wise</span>
                </span>
              </Link>
            </div>

            {/* Header */}
            <div className="mb-6">
              <span className="inline-block font-serif-classic text-amber-400 italic text-xs mb-1">
                Account Recovery
              </span>
              <h1 className="font-serif-classic text-2xl sm:text-3xl font-normal tracking-tight text-zinc-100">
                Reset Password
              </h1>
              <p className="text-xs text-zinc-400 mt-1.5 font-light">
                {step === 1 && 'Enter your registered email to receive a 6-digit OTP'}
                {step === 2 && 'Enter the OTP sent to your email and your new password'}
                {step === 3 && 'Your password has been successfully updated'}
              </p>
            </div>

            {/* Feedback banners */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                <span>{error}</span>
              </div>
            )}

            {message && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>{message}</span>
              </div>
            )}

            {/* Step 1: Request OTP */}
            {step === 1 && (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    required
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 text-xs font-medium text-zinc-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {loading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></span>
                      <span>Sending Code...</span>
                    </>
                  ) : (
                    <span>Send Reset OTP</span>
                  )}
                </button>
              </form>
            )}

            {/* Step 2: Enter OTP + New Password */}
            {step === 2 && (
              <form onSubmit={handleResetPassword} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                    6-Digit OTP Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    required
                    className="w-full px-3.5 py-2.5 text-center text-lg tracking-[8px] font-mono rounded-xl bg-zinc-900/80 border border-zinc-800 text-amber-400 placeholder-zinc-700 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      onFocus={() => setIsPasswordFocused(true)}
                      onBlur={() => setIsPasswordFocused(false)}
                      placeholder="New strong password"
                      required
                      className="w-full px-3.5 py-2.5 pr-10 text-xs rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors p-1"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>

                  {/* Compact Password Requirements — hidden by default, shown when focused or typing unmet rules */}
                  {(isPasswordFocused || (newPassword.length > 0 && !passwordRules.every((r) => r.met))) && (
                    <div className="mt-2 p-2 rounded-lg bg-zinc-900/90 border border-zinc-800/80 text-[10px] shadow-lg transition-all">
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                        {passwordRules.map((rule, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 truncate">
                            <span className={rule.met ? 'text-emerald-400 font-bold' : 'text-zinc-600'}>
                              {rule.met ? '✓' : '•'}
                            </span>
                            <span className={rule.met ? 'text-emerald-300 font-medium' : 'text-zinc-500'}>
                              {rule.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 text-xs font-medium text-zinc-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {loading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></span>
                      <span>Resetting Password...</span>
                    </>
                  ) : (
                    <span>Reset Password</span>
                  )}
                </button>
              </form>
            )}

            {/* Step 3: Success State */}
            {step === 3 && (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-2xl font-bold">
                  ✓
                </div>
                <p className="text-xs text-zinc-300">
                  Your password has been reset successfully. Redirecting you to sign in...
                </p>
                <Link
                  href="/login"
                  className="inline-block w-full py-2.5 text-xs font-medium text-zinc-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl transition-all text-center shadow-lg shadow-amber-500/20"
                >
                  Sign In Now
                </Link>
              </div>
            )}

            {/* Footer Link */}
            <div className="mt-6 pt-4 border-t border-zinc-800/60 text-center">
              <Link href="/login" className="text-xs text-amber-400 hover:underline font-medium">
                Back to Sign in
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
