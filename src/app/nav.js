"use client";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import React, { useState, useEffect } from "react";

const NAV_LINKS = [
  { label: "Home",       href: "/",          exact: true  },
  { label: "Jobs",       href: "/jobs"                    },
  { label: "Tech News",  href: "/news"                    },
  { label: "About",      href: "/#about",    hash: true   },
  { label: "Community",  href: "/#community",hash: true   },
];

// Pages where the nav should be completely hidden
const HIDDEN_PATHS = ["/account/signup", "/account/signin"];

export default function Nav() {
  const path      = usePathname();
  const router    = useRouter();
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [isLoggedIn,setIsLoggedIn]= useState(false);
  const [user,      setUser]      = useState(null);
  const [dropOpen,  setDropOpen]  = useState(false);

  // Scroll listener
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Auth check
  useEffect(() => {
    try {
      const token     = localStorage.getItem("token");
      const userData  = localStorage.getItem("user");
      setIsLoggedIn(!!token);
      if (userData) setUser(JSON.parse(userData));
    } catch {
      setIsLoggedIn(false);
    }
  }, [path]); // re-check on route change

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest("#user-menu")) setDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    setDropOpen(false);
    router.push("/");
  };

  // Determine if a nav link is active
  const isActive = (href, exact) => {
    if (exact) return path === href;
    return path.startsWith(href);
  };

  if (HIDDEN_PATHS.includes(path)) return null;

  // Use solid bg on inner pages, transparent on home hero
  const isHome       = path === "/";
  const solidBg      = !isHome || scrolled;

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        solidBg
          ? "bg-white/95 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <img
              src="/logo.svg"
              alt="Python 9ja"
              className="w-8 h-8 rounded-lg"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
            <div
              style={{ display: "none" }}
              className="w-8 h-8 green-gradient rounded-lg items-center justify-center text-white font-bold text-sm"
            >
              Py
            </div>
            <span className={`font-display font-bold text-lg ${solidBg ? "text-green-800" : "text-white"}`}>
              Python<span className="text-green-500">9ja</span>
            </span>
          </Link>

          {/* ── Desktop Links ── */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            {NAV_LINKS.map(({ label, href, exact, hash }) => {
              const active = !hash && isActive(href, exact);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`nav-link transition-colors ${
                    active
                      ? "text-green-700 font-semibold"
                      : solidBg
                        ? "text-gray-600 hover:text-green-700"
                        : "text-white/80 hover:text-white"
                  }`}
                >
                  {label}
                  {active && (
                    <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-green-500 rounded-full" />
                  )}
                </Link>
              );
            })}

            {/* ── Auth area ── */}
            {isLoggedIn ? (
              <div className="relative" id="user-menu">
                <button
                  onClick={() => setDropOpen((v) => !v)}
                  className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-xl border border-green-100 hover:border-green-300 bg-green-50 transition-all"
                >
                  <div className="w-7 h-7 rounded-lg green-gradient flex items-center justify-center text-white text-xs font-bold">
                    {user?.first_name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="text-sm font-semibold text-green-800 max-w-[80px] truncate">
                    {user?.first_name || user?.username || "Account"}
                  </span>
                  <span className={`text-gray-400 text-xs transition-transform ${dropOpen ? "rotate-180" : ""}`}>▾</span>
                </button>

                {/* User dropdown */}
                {dropOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-50">
                      <p className="text-xs font-semibold text-gray-900 truncate">{user?.first_name} {user?.last_name}</p>
                      <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                    </div>
                    <Link href="/dashboard"      onClick={() => setDropOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors">🏠 Dashboard</Link>
                    <Link href="/jobs/post"       onClick={() => setDropOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors">💼 Post a Job</Link>
                    <Link href="/jobs/bookmarks" onClick={() => setDropOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors">🔖 Saved Jobs</Link>
                    <Link href="/account/settings" onClick={() => setDropOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors">⚙️ Settings</Link>
                    <div className="border-t border-gray-50 mt-1" />
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                      🚪 Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/account/signin"
                  className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-colors ${
                    solidBg
                      ? "border-green-600 text-green-700 hover:bg-green-50"
                      : "border-white/50 text-white hover:bg-white/10"
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  href="/account/signup"
                  className="px-4 py-2 rounded-lg green-gradient text-white hover:opacity-90 transition-opacity text-sm font-semibold shadow-sm"
                >
                  Join Free
                </Link>
              </div>
            )}
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            className={`md:hidden flex flex-col justify-center gap-1.5 w-8 h-8 ${solidBg ? "text-gray-700" : "text-white"}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-current rounded-full transition-all duration-300 origin-center ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-current rounded-full transition-all duration-300 origin-center ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>

        {/* ── Mobile Dropdown ── */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-screen" : "max-h-0"}`}>
          <div className="bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-1">

            {/* User info (mobile, logged in) */}
            {isLoggedIn && user && (
              <div className="flex items-center gap-3 px-3 py-3 mb-2 bg-green-50 rounded-xl border border-green-100">
                <div className="w-9 h-9 rounded-xl green-gradient flex items-center justify-center text-white font-bold text-sm">
                  {user?.first_name?.[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{user?.first_name} {user?.last_name}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
              </div>
            )}

            {/* Nav links */}
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(href, href === "/")
                    ? "bg-green-50 text-green-700 font-semibold"
                    : "text-gray-700 hover:bg-gray-50 hover:text-green-700"
                }`}
              >
                {label}
              </Link>
            ))}

            {/* Auth / user links (mobile) */}
            <div className="border-t border-gray-100 mt-2 pt-3 flex flex-col gap-1">
              {isLoggedIn ? (
                <>
                  <Link href="/dashboard"        onClick={() => setMenuOpen(false)} className="px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors font-medium">🏠 Dashboard</Link>
                  <Link href="/jobs/post"         onClick={() => setMenuOpen(false)} className="px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors font-medium">💼 Post a Job</Link>
                  <Link href="/jobs/bookmarks"   onClick={() => setMenuOpen(false)} className="px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors font-medium">🔖 Saved Jobs</Link>
                  <Link href="/account/settings" onClick={() => setMenuOpen(false)} className="px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors font-medium">⚙️ Settings</Link>
                  <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="mt-1 w-full px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors font-medium text-left">
                    🚪 Sign Out
                  </button>
                </>
              ) : (
                <div className="flex gap-3">
                  <Link href="/account/signin" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2.5 rounded-xl border border-green-600 text-green-700 font-semibold text-sm hover:bg-green-50 transition-colors">
                    Sign In
                  </Link>
                  <Link href="/account/signup" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2.5 rounded-xl green-gradient text-white font-semibold text-sm">
                    Join Free
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer so content doesn't hide under fixed nav (skip on home hero pages) */}
      {!isHome && <div className="h-16" />}
    </>
  );
}
