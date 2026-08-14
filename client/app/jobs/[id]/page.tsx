'use client';

import { useEffect, useState, use } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { apiRequest } from '@/lib/api';
import { Job } from '@/types/job';
import Link from 'next/link';
import {
  MapPin,
  Briefcase,
  ExternalLink,
  ChevronLeft,
  Bookmark,
  Share2,
  Building2,
  Calendar,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function SingleJobPage({ params }: PageProps) {
  const { id } = use(params);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    async function fetchJobDetails() {
      setLoading(true);
      const res = await apiRequest<{ success: boolean; data: Job }>(`/jobs/${id}`);
      if (res.error || !res.data?.success) {
        setError(res.message || 'Job not found');
      } else {
        setJob(res.data.data);
      }
      setLoading(false);
    }
    fetchJobDetails();
  }, [id]);

  const formatSalary = (salary?: Job['salary']) => {
    if (!salary || !salary.isDisclosed) return 'Undisclosed';
    const currencySymbol = salary.currency === 'INR' ? '₹' : '$';
    if (salary.min && salary.max) {
      return `${currencySymbol}${(salary.min / 100000).toFixed(1)}L - ${currencySymbol}${(salary.max / 100000).toFixed(1)}L / yr`;
    } else if (salary.max) {
      return `Up to ${currencySymbol}${(salary.max / 100000).toFixed(1)}L / yr`;
    }
    return 'Competitive';
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-amber-400 mb-6 transition-colors font-medium"
        >
          <ChevronLeft className="w-4 h-4" /> Back to all jobs
        </Link>

        {loading ? (
          <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 animate-pulse flex flex-col gap-4">
            <div className="h-6 bg-zinc-800 rounded w-1/2"></div>
            <div className="h-4 bg-zinc-800/60 rounded w-1/3"></div>
            <div className="h-24 bg-zinc-800/20 rounded mt-4"></div>
          </div>
        ) : error || !job ? (
          <div className="p-10 text-center border border-rose-900/30 bg-rose-950/20 rounded-2xl">
            <h2 className="text-lg font-semibold text-rose-300">Job Not Found</h2>
            <p className="text-xs text-zinc-400 mt-1">{error || 'This job listing may have expired'}</p>
          </div>
        ) : (
          <div className="p-6 sm:p-8 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-xl flex flex-col gap-6 shadow-2xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-zinc-800 pb-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-amber-400 font-bold text-xl shrink-0 shadow-inner">
                  {job.company.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {job.title}
                  </h1>
                  <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                    <span className="text-zinc-200 font-semibold">{job.company}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400" /> {job.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSaved(!isSaved)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isSaved
                      ? 'border-amber-500/40 bg-amber-500/10 text-amber-400'
                      : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-400' : ''}`} />
                </button>
                {job.sourceUrl ? (
                  <a
                    href={job.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 font-bold text-xs flex items-center gap-2 shadow-md shadow-amber-500/20 hover:from-amber-300 hover:to-amber-400 transition-all"
                  >
                    Apply Now <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 font-bold text-xs flex items-center gap-2 shadow-md shadow-amber-500/20 hover:from-amber-300 hover:to-amber-400 transition-all cursor-pointer">
                    Apply Now <ExternalLink className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-zinc-950/70 p-4 rounded-xl border border-zinc-800/60">
              <div>
                <span className="text-[10px] text-zinc-500 block uppercase font-mono">Salary</span>
                <span className="text-sm font-semibold text-amber-400 mt-0.5 block">
                  {formatSalary(job.salary)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 block uppercase font-mono">Experience</span>
                <span className="text-sm font-medium text-zinc-200 mt-0.5 block">
                  {job.experienceLevel}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 block uppercase font-mono">Job Type</span>
                <span className="text-sm font-medium text-zinc-200 mt-0.5 block">
                  {job.jobType}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 block uppercase font-mono">Posted</span>
                <span className="text-sm font-medium text-zinc-200 mt-0.5 block">
                  {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Tags */}
            {job.skills && job.skills.length > 0 && (
              <div className="flex flex-col gap-2">
                <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-mono">
                  Required Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1 rounded-lg bg-zinc-800/80 border border-zinc-700/80 text-zinc-200 text-xs font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="flex flex-col gap-3 border-t border-zinc-800 pt-6">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-mono">
                Job Description
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
