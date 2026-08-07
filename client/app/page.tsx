'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-16 sm:pt-24 pb-20 px-4 sm:px-6 max-w-6xl mx-auto text-center z-10">
        {/* Subtle Announcement Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-medium tracking-wide mb-6 animate-float shadow-sm shadow-amber-500/10">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
          <span>ApplyWise 2.0 — AI Job Application & Career OS</span>
        </div>

        {/* Hero Title with Classic Serif Aesthetic */}
        <h1 className="font-serif-classic text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-zinc-100 max-w-4xl mx-auto leading-[1.1] mb-6">
          Land your dream role with <span className="italic text-amber-400 font-serif-classic">intelligent precision</span>.
        </h1>

        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto font-light leading-relaxed mb-8">
          ApplyWise automates application tracking, customizes resumes for every job description, and provides real-time AI interview intelligence.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
          {user ? (
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-6 py-2.5 text-xs font-medium text-zinc-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-full transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2"
            >
              <span>Go to Your Workspace</span>
              <span>→</span>
            </Link>
          ) : (
            <>
              <Link
                href="/register"
                className="w-full sm:w-auto px-6 py-2.5 text-xs font-medium text-zinc-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-full transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2"
              >
                <span>Start Free Trial</span>
                <span>→</span>
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto px-6 py-2.5 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 rounded-full transition-all flex items-center justify-center gap-2"
              >
                <span>Sign In to Account</span>
              </Link>
            </>
          )}
        </div>

        {/* Interactive Workspace Preview Graphic */}
        <div className="max-w-4xl mx-auto rounded-2xl p-2 bg-gradient-to-b from-zinc-700/30 via-zinc-800/20 to-transparent border border-zinc-800/80 shadow-2xl backdrop-blur-xl">
          <div className="bg-zinc-950/90 rounded-xl p-4 sm:p-6 border border-zinc-800/60 text-left">
            {/* Top Mock Window Bar */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800/60 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                <span className="ml-2 font-mono text-[10px] text-zinc-500">applywise.app/workspace</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>AI Pipeline Active</span>
              </div>
            </div>

            {/* Mock Dashboard Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">Response Rate</span>
                <span className="font-serif-classic text-xl text-amber-400">48.2%</span>
                <span className="text-[9px] text-emerald-400 block mt-0.5">↑ +14% vs avg</span>
              </div>
              <div className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">Tailored Resumes</span>
                <span className="font-serif-classic text-xl text-zinc-200">34 Generated</span>
                <span className="text-[9px] text-zinc-400 block mt-0.5">100% ATS score</span>
              </div>
              <div className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">Offers Pending</span>
                <span className="font-serif-classic text-xl text-emerald-400">2 Active</span>
                <span className="text-[9px] text-zinc-400 block mt-0.5">Final rounds completed</span>
              </div>
            </div>

            {/* Mock Recent Log */}
            <div className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-serif-classic text-amber-400 text-xs">
                  AI
                </div>
                <div>
                  <p className="text-zinc-200 font-medium text-xs">Resume tailored for Senior Frontend @ Linear</p>
                  <p className="text-[10px] text-zinc-500">Matched 14 required keywords from job description</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Completed</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section id="features" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto w-full relative z-10 border-t border-zinc-800/60">
        <div className="text-center mb-14">
          <span className="font-serif-classic text-amber-400 italic text-sm block mb-1">
            Engineered for high performers
          </span>
          <h2 className="font-serif-classic text-3xl sm:text-4xl font-normal text-zinc-100 tracking-tight">
            Everything you need to master your search
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="glass-card p-6 rounded-2xl border border-zinc-800/80">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-serif-classic text-lg mb-4">
              01
            </div>
            <h3 className="font-serif-classic text-lg text-zinc-100 mb-2">
              AI Resume Tailoring
            </h3>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              Dynamically rewrite your work bullets to perfectly align with job requirements while maintaining strict ATS readability.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-card p-6 rounded-2xl border border-zinc-800/80">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-serif-classic text-lg mb-4">
              02
            </div>
            <h3 className="font-serif-classic text-lg text-zinc-100 mb-2">
              Automated Tracker
            </h3>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              Track status, follow-up dates, interviewer details, and compensation notes in a clean unified Kanban view.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-card p-6 rounded-2xl border border-zinc-800/80">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-serif-classic text-lg mb-4">
              03
            </div>
            <h3 className="font-serif-classic text-lg text-zinc-100 mb-2">
              Interview Intelligence
            </h3>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              Receive company-specific question prep, tech stack briefs, and strategic talking points prior to every interview.
            </p>
          </div>
        </div>
      </section>

      {/* Metrics / Stats Banner */}
      <section id="metrics" className="py-16 px-4 sm:px-6 max-w-6xl mx-auto w-full relative z-10">
        <div className="glass-panel p-8 rounded-2xl border border-zinc-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <span className="font-serif-classic text-3xl sm:text-4xl text-amber-400 block font-normal">3.2x</span>
            <span className="text-[11px] text-zinc-400 mt-1 block">Higher Callback Rate</span>
          </div>
          <div>
            <span className="font-serif-classic text-3xl sm:text-4xl text-zinc-100 block font-normal">14 Days</span>
            <span className="text-[11px] text-zinc-400 mt-1 block">Avg Time to First Interview</span>
          </div>
          <div>
            <span className="font-serif-classic text-3xl sm:text-4xl text-amber-400 block font-normal">10k+</span>
            <span className="text-[11px] text-zinc-400 mt-1 block">Applications Processed</span>
          </div>
          <div>
            <span className="font-serif-classic text-3xl sm:text-4xl text-zinc-100 block font-normal">99.4%</span>
            <span className="text-[11px] text-zinc-400 mt-1 block">ATS Compatibility</span>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto w-full relative z-10">
        <div className="text-center mb-12">
          <span className="font-serif-classic text-amber-400 italic text-sm block mb-1">
            Proven Results
          </span>
          <h2 className="font-serif-classic text-3xl font-normal text-zinc-100 tracking-tight">
            Loved by ambitious professionals
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-zinc-800/80">
            <p className="font-serif-classic text-sm text-zinc-300 italic mb-4 leading-relaxed">
              "ApplyWise changed my job search completely. Tailoring my resume for each role used to take hours. Now it takes 30 seconds."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-serif-classic text-xs text-amber-400">
                SC
              </div>
              <div>
                <p className="text-xs text-zinc-200 font-medium">Sophia Chen</p>
                <p className="text-[10px] text-zinc-500">Software Engineer @ Stripe</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-zinc-800/80">
            <p className="font-serif-classic text-sm text-zinc-300 italic mb-4 leading-relaxed">
              "The interface is so refined and compact. Having MongoDB & JWT auth backend connection working seamlessly makes it a joy to use."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-serif-classic text-xs text-amber-400">
                MD
              </div>
              <div>
                <p className="text-xs text-zinc-200 font-medium">Marcus Vance</p>
                <p className="text-[10px] text-zinc-500">Product Manager @ Vercel</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 max-w-4xl mx-auto w-full relative z-10 text-center">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-zinc-800/80 shadow-2xl relative overflow-hidden">
          <h2 className="font-serif-classic text-3xl sm:text-5xl font-normal text-zinc-100 tracking-tight mb-4">
            Ready to accelerate your <span className="italic text-amber-400 font-serif-classic">career</span>?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto font-light mb-8">
            Create your account today and experience intelligent job search management.
          </p>

          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-7 py-3 text-xs font-medium text-zinc-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-full transition-all shadow-lg shadow-amber-500/20"
          >
            <span>Create Your Free Account</span>
            <span>→</span>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
