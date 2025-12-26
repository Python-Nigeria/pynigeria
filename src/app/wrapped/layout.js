import React from "react"


export default function Layout({ children }) {
  return (
    <div className="wrap-layout ">
      <header className="wrap-header d-none">
        <img
          src="/logo.svg"
          alt="Python 9ja"
          className="wrap-logo"
        />

        <div className="wrap-title">
          <span className="wrap-emoji">🎉</span>
          <div>
            <div className="wrap-year">2025</div>
            <div className="wrap-text">Wrapped</div>
          </div>
        </div>
      </header>

      <main className="wrap-content mt-4 container">
        {children}
      </main>
    </div>
  );
}