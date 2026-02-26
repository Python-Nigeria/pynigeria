"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Freelance", "Internship", "Remote"];
const SKILL_LEVELS = ["Beginner", "Intermediate", "Mid-level", "Senior", "Expert"];

async function getCsrfToken() {
  const res = await fetch(`${API_BASE}/api/auth/csrfToken/`, { credentials: "include" });
  const data = await res.json();
  return data.csrfToken;
}

export default function PostJobPage() {
  const [form, setForm] = useState({
    job_title: "",
    company: "",
    employment_type: "",
    location: "",
    salary: "",
    description: "",
    application_url: "",
    application_email: "",
    tags: "",
  });
  const [skills, setSkills] = useState([{ skill: "", skill_level: "" }]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/account/signin"; return; }
    setIsLoggedIn(true);
  }, []);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: "" }));
  };

  const handleSkillChange = (i, field, value) => {
    setSkills((prev) => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s));
  };

  const addSkill = () => setSkills((p) => [...p, { skill: "", skill_level: "" }]);
  const removeSkill = (i) => setSkills((p) => p.filter((_, idx) => idx !== i));

  const validate = () => {
    const errs = {};
    if (!form.job_title.trim()) errs.job_title = "Job title is required";
    if (!form.employment_type) errs.employment_type = "Employment type is required";
    if (!form.description.trim()) errs.description = "Description is required";
    if (!form.application_url && !form.application_email) {
      errs.application_url = "Provide either an application URL or email";
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setErrors({});

    try {
      const token = localStorage.getItem("token");
      const csrfToken = await getCsrfToken();

      const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean).map((name) => ({ name }));
      const job_skills = skills.filter((s) => s.skill.trim()).map((s) => ({
        skill: s.skill,
        skill_level: s.skill_level,
      }));

      const payload = {
        ...form,
        tags,
        job_skills,
      };

      const res = await fetch(`${API_BASE}/api/jobs/job/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        const fieldErrors = {};
        for (const [key, val] of Object.entries(data)) {
          fieldErrors[key] = Array.isArray(val) ? val[0] : val;
        }
        setErrors(fieldErrors);
        return;
      }

      setSuccess(true);
    } catch {
      setErrors({ general: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 font-sans">
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Clash+Display:wght@600;700&display=swap'); *{font-family:'DM Sans',sans-serif;} .font-display{font-family:'Clash Display',sans-serif;} .green-gradient{background:linear-gradient(135deg,#065f46,#059669,#34d399);}`}</style>
        <div className="text-center max-w-md">
          <div className="text-7xl mb-5">🎉</div>
          <h2 className="font-display text-3xl text-gray-900 mb-2">Job Posted!</h2>
          <p className="text-gray-500 text-sm mb-2">Your job is under review and will be published after admin approval.</p>
          <p className="text-gray-400 text-xs mb-8">You'll receive an email notification once it's approved.</p>
          <div className="flex justify-center gap-3">
            <Link href="/jobs" className="px-6 py-3 rounded-xl border border-emerald-600 text-emerald-700 font-semibold text-sm hover:bg-emerald-50 transition-colors">Browse Jobs</Link>
            <button onClick={() => { setSuccess(false); setForm({ job_title:"",company:"",employment_type:"",location:"",salary:"",description:"",application_url:"",application_email:"",tags:"" }); setSkills([{skill:"",skill_level:""}]); }} className="px-6 py-3 rounded-xl text-white font-semibold text-sm green-gradient">Post Another</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Clash+Display:wght@600;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .font-display { font-family: 'Clash Display', 'DM Sans', sans-serif; }
        .green-gradient { background: linear-gradient(135deg, #065f46 0%, #059669 60%, #34d399 100%); }
        .btn-green { background: linear-gradient(135deg, #065f46, #059669); transition: all 0.2s; }
        .btn-green:hover { opacity: 0.92; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(5,150,105,0.3); }
        .input-focus:focus { outline: none; border-color: #059669; box-shadow: 0 0 0 3px rgba(5,150,105,0.1); }
        .input-error { border-color: #fca5a5 !important; background: #fff5f5; }
        .fade-up { animation: fadeUp 0.5s ease forwards; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .section-card { background: white; border-radius: 1rem; border: 1px solid #f3f4f6; padding: 1.75rem; margin-bottom: 1.25rem; }
        .error-text { color: #ef4444; font-size: 0.75rem; margin-top: 0.25rem; }
        select { appearance: auto; }
      `}</style>

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 green-gradient rounded-lg flex items-center justify-center text-white font-bold text-sm">Py</div>
            <span className="font-display text-lg text-gray-900">Python<span className="text-emerald-600">8ja</span></span>
          </Link>
          <Link href="/jobs" className="text-sm text-gray-500 hover:text-emerald-700 font-medium transition-colors">← Job Board</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 fade-up">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl text-gray-900 mb-1">Post a Python Job</h1>
          <p className="text-gray-400 text-sm">Reach thousands of Python developers across Nigeria. Jobs go live after admin review.</p>
        </div>

        {errors.general && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">⚠️ {errors.general}</div>
        )}

        <form onSubmit={handleSubmit}>

          {/* ── Section 1: Basic Info ── */}
          <div className="section-card">
            <h2 className="font-display text-lg text-gray-900 mb-5 flex items-center gap-2">
              <span className="w-7 h-7 green-gradient rounded-lg flex items-center justify-center text-white text-xs font-bold">1</span>
              Basic Information
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Title <span className="text-red-400">*</span></label>
                <input
                  name="job_title" value={form.job_title} onChange={handleChange} required
                  placeholder="e.g. Senior Python Developer"
                  className={`input-focus w-full px-4 py-3 rounded-xl border text-sm text-gray-900 bg-gray-50 placeholder-gray-400 transition-all ${errors.job_title ? "input-error" : "border-gray-200"}`}
                />
                {errors.job_title && <p className="error-text">{errors.job_title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Name</label>
                <input
                  name="company" value={form.company} onChange={handleChange}
                  placeholder="e.g. TechCorp Nigeria"
                  className="input-focus w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 bg-gray-50 placeholder-gray-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Employment Type <span className="text-red-400">*</span></label>
                <select
                  name="employment_type" value={form.employment_type} onChange={handleChange} required
                  className={`input-focus w-full px-4 py-3 rounded-xl border text-sm text-gray-900 bg-gray-50 transition-all ${errors.employment_type ? "input-error" : "border-gray-200"}`}
                >
                  <option value="">Select type…</option>
                  {EMPLOYMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.employment_type && <p className="error-text">{errors.employment_type}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
                <input
                  name="location" value={form.location} onChange={handleChange}
                  placeholder="e.g. Lagos / Remote"
                  className="input-focus w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 bg-gray-50 placeholder-gray-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Salary / Range</label>
                <input
                  name="salary" value={form.salary} onChange={handleChange}
                  placeholder="e.g. ₦400,000 – ₦600,000/mo"
                  className="input-focus w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 bg-gray-50 placeholder-gray-400 transition-all"
                />
              </div>
            </div>
          </div>

          {/* ── Section 2: Description ── */}
          <div className="section-card">
            <h2 className="font-display text-lg text-gray-900 mb-5 flex items-center gap-2">
              <span className="w-7 h-7 green-gradient rounded-lg flex items-center justify-center text-white text-xs font-bold">2</span>
              Job Description
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description <span className="text-red-400">*</span></label>
              <textarea
                name="description" value={form.description} onChange={handleChange} required rows={8}
                placeholder="Describe the role, responsibilities, requirements, and what makes this opportunity exciting…"
                className={`input-focus w-full px-4 py-3 rounded-xl border text-sm text-gray-900 bg-gray-50 placeholder-gray-400 transition-all resize-none ${errors.description ? "input-error" : "border-gray-200"}`}
              />
              {errors.description && <p className="error-text">{errors.description}</p>}
              <p className="text-xs text-gray-400 mt-1">HTML is supported (e.g. &lt;ul&gt;, &lt;strong&gt;).</p>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags / Technologies</label>
              <input
                name="tags" value={form.tags} onChange={handleChange}
                placeholder="e.g. Django, FastAPI, PostgreSQL, Machine Learning"
                className="input-focus w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 bg-gray-50 placeholder-gray-400 transition-all"
              />
              <p className="text-xs text-gray-400 mt-1">Comma-separated tags.</p>
            </div>
          </div>

          {/* ── Section 3: Skills ── */}
          <div className="section-card">
            <h2 className="font-display text-lg text-gray-900 mb-2 flex items-center gap-2">
              <span className="w-7 h-7 green-gradient rounded-lg flex items-center justify-center text-white text-xs font-bold">3</span>
              Required Skills
            </h2>
            <p className="text-xs text-gray-400 mb-4">Add specific skills and proficiency levels.</p>

            <div className="space-y-3">
              {skills.map((s, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="flex-1">
                    <input
                      value={s.skill} onChange={(e) => handleSkillChange(i, "skill", e.target.value)}
                      placeholder="e.g. Python, Django, Pandas…"
                      className="input-focus w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 bg-gray-50 placeholder-gray-400 transition-all"
                    />
                  </div>
                  <div className="w-36">
                    <select
                      value={s.skill_level} onChange={(e) => handleSkillChange(i, "skill_level", e.target.value)}
                      className="input-focus w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 bg-gray-50 transition-all"
                    >
                      <option value="">Level…</option>
                      {SKILL_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  {skills.length > 1 && (
                    <button type="button" onClick={() => removeSkill(i)} className="w-9 h-9 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center text-sm transition-colors flex-shrink-0 mt-0.5">
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button type="button" onClick={addSkill} className="mt-3 flex items-center gap-2 text-sm text-emerald-600 font-semibold hover:text-emerald-800 transition-colors">
              + Add Skill
            </button>
          </div>

          {/* ── Section 4: Application ── */}
          <div className="section-card">
            <h2 className="font-display text-lg text-gray-900 mb-5 flex items-center gap-2">
              <span className="w-7 h-7 green-gradient rounded-lg flex items-center justify-center text-white text-xs font-bold">4</span>
              How to Apply
            </h2>
            <p className="text-xs text-gray-400 mb-4">Provide at least one: a link or email address.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Application URL</label>
                <input
                  name="application_url" value={form.application_url} onChange={handleChange}
                  placeholder="https://yourcompany.com/careers/python-dev"
                  type="url"
                  className={`input-focus w-full px-4 py-3 rounded-xl border text-sm text-gray-900 bg-gray-50 placeholder-gray-400 transition-all ${errors.application_url ? "input-error" : "border-gray-200"}`}
                />
                {errors.application_url && <p className="error-text">{errors.application_url}</p>}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-400 font-medium">or</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Application Email</label>
                <input
                  name="application_email" value={form.application_email} onChange={handleChange}
                  placeholder="careers@yourcompany.com"
                  type="email"
                  className="input-focus w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 bg-gray-50 placeholder-gray-400 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit" disabled={loading}
              className="btn-green flex-1 sm:flex-none sm:px-10 py-3.5 rounded-xl text-white font-semibold text-sm shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting…
                </span>
              ) : "Submit Job for Review 🚀"}
            </button>
            <Link href="/jobs" className="text-sm text-gray-400 hover:text-gray-600 transition-colors font-medium">
              Cancel
            </Link>
          </div>

          <p className="text-xs text-gray-400 mt-4">
            Your job will be reviewed by our admin team before going live. You'll receive an email notification.
          </p>
        </form>
      </div>
    </div>
  );
}
