"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ── Mock activity data (replace with API) ──────────────────────────────────────
const MOCK_ACTIVITY = [
  { type: "challenge", text: "Submitted solution to Naira Currency Converter",  time: "2 days ago",   icon: "🏆" },
  { type: "resource",  text: "Downloaded Django REST Framework Guide",            time: "5 days ago",   icon: "📄" },
  { type: "job",       text: "Bookmarked Senior Python Developer @ TechCorp",    time: "1 week ago",   icon: "💼" },
  { type: "join",      text: "Joined the Python 9ja community",                  time: "3 months ago", icon: "🐍" },
];

const SKILL_LEVELS = {
  Beginner:     { color: "bg-emerald-100 text-emerald-700",  width: "w-1/4"  },
  Intermediate: { color: "bg-amber-100 text-amber-700",      width: "w-1/2"  },
  "Mid-level":  { color: "bg-blue-100 text-blue-700",        width: "w-3/5"  },
  Senior:       { color: "bg-purple-100 text-purple-700",    width: "w-4/5"  },
  Expert:       { color: "bg-red-100 text-red-700",          width: "w-full" },
};

const BADGE_DATA = [
  { icon: "🐍", label: "Pythonista",       desc: "Joined Python 9ja"          },
  { icon: "🏆", label: "Challenger",       desc: "Submitted a challenge"      },
  { icon: "📚", label: "Learner",          desc: "Downloaded 5+ resources"    },
  { icon: "🤝", label: "Contributor",      desc: "Shared a resource"          },
];

export default function ProfilePage() {
  const params     = useParams();
  const username   = params?.username;
  const [user,     setUser]     = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [isOwn,    setIsOwn]    = useState(false);
  const [activeTab,setActiveTab]= useState("about");
  const [copied,   setCopied]   = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        // Try to fetch from API; fall back to localStorage for own profile
        const token        = localStorage.getItem("token");
        const storedUser   = JSON.parse(localStorage.getItem("user") || "null");

        // Check if viewing own profile
        if (storedUser && (storedUser.username === username)) {
          setIsOwn(true);
        }

        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch(`${API_BASE}/api/profile/${username}/`, {
          headers,
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else if (storedUser && storedUser.username === username) {
          // Fallback: use local storage data for own profile
          setUser({
            ...storedUser,
            bio: storedUser.bio || "Python developer from Nigeria 🇳🇬",
            location: storedUser.location || "Nigeria",
            github: storedUser.github || "",
            twitter: storedUser.twitter || "",
            linkedin: storedUser.linkedin || "",
            website: storedUser.website || "",
            skills: storedUser.skills || [
              { skill: "Python",     skill_level: "Senior"       },
              { skill: "Django",     skill_level: "Intermediate" },
              { skill: "FastAPI",    skill_level: "Mid-level"    },
              { skill: "Pandas",     skill_level: "Intermediate" },
            ],
            joined: storedUser.date_joined || new Date().toISOString(),
            challenge_count: 3,
            resource_count: 12,
            badges: BADGE_DATA.slice(0, 3),
          });
        } else {
          throw new Error("User not found");
        }
      } catch (e) {
        // Use demo data if API isn't ready
        setUser({
          first_name: "Demo", last_name: "User",
          username: username || "demo_user",
          email: "demo@python9ja.com",
          bio: "Full-stack Python developer passionate about building tools for Africa. Loves Django, FastAPI and data science.",
          location: "Lagos, Nigeria",
          github: "python9ja",
          twitter: "python9ja",
          linkedin: "",
          website: "https://python9ja.com",
          skills: [
            { skill: "Python",       skill_level: "Expert"       },
            { skill: "Django",       skill_level: "Senior"       },
            { skill: "FastAPI",      skill_level: "Senior"       },
            { skill: "Pandas",       skill_level: "Intermediate" },
            { skill: "Machine Learning", skill_level: "Mid-level"},
          ],
          joined: "2024-01-15T10:00:00Z",
          challenge_count: 8,
          resource_count: 24,
          badges: BADGE_DATA,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const joinedDate = user?.joined
    ? new Date(user.joined).toLocaleDateString("en-NG", { month: "long", year: "numeric" })
    : "";

  const initials = user
    ? `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase() || "U"
    : "U";

  const tabs = ["about", "skills", "activity", "badges"];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── Loading ── */}
      {loading && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" style={{borderWidth:"3px"}} />
            <p className="text-sm text-gray-400 font-medium">Loading profile…</p>
          </div>
        </div>
      )}

      {!loading && user && (
        <>
          {/* ── Cover banner ── */}
          <div className="relative h-48 md:h-56 green-gradient overflow-hidden">
            <div className="absolute inset-0 pattern-dots opacity-30" />
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/20 to-transparent" />
            {/* Action buttons top-right */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button onClick={handleShare} className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors text-white text-xs font-semibold px-3 py-1.5 rounded-lg">
                {copied ? "✅ Copied!" : "🔗 Share"}
              </button>
              {isOwn && (
                <Link href="/account/settings" className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors text-white text-xs font-semibold px-3 py-1.5 rounded-lg">
                  ✏️ Edit Profile
                </Link>
              )}
            </div>
          </div>

          {/* ── Profile header ── */}
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="relative flex flex-col sm:flex-row sm:items-end gap-4 -mt-16 mb-6">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-emerald-600 flex items-center justify-center">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-display text-4xl text-white font-bold">{initials}</span>
                  )}
                </div>
                {/* Online dot */}
                <div className="absolute bottom-2 right-2 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" title="Member" />
              </div>

              {/* Name + meta */}
              <div className="flex-1 pb-2">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="font-display text-2xl md:text-3xl text-gray-900">
                    {user.first_name} {user.last_name}
                  </h1>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                    🐍 Python 9ja
                  </span>
                </div>
                <p className="text-gray-400 text-sm font-medium mb-2">@{user.username}</p>
                <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                  {user.location && <span className="flex items-center gap-1">📍 {user.location}</span>}
                  {joinedDate   && <span className="flex items-center gap-1">📅 Joined {joinedDate}</span>}
                </div>
              </div>

              {/* Social links */}
              <div className="flex gap-2 pb-2">
                {user.github && (
                  <a href={`https://github.com/${user.github}`} target="_blank" rel="noopener noreferrer"
                     className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-600 text-base" title="GitHub">
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                  </a>
                )}
                {user.twitter && (
                  <a href={`https://twitter.com/${user.twitter}`} target="_blank" rel="noopener noreferrer"
                     className="w-9 h-9 rounded-xl bg-sky-50 hover:bg-sky-100 flex items-center justify-center transition-colors text-sky-500 text-base" title="Twitter/X">
                    𝕏
                  </a>
                )}
                {user.linkedin && (
                  <a href={`https://linkedin.com/in/${user.linkedin}`} target="_blank" rel="noopener noreferrer"
                     className="w-9 h-9 rounded-xl bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition-colors text-blue-600 text-sm font-bold" title="LinkedIn">
                    in
                  </a>
                )}
                {user.website && (
                  <a href={user.website} target="_blank" rel="noopener noreferrer"
                     className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-600" title="Website">
                    🌐
                  </a>
                )}
              </div>
            </div>

            {/* ── Stats strip ── */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { icon: "🏆", val: user.challenge_count || 0,  label: "Challenges"  },
                { icon: "📥", val: user.resource_count  || 0,  label: "Downloads"   },
                { icon: "🎖️", val: user.badges?.length  || 0,  label: "Badges"      },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl border border-gray-100 py-4 text-center">
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className="font-display text-2xl font-bold text-gray-900">{s.val}</div>
                  <div className="text-xs text-gray-400 font-medium">{s.label}</div>
                </div>
              ))}
            </div>

            {/* ── Tab nav ── */}
            <div className="flex gap-1 bg-white rounded-2xl border border-gray-100 p-1.5 mb-6 w-fit">
              {tabs.map(t => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
                    activeTab === t
                      ? "btn-green text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  {t === "about"    ? "👤 About"    :
                   t === "skills"   ? "⚡ Skills"   :
                   t === "activity" ? "📋 Activity" :
                                      "🎖️ Badges"  }
                </button>
              ))}
            </div>

            {/* ── Tab content ── */}
            <div className="flex flex-col lg:flex-row gap-6 pb-16">
              <div className="flex-1 min-w-0 fade-up">

                {/* ABOUT */}
                {activeTab === "about" && (
                  <div className="space-y-4">
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                      <h2 className="font-display text-lg text-gray-900 mb-3">Bio</h2>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {user.bio || "No bio yet. This user hasn't added a bio."}
                      </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                      <h2 className="font-display text-lg text-gray-900 mb-4">Details</h2>
                      <div className="space-y-3">
                        {[
                          { icon: "📧", label: "Email",    val: isOwn ? user.email : null          },
                          { icon: "📍", label: "Location", val: user.location                       },
                          { icon: "🌐", label: "Website",  val: user.website, link: user.website   },
                          { icon: "🐙", label: "GitHub",   val: user.github ? `@${user.github}` : null, link: user.github ? `https://github.com/${user.github}` : null },
                        ].filter(d => d.val).map(d => (
                          <div key={d.label} className="flex items-center gap-3 text-sm">
                            <span className="text-lg w-6 text-center">{d.icon}</span>
                            <span className="text-gray-400 w-16 flex-shrink-0">{d.label}</span>
                            {d.link ? (
                              <a href={d.link} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline font-medium truncate">{d.val}</a>
                            ) : (
                              <span className="text-gray-700 font-medium truncate">{d.val}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {isOwn && (
                      <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-5 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-emerald-800 text-sm">Your profile is live 🎉</p>
                          <p className="text-emerald-600 text-xs mt-0.5">Other members can find and view your profile.</p>
                        </div>
                        <Link href="/account/settings" className="btn-green px-4 py-2 rounded-xl text-white text-xs font-bold shadow-sm flex-shrink-0">
                          Edit Profile
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {/* SKILLS */}
                {activeTab === "skills" && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <h2 className="font-display text-lg text-gray-900 mb-5">Python Skills</h2>
                    {user.skills?.length > 0 ? (
                      <div className="space-y-4">
                        {user.skills.map((s, i) => {
                          const level = SKILL_LEVELS[s.skill_level] || SKILL_LEVELS["Intermediate"];
                          return (
                            <div key={i}>
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-sm font-semibold text-gray-800">{s.skill}</span>
                                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${level.color} border-current/20`}>
                                  {s.skill_level}
                                </span>
                              </div>
                              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className={`h-full green-gradient rounded-full transition-all duration-700 ${level.width}`}
                                     style={{ animationDelay: `${i * 0.1}s` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <div className="text-4xl mb-3">⚡</div>
                        <p className="text-gray-400 text-sm">No skills added yet.</p>
                        {isOwn && (
                          <Link href="/account/settings" className="inline-block mt-3 text-emerald-600 text-sm font-semibold hover:underline">
                            Add your skills →
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* ACTIVITY */}
                {activeTab === "activity" && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <h2 className="font-display text-lg text-gray-900 mb-5">Recent Activity</h2>
                    <div className="space-y-1">
                      {MOCK_ACTIVITY.map((a, i) => (
                        <div key={i} className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
                          <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-lg flex-shrink-0">{a.icon}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-700 leading-snug">{a.text}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* BADGES */}
                {activeTab === "badges" && (
                  <div className="space-y-4">
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                      <h2 className="font-display text-lg text-gray-900 mb-5">Earned Badges</h2>
                      {user.badges?.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {user.badges.map((b, i) => (
                            <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gradient-to-b from-emerald-50 to-white border border-emerald-100 text-center card-hover">
                              <div className="w-14 h-14 rounded-2xl green-gradient flex items-center justify-center text-3xl shadow-md">
                                {b.icon}
                              </div>
                              <p className="font-semibold text-sm text-gray-900">{b.label}</p>
                              <p className="text-xs text-gray-400">{b.desc}</p>
                            </div>
                          ))}

                          {/* Locked badges */}
                          {BADGE_DATA.filter(b => !user.badges?.find(ub => ub.label === b.label)).map((b, i) => (
                            <div key={`locked-${i}`} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gray-50 border border-gray-100 text-center opacity-50">
                              <div className="w-14 h-14 rounded-2xl bg-gray-200 flex items-center justify-center text-3xl grayscale">
                                {b.icon}
                              </div>
                              <p className="font-semibold text-sm text-gray-500">{b.label}</p>
                              <p className="text-xs text-gray-400">🔒 {b.desc}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-10">
                          <div className="text-4xl mb-3">🎖️</div>
                          <p className="text-gray-400 text-sm">No badges earned yet — participate to unlock them!</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* ── Right sidebar ── */}
              <aside className="lg:w-64 flex-shrink-0 space-y-4">
                {/* Community member card */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <h3 className="font-semibold text-sm text-gray-900 mb-3">Community</h3>
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-100 mb-3">
                    <span className="text-xl">🇳🇬</span>
                    <div>
                      <p className="text-xs font-bold text-emerald-800">Python 9ja Member</p>
                      <p className="text-xs text-emerald-600">Since {joinedDate}</p>
                    </div>
                  </div>
                  <a href="https://chat.whatsapp.com/BiQWwZnBTgwFaAbLmhiF43" target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-2 text-xs text-gray-500 hover:text-emerald-700 transition-colors py-1.5">
                    💬 <span>Join our WhatsApp</span>
                  </a>
                </div>

                {/* Posted jobs (if any) */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <h3 className="font-semibold text-sm text-gray-900 mb-3">Posted Jobs</h3>
                  <p className="text-xs text-gray-400">No jobs posted yet.</p>
                  {isOwn && (
                    <Link href="/jobs/post" className="mt-3 flex items-center gap-1 text-xs text-emerald-600 font-semibold hover:underline">
                      + Post a job
                    </Link>
                  )}
                </div>

                {/* Share profile */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <h3 className="font-semibold text-sm text-gray-900 mb-2">Share Profile</h3>
                  <p className="text-xs text-gray-400 mb-3">Let others find you in the community.</p>
                  <button onClick={handleShare} className="w-full btn-green py-2.5 rounded-xl text-white text-xs font-bold shadow-sm">
                    {copied ? "✅ Link Copied!" : "🔗 Copy Profile Link"}
                  </button>
                </div>
              </aside>
            </div>
          </div>
        </>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <div className="text-6xl">😕</div>
          <h2 className="font-display text-2xl text-gray-800">User not found</h2>
          <p className="text-gray-400 text-sm">@{username} doesn't exist in our community yet.</p>
          <Link href="/" className="btn-green px-6 py-3 rounded-xl text-white font-semibold text-sm">Go Home</Link>
        </div>
      )}
    </div>
  );
}
