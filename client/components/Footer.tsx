import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-800/60 bg-zinc-950/80 py-10 px-4 sm:px-6 relative z-10 text-xs text-zinc-500">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-serif-classic font-bold text-xs">
            W
          </div>
          <span className="font-serif-classic text-sm text-zinc-300 tracking-tight">
            Apply<span className="italic text-amber-400 font-serif-classic">Wise</span>
          </span>
          <span className="text-zinc-700">|</span>
          <span>© {new Date().getFullYear()} ApplyWise Inc. All rights reserved.</span>
        </div>

        <div className="flex items-center gap-6 text-zinc-400 font-medium">
          <Link href="#features" className="hover:text-zinc-200 transition-colors">
            Product
          </Link>
          <Link href="/privacy" className="hover:text-zinc-200 transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-zinc-200 transition-colors">
            Terms
          </Link>
          <Link href="/login" className="hover:text-zinc-200 transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    </footer>
  );
}
