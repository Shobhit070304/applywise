'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { Sparkles, ShieldCheck, MailCheck } from 'lucide-react';

export default function VerifyEmailPage() {
  const router = useRouter();
  const { user, refetchUser } = useAuth();

  const [email, setEmail] = useState(user?.email || '');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [isVerified, setIsVerified] = useState(user?.isVerified || false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const targetEmail = user?.email || email.trim().toLowerCase();

    if (!targetEmail || !otp) {
      setError('Please provide your email and 6-digit OTP code.');
      return;
    }

    setLoading(true);
    const res = await apiRequest('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ email: targetEmail, otp: otp.trim() }),
    });
    setLoading(false);

    if (res.status === 200) {
      setIsVerified(true);
      setMessage('Your email has been verified successfully! Redirecting to dashboard...');
      if (refetchUser) await refetchUser();
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } else {
      setError(res.message || res.error || 'Invalid or expired OTP code.');
    }
  };

  const handleResendOtp = async () => {
    setError(null);
    setMessage(null);

    const targetEmail = user?.email || email.trim().toLowerCase();
    if (!targetEmail) {
      setError('Please enter your email address to send OTP.');
      return;
    }

    setResending(true);
    const res = await apiRequest('/auth/send-verification-otp', {
      method: 'POST',
      body: JSON.stringify({ email: targetEmail }),
    });
    setResending(false);

    if (res.status === 200) {
      setMessage('A new 6-digit verification code has been sent to your email.');
    } else {
      setError(res.message || res.error || 'Failed to send verification OTP.');
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
                <span>Account Protection</span>
              </div>
            </div>

            {/* Center Showcase Card */}
            <div className="relative z-10 my-8 space-y-4">
              <h2 className="font-serif-classic text-2xl lg:text-3xl text-zinc-100 font-normal leading-tight">
                Secure your <span className="italic text-amber-400 font-serif-classic">ApplyWise</span> account.
              </h2>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">
                Verifying your email grants full access to automated job tracking, AI resume tools, and instant interview notifications.
              </p>

              {/* Status Card */}
              <div className="glass-card p-4 rounded-xl shadow-xl space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <MailCheck size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-zinc-200">Email Verification Active</p>
                    <p className="text-[10px] text-zinc-500">10-Minute Encrypted OTP</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Info */}
            <div className="relative z-10 pt-4 border-t border-zinc-800/60 flex items-center gap-2 text-xs text-zinc-400">
              <ShieldCheck size={16} className="text-emerald-400" />
              <span>Resend API Encrypted Security</span>
            </div>
          </div>

          {/* Right Side: Form Panel (Full width on Mobile, Half width on MD+) */}
          <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center bg-zinc-950/60">
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
                Account Security
              </span>
              <h1 className="font-serif-classic text-2xl sm:text-3xl font-normal tracking-tight text-zinc-100">
                Verify your Email
              </h1>
              <p className="text-xs text-zinc-400 mt-1.5 font-light">
                Enter the 6-digit OTP code sent to your inbox
              </p>
            </div>

            {/* Feedback messages */}
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

            {isVerified ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-2xl font-bold">
                  ✓
                </div>
                <p className="text-xs text-zinc-300">
                  Email verification complete. You now have full account access.
                </p>
                <Link
                  href="/dashboard"
                  className="inline-block w-full py-2.5 text-xs font-medium text-zinc-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl transition-all text-center shadow-lg shadow-amber-500/20"
                >
                  Go to Dashboard
                </Link>
              </div>
            ) : (
              <form onSubmit={handleVerify} className="space-y-4">
                {!user && (
                  <div>
                    <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@company.com"
                      required
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all"
                    />
                  </div>
                )}

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
                    className="w-full px-3.5 py-3 text-center text-xl tracking-[10px] font-mono rounded-xl bg-zinc-900/80 border border-zinc-800 text-amber-400 placeholder-zinc-700 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all"
                  />
                  <p className="text-[10px] text-zinc-500 mt-1.5">OTP is valid for 10 minutes</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 text-xs font-medium text-zinc-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {loading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></span>
                      <span>Verifying Code...</span>
                    </>
                  ) : (
                    <span>Verify Email</span>
                  )}
                </button>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resending}
                    className="text-xs text-amber-400/80 hover:text-amber-300 transition-colors disabled:opacity-50 cursor-pointer font-medium"
                  >
                    {resending ? 'Sending OTP...' : "Didn't receive code? Resend OTP"}
                  </button>
                </div>
              </form>
            )}

            {/* Footer Link */}
            <div className="mt-6 pt-4 border-t border-zinc-800/60 text-center">
              <Link href="/dashboard" className="text-xs text-zinc-400 hover:text-zinc-200">
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
