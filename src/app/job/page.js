"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Freelance", "Internship", "Remote"];
const SORT_OPTIONS = [
  { label: "Newest", value: "-created_at" },
  { label: "Job Title A-Z", value: "job_title" },
  { label: "Salary", value: "salary" },
];

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function JobCard({ job, bookmarked, onBookmark }) {
  return (
    <div className="job-card group bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-4 transition-all duration-200 hover:border-emerald-200 hover:shadow-lg hover:-translate-y-0.5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-2xl flex-shrink-0">
            {job.company_logo ? (
              <img src={job.company_logo} alt={job.company} className="w-full h-full object-cover rounded-xl" />
            ) : "🏢"}
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">{job.company || "Company"}</p>
            <h3 className="font-semibold text-gray-900 text-base leading-tight group-hover:text-emerald-700 transition-colors">
              {job.job_title}
            </h3>
          </div>
        </div>
        <button
          onClick={() => onBookmark(job.slug)}
          className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${bookmarked ? "bg-emerald-100 text-emerald-600" : "bg-gray-50 text-gray-400 hover:bg-emerald-50 hover:text-emerald-500"}`}
          title={bookmarked ? "Remove bookmark" : "Bookmark"}
        >
          {bookmarked ? "🔖" : "📑"}
        </button>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {job.employment_type && (
          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100">
            {job.employment_type}
          </span>
        )}
        {job.tags?.slice(0, 3).map((tag) => (
          <span key={tag.name || tag} className="px-2.5 py-1 rounded-lg bg-gray-50 text-gray-600 text-xs font-medium border border-gray-100">
            {tag.name || tag}
          </span>
        ))}
      </div>

      {/* Meta */}
      <div className="flex items-center gap-4 text-xs text-gray-400">
        {job.location && <span className="flex items-center gap-1">📍 {job.location}</span>}
        {job.salary && <span className="flex items-center gap-1">💰 {job.salary}</span>}
        <span className="ml-auto">{timeAgo(job.created_at)}</span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-gray-50">
        {job.is_approved ? (
          <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">✅ Verified</span>
        ) : (
          <span className="text-xs text-amber-500 font-medium flex items-center gap-1">⏳ Pending</span>
        )}
        <Link
          href={`/jobs/${job.slug}`}
          className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 transition-colors"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [ordering, setOrdering] = useState("-created_at");
  const [pagination, setPagination] = useState({ count: 0, next: null, previous: null });
  const [page, setPage] = useState(1);
  const [bookmarks, setBookmarks] = useState(new Set());
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (employmentType) params.set("employment_type", employmentType);
      if (ordering) params.set("ordering", ordering);
      params.set("page", page);

      const res = await fetch(`${API_BASE}/api/jobs/job/job-list/?${params}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to load jobs");
      const data = await res.json();

      // Handle both paginated and plain array responses
      if (Array.isArray(data)) {
        setJobs(data);
        setPagination({ count: data.length, next: null, previous: null });
      } else {
        setJobs(data.results || []);
        setPagination({ count: data.count || 0, next: data.next, previous: data.previous });
      }
    } catch (e) {
      setError("Could not load jobs. Make sure your backend is running.");
    } finally {
      setLoading(false);
    }
  }, [search, employmentType, ordering, page]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const toggleBookmark = async (slug) => {
    if (!isLoggedIn) { window.location.href = "/account/signin"; return; }
    setBookmarks((prev) => {
      const next = new Set(prev);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      return next;
    });
    // You can wire this to POST /api/jobs/bookmark/ as needed
  };

  const totalPages = Math.ceil(pagination.count / 10);

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
        .job-card { animation: fadeUp 0.4s ease forwards; }
        .search-focus:focus { outline: none; border-color: #059669; box-shadow: 0 0 0 3px rgba(5,150,105,0.1); }
        .filter-chip { transition: all 0.15s; }
        .filter-chip.active { background: linear-gradient(135deg, #065f46, #059669); color: white; border-color: transparent; }
        .filter-chip:not(.active):hover { border-color: #059669; color: #059669; }
        .skeleton { background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
      `}</style>

      {/* ── Hero Banner ── */}
      <div className="green-gradient py-14 px-4">
        <div className="max-w-4xl mx-auto text-center fade-up">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 text-white/90 text-sm font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
            {pagination.count > 0 ? `${pagination.count} Python jobs available` : "Python Jobs Board"}
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-white mb-3">Find Your Next Python Role</h1>
          <p className="text-emerald-100 text-base mb-8 max-w-lg mx-auto">Curated jobs for Python developers, data scientists, and ML engineers across Nigeria and remote.</p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto">
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by title, skill, or type…"
                className="search-focus w-full pl-10 pr-4 py-3.5 rounded-xl border border-transparent text-sm text-gray-800 bg-white shadow-md"
              />
            </div>
            <button type="submit" className="px-5 py-3.5 rounded-xl bg-emerald-900 text-white font-semibold text-sm hover:bg-emerald-800 transition-colors shadow-md">
              Search
            </button>
          </form>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── Sidebar Filters ── */}
          <aside className="lg:w-60 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
              <h3 className="font-semibold text-gray-800 text-sm mb-4">Filters</h3>

              <div className="mb-5">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Employment Type</p>
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => { setEmploymentType(""); setPage(1); }}
                    className={`filter-chip text-left px-3 py-2 rounded-lg text-sm border font-medium ${!employmentType ? "active" : "border-gray-200 text-gray-600"}`}
                  >
                    All Types
                  </button>
                  {EMPLOYMENT_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => { setEmploymentType(t); setPage(1); }}
                      className={`filter-chip text-left px-3 py-2 rounded-lg text-sm border font-medium ${employmentType === t ? "active" : "border-gray-200 text-gray-600"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Sort By</p>
                <div className="flex flex-col gap-1.5">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setOrdering(opt.value); setPage(1); }}
                      className={`filter-chip text-left px-3 py-2 rounded-lg text-sm border font-medium ${ordering === opt.value ? "active" : "border-gray-200 text-gray-600"}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {isLoggedIn && (
                <div className="mt-5 pt-4 border-t border-gray-100">
                  <Link href="/jobs/bookmarks" className="flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-700 font-medium transition-colors">
                    🔖 My Bookmarks
                  </Link>
                </div>
              )}
            </div>
          </aside>

          {/* ── Job Grid ── */}
          <main className="flex-1 min-w-0">
            {/* Active filters row */}
            {(search || employmentType) && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-sm text-gray-400">Active filters:</span>
                {search && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100">
                    🔍 "{search}"
                    <button onClick={() => { setSearch(""); setSearchInput(""); setPage(1); }} className="ml-1 hover:text-red-500">✕</button>
                  </span>
                )}
                {employmentType && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100">
                    {employmentType}
                    <button onClick={() => { setEmploymentType(""); setPage(1); }} className="ml-1 hover:text-red-500">✕</button>
                  </span>
                )}
              </div>
            )}

            {/* Results count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                {loading ? "Loading…" : `${pagination.count} job${pagination.count !== 1 ? "s" : ""} found`}
              </p>
              {!isLoggedIn && (
                <Link href="/jobs/post" className="text-xs text-emerald-600 font-semibold hover:underline">
                  Hiring? Post a job →
                </Link>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
                ⚠️ {error}
                <button onClick={fetchJobs} className="ml-auto text-xs font-semibold underline">Retry</button>
              </div>
            )}

            {/* Skeleton */}
            {loading && (
              <div className="grid sm:grid-cols-2 gap-4">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
                    <div className="flex gap-3">
                      <div className="skeleton w-12 h-12 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <div className="skeleton h-3 w-24 rounded" />
                        <div className="skeleton h-4 w-40 rounded" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="skeleton h-6 w-20 rounded-lg" />
                      <div className="skeleton h-6 w-16 rounded-lg" />
                    </div>
                    <div className="skeleton h-3 w-32 rounded" />
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && jobs.length === 0 && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="font-display text-2xl text-gray-800 mb-2">No jobs found</h3>
                <p className="text-gray-400 text-sm mb-6">Try a different search or filter</p>
                <button onClick={() => { setSearch(""); setSearchInput(""); setEmploymentType(""); setPage(1); }} className="btn-green px-6 py-2.5 rounded-xl text-white font-semibold text-sm">
                  Clear Filters
                </button>
              </div>
            )}

            {/* Job Cards */}
            {!loading && jobs.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-4">
                {jobs.map((job, i) => (
                  <div key={job.slug || i} style={{ animationDelay: `${i * 0.05}s` }}>
                    <JobCard job={job} bookmarked={bookmarks.has(job.slug)} onBookmark={toggleBookmark} />
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:border-emerald-400 hover:text-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  ← Prev
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${page === p ? "btn-green text-white shadow-sm" : "border border-gray-200 text-gray-600 hover:border-emerald-400"}`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:border-emerald-400 hover:text-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Next →
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 bg-white mt-12 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Python 8ja · <Link href="/" className="text-emerald-600 hover:underline">Back to home</Link>
        </div>
      </footer>
    </div>
  );
}
