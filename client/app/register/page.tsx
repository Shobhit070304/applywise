'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { Eye, EyeOff, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterPage() {
  const router = useRouter();
  const { register, user, refetchUser } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Password rules validation
  const passwordRules = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'One uppercase letter (A-Z)', met: /[A-Z]/.test(password) },
    { label: 'One lowercase letter (a-z)', met: /[a-z]/.test(password) },
    { label: 'One number (0-9)', met: /[0-9]/.test(password) },
    { label: 'One special character (!@#$%^&*)', met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) },
  ];

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
      setError(res.message || res.error || 'Google signup failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();

    if (!name || !cleanEmail || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!EMAIL_REGEX.test(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    const allRulesMet = passwordRules.every((r) => r.met);
    if (!allRulesMet) {
      setError('Please make sure your password meets all requirements.');
      return;
    }

    setLoading(true);
    const result = await register(name.trim(), cleanEmail, password);
    setLoading(false);

    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.message || 'Registration failed');
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
                <span>Join ApplyWise 2.0</span>
              </div>
            </div>

            {/* Center Showcase Card */}
            <div className="relative z-10 my-6 space-y-4">
              <h2 className="font-serif-classic text-2xl lg:text-3xl text-zinc-100 font-normal leading-tight">
                Unlock your complete <span className="italic text-amber-400 font-serif-classic">career OS</span>.
              </h2>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">
                Create a free account to track job applications, auto-tailor resumes, and get real-time interview updates.
              </p>

              {/* Feature Bullet List */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                  <CheckCircle2 size={15} className="text-amber-400 flex-shrink-0" />
                  <span>Real-time Application Metrics & Analytics</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                  <CheckCircle2 size={15} className="text-amber-400 flex-shrink-0" />
                  <span>AI Resume Keyword & Match Optimizer</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                  <ShieldCheck size={15} className="text-emerald-400 flex-shrink-0" />
                  <span>HttpOnly Cookie & Encryption Protected</span>
                </div>
              </div>
            </div>

            {/* Bottom Testimonial */}
            <div className="relative z-10 pt-4 border-t border-zinc-800/60">
              <p className="font-serif-classic text-[11px] text-zinc-300 italic leading-relaxed">
                "The setup took 30 seconds. Applying to tech roles has never felt this organized and effortless."
              </p>
              <div className="mt-2.5 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 font-serif-classic text-amber-400 font-bold text-[10px] flex items-center justify-center">
                  MV
                </div>
                <div>
                  <p className="text-[11px] font-medium text-zinc-200">Marcus Vance</p>
                  <p className="text-[9px] text-zinc-500">Product Manager @ Vercel</p>
                </div>
              </div>
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

            {/* Form Header */}
            <div className="mb-6">
              <span className="inline-block font-serif-classic text-amber-400 italic text-xs mb-1">
                Start your journey
              </span>
              <h1 className="font-serif-classic text-2xl sm:text-3xl font-normal tracking-tight text-zinc-100">
                Create account
              </h1>
              <p className="text-xs text-zinc-400 mt-1.5 font-light">
                Join ApplyWise to streamline your job search process
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                <span>{error}</span>
              </div>
            )}

            {/* Google Sign Up */}
            <div className="mb-4 flex justify-center overflow-hidden">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google Login Failed')}
                theme="filled_black"
                shape="pill"
                size="medium"
              />
            </div>

            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800/80"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                <span className="bg-zinc-950 px-2.5 text-zinc-500 font-mono">Or continue with email</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Morgan"
                  required
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all"
                />
              </div>

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

              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    placeholder="Strong password"
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

                {/* Compact Password Requirements — hidden by default, shown when focused or typing unmet rules */}
                {(isPasswordFocused || (password.length > 0 && !passwordRules.every((r) => r.met))) && (
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
                className="w-full py-2.5 text-xs font-medium text-zinc-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-3"
              >
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></span>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <span>Create Account</span>
                )}
              </button>
            </form>

            {/* Footer Link */}
            <div className="mt-6 pt-4 border-t border-zinc-800/60 text-center">
              <p className="text-xs text-zinc-500">
                Already have an account?{' '}
                <Link href="/login" className="text-amber-400 hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
