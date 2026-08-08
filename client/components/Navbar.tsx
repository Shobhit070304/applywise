'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-zinc-950/70 border-b border-zinc-800/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="font-serif-classic text-lg tracking-tight text-zinc-100 font-medium">
            Apply<span className="italic text-amber-400 font-serif-classic">Wise</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs text-zinc-400 font-medium tracking-wide">
          {user ? (
            <>
              <Link href="/dashboard" className="hover:text-zinc-100 transition-colors">
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link href="#features" className="hover:text-zinc-100 transition-colors">
                Features
              </Link>
              <Link href="#metrics" className="hover:text-zinc-100 transition-colors">
                Metrics
              </Link>
            </>
          )}
        </nav>

        {/* Auth CTA Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {/* User Avatar + Profile Link Right Next To It */}
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center justify-center font-mono">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <Link
                  href="/profile"
                  className="text-xs text-zinc-300 hover:text-amber-400 font-medium transition-colors"
                >
                  Profile
                </Link>
              </div>

              <span className="text-zinc-800">|</span>

              <button
                onClick={logout}
                className="text-xs text-zinc-400 hover:text-rose-400 transition-colors cursor-pointer"
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
