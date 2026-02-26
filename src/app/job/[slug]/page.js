"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return new Date(dateStr).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

export default function JobDetailPage() {
  const params = useParams();
  const slug = params?.slug;

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    if (!slug) return;
    const fetchJob = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/jobs/job/${slug}/`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Job not found");
        const data = await res.json();
        setJob(data);
      } catch (e) {
        setError(e.message || "Failed to load job");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [slug]);

  const handleBookmark = async () => {
    if (!isLoggedIn) { window.location.href = "/account/signin"; return; }
    setBookmarked((v) => !v);
    // Wire to POST /api/jobs/bookmark/ with job slug
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Clash+Display:wght@600;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .font-display { font-family: 'Clash Display', 'DM Sans', sans-serif; }
        .green-gradient { background: linear-gradient(135deg, #065f46 0%, #059669 60%, #34d399 100%); }
        .btn-green { background: linear-gradient(135deg, #065f46, #059669); transition: all 0.2s; }
        .btn-green:hover { opacity: 0.92; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(5,150,105,0.3); }
        .fade-up { animation: fadeUp 0.5s ease forwards; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .skeleton { background: linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%); background-size:200% 100%; animation:shimmer 1.4s infinite; }
        @keyframes shimmer { 0%{background-position:200% 0}100%{background-position:-200% 0} }
        .prose p { margin-bottom: 1em; line-height: 1.75; }
        .prose ul { list-style: disc; padding-left: 1.5rem; margin-bottom: 1em; }
        .prose li { margin-bottom: 0.4em; }
        .prose h3 { font-weight: 700; font-size: 1.1rem; margin: 1.2em 0 0.4em; color: #111; }
      `}</style>

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 green-gradient rounded-lg flex items-center justify-center text-white font-bold text-sm">Py</div>
            <span className="font-display text-lg text-gray-900">Python<span className="text-emerald-600">8ja</span></span>
          </Link>
          <Link href="/jobs" className="text-sm text-gray-500 hover:text-emerald-700 font-medium transition-colors flex items-center gap-1">
            ← All Jobs
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-4">
              <div className="flex gap-4">
                <div className="skeleton w-16 h-16 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-32 rounded" />
                  <div className="skeleton h-6 w-56 rounded" />
                  <div className="flex gap-2 pt-1">
                    <div className="skeleton h-6 w-20 rounded-lg" />
                    <div className="skeleton h-6 w-16 rounded-lg" />
                  </div>
                </div>
              </div>
              <div className="space-y-2 pt-4">
                <div className="skeleton h-4 w-full rounded" />
                <div className="skeleton h-4 w-5/6 rounded" />
                <div className="skeleton h-4 w-4/6 rounded" />
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😕</div>
            <h3 className="font-display text-2xl text-gray-800 mb-2">Job not found</h3>
            <p className="text-gray-400 text-sm mb-6">{error}</p>
            <Link href="/jobs" className="btn-green px-6 py-2.5 rounded-xl text-white font-semibold text-sm">
              Browse all jobs
            </Link>
          </div>
        )}

        {/* Content */}
        {!loading && job && (
          <div className="flex flex-col lg:flex-row gap-6 fade-up">
            {/* Main column */}
            <div className="flex-1 min-w-0 space-y-5">

              {/* Header card */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-3xl flex-shrink-0">
                      {job.company_logo ? (
                        <img src={job.company_logo} alt={job.company} className="w-full h-full object-cover rounded-2xl" />
                      ) : "🏢"}
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 font-medium mb-0.5">{job.company || "Company"}</p>
                      <h1 className="font-display text-2xl sm:text-3xl text-gray-900 leading-tight">{job.job_title}</h1>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={handleBookmark} title="Bookmark" className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all border ${bookmarked ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-gray-50 border-gray-200 text-gray-400 hover:border-emerald-300"}`}>
                      {bookmarked ? "🔖" : "📑"}
                    </button>
                    <button onClick={handleShare} title="Share" className="w-9 h-9 rounded-xl flex items-center justify-center text-lg bg-gray-50 border border-gray-200 text-gray-400 hover:border-emerald-300 transition-all">
                      {copied ? "✅" : "🔗"}
                    </button>
                  </div>
                </div>

                {/* Meta pills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.employment_type && (
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-semibold border border-emerald-100">
                      {job.employment_type}
                    </span>
                  )}
                  {job.location && (
                    <span className="px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 text-sm font-medium border border-gray-100">
                      📍 {job.location}
                    </span>
                  )}
                  {job.salary && (
                    <span className="px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 text-sm font-medium border border-gray-100">
                      💰 {job.salary}
                    </span>
                  )}
                  {job.is_approved && (
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-medium border border-emerald-100">
                      ✅ Verified
                    </span>
                  )}
                </div>

                {/* Tags */}
                {job.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.tags.map((tag) => (
                      <span key={tag.name || tag} className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium">
                        #{tag.name || tag}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-xs text-gray-400">Posted {timeAgo(job.created_at)}</p>
              </div>

              {/* Description */}
              {job.description && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
                  <h2 className="font-display text-xl text-gray-900 mb-4">Job Description</h2>
                  <div className="prose text-gray-600 text-sm" dangerouslySetInnerHTML={{ __html: job.description }} />
                </div>
              )}

              {/* Skills */}
              {job.job_skills?.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
                  <h2 className="font-display text-xl text-gray-900 mb-4">Required Skills</h2>
                  <div className="flex flex-wrap gap-3">
                    {job.job_skills.map((skill, i) => (
                      <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-100">
                        <span className="text-sm font-semibold text-emerald-800">{skill.skill || skill.name}</span>
                        {skill.skill_level && (
                          <span className="text-xs text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">{skill.skill_level}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:w-72 flex-shrink-0 space-y-4">
              {/* Apply card */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
                <h3 className="font-semibold text-gray-900 mb-1">Interested?</h3>
                <p className="text-xs text-gray-400 mb-4">Apply now before the role is filled.</p>
                {job.application_url ? (
                  <a
                    href={job.application_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-green w-full block text-center py-3.5 rounded-xl text-white font-semibold text-sm shadow-md"
                  >
                    Apply Now →
                  </a>
                ) : job.application_email ? (
                  <a
                    href={`mailto:${job.application_email}?subject=Application for ${job.job_title}`}
                    className="btn-green w-full block text-center py-3.5 rounded-xl text-white font-semibold text-sm shadow-md"
                  >
                    Apply via Email →
                  </a>
                ) : (
                  <div className="text-sm text-gray-400 text-center py-2">Contact the company directly</div>
                )}

                <button onClick={handleBookmark} className={`mt-3 w-full py-3 rounded-xl text-sm font-semibold border transition-all ${bookmarked ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "border-gray-200 text-gray-600 hover:border-emerald-300"}`}>
                  {bookmarked ? "🔖 Bookmarked" : "📑 Save Job"}
                </button>

                <button onClick={handleShare} className="mt-2 w-full py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:border-emerald-300 transition-all">
                  {copied ? "✅ Link copied!" : "🔗 Share Job"}
                </button>
              </div>

              {/* Company info */}
              {job.company && (
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm">About the Company</h3>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-xl">🏢</div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{job.company}</p>
                      {job.company_website && (
                        <a href={job.company_website} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-600 hover:underline">
                          {job.company_website.replace(/^https?:\/\//, "")}
                        </a>
                      )}
                    </div>
                  </div>
                  {job.company_description && (
                    <p className="text-xs text-gray-500 leading-relaxed">{job.company_description}</p>
                  )}
                </div>
              )}

              {/* Back to list */}
              <Link href="/jobs" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-gray-200 text-sm text-gray-500 hover:border-emerald-300 hover:text-emerald-700 transition-all font-medium">
                ← Back to Job Board
              </Link>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
