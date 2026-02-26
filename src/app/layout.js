import "./css/acss/acss.css";
import "./css/bootstrap-5/css/bootstrap.css";
import "./css/fontawesome/css/all.min.css";
import "./css/animate.min.css";
import "./globals.css";
import Nav from "./nav.js";
import Link from "next/link";

export const metadata = {
  title: "Python 9ja",
  description: "Python 9ja Official Website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Clash+Display:wght@600;700&family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{ __html: `
          /* ── Base typography ── */
          *, *::before, *::after { box-sizing: border-box; }
          * { font-family: 'DM Sans', 'Space Grotesk', sans-serif; }
          .font-display { font-family: 'Clash Display', 'Syne', sans-serif; }

          /* ── Brand gradients ── */
          .green-gradient {
            background: linear-gradient(135deg, #065f46 0%, #059669 60%, #34d399 100%);
          }
          .green-gradient-soft {
            background: linear-gradient(135deg, #006400 0%, #228B22 50%, #32CD32 100%);
          }
          .green-subtle {
            background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          }

          /* ── Hero background pattern ── */
          .hero-pattern {
            background-image:
              radial-gradient(circle at 20% 50%, rgba(34,139,34,0.08) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(0,100,0,0.06) 0%, transparent 40%),
              radial-gradient(circle at 60% 80%, rgba(50,205,50,0.05) 0%, transparent 40%);
          }

          /* ── Card interactions ── */
          .card-hover { transition: transform 0.25s ease, box-shadow 0.25s ease; }
          .card-hover:hover {
            transform: translateY(-6px);
            box-shadow: 0 20px 40px rgba(0,100,0,0.12);
          }

          /* ── Nav link underline ── */
          .nav-link { position: relative; }
          .nav-link::after {
            content: '';
            position: absolute;
            bottom: -2px; left: 0;
            width: 0; height: 2px;
            background: #16a34a;
            transition: width 0.3s ease;
          }
          .nav-link:hover::after { width: 100%; }

          /* ── Animated shine text ── */
          .shine {
            background: linear-gradient(90deg, #006400, #22c55e, #006400);
            background-size: 200%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: shine 3s linear infinite;
          }
          @keyframes shine {
            0%   { background-position: 0%; }
            100% { background-position: 200%; }
          }

          /* ── Page entry animations ── */
          .fade-in {
            animation: fadeIn 0.8s ease forwards;
          }
          .fade-up {
            animation: fadeUp 0.5s ease forwards;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(12px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .slide-in {
            animation: slideIn 0.35s ease forwards;
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translateX(20px); }
            to   { opacity: 1; transform: translateX(0); }
          }

          /* ── Badge pill ── */
          .badge-pill {
            background: rgba(34,197,94,0.12);
            border: 1px solid rgba(34,197,94,0.3);
          }

          /* ── Buttons ── */
          .btn-green {
            background: linear-gradient(135deg, #065f46, #059669);
            transition: all 0.2s ease;
          }
          .btn-green:hover {
            opacity: 0.92;
            transform: translateY(-1px);
            box-shadow: 0 8px 25px rgba(5,150,105,0.35);
          }
          .btn-green:active { transform: translateY(0); }
          .btn-green:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
          }

          /* ── Form inputs ── */
          .input-focus:focus {
            outline: none;
            border-color: #059669;
            box-shadow: 0 0 0 3px rgba(5,150,105,0.12);
          }
          .input-error {
            border-color: #fca5a5 !important;
            background: #fff5f5;
          }
          .error-text {
            color: #ef4444;
            font-size: 0.75rem;
            margin-top: 0.25rem;
          }

          /* ── Social buttons ── */
          .social-btn {
            transition: all 0.2s ease;
            border: 1.5px solid #e5e7eb;
          }
          .social-btn:hover {
            border-color: #059669;
            background: #f0fdf4;
            transform: translateY(-1px);
          }

          /* ── Step indicator (sign up wizard) ── */
          .step-active {
            background: linear-gradient(135deg, #065f46, #059669);
            color: white;
          }
          .step-done  { background: #d1fae5; color: #065f46; }
          .step-idle  { background: #f3f4f6; color: #9ca3af; }

          /* ── Filter chips (jobs sidebar) ── */
          .filter-chip { transition: all 0.15s; }
          .filter-chip.active {
            background: linear-gradient(135deg, #065f46, #059669);
            color: white;
            border-color: transparent;
          }
          .filter-chip:not(.active):hover {
            border-color: #059669;
            color: #059669;
          }

          /* ── Skeleton loader ── */
          .skeleton {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: shimmer 1.4s infinite;
          }
          @keyframes shimmer {
            0%   { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }

          /* ── Job card ── */
          .job-card {
            animation: fadeUp 0.4s ease forwards;
            transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
          }
          .job-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 32px rgba(5,150,105,0.1);
            border-color: #a7f3d0;
          }

          /* ── Error shake ── */
          .error-shake { animation: shake 0.4s ease; }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25%       { transform: translateX(-6px); }
            75%       { transform: translateX(6px); }
          }

          /* ── Left panel (auth pages) ── */
          .panel-left {
            background: linear-gradient(160deg, #022c22 0%, #064e3b 50%, #065f46 100%);
          }
          .pattern-dots {
            background-image: radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px);
            background-size: 24px 24px;
          }

          /* ── Section cards (post-job form) ── */
          .section-card {
            background: white;
            border-radius: 1rem;
            border: 1px solid #f3f4f6;
            padding: 1.75rem;
            margin-bottom: 1.25rem;
          }

          /* ── Rich text prose (job description) ── */
          .prose p  { margin-bottom: 1em; line-height: 1.75; }
          .prose ul { list-style: disc; padding-left: 1.5rem; margin-bottom: 1em; }
          .prose li { margin-bottom: 0.4em; }
          .prose h3 { font-weight: 700; font-size: 1.1rem; margin: 1.2em 0 0.4em; color: #111; }

          /* ── Search bar focus ── */
          .search-focus:focus {
            outline: none;
            border-color: #059669;
            box-shadow: 0 0 0 3px rgba(5,150,105,0.1);
          }
        `}} />
        <script src="/tailwind.cdn.js"></script>
      </head>
      <body>
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}


function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 green-gradient rounded-lg flex items-center justify-center text-white font-bold text-sm">
                Py
              </div>
              <span className="font-display font-bold text-lg text-white">
                Python<span className="text-green-400">9ja</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Building Nigeria's most vibrant Python developer community — one line of code at a time. 🇳🇬
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Platform</h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/jobs"           className="hover:text-green-400 transition-colors">Jobs Board</Link>
              <Link href="/news"           className="hover:text-green-400 transition-colors">Tech News</Link>
              <Link href="/account/signup" className="hover:text-green-400 transition-colors">Sign Up</Link>
              <Link href="/account/signin" className="hover:text-green-400 transition-colors">Sign In</Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Community</h4>
            <div className="flex flex-col gap-2 text-sm">
              <a href="https://chat.whatsapp.com/BiQWwZnBTgwFaAbLmhiF43" className="hover:text-green-400 transition-colors">WhatsApp Group</a>
              <a href="#" className="hover:text-green-400 transition-colors">Telegram</a>
              <a href="#" className="hover:text-green-400 transition-colors">Discord</a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <p>© {new Date().getFullYear()} Python 9ja. Made with 🐍 in Nigeria.</p>
          <p className="text-green-500">🇳🇬 Empowering Nigerian Developers</p>
        </div>
      </div>
    </footer>
  );
}
