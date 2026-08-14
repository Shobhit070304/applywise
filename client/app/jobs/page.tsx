'use client';

import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { apiRequest } from '@/lib/api';
import { Job, JobsResponse, PaginationMeta } from '@/types/job';
import {
  Search,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Filter,
  ExternalLink,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Building2,
  Bookmark,
  Check,
  X,
  SlidersHorizontal,
} from 'lucide-react';

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobType, setSelectedJobType] = useState<string>('');
  const [selectedExp, setSelectedExp] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('desc');
  const [page, setPage] = useState<number>(1);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 10,
    totalJobs: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);

    const queryParams = new URLSearchParams();
    if (searchTerm) queryParams.append('search', searchTerm);
    if (selectedJobType) queryParams.append('jobType', selectedJobType);
    if (selectedExp) queryParams.append('experienceLevel', selectedExp);
    if (selectedLocation) queryParams.append('location', selectedLocation);
    queryParams.append('sortBy', 'createdAt');
    queryParams.append('order', sortOrder);
    queryParams.append('page', page.toString());
    queryParams.append('limit', '10');

    const response = await apiRequest<JobsResponse>(`/jobs?${queryParams.toString()}`);

    if (response.error || !response.data?.success) {
      setError(response.message || 'Failed to load jobs');
      setJobs([]);
    } else {
      const fetchedJobs = response.data.data || [];
      setJobs(fetchedJobs);
      setPagination(response.data.pagination);

      // Automatically select first job if none selected or current selection is not in list
      if (fetchedJobs.length > 0) {
        setSelectedJob((prev) => {
          const exists = fetchedJobs.find((j) => j._id === prev?._id);
          return exists || fetchedJobs[0];
        });
      } else {
        setSelectedJob(null);
      }
    }
    setLoading(false);
  }, [searchTerm, selectedJobType, selectedExp, selectedLocation, sortOrder, page]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const toggleSaveJob = (jobId: string) => {
    setSavedJobIds((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };

  const formatSalary = (salary: Job['salary']) => {
    if (!salary || !salary.isDisclosed) return 'Undisclosed';
    const currencySymbol = salary.currency === 'INR' ? '₹' : '$';

    if (salary.min && salary.max) {
      return `${currencySymbol}${(salary.min / 100000).toFixed(1)}L - ${currencySymbol}${(salary.max / 100000).toFixed(1)}L / yr`;
    } else if (salary.max) {
      return `Up to ${currencySymbol}${(salary.max / 100000).toFixed(1)}L / yr`;
    } else if (salary.min) {
      return `From ${currencySymbol}${(salary.min / 100000).toFixed(1)}L / yr`;
    }
    return 'Competitive';
  };

  const getRelativeTime = (dateString: string) => {
    const diffMs = new Date().getTime() - new Date(dateString).getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedJobType('');
    setSelectedExp('');
    setSelectedLocation('');
    setSortOrder('desc');
    setPage(1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
        {/* Search & Header Section */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
                Discover Roles <Sparkles className="w-4 h-4 text-amber-400" />
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                Handpicked job listings tailored for modern engineers & creators
              </p>
            </div>
            <div className="text-xs text-zinc-400 bg-zinc-900/80 px-3 py-1.5 rounded-full border border-zinc-800 self-start sm:self-auto">
              <span className="text-amber-400 font-medium">{pagination.totalJobs}</span> positions available
            </div>
          </div>

          {/* Sleek Search & Dropdown Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3">
            {/* Search Input (5 Cols on MD) */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search by job title..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Job Type Select (3 Cols on MD) */}
            <div className="md:col-span-3 relative">
              <Clock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
              <select
                value={selectedJobType}
                onChange={(e) => {
                  setSelectedJobType(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl pl-10 pr-8 py-2.5 text-xs sm:text-sm text-zinc-200 focus:outline-none focus:border-amber-500/50 appearance-none cursor-pointer"
              >
                <option value="">All Job Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            {/* Location Select (2 Cols on MD) */}
            <div className="md:col-span-2 relative">
              <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
              <select
                value={selectedLocation}
                onChange={(e) => {
                  setSelectedLocation(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl pl-10 pr-8 py-2.5 text-xs sm:text-sm text-zinc-200 focus:outline-none focus:border-amber-500/50 appearance-none cursor-pointer"
              >
                <option value="">All Locations</option>
                <option value="Remote">Remote Only</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi NCR</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Pune">Pune</option>
              </select>
            </div>

            {/* Experience Select (2 Cols on MD) */}
            <div className="md:col-span-2 relative">
              <Briefcase className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
              <select
                value={selectedExp}
                onChange={(e) => {
                  setSelectedExp(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl pl-10 pr-8 py-2.5 text-xs sm:text-sm text-zinc-200 focus:outline-none focus:border-amber-500/50 appearance-none cursor-pointer"
              >
                <option value="">All Experience</option>
                <option value="Fresher">Fresher</option>
                <option value="0-2 yrs">0-2 years</option>
                <option value="2-5 yrs">2-5 years</option>
                <option value="5+ yrs">5+ years</option>
              </select>
            </div>
          </div>

          {/* Active Filters Bar & Sorting Dropdown */}
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2">
              {searchTerm || selectedJobType || selectedExp || selectedLocation ? (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-zinc-500 font-medium">Active:</span>
                  {selectedJobType && (
                    <span className="bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2.5 py-0.5 rounded-full text-xs flex items-center gap-1">
                      {selectedJobType}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-white"
                        onClick={() => {
                          setSelectedJobType('');
                          setPage(1);
                        }}
                      />
                    </span>
                  )}
                  {selectedLocation && (
                    <span className="bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2.5 py-0.5 rounded-full text-xs flex items-center gap-1">
                      {selectedLocation}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-white"
                        onClick={() => {
                          setSelectedLocation('');
                          setPage(1);
                        }}
                      />
                    </span>
                  )}
                  {selectedExp && (
                    <span className="bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2.5 py-0.5 rounded-full text-xs flex items-center gap-1">
                      {selectedExp}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-white"
                        onClick={() => {
                          setSelectedExp('');
                          setPage(1);
                        }}
                      />
                    </span>
                  )}
                  {searchTerm && (
                    <span className="bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2.5 py-0.5 rounded-full text-xs flex items-center gap-1">
                      "{searchTerm}"
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-white"
                        onClick={() => {
                          setSearchTerm('');
                          setPage(1);
                        }}
                      />
                    </span>
                  )}
                  <button
                    onClick={clearFilters}
                    className="text-amber-400 hover:text-amber-300 underline font-medium ml-1 cursor-pointer"
                  >
                    Clear all
                  </button>
                </div>
              ) : null}
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 ml-auto text-xs text-zinc-400">
              <span>Sort by:</span>
              <select
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value);
                  setPage(1);
                }}
                className="bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1 text-zinc-200 focus:outline-none cursor-pointer"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Master-Detail Split Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Job List (5 Cols on LG) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {loading ? (
              // Loading Skeleton List
              Array.from({ length: 5 }).map((_, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-zinc-800/60 bg-zinc-900/40 animate-pulse flex flex-col gap-2.5"
                >
                  <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
                  <div className="h-3 bg-zinc-800/60 rounded w-1/2"></div>
                  <div className="flex gap-2 mt-1">
                    <div className="h-5 bg-zinc-800/40 rounded w-16"></div>
                    <div className="h-5 bg-zinc-800/40 rounded w-20"></div>
                  </div>
                </div>
              ))
            ) : error ? (
              <div className="p-6 rounded-xl border border-rose-900/30 bg-rose-950/20 text-center text-xs text-rose-300">
                {error}
              </div>
            ) : jobs.length === 0 ? (
              <div className="p-10 rounded-2xl border border-zinc-800/60 bg-zinc-900/20 text-center flex flex-col items-center gap-3">
                <Building2 className="w-8 h-8 text-zinc-600" />
                <div>
                  <h3 className="text-sm font-medium text-zinc-300">No jobs match your query</h3>
                  <p className="text-xs text-zinc-500 mt-1">Try clearing filters or searching another keyword</p>
                </div>
                <button
                  onClick={clearFilters}
                  className="mt-2 px-4 py-1.5 rounded-lg bg-zinc-800 text-xs font-medium text-zinc-200 hover:bg-zinc-700"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              // Sleek Job Cards List
              jobs.map((job) => {
                const isSelected = selectedJob?._id === job._id;
                const isSaved = savedJobIds.includes(job._id);

                return (
                  <div
                    key={job._id}
                    onClick={() => setSelectedJob(job)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-2.5 relative group ${
                      isSelected
                        ? 'bg-zinc-900/90 border-amber-500/50 shadow-md shadow-amber-500/5'
                        : 'bg-zinc-900/30 hover:bg-zinc-900/60 border-zinc-800/70 hover:border-zinc-700'
                    }`}
                  >
                    {/* Header: Logo Initial + Title */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        {/* Company Logo Initial */}
                        <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-amber-400 font-bold text-sm shrink-0">
                          {job.company.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h2
                            className={`text-sm font-medium leading-snug line-clamp-1 transition-colors ${
                              isSelected ? 'text-amber-400' : 'text-zinc-100 group-hover:text-amber-300'
                            }`}
                          >
                            {job.title}
                          </h2>
                          <p className="text-xs text-zinc-400 flex items-center gap-1.5 mt-0.5">
                            <span>{job.company}</span>
                            <span className="text-zinc-700">•</span>
                            <span className="text-zinc-400">{job.location}</span>
                          </p>
                        </div>
                      </div>

                      {/* Save Bookmark Toggle */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaveJob(job._id);
                        }}
                        className={`text-zinc-500 hover:text-amber-400 transition-colors p-1 ${
                          isSaved ? 'text-amber-400' : ''
                        }`}
                        title={isSaved ? 'Saved' : 'Save job'}
                      >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-400' : ''}`} />
                      </button>
                    </div>

                    {/* Metadata Badges */}
                    <div className="flex items-center gap-2 flex-wrap text-[11px] mt-1">
                      <span className="px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-300 border border-zinc-700/50">
                        {job.jobType}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {job.experienceLevel}
                      </span>
                      <span className="text-zinc-400 ml-auto font-mono text-[10px]">
                        {getRelativeTime(job.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between py-3 px-2 text-xs text-zinc-400">
                <button
                  disabled={!pagination.hasPrevPage}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </button>
                <span>
                  Page <strong className="text-zinc-200">{pagination.page}</strong> of{' '}
                  <strong className="text-zinc-200">{pagination.totalPages}</strong>
                </span>
                <button
                  disabled={!pagination.hasNextPage}
                  onClick={() => setPage((p) => p + 1)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Detail Panel (7 Cols on LG) */}
          <div className="lg:col-span-7 sticky top-20">
            {selectedJob ? (
              <div className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-xl flex flex-col gap-6 shadow-xl">
                {/* Detail Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-zinc-800 pb-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-amber-400 font-bold text-lg shrink-0">
                      {selectedJob.company.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
                        {selectedJob.title}
                      </h2>
                      <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                        <span className="text-zinc-200 font-medium">{selectedJob.company}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-zinc-400" /> {selectedJob.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                    <button
                      onClick={() => toggleSaveJob(selectedJob._id)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                        savedJobIds.includes(selectedJob._id)
                          ? 'border-amber-500/40 bg-amber-500/10 text-amber-400'
                          : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-700'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${savedJobIds.includes(selectedJob._id) ? 'fill-amber-400' : ''}`} />
                    </button>
                    {selectedJob.sourceUrl ? (
                      <a
                        href={selectedJob.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 hover:from-amber-300 hover:to-amber-400 transition-all"
                      >
                        Apply Now <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 hover:from-amber-300 hover:to-amber-400 transition-all cursor-pointer">
                        Apply Now <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Grid Metadata Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-800/60">
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase font-mono">Salary</span>
                    <span className="text-xs font-medium text-amber-400 mt-0.5 block">
                      {formatSalary(selectedJob.salary)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase font-mono">Experience</span>
                    <span className="text-xs font-medium text-zinc-200 mt-0.5 block">
                      {selectedJob.experienceLevel}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase font-mono">Job Type</span>
                    <span className="text-xs font-medium text-zinc-200 mt-0.5 block">
                      {selectedJob.jobType}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase font-mono">Posted</span>
                    <span className="text-xs font-medium text-zinc-200 mt-0.5 block">
                      {getRelativeTime(selectedJob.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Skills Tags */}
                {selectedJob.skills && selectedJob.skills.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <h4 className="text-xs font-medium text-zinc-400 uppercase tracking-wider font-mono">
                      Required Skills & Keywords
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedJob.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 rounded-lg bg-zinc-800/60 border border-zinc-700/60 text-zinc-200 text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="flex flex-col gap-2 border-t border-zinc-800/80 pt-4">
                  <h4 className="text-xs font-medium text-zinc-400 uppercase tracking-wider font-mono">
                    Job Overview & Description
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                    {selectedJob.description}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-12 rounded-2xl border border-zinc-800/60 bg-zinc-900/20 text-center text-zinc-500 text-xs flex flex-col items-center gap-2">
                <Briefcase className="w-8 h-8 text-zinc-700" />
                Select a job from the list to view full details
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
