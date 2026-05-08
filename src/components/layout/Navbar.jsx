"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import Avatar from "@/components/ui/Avatar";
import C from "@/styles/colors"
import { FiBell } from "react-icons/fi";
import { useNotifications } from "@/hooks/useNotifications";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Jobs", href: "/jobs" },
  { label: "Events", href: "/events" },
  { label: "Resources", href: "/resources" },
  { label: "Community", href: "/community" },
  { label: "Developers", href: "/profile" },
];

// Pages where the nav should be completely hidden
const HIDDEN_PATHS = ["/register", "/login"];

const ms = (name, extra = {}) => (
  <span className="material-symbols-outlined" style={{ fontSize: 20, verticalAlign: "middle", ...extra }}>{name}</span>
);

export default function Navbar() {
  const path = usePathname();
  const { user, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const router    = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { recentNotifications, unreadCount, loading, markAsRead, markAllAsRead, deleteNotification } = useNotifications();


  if (HIDDEN_PATHS.includes(path)) return null;

  return (
    <>
     <nav style={{
        position: "fixed", top: 0, width: "100%", zIndex: 50,
        background: "rgba(14,14,14,0.85)", backdropFilter: "blur(20px)",
        borderBottom: `1px solid rgba(73,72,71,0.2)`,
        boxShadow: "0 0 20px rgba(142,255,113,0.05)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "1rem 1.5rem", maxWidth: 1440, margin: "0 auto" }}>
          <div className="font-headline" style={{ fontSize: "1.5rem", fontWeight: 900, color: C.primary, letterSpacing: "-0.04em", textTransform: "uppercase" }}>
            <div className="flex items-center gap-2 mb-3">
               <img
              src="/logo.svg"
              alt="Python 9ja"
              className="w-8 h-8 rounded-lg"
            />
              <span className="font-display font-bold text-lg text-white">
                Python<span className="text-green-400">9ja</span>
              </span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "2rem" }} className="font-headline nav-desktop-links">
            {NAV_LINKS.map((item, i) => (
              <a key={item.href} href={item.href} className={i === 0 ? "nav-link-active font-headline" : "nav-link font-headline"}
                style={{ fontSize: "0.8rem", fontWeight: 600, letterSpacing: "-0.02em", textTransform: "uppercase" }}>
                {item.label}
              </a>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div className="nav-search-box" style={{ display: "flex", alignItems: "center", background: C.surfaceLowest, border: `1px solid rgba(73,72,71,0.2)`, padding: "0.3rem 0.75rem" }}>
              {ms("search", { fontSize: 14, color: C.primary, marginRight: 8 })}
              <input
                style={{ background: "transparent", border: "none", outline: "none", fontSize: "0.6rem", width: 128, fontFamily: "JetBrains Mono, monospace", color: C.outline, textTransform: "uppercase" }}
                placeholder="CMD + K TO SEARCH"
              />
            </div>
            {true ? (
              <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "1rem" }}>
                {/* Bell Icon */}
                <button 
                  onClick={ () => setDropdownOpen(!dropdownOpen)}
                  style={{ position: "relative", background: "none", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center"
                  }}
                  aria-label="Notifications"
                  >
                    <FiBell size={20} color="white"></FiBell>
                    {/* Unread badge */}
                    <span style={{
                      position: "absolute",
                      top: "-5px",
                      right: "-8px",
                      background: "#ef4444",
                      color: "white",
                      fontSize: "10px",
                      fontWeight: "bold",
                      borderRadius: "50%",
                      width: "16px",
                      height: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      {unreadCount}
                      </span>  
                  </button>

                  <Avatar name={user?.username || "Test User"}/>
            </div>
            ): (
              <Link href="/login" className="nav-login-btn">
                <button className="login-btn font-headline" style={{ padding: "0.5rem 1.5rem", fontWeight: 700, fontSize: "0.875rem", border: "none", cursor: "pointer" }}>
                  LOGIN
                </button>
              </Link>
            )}

            <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
              <span style={{ transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
              <span style={{ opacity: menuOpen ? 0 : 1 }} />
              <span style={{ transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        <div className={`nav-mobile-menu${menuOpen ? " open" : ""}`}>
          {NAV_LINKS.map((item, i) => (
            <a key={item.href} href={item.href} className={i === 0 ? "nav-link-active" : "nav-link"} onClick={() => setMenuOpen(false)}>
              {item.label}
            </a>
          ))}
          {isAuthenticated ? <Avatar/> 
          : <Link href="/login" style={{ paddingTop: "1rem" }}>
            <button className="login-btn font-headline" style={{ width: "100%", padding: "0.75rem", fontWeight: 700, fontSize: "0.875rem", border: "none", cursor: "pointer", textTransform: "uppercase" }}>
              LOGIN
            </button>
          </Link>}

        </div>
      </nav>

            {/* Notifications Dropdown */}
      {dropdownOpen && (
        <div style={{
          position: "fixed",
          top: "70px",
          right: "20px",
          width: "320px",
          background: "#1a1a1a",
          borderRadius: "12px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
          border: "1px solid rgba(255,255,255,0.1)",
          zIndex: 100,
          overflow: "hidden"
        }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
            <h4 style={{ color: "white", margin: 0 }}>Notifications</h4>
          </div>
          <div style={{ padding: "16px" }}>
          {loading ? (
            <div style={{ textAlign: "center", color: "#888" }}>Loading...</div>
          ) : recentNotifications.length === 0 ? (
            <div style={{ textAlign: "center", color: "#888" }}>No notifications yet</div>
          ) : (
            recentNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                style={{
                  padding: "12px",
                  marginBottom: "8px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  background: notification.is_read ? "transparent" : "rgba(59, 130, 246, 0.1)",
                  transition: "background 0.2s"
                }}
              >
                <div style={{ color: "white", fontSize: "14px", marginBottom: "4px" }}>
                  {notification.message}
                </div>
                <div style={{ color: "#888", fontSize: "12px" }}>
                  {new Date(notification.created_at).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
          {recentNotifications.length > 0 && (
            <Link href="/notifications" style={{ display: "block", textAlign: "center", padding: "12px", color: "#3b82f6", textDecoration: "none", fontSize: "14px" }}>
              View all
            </Link>
          )}
        </div>
        </div>
      )}
    </>
  );
}
