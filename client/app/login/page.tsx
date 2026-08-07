'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { Eye, EyeOff, Sparkles, CheckCircle2, TrendingUp } from 'lucide-react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const router = useRouter();
  const { login, user, refetchUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to dashboard
  if (user) {
    router.push('/dashboard');
  }

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) return;
    setError(null);
    setLoading(true);

    const res = await apiRequest('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ credential: credentialResponse.credential }),
    });
    setLoading(false);

    if (res.status === 200) {
      if (refetchUser) await refetchUser();
      router.push('/dashboard');
    } else {
      setError(res.message || res.error || 'Google login failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (!EMAIL_REGEX.test(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    const result = await login(cleanEmail, password);
    setLoading(false);

    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.message || 'Failed to authenticate');
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
                <span>ApplyWise 2.0 — Intelligent Career OS</span>
              </div>
            </div>

            {/* Center Showcase Card */}
            <div className="relative z-10 my-8 space-y-4">
              <h2 className="font-serif-classic text-2xl lg:text-3xl text-zinc-100 font-normal leading-tight">
                Land your dream role with <span className="italic text-amber-400 font-serif-classic">intelligent precision</span>.
              </h2>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">
                Automate application tracking, customize resumes for every job description, and access real-time career intelligence.
              </p>

              {/* Glass Metric Card */}
              <div className="glass-card p-4 rounded-xl shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <TrendingUp size={15} />
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-zinc-200">Resume Match Score</p>
                      <p className="text-[10px] text-zinc-500">AI Tailored for Senior Frontend</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    94%
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2.5 border-t border-zinc-800/60 text-[10px]">
                  <span className="text-zinc-300 flex items-center gap-1.5 font-medium">
                    <CheckCircle2 size={13} className="text-amber-400" /> 14 Active Pipelines
                  </span>
                  <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono">Live Synced</span>
                </div>
              </div>
            </div>

            {/* Bottom Testimonial */}
            <div className="relative z-10 pt-4 border-t border-zinc-800/60">
              <p className="font-serif-classic text-[11px] text-zinc-300 italic leading-relaxed">
                "ApplyWise changed my job search completely. Having my resume tailored and tracked seamlessly makes it a joy to use."
              </p>
              <div className="mt-2.5 flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 font-serif-classic text-amber-400 font-bold text-[10px] flex items-center justify-center">
                  SC
                </div>
                <div>
                  <p className="text-[11px] font-medium text-zinc-200">Sophia Chen</p>
                  <p className="text-[9px] text-zinc-500">Software Engineer @ Stripe</p>
                </div>
              </div>
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

            {/* Form Header */}
            <div className="mb-6">
              <span className="inline-block font-serif-classic text-amber-400 italic text-xs mb-1">
                Welcome back
              </span>
              <h1 className="font-serif-classic text-2xl sm:text-3xl font-normal tracking-tight text-zinc-100">
                Sign in to workspace
              </h1>
              <p className="text-xs text-zinc-400 mt-1.5 font-light">
                Enter your credentials to access your job search workspace
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                <span>{error}</span>
              </div>
            )}

            {/* Google Sign In */}
            <div className="mb-5 flex justify-center overflow-hidden">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google Login Failed')}
                theme="filled_black"
                shape="pill"
                size="medium"
              />
            </div>

            <div className="relative mb-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800/80"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                <span className="bg-zinc-950 px-2.5 text-zinc-500 font-mono">Or continue with email</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
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

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-[11px] text-amber-400/80 hover:text-amber-300 transition-colors font-medium">
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-3.5 py-2.5 pr-10 text-xs rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors p-1"
                    title={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 text-xs font-medium text-zinc-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-3"
              >
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></span>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>

            {/* Footer Link */}
            <div className="mt-6 pt-4 border-t border-zinc-800/60 text-center">
              <p className="text-xs text-zinc-500">
                Don't have an account?{' '}
                <Link href="/register" className="text-amber-400 hover:underline font-medium">
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
