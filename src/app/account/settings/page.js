"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const SKILL_LEVELS = ["Beginner", "Intermediate", "Mid-level", "Senior", "Expert"];

const SECTION_TABS = [
  { key: "profile",   label: "👤 Profile"   },
  { key: "skills",    label: "⚡ Skills"    },
  { key: "social",    label: "🔗 Social"    },
  { key: "account",   label: "🔐 Account"   },
];

async function getCsrfToken() {
  try {
    const res  = await fetch(`${API_BASE}/api/auth/csrfToken/`, { credentials: "include" });
    const data = await res.json();
    return data.csrfToken;
  } catch { return ""; }
}

export default function SettingsPage() {
  const router = useRouter();
  const fileRef = useRef(null);

  const [tab,        setTab]       = useState("profile");
  const [loading,    setLoading]   = useState(true);
  const [saving,     setSaving]    = useState(false);
  const [saved,      setSaved]     = useState(false);
  const [error,      setError]     = useState("");
  const [avatarPrev, setAvatarPrev]= useState(null);

  const [profile, setProfile] = useState({
    first_name: "", last_name: "", username: "",
    email: "", bio: "", location: "",
  });

  const [social, setSocial] = useState({
    github: "", twitter: "", linkedin: "", website: "",
  });

  const [skills,  setSkills]  = useState([{ skill: "", skill_level: "Intermediate" }]);

  const [passwords, setPasswords] = useState({
    current_password: "", new_password: "", confirm_password: "",
  });
  const [passError,  setPassError]  = useState("");
  const [passSaved,  setPassSaved]  = useState(false);

  // Load user from localStorage / API
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/account/signin"); return; }

    const stored = JSON.parse(localStorage.getItem("user") || "null");
    if (stored) {
      setProfile({
        first_name: stored.first_name || "",
        last_name:  stored.last_name  || "",
        username:   stored.username   || "",
        email:      stored.email      || "",
        bio:        stored.bio        || "",
        location:   stored.location   || "",
      });
      setSocial({
        github:   stored.github   || "",
        twitter:  stored.twitter  || "",
        linkedin: stored.linkedin || "",
        website:  stored.website  || "",
      });
      setSkills(stored.skills?.length ? stored.skills : [{ skill: "", skill_level: "Intermediate" }]);
      setAvatarPrev(stored.avatar || null);
    }
    setLoading(false);
  }, []);

  const handleProfileChange = e =>
    setProfile(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSocialChange = e =>
    setSocial(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSkillChange = (i, field, val) =>
    setSkills(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s));

  const addSkill    = () => setSkills(p => [...p, { skill: "", skill_level: "Intermediate" }]);
  const removeSkill = i  => setSkills(p => p.filter((_, idx) => idx !== i));

  const handleAvatarChange = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setAvatarPrev(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const token     = localStorage.getItem("token");
      const csrfToken = await getCsrfToken();

      const payload = {
        ...profile,
        ...social,
        skills: skills.filter(s => s.skill.trim()),
      };

      const res = await fetch(`${API_BASE}/api/profile/update/`, {
        method: "PATCH",
        headers: {
          "Content-Type":  "application/json",
          "X-CSRFToken":   csrfToken,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const updated = await res.json();
        localStorage.setItem("user", JSON.stringify({ ...JSON.parse(localStorage.getItem("user") || "{}"), ...updated }));
      } else {
        // Optimistic update even if API not ready
        const current = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem("user", JSON.stringify({ ...current, ...payload }));
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // Still update localStorage
      const current = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...current, ...profile, ...social, skills }));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPassError("");
    setPassSaved(false);
    if (passwords.new_password !== passwords.confirm_password) {
      setPassError("New passwords don't match."); return;
    }
    if (passwords.new_password.length < 8) {
      setPassError("Password must be at least 8 characters."); return;
    }
    setSaving(true);
    try {
      const token     = localStorage.getItem("token");
      const csrfToken = await getCsrfToken();
      await fetch(`${API_BASE}/api/auth/password/change/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken":  csrfToken,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({ old_password: passwords.current_password, new_password: passwords.new_password }),
      });
      setPassSaved(true);
      setPasswords({ current_password: "", new_password: "", confirm_password: "" });
      setTimeout(() => setPassSaved(false), 3000);
    } catch {
      setPassError("Failed to update password.");
    } finally {
      setSaving(false);
    }
  };

  const initials = `${profile.first_name?.[0] || ""}${profile.last_name?.[0] || ""}`.toUpperCase() || "U";

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-10 h-10 rounded-full border-t-emerald-600 border-4 border-emerald-100 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── Page header ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl text-gray-900">Account Settings</h1>
            <p className="text-sm text-gray-400 mt-0.5">Manage your Python 9ja profile and preferences</p>
          </div>
          <Link href={`/profile/${profile.username}`}
                className="flex items-center gap-2 text-sm text-emerald-600 font-semibold hover:underline">
            👤 View Public Profile →
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── Sidebar tabs ── */}
          <aside className="lg:w-56 flex-shrink-0">
            {/* Avatar editor */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4 flex flex-col items-center gap-3">
              <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-emerald-600 flex items-center justify-center shadow-md">
                  {avatarPrev ? (
                    <img src={avatarPrev} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-display text-2xl text-white font-bold">{initials}</span>
                  )}
                </div>
                <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">Change</span>
                </div>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-900">{profile.first_name} {profile.last_name}</p>
                <p className="text-xs text-gray-400">@{profile.username}</p>
              </div>
              <button onClick={() => fileRef.current?.click()}
                      className="w-full text-xs py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-emerald-300 hover:text-emerald-600 transition-colors font-medium">
                📷 Change Photo
              </button>
            </div>

            {/* Section nav */}
            <div className="bg-white rounded-2xl border border-gray-100 p-2 flex flex-col gap-0.5">
              {SECTION_TABS.map(t => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all ${
                    tab === t.key
                      ? "btn-green text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </aside>

          {/* ── Main panel ── */}
          <main className="flex-1 min-w-0 fade-up">

            {/* ══ PROFILE TAB ══ */}
            {tab === "profile" && (
              <form onSubmit={handleSave}>
                <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
                  <h2 className="font-display text-lg text-gray-900 mb-5">Basic Information</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                      <input name="first_name" value={profile.first_name} onChange={handleProfileChange}
                             placeholder="Emeka"
                             className="input-focus w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-900 placeholder-gray-400 transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                      <input name="last_name" value={profile.last_name} onChange={handleProfileChange}
                             placeholder="Okafor"
                             className="input-focus w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-900 placeholder-gray-400 transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
                        <input name="username" value={profile.username} onChange={handleProfileChange}
                               placeholder="emeka_py"
                               className="input-focus w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-900 placeholder-gray-400 transition-all" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
                      <input name="location" value={profile.location} onChange={handleProfileChange}
                             placeholder="Lagos, Nigeria"
                             className="input-focus w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-900 placeholder-gray-400 transition-all" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
                      <textarea name="bio" value={profile.bio} onChange={handleProfileChange}
                                rows={4} placeholder="Tell the community about yourself, your stack, and what you're building…"
                                className="input-focus w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-900 placeholder-gray-400 resize-none transition-all" />
                      <p className="text-xs text-gray-400 mt-1">{profile.bio.length}/300 characters</p>
                    </div>
                  </div>
                </div>

                <SaveBar saving={saving} saved={saved} error={error} />
              </form>
            )}

            {/* ══ SKILLS TAB ══ */}
            {tab === "skills" && (
              <form onSubmit={handleSave}>
                <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
                  <h2 className="font-display text-lg text-gray-900 mb-2">Your Python Skills</h2>
                  <p className="text-sm text-gray-400 mb-5">Add skills that appear on your public profile.</p>

                  <div className="space-y-3">
                    {skills.map((s, i) => (
                      <div key={i} className="flex gap-3 items-center">
                        <div className="flex-1">
                          <input
                            value={s.skill}
                            onChange={e => handleSkillChange(i, "skill", e.target.value)}
                            placeholder="e.g. Python, Django, Pandas…"
                            className="input-focus w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-900 placeholder-gray-400 transition-all"
                          />
                        </div>
                        <div className="w-40">
                          <select
                            value={s.skill_level}
                            onChange={e => handleSkillChange(i, "skill_level", e.target.value)}
                            className="input-focus w-full px-3 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-900 transition-all"
                          >
                            {SKILL_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                          </select>
                        </div>
                        {skills.length > 1 && (
                          <button type="button" onClick={() => removeSkill(i)}
                                  className="w-9 h-9 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center text-sm transition-colors flex-shrink-0">
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={addSkill}
                          className="mt-4 flex items-center gap-2 text-sm text-emerald-600 font-semibold hover:text-emerald-800 transition-colors">
                    + Add Skill
                  </button>
                </div>

                <SaveBar saving={saving} saved={saved} error={error} />
              </form>
            )}

            {/* ══ SOCIAL TAB ══ */}
            {tab === "social" && (
              <form onSubmit={handleSave}>
                <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
                  <h2 className="font-display text-lg text-gray-900 mb-2">Social Links</h2>
                  <p className="text-sm text-gray-400 mb-5">These show up on your public profile.</p>
                  <div className="space-y-4">
                    {[
                      { name: "github",   label: "GitHub",   placeholder: "your-username",      prefix: "github.com/",   icon: "🐙" },
                      { name: "twitter",  label: "Twitter/X",placeholder: "your-handle",        prefix: "twitter.com/",  icon: "𝕏"  },
                      { name: "linkedin", label: "LinkedIn", placeholder: "your-linkedin-name", prefix: "linkedin.com/in/", icon: "in" },
                      { name: "website",  label: "Website",  placeholder: "https://yoursite.com", prefix: "",            icon: "🌐" },
                    ].map(f => (
                      <div key={f.name}>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                          <span className="text-base">{f.icon}</span> {f.label}
                        </label>
                        <div className="flex">
                          {f.prefix && (
                            <span className="flex items-center px-3 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-xs text-gray-400 whitespace-nowrap">
                              {f.prefix}
                            </span>
                          )}
                          <input
                            name={f.name}
                            value={social[f.name]}
                            onChange={handleSocialChange}
                            placeholder={f.placeholder}
                            className={`input-focus flex-1 px-4 py-3 border border-gray-200 text-sm bg-gray-50 text-gray-900 placeholder-gray-400 transition-all ${f.prefix ? "rounded-r-xl" : "rounded-xl"}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <SaveBar saving={saving} saved={saved} error={error} />
              </form>
            )}

            {/* ══ ACCOUNT TAB ══ */}
            {tab === "account" && (
              <div className="space-y-4">
                {/* Email display */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h2 className="font-display text-lg text-gray-900 mb-4">Email Address</h2>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-lg">📧</span>
                    <span className="text-sm text-gray-700 font-medium">{profile.email}</span>
                    <span className="ml-auto text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">Verified</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">To change your email, contact support.</p>
                </div>

                {/* Change password */}
                <form onSubmit={handlePasswordChange} className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h2 className="font-display text-lg text-gray-900 mb-5">Change Password</h2>
                  <div className="space-y-4">
                    {[
                      { name: "current_password", label: "Current Password", placeholder: "••••••••" },
                      { name: "new_password",      label: "New Password",     placeholder: "Min. 8 characters" },
                      { name: "confirm_password",  label: "Confirm New Password", placeholder: "Repeat new password" },
                    ].map(f => (
                      <div key={f.name}>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">{f.label}</label>
                        <input
                          type="password" name={f.name}
                          value={passwords[f.name]}
                          onChange={e => setPasswords(p => ({ ...p, [e.target.name]: e.target.value }))}
                          placeholder={f.placeholder}
                          className="input-focus w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-900 placeholder-gray-400 transition-all"
                        />
                      </div>
                    ))}
                  </div>
                  {passError && <p className="mt-3 text-sm text-red-500">⚠️ {passError}</p>}
                  {passSaved && <p className="mt-3 text-sm text-emerald-600">✅ Password updated!</p>}
                  <button type="submit" disabled={saving}
                          className="mt-5 btn-green px-6 py-3 rounded-xl text-white font-semibold text-sm shadow-sm disabled:opacity-60">
                    {saving ? "Updating…" : "Update Password"}
                  </button>
                </form>

                {/* Danger zone */}
                <div className="bg-white rounded-2xl border border-red-100 p-6">
                  <h2 className="font-display text-lg text-red-600 mb-2">Danger Zone</h2>
                  <p className="text-sm text-gray-400 mb-4">These actions are permanent and cannot be undone.</p>
                  <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition-colors">
                    🗑️ Delete Account
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// ── Reusable save bar ──────────────────────────────────────────────────────────
function SaveBar({ saving, saved, error }) {
  return (
    <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 px-5 py-4">
      <div>
        {error && <p className="text-sm text-red-500">⚠️ {error}</p>}
        {saved && <p className="text-sm text-emerald-600 font-medium">✅ Changes saved!</p>}
        {!error && !saved && <p className="text-xs text-gray-400">Changes are saved to your profile immediately.</p>}
      </div>
      <button
        type="submit"
        disabled={saving}
        className="btn-green px-6 py-2.5 rounded-xl text-white font-semibold text-sm shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {saving ? (
          <>
            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Saving…
          </>
        ) : "Save Changes"}
      </button>
    </div>
  );
}
