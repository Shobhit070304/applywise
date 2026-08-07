'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-zinc-950/70 border-b border-zinc-800/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-zinc-950 font-serif-classic font-bold text-sm tracking-tighter shadow-sm shadow-amber-500/20 group-hover:scale-105 transition-transform">
            W
          </div>
          <span className="font-serif-classic text-lg tracking-tight text-zinc-100 font-medium">
            Apply<span className="italic text-amber-400 font-serif-classic">Wise</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs text-zinc-400 font-medium tracking-wide">
          <Link href="#features" className="hover:text-zinc-100 transition-colors">
            Features
          </Link>
          <Link href="#workflow" className="hover:text-zinc-100 transition-colors">
            Workflow
          </Link>
          <Link href="#metrics" className="hover:text-zinc-100 transition-colors">
            Metrics
          </Link>
          <Link href="#pricing" className="hover:text-zinc-100 transition-colors">
            Pricing
          </Link>
        </nav>

        {/* Auth CTA Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="text-xs text-zinc-300 hover:text-amber-400 font-medium px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 transition-colors flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{user.name.split(' ')[0]}</span>
              </Link>
              <button
                onClick={logout}
                className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors px-2.5 py-1"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-xs text-zinc-300 hover:text-white transition-colors px-3 py-1.5 font-medium"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="text-xs font-medium text-zinc-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 px-3.5 py-1.5 rounded-full transition-all shadow-sm shadow-amber-500/20"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
