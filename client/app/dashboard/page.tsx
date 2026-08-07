'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, logout, refetchUser } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-zinc-100">
        <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="font-serif-classic text-sm text-zinc-400 italic">Loading workspace...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10 relative z-10">
        {/* Top Welcome Banner */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-zinc-800/80 mb-8 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>JWT Authenticated</span>
              </span>
              <span className="text-xs text-zinc-500">•</span>
              {user.isVerified ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  ✓ Email Verified
                </span>
              ) : (
                <Link
                  href="/verify-email"
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:underline"
                >
                  ! Verify Email (Enter OTP)
                </Link>
              )}
              <span className="text-xs text-zinc-500">•</span>
              <span className="text-xs text-zinc-400 font-mono">ID: {user._id}</span>
            </div>
            <h1 className="font-serif-classic text-3xl font-normal text-zinc-100 tracking-tight">
              Welcome back, <span className="italic text-amber-400">{user.name}</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1 font-light">
              Connected to backend MongoDB & JWT Auth Service
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => refetchUser()}
              className="text-xs font-medium px-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Refresh Profile</span>
            </button>
            <button
              onClick={logout}
              className="text-xs font-medium px-3.5 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 hover:bg-rose-500/20 transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card 1: User Profile */}
          <div className="glass-card p-5 rounded-xl border border-zinc-800/80">
            <h2 className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-4 font-mono">
              Account Profile
            </h2>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase font-mono">Full Name</span>
                <span className="text-zinc-200 font-medium">{user.name}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase font-mono">Email Address</span>
                <span className="text-zinc-200 font-medium">{user.email}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase font-mono">Joined Date</span>
                <span className="text-zinc-400">
                  {new Date(user.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Applications Overview */}
          <div className="glass-card p-5 rounded-xl border border-zinc-800/80">
            <h2 className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-4 font-mono">
              Application Metrics
            </h2>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/60">
                <span className="font-serif-classic text-2xl text-amber-400 font-medium">12</span>
                <span className="block text-[10px] text-zinc-500 mt-0.5">Active Tracked</span>
              </div>
              <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/60">
                <span className="font-serif-classic text-2xl text-emerald-400 font-medium">4</span>
                <span className="block text-[10px] text-zinc-500 mt-0.5">Interviews Set</span>
              </div>
            </div>
          </div>

          {/* Card 3: Session Security */}
          <div className="glass-card p-5 rounded-xl border border-zinc-800/80">
            <h2 className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-4 font-mono">
              Session Security
            </h2>
            <div className="space-y-2">
              <div className="p-2.5 rounded bg-zinc-950 font-mono text-[10px] text-emerald-400 border border-zinc-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>HttpOnly Cookie Auth</span>
              </div>
              <p className="text-[10px] text-zinc-500 leading-normal">
                Tokens are stored in secure HttpOnly cookies, sent automatically with cross-origin credentials.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Applications Tracker Table */}
        <div className="glass-panel p-6 rounded-2xl border border-zinc-800/80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif-classic text-lg text-zinc-100">
              Recent Job Applications
            </h3>
            <span className="text-xs text-amber-400 font-mono">+ Add Application</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="text-[10px] text-zinc-500 uppercase font-mono border-b border-zinc-800">
                <tr>
                  <th className="pb-2.5 font-medium">Company</th>
                  <th className="pb-2.5 font-medium">Role</th>
                  <th className="pb-2.5 font-medium">Status</th>
                  <th className="pb-2.5 font-medium text-right">Applied Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                <tr>
                  <td className="py-3 font-medium text-zinc-200">Linear</td>
                  <td className="py-3 text-zinc-400">Senior Frontend Engineer</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Interview
                    </span>
                  </td>
                  <td className="py-3 text-right text-zinc-500 font-mono">2026-08-01</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-zinc-200">Vercel</td>
                  <td className="py-3 text-zinc-400">Product Designer</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      Screening
                    </span>
                  </td>
                  <td className="py-3 text-right text-zinc-500 font-mono">2026-07-29</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-zinc-200">Stripe</td>
                  <td className="py-3 text-zinc-400">Fullstack Developer</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-400 border border-zinc-700">
                      Applied
                    </span>
                  </td>
                  <td className="py-3 text-right text-zinc-500 font-mono">2026-07-25</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
