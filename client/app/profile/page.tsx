'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { User, Briefcase, MapPin, Award, Clock, Sparkles, Check, Save, FileText, UploadCloud, ExternalLink, Edit3, X } from 'lucide-react';

// Opens a PDF in-browser via Google Docs Viewer (avoids forced download)
const getViewableResumeUrl = (url: string) =>
  `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=false`;

const EXP_LEVELS = ['Fresher', '0-2 yrs', '2-5 yrs', '5+ yrs'];
const JOB_TYPES = ['Full-time', 'Internship', 'Contract', 'Part-time'];

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, refetchUser } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [preferredRoles, setPreferredRoles] = useState('');
  const [preferredLocations, setPreferredLocations] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Fresher');
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>(['Full-time']);
  const [skills, setSkills] = useState('');

  // Resume State
  const [resumeUrl, setResumeUrl] = useState('');
  const [resumeOriginalName, setResumeOriginalName] = useState('');
  const [uploadingResume, setUploadingResume] = useState(false);

  // Edit Mode State — Default false so fields are NOT open by default
  const [isEditing, setIsEditing] = useState(false);

  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      fetchProfile();
    }
  }, [user, authLoading, router]);

  const fetchProfile = async () => {
    setFetching(true);
    const res = await apiRequest('/profile', { method: 'GET' });
    setFetching(false);

    if (res.status === 200 && res.data.profile) {
      const p = res.data.profile;
      setPreferredRoles(Array.isArray(p.preferredRoles) ? p.preferredRoles.join(', ') : '');
      setPreferredLocations(Array.isArray(p.preferredLocations) ? p.preferredLocations.join(', ') : '');
      setExperienceLevel(p.experienceLevel || 'Fresher');
      setSelectedJobTypes(Array.isArray(p.jobType) && p.jobType.length > 0 ? p.jobType : ['Full-time']);
      setSkills(Array.isArray(p.skills) ? p.skills.join(', ') : '');
      setResumeUrl(p.resumeUrl || '');
      setResumeOriginalName(p.resumeOriginalName || '');
    }
  };

  const toggleJobType = (type: string) => {
    if (!isEditing) return;
    if (selectedJobTypes.includes(type)) {
      if (selectedJobTypes.length > 1) {
        setSelectedJobTypes(selectedJobTypes.filter((t) => t !== type));
      }
    } else {
      setSelectedJobTypes([...selectedJobTypes, type]);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setMessage(null);
    setUploadingResume(true);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/profile/upload-resume`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      const data = await res.json();
      setUploadingResume(false);

      if (res.ok && data.profile) {
        setResumeUrl(data.profile.resumeUrl || '');
        setResumeOriginalName(data.profile.resumeOriginalName || file.name);
        setMessage('Resume uploaded to Cloudinary successfully!');
      } else {
        setError(data.message || 'Failed to upload resume.');
      }
    } catch (err: any) {
      setUploadingResume(false);
      setError(err.message || 'Failed to upload resume.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!name.trim()) {
      setError('Name is required.');
      return;
    }

    setSaving(true);
    const res = await apiRequest('/profile', {
      method: 'PUT',
      body: JSON.stringify({
        name: name.trim(),
        preferredRoles,
        preferredLocations,
        experienceLevel,
        jobType: selectedJobTypes,
        skills,
      }),
    });
    setSaving(false);

    if (res.status === 200) {
      setMessage('Profile updated successfully!');
      setIsEditing(false); // Lock fields back after saving
      if (refetchUser) await refetchUser();
      setTimeout(() => setMessage(null), 3000);
    } else {
      setError(res.message || res.error || 'Failed to update profile.');
    }
  };

  if (authLoading || fetching) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-zinc-100">
        <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="font-serif-classic text-sm text-zinc-400 italic">Loading profile preferences...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-10 relative z-10">
        {/* Header with Edit Toggle Button */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium mb-3">
              <Sparkles size={13} className="text-amber-400" />
              <span>Job Preferences & Career Info</span>
            </div>
            <h1 className="font-serif-classic text-3xl font-normal text-zinc-100 tracking-tight">
              User Profile <span className="italic text-amber-400">Settings</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1 font-light">
              Customize your target roles, locations, experience level, and resume for smart application tracking.
            </p>
          </div>

          {/* Edit / Cancel Toggle Button */}
          {isEditing ? (
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0"
            >
              <X size={14} />
              <span>Cancel Edit</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-xs font-medium text-zinc-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer flex-shrink-0"
            >
              <Edit3 size={14} />
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        {/* Feedback Banners */}
        {error && (
          <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="mb-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
            <Check size={14} className="text-emerald-400" />
            <span>{message}</span>
          </div>
        )}

        {/* Profile Card Form */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-zinc-800/80 shadow-2xl backdrop-blur-xl space-y-6">
          {/* Resume Upload Section */}
          <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-medium uppercase tracking-wider text-amber-400 font-mono flex items-center gap-2">
                <FileText size={14} /> Resume Document
              </h2>
              {resumeUrl && (
                <a
                  href={getViewableResumeUrl(resumeUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-amber-400 hover:underline inline-flex items-center gap-1 font-medium"
                >
                  <span>View Resume</span>
                  <ExternalLink size={12} />
                </a>
              )}
            </div>

            {resumeUrl ? (
              <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 text-xs text-zinc-200">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-8 h-8 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                    <FileText size={16} />
                  </div>
                  <div className="truncate">
                    <p className="font-medium truncate">{resumeOriginalName || 'Resume.pdf'}</p>
                    <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <Check size={10} /> Hosted on Cloudinary
                    </p>
                  </div>
                </div>

                {isEditing && (
                  <label className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors text-xs font-medium cursor-pointer flex-shrink-0">
                    {uploadingResume ? 'Uploading...' : 'Replace PDF'}
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                      disabled={uploadingResume}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            ) : (
              <label className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-colors bg-zinc-950/40 ${
                isEditing ? 'border-zinc-800 hover:border-amber-500/50 cursor-pointer group' : 'border-zinc-800/60 opacity-60 cursor-not-allowed'
              }`}>
                <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-2">
                  <UploadCloud size={20} />
                </div>
                <p className="text-xs font-medium text-zinc-200">
                  {uploadingResume ? 'Uploading to Cloudinary...' : 'Upload Resume PDF'}
                </p>
                <p className="text-[10px] text-zinc-500 mt-1">
                  {isEditing ? 'PDF or DOCX format (Max 5MB)' : 'Click "Edit Profile" to upload your resume'}
                </p>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  disabled={!isEditing || uploadingResume}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info Section */}
            <div className="space-y-4 pb-6 border-b border-zinc-800/60">
              <h2 className="text-xs font-medium uppercase tracking-wider text-amber-400 font-mono flex items-center gap-2">
                <User size={14} /> Basic Identity
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!isEditing}
                    required
                    placeholder="Alex Morgan"
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border transition-all ${
                      isEditing
                        ? 'bg-zinc-900/80 border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30'
                        : 'bg-zinc-950/60 border-zinc-800/60 text-zinc-300 cursor-not-allowed'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-500 mb-1.5">
                    Email Address <span className="text-[9px] text-zinc-600">(Read-Only)</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-zinc-950/60 border border-zinc-800/60 text-zinc-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Career Preferences Section */}
            <div className="space-y-5 pb-6 border-b border-zinc-800/60">
              <h2 className="text-xs font-medium uppercase tracking-wider text-amber-400 font-mono flex items-center gap-2">
                <Briefcase size={14} /> Job Preferences
              </h2>

              {/* Preferred Roles */}
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                  Preferred Roles
                </label>
                <input
                  type="text"
                  value={preferredRoles}
                  onChange={(e) => setPreferredRoles(e.target.value)}
                  disabled={!isEditing}
                  placeholder="e.g. Backend Developer, SDE, Fullstack Engineer"
                  className={`w-full px-3.5 py-2.5 text-xs rounded-xl border transition-all ${
                    isEditing
                      ? 'bg-zinc-900/80 border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30'
                      : 'bg-zinc-950/60 border-zinc-800/60 text-zinc-300 cursor-not-allowed'
                  }`}
                />
              </div>

              {/* Preferred Locations */}
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1">
                  <MapPin size={12} className="text-amber-400" /> Preferred Locations
                </label>
                <input
                  type="text"
                  value={preferredLocations}
                  onChange={(e) => setPreferredLocations(e.target.value)}
                  disabled={!isEditing}
                  placeholder="e.g. Bangalore, Remote, Gurgaon"
                  className={`w-full px-3.5 py-2.5 text-xs rounded-xl border transition-all ${
                    isEditing
                      ? 'bg-zinc-900/80 border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30'
                      : 'bg-zinc-950/60 border-zinc-800/60 text-zinc-300 cursor-not-allowed'
                  }`}
                />
              </div>

              {/* Experience Level Selector */}
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1">
                  <Award size={12} className="text-amber-400" /> Experience Level
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {EXP_LEVELS.map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      disabled={!isEditing}
                      onClick={() => setExperienceLevel(lvl)}
                      className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all text-center ${
                        experienceLevel === lvl
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-sm shadow-amber-500/10'
                          : 'bg-zinc-900/60 border-zinc-800 text-zinc-500'
                      } ${isEditing ? 'cursor-pointer hover:border-zinc-700' : 'cursor-not-allowed opacity-80'}`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Job Type Multi-Select Pills */}
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1">
                  <Clock size={12} className="text-amber-400" /> Job Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {JOB_TYPES.map((type) => {
                    const isSelected = selectedJobTypes.includes(type);
                    return (
                      <button
                        key={type}
                        type="button"
                        disabled={!isEditing}
                        onClick={() => toggleJobType(type)}
                        className={`py-1.5 px-3.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                            : 'bg-zinc-900/60 border-zinc-800 text-zinc-500'
                        } ${isEditing ? 'cursor-pointer hover:text-zinc-300' : 'cursor-not-allowed opacity-80'}`}
                      >
                        {isSelected && <Check size={12} className="text-emerald-400" />}
                        <span>{type}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Optional Skills Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                  Skills <span className="text-zinc-600 font-mono">(Optional)</span>
                </label>
              </div>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                disabled={!isEditing}
                placeholder="e.g. React, Node.js, Python, TypeScript, MongoDB"
                className={`w-full px-3.5 py-2.5 text-xs rounded-xl border transition-all ${
                  isEditing
                    ? 'bg-zinc-900/80 border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30'
                    : 'bg-zinc-950/60 border-zinc-800/60 text-zinc-300 cursor-not-allowed'
                }`}
              />
            </div>

            {/* Save Button (Only visible when editing) */}
            {isEditing && (
              <div className="pt-4 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 text-xs font-medium text-zinc-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  {saving ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></span>
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
