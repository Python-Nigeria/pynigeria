import { Inter } from "next/font/google";
import "./css/acss/acss.css";
import "./css/bootstrap-5/css/bootstrap.css";
import "./css/fontawesome/css/all.min.css";
import "./css/animate.min.css";
import "./globals.css";
import Nav from "./nav.js"
import PopUp from "./pop.js"
import "./storage.js"
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Python 9ja",
  description: "Python 9ja Official Website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-montserrat">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>
        <script src="/tailwind.cdn.js"></script>
              <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
        * { font-family: 'Space Grotesk', sans-serif; }
        .font-display { font-family: 'Syne', sans-serif; }
        .green-gradient { background: linear-gradient(135deg, #006400 0%, #228B22 50%, #32CD32 100%); }
        .green-subtle { background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); }
        .hero-pattern {
          background-image: radial-gradient(circle at 20% 50%, rgba(34,139,34,0.08) 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, rgba(0,100,0,0.06) 0%, transparent 40%),
                            radial-gradient(circle at 60% 80%, rgba(50,205,50,0.05) 0%, transparent 40%);
        }
        .card-hover { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .card-hover:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,100,0,0.12); }
        .nav-link { position: relative; }
        .nav-link::after { content:''; position:absolute; bottom:-2px; left:0; width:0; height:2px; background:#16a34a; transition: width 0.3s ease; }
        .nav-link:hover::after { width:100%; }
        .shine { background: linear-gradient(90deg, #006400, #22c55e, #006400); background-size:200%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: shine 3s linear infinite; }
        @keyframes shine { 0%{background-position:0%} 100%{background-position:200%} }
        .fade-in { animation: fadeIn 0.8s ease forwards; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .badge-pill { background: rgba(34,197,94,0.12); border: 1px solid rgba(34,197,94,0.3); }
      `}</style>
        <Nav />
      {children}
      <Footer />
      </body>
    </html>
  );
}


function Footer(){
  return(
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 green-gradient rounded-lg flex items-center justify-center text-white font-bold text-sm">Py</div>
                <span className="font-display font-bold text-lg text-white">Python<span className="text-green-400">9ja</span></span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs">Building Nigeria's most vibrant Python developer community — one line of code at a time. 🇳🇬</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm">Platform</h4>
              <div className="flex flex-col gap-2 text-sm">
                <Link href="/jobs" className="hover:text-green-400 transition-colors">Jobs Board</Link>
                <Link href="/news" className="hover:text-green-400 transition-colors">Tech News</Link>
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

    )
}