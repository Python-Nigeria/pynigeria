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

const steps = ["Account", "Profile", "Done"];

export default function SignUpPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    username: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [done, setDone] = useState(false);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: "" }));
  };

  const validateStep0 = () => {
    const errs = {};
    if (!form.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 8) errs.password = "At least 8 characters";
    if (form.password !== form.confirmPassword)
      errs.confirmPassword = "Passwords do not match";
    return errs;
  };

  const validateStep1 = () => {
    const errs = {};
    if (!form.first_name) errs.first_name = "First name is required";
    if (!form.last_name) errs.last_name = "Last name is required";
    if (!form.username) errs.username = "Username is required";
    else if (form.username.length < 3) errs.username = "At least 3 characters";
    return errs;
  };

  const handleNext = () => {
    const errs = step === 0 ? validateStep0() : validateStep1();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateStep1();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setErrors({});
    try {
      const csrfToken = await getCsrfToken();

      const payload = {
        email: form.email,
        password: form.password,
        first_name: form.first_name,
        last_name: form.last_name,
        username: form.username,
      };

      const res = await fetch(`${API_BASE}/api/auth/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        // Parse Django field errors
        const fieldErrors = {};
        let general = "";
        for (const [key, val] of Object.entries(data)) {
          if (["email","password","username","first_name","last_name"].includes(key)) {
            fieldErrors[key] = Array.isArray(val) ? val[0] : val;
          } else {
            general = Array.isArray(val) ? val[0] : val;
          }
        }
        if (Object.keys(fieldErrors).length) {
          setErrors(fieldErrors);
          // Go back to step 0 if email/password errors
          if (fieldErrors.email || fieldErrors.password) setStep(0);
        } else {
          setErrors({ general: general || "Registration failed. Please try again." });
        }
        return;
      }

      setDone(true);
      setStep(2);
    } catch {
      setErrors({ general: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    window.location.href = `${API_BASE}/api/auth/social/begin/${provider}/`;
  };

  const strengthScore = () => {
    const p = form.password;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  };

  const strengthColors = ["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-emerald-400"];
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];
  const score = strengthScore();

  return (
    <div className="min-h-screen flex font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Clash+Display:wght@600;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .font-display { font-family: 'Clash Display', 'DM Sans', sans-serif; }
        .green-gradient { background: linear-gradient(135deg, #065f46 0%, #059669 60%, #34d399 100%); }
        .input-focus:focus { outline: none; border-color: #059669; box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.12); }
        .btn-green { background: linear-gradient(135deg, #065f46, #059669); transition: all 0.2s ease; }
        .btn-green:hover { transform: translateY(-1px); box-shadow: 0 8px 25px rgba(5, 150, 105, 0.35); }
        .btn-green:disabled { transform: none; box-shadow: none; }
        .fade-up { animation: fadeUp 0.5s ease forwards; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        .panel-left { background: linear-gradient(160deg, #022c22 0%, #064e3b 50%, #065f46 100%); }
        .pattern-dots { background-image: radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px); background-size: 24px 24px; }
        .social-btn { transition: all 0.2s ease; border: 1.5px solid #e5e7eb; }
        .social-btn:hover { border-color: #059669; background: #f0fdf4; transform: translateY(-1px); }
        .step-active { background: linear-gradient(135deg, #065f46, #059669); color: white; }
        .step-done { background: #d1fae5; color: #065f46; }
        .step-idle { background: #f3f4f6; color: #9ca3af; }
        .slide-in { animation: slideIn 0.35s ease forwards; }
        @keyframes slideIn { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
        .error-text { color: #ef4444; font-size: 0.75rem; margin-top: 0.25rem; }
        .input-error { border-color: #fca5a5 !important; background: #fff5f5; }
      `}</style>

      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-5/12 panel-left pattern-dots flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />

        <Link href="/" className="flex items-center gap-3 z-10">
          <div className="w-10 h-10 green-gradient rounded-xl flex items-center justify-center text-white font-bold shadow-lg">Py</div>
          <span className="font-display text-xl text-white">Python<span className="text-emerald-400">9ja</span></span>
        </Link>

        <div className="z-10 space-y-6">
          <div className="text-5xl">🚀</div>
          <h2 className="font-display text-4xl text-white leading-tight">
            Start your journey with <br />
            <span className="text-emerald-400">Nigeria's Python family</span>
          </h2>
          <p className="text-emerald-200/70 text-base leading-relaxed max-w-xs">
            Join a growing community of developers, get access to job listings, tech news, projects, and mentorship.
          </p>

          {/* Perks */}
          {[
            "✅ Access to 120+ Python job listings",
            "✅ Weekly curated tech news",
            "✅ Connect with 2,400+ developers",
            "✅ Project collabs & mentorship",
          ].map((p) => (
            <div key={p} className="text-emerald-200 text-sm font-medium">{p}</div>
          ))}
        </div>

        <p className="text-emerald-200/40 text-xs z-10">
          © {new Date().getFullYear()} Python 8ja · Made in Nigeria 🇳🇬
        </p>
      </div>

      {/* ── Right: form ── */}
      <div className="flex-1 flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-md fade-up">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
             <img src="/logo.svg" className="w-8 h-8 green-gradiet rouded-lg flex items-center justify-center text-white font-bold text-sm"/>
            <span className="font-display text-lg text-gray-900">Python<span className="text-emerald-600">9ja</span></span>
          </Link>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            {steps.map((s, i) => (
              <React.Fragment key={s}>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  i === step ? "step-active" : i < step ? "step-done" : "step-idle"
                }`}>
                  <span>{i < step ? "✓" : i + 1}</span>
                  <span>{s}</span>
                </div>
                {i < steps.length - 1 && <div className="flex-1 h-px bg-gray-200" />}
              </React.Fragment>
            ))}
          </div>

          {/* ── DONE STATE ── */}
          {done ? (
            <div className="slide-in text-center py-8">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="font-display text-3xl text-gray-900 mb-2">You're in!</h2>
              <p className="text-gray-500 text-sm mb-2">
                Welcome to Python 8ja, <strong>{form.first_name}</strong>!
              </p>
              <p className="text-gray-400 text-sm mb-8">
                We sent a verification email to <strong>{form.email}</strong>. Please verify before signing in.
              </p>
              <Link
                href="/account/signin"
                className="btn-green inline-block px-8 py-3.5 rounded-xl text-white font-semibold text-sm"
              >
                Go to Sign In →
              </Link>
            </div>
          ) : (
            <>
              {step === 0 && (
                <div className="slide-in">
                  <h1 className="font-display text-3xl text-gray-900 mb-1">Create account</h1>
                  <p className="text-gray-400 text-sm mb-6">
                    Already have an account?{" "}
                    <Link href="/account/signin" className="text-emerald-600 font-semibold hover:underline">Sign in</Link>
                  </p>

                  {/* Social */}
                  <div className="flex gap-3 mb-5">
                    <button onClick={() => handleSocialLogin("google-oauth2")} className="social-btn flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-gray-700 bg-white">
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Google
                    </button>
                    <button onClick={() => handleSocialLogin("github")} className="social-btn flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-gray-700 bg-white">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                      </svg>
                      GitHub
                    </button>
                  </div>

                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex-1 h-px bg-gray-100" />
                    <span className="text-xs text-gray-400 font-medium">or with email</span>
                    <div className="flex-1 h-px bg-gray-100" />
                  </div>

                  {errors.general && (
                    <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">⚠️ {errors.general}</div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                      <input
                        type="email" name="email" value={form.email} onChange={handleChange} required
                        placeholder="you@example.com"
                        className={`input-focus w-full px-4 py-3 rounded-xl border text-sm text-gray-900 bg-gray-50 placeholder-gray-400 transition-all ${errors.email ? "input-error border-red-300" : "border-gray-200"}`}
                      />
                      {errors.email && <p className="error-text">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                      <div className="relative">
                        <input
                          type={showPass ? "text" : "password"} name="password" value={form.password} onChange={handleChange} required
                          placeholder="Min. 8 characters"
                          className={`input-focus w-full px-4 py-3 rounded-xl border text-sm text-gray-900 bg-gray-50 placeholder-gray-400 pr-11 transition-all ${errors.password ? "input-error border-red-300" : "border-gray-200"}`}
                        />
                        <button type="button" onClick={() => setShowPass((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg">
                          {showPass ? "🙈" : "👁️"}
                        </button>
                      </div>
                      {errors.password && <p className="error-text">{errors.password}</p>}
                      {/* Strength bar */}
                      {form.password && (
                        <div className="mt-2 space-y-1">
                          <div className="flex gap-1">
                            {[0,1,2,3].map((i) => (
                              <div key={i} className={`flex-1 h-1 rounded-full transition-all ${i < score ? strengthColors[score - 1] : "bg-gray-200"}`} />
                            ))}
                          </div>
                          <p className="text-xs text-gray-400">{score > 0 ? strengthLabels[score - 1] : ""} password</p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm password</label>
                      <input
                        type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required
                        placeholder="Repeat password"
                        className={`input-focus w-full px-4 py-3 rounded-xl border text-sm text-gray-900 bg-gray-50 placeholder-gray-400 transition-all ${errors.confirmPassword ? "input-error border-red-300" : "border-gray-200"}`}
                      />
                      {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
                    </div>

                    <button type="button" onClick={handleNext} className="btn-green w-full py-3.5 rounded-xl text-white font-semibold text-sm mt-2">
                      Continue →
                    </button>
                  </div>
                </div>
              )}

              {step === 1 && (
                <form onSubmit={handleSubmit} className="slide-in space-y-4">
                  <div>
                    <h1 className="font-display text-3xl text-gray-900 mb-1">Your profile</h1>
                    <p className="text-gray-400 text-sm mb-6">Tell us a little about yourself.</p>
                  </div>

                  {errors.general && (
                    <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">⚠️ {errors.general}</div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">First name</label>
                      <input
                        type="text" name="first_name" value={form.first_name} onChange={handleChange} required placeholder="Emeka"
                        className={`input-focus w-full px-4 py-3 rounded-xl border text-sm text-gray-900 bg-gray-50 placeholder-gray-400 transition-all ${errors.first_name ? "input-error border-red-300" : "border-gray-200"}`}
                      />
                      {errors.first_name && <p className="error-text">{errors.first_name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Last name</label>
                      <input
                        type="text" name="last_name" value={form.last_name} onChange={handleChange} required placeholder="Okafor"
                        className={`input-focus w-full px-4 py-3 rounded-xl border text-sm text-gray-900 bg-gray-50 placeholder-gray-400 transition-all ${errors.last_name ? "input-error border-red-300" : "border-gray-200"}`}
                      />
                      {errors.last_name && <p className="error-text">{errors.last_name}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">@</span>
                      <input
                        type="text" name="username" value={form.username} onChange={handleChange} required placeholder="emeka_py"
                        className={`input-focus w-full pl-8 pr-4 py-3 rounded-xl border text-sm text-gray-900 bg-gray-50 placeholder-gray-400 transition-all ${errors.username ? "input-error border-red-300" : "border-gray-200"}`}
                      />
                    </div>
                    {errors.username && <p className="error-text">{errors.username}</p>}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button" onClick={() => setStep(0)}
                      className="flex-1 py-3.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit" disabled={loading}
                      className="btn-green flex-1 py-3.5 rounded-xl text-white font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Creating…
                        </span>
                      ) : (
                        "Create Account 🚀"
                      )}
                    </button>
                  </div>

                  <p className="text-center text-xs text-gray-400">
                    By creating an account you agree to our{" "}
                    <Link href="/terms" className="text-emerald-600 hover:underline">Terms</Link> &{" "}
                    <Link href="/privacy" className="text-emerald-600 hover:underline">Privacy Policy</Link>
                  </p>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
