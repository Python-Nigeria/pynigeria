"use client";
import React, { useState } from "react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function getCsrfToken() {
  const res = await fetch(`${API_BASE}/api/auth/csrfToken/`, {
    credentials: "include",
  });
  const data = await res.json();
  return data.csrfToken;
}

export default function SignInPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const csrfToken = await getCsrfToken();

      const res = await fetch(`${API_BASE}/api/auth/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg =
          data?.detail ||
          data?.non_field_errors?.[0] ||
          Object.values(data)?.[0]?.[0] ||
          "Login failed. Please check your credentials.";
        setError(msg);
        return;
      }

      // Store token if returned
      if (data?.data?.token || data?.token) {
        localStorage.setItem("token", data?.data?.token || data?.token);
      }

      window.location.href = "/dashboard";
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    window.location.href = `${API_BASE}/api/auth/social/begin/${provider}/`;
  };

  return (
    <div className="min-h-screen flex font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Clash+Display:wght@600;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .font-display { font-family: 'Clash Display', 'DM Sans', sans-serif; }
        .green-gradient { background: linear-gradient(135deg, #065f46 0%, #059669 60%, #34d399 100%); }
        .green-glow { box-shadow: 0 0 40px rgba(5, 150, 105, 0.3); }
        .input-focus:focus { outline: none; border-color: #059669; box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.12); }
        .btn-green { background: linear-gradient(135deg, #065f46, #059669); transition: all 0.2s ease; }
        .btn-green:hover { transform: translateY(-1px); box-shadow: 0 8px 25px rgba(5, 150, 105, 0.35); }
        .btn-green:active { transform: translateY(0); }
        .fade-up { animation: fadeUp 0.6s ease forwards; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .panel-left {
          background: linear-gradient(160deg, #022c22 0%, #064e3b 50%, #065f46 100%);
        }
        .pattern-dots {
          background-image: radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px);
          background-size: 24px 24px;
        }
        .social-btn { transition: all 0.2s ease; border: 1.5px solid #e5e7eb; }
        .social-btn:hover { border-color: #059669; background: #f0fdf4; transform: translateY(-1px); }
        .error-shake { animation: shake 0.4s ease; }
        @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
      `}</style>

      {/* ── Left decorative panel (hidden on mobile) ── */}
      <div className="hidden lg:flex lg:w-5/12 panel-left pattern-dots flex-col justify-between p-12 relative overflow-hidden">
        {/* Glowing orb */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />

        {/* Logo */}
<Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
             <img src="/logo.svg" className="w-8 h-8 green-gradiet rouded-lg flex items-center justify-center text-white font-bold text-sm"/>
            <span className="font-display text-lg text-gray-900">Python<span className="text-emerald-600">9ja</span></span>
          </Link>

        {/* Center quote */}
        <div className="z-10 space-y-6">
          <div className="text-5xl">🐍</div>
          <h2 className="font-display text-4xl text-white leading-tight">
            Welcome back to <br />
            <span className="text-emerald-400">Nigeria's Python hub</span>
          </h2>
          <p className="text-emerald-200/70 text-base leading-relaxed max-w-xs">
            Connect with thousands of Python developers, find jobs, and stay
            up‑to‑date with tech news — all in one place.
          </p>

          {/* Avatars */}
          <div className="flex items-center gap-3 pt-2">
            <div className="flex -space-x-2">
              {["🧑🏾‍💻", "👩🏽‍💻", "👨🏿‍💻", "👩🏾‍💻"].map((e, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full bg-emerald-800 border-2 border-emerald-900 flex items-center justify-center text-sm"
                >
                  {e}
                </div>
              ))}
            </div>
            <span className="text-emerald-300 text-sm font-medium">
              2,400+ members waiting
            </span>
          </div>
        </div>

        <p className="text-emerald-200/40 text-xs z-10">
          © {new Date().getFullYear()} Python 8ja · Made in Nigeria 🇳🇬
        </p>
      </div>

      {/* ── Right: form panel ── */}
      <div className="flex-1 flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-md fade-up">
          {/* Mobile logo */}
         <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
             <img src="/logo.svg" className="w-8 h-8 green-gradiet rouded-lg flex items-center justify-center text-white font-bold text-sm"/>
            <span className="font-display text-lg text-gray-900">Python<span className="text-emerald-600">9ja</span></span>
          </Link>

          <h1 className="font-display text-3xl text-gray-900 mb-1">Sign in</h1>
          <p className="text-gray-400 text-sm mb-8">
            Don't have an account?{" "}
            <Link
              href="/account/signup"
              className="text-emerald-600 font-semibold hover:underline"
            >
              Create one free
            </Link>
          </p>

          {/* Social Login */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => handleSocialLogin("google-oauth2")}
              className="social-btn flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-gray-700 bg-white"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button
              onClick={() => handleSocialLogin("github")}
              className="social-btn flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-gray-700 bg-white"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              GitHub
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400 font-medium">or continue with email</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Error */}
          {error && (
            <div className="error-shake mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-start gap-2">
              <span className="mt-0.5">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="input-focus w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 bg-gray-50 placeholder-gray-400 transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link
                  href="/account/forgot-password"
                  className="text-xs text-emerald-600 hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="input-focus w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 bg-gray-50 placeholder-gray-400 pr-11 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors text-lg"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-green w-full py-3.5 rounded-xl text-white font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : (
                "Sign In →"
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            By signing in you agree to our{" "}
            <Link href="/terms" className="text-emerald-600 hover:underline">
              Terms
            </Link>{" "}
            &{" "}
            <Link href="/privacy" className="text-emerald-600 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
