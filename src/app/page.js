"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {

  const stats = [
    { value: "2,500+", label: "Members" },
    { value: "100+", label: "Daily Engagements" },
    { value: "120+", label: "Job Posted" },
    { value: "5+ yrs", label: "Running Strong" },
  ];

  const features = [
    {
      icon: "🎓",
      title: "Learn From the Best",
      desc: "Get personalized guidance from experienced Python developers to accelerate your growth and achieve your goals.",
    },
    {
      icon: "💬",
      title: "Join the Conversation",
      desc: "Engage in lively discussions, share insights, and solve problems with fellow Python enthusiasts in a supportive forum.",
    },
    {
      icon: "💼",
      title: "Python Job Opportunities",
      desc: "Explore curated job postings tailored to Python developers, data scientists, and machine learning experts across Nigeria.",
    },
    {
      icon: "📰",
      title: "Tech News & Updates",
      desc: "Stay ahead with the latest Python releases, framework updates, and industry news curated for the African tech ecosystem.",
    },
  ];

  const tracks = [
    "Web Development",
    "Data Science & Analysis",
    "Machine Learning",
    "Automation & Scripting",
    "Job Updates",
    "Open Source",
  ];

  const platforms = [
    { name: "WhatsApp", icon: "💬", href: "https://chat.whatsapp.com/BiQWwZnBTgwFaAbLmhiF43", color: "bg-green-500" },
    { name: "Telegram", icon: "✈️", href: "#", color: "bg-sky-500" },
    { name: "Discord", icon: "🎮", href: "#", color: "bg-indigo-500" },
  ];

  return (
    <div className="font-sans text-gray-900 bg-white overflow-x-hidden">

      {/* ─── HERO ─── */}
      <section className="min-h-screen hero-pattern flex items-center pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div className="fade-in">
              <div className="inline-flex items-center gap-2 badge-pill rounded-full px-4 py-1.5 text-sm text-green-700 font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Nigeria's #1 Python Community
              </div>
              <h2 className="font-display text-3xl md:text-6xl leading-tight text-gray-900 mb-4"> Welcome to
                 <br />
                <span className="shine text-5xl">Python 9ja</span>
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-md">
                A space for Python enthusiasts across Nigeria to share knowledge, tackle real-world projects together, and grow in tech 
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/account/signup" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl green-gradient text-white font-semibold shadow-md hover:opacity-90 transition-opacity text-sm">
                  🐍 Become a Member
                </Link>
                <a href="https://chat.whatsapp.com/BiQWwZnBTgwFaAbLmhiF43" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border-2 border-green-600 text-green-700 font-semibold hover:bg-green-50 transition-colors text-sm">
                  💬 Join WhatsApp
                </a>
              </div>
              {/* Quick-links row */}
              <div className="flex gap-4 mt-6">
                <Link href="/jobs" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-700 transition-colors">
                  <span className="text-base">💼</span> Browse Jobs
                </Link>
                <Link href="/news" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-700 transition-colors">
                  <span className="text-base">📰</span> Tech News
                </Link>
                <Link href="/account/signin" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-700 transition-colors">
                  <span className="text-base">🔐</span> Sign In
                </Link>
              </div>
            </div>

            {/* Right – Hero graphic placeholder / logo */}
            <div className="flex justify-center fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="relative">
                <div className="w-72 h-72 md:w-96 md:h-96 green-gradient rounded-3xl flex items-center justify-center shadow-2xl">
                  <img src="/hero.png" alt="Python 8ja hero" className="w-full h-full object-cover rounded-3xl opacity-90" onError={(e) => { e.target.style.display = "none"; }} />
                  <span className="hidden absolute text-8xl select-none">🐍</span>
                </div>
                {/* floating badges */}
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg px-4 py-2 text-sm font-semibold text-green-700 border border-green-100">2,400+ Members 🇳🇬</div>
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg px-4 py-2 text-sm font-semibold text-green-700 border border-green-100">🐍 Python Powered</div>
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20">
            {stats.map((s) => (
              <div key={s.label} className="text-center bg-white/80 backdrop-blur-sm rounded-2xl py-5 shadow-sm border border-green-50">
                <div className="font-display text-3xl text-green-700 font-bold">{s.value}</div>
                <div className="text-sm text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="py-24 green-subtle">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <div className="inline-block badge-pill rounded-full px-4 py-1 text-sm text-green-700 font-medium mb-3">Why Python 9ja?</div>
            <h2 className="font-display text-4xl md:text-5xl text-gray-900">What Makes Our Community<br /><span className="text-green-600">Unique</span></h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm border border-green-50 card-hover">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ABOUT ─── */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block badge-pill rounded-full px-4 py-1 text-sm text-green-700 font-medium mb-4">About Us</div>
              <h2 className="font-display text-4xl md:text-5xl text-gray-900 mb-6">Building Nigeria's<br /><span className="text-green-600">Python Ecosystem</span></h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                Python 9ja is a vibrant community of developers and enthusiasts dedicated to exploring Python programming in Nigeria. Whether you're an expert or just starting out, you'll find a supportive environment to grow and collaborate.
              </p>
              <p className="text-gray-500 leading-relaxed mb-6">
                Our vision is to empower Python developers across Africa to connect, grow, and make a meaningful impact in tech. We believe in <strong className="text-gray-700">Collaboration</strong>, <strong className="text-gray-700">Inclusivity</strong>, <strong className="text-gray-700">Innovation</strong>, and <strong className="text-gray-700">Growth</strong>.
              </p>
              <Link href="/account/signup" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl green-gradient text-white font-semibold hover:opacity-90 transition-opacity shadow-md text-sm">
                Join the Community →
              </Link>
            </div>
            <div>
              <div className="grid grid-cols-2 gap-3">
                {tracks.map((t) => (
                  <div key={t} className="rounded-xl px-4 py-4 bg-green-50 border border-green-100 text-green-800 font-medium text-sm text-center card-hover cursor-default">
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── JOBS + NEWS BANNER ─── */}
      <section className="py-16 bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Jobs Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-green-100 card-hover flex flex-col gap-4">
              <div className="text-4xl">💼</div>
              <h3 className="font-display text-2xl text-gray-900">Python Jobs Board</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Discover Python developer roles, data science positions, and ML engineer jobs across Nigeria and remote opportunities globally — posted by verified employers.</p>
              <Link href="/jobs" className="mt-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl green-gradient text-white font-semibold hover:opacity-90 transition-opacity shadow-sm text-sm w-fit">
                Browse Jobs →
              </Link>
            </div>

            {/* Tech News Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-green-100 card-hover flex flex-col gap-4">
              <div className="text-4xl">📰</div>
              <h3 className="font-display text-2xl text-gray-900">Tech News & Insights</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Stay current with Python releases, trending frameworks, African tech startup news, and tutorials curated by our community editors every week.</p>
              <Link href="/news" className="mt-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border-2 border-green-600 text-green-700 font-semibold hover:bg-green-50 transition-colors text-sm w-fit">
                Read News →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── JOIN / PLATFORMS ─── */}
      <section id="community" className="py-24 green-gradient text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <img src="/logo.svg" alt="Python 8ja" className="w-20 h-20 mx-auto mb-6 bg-white/10 rounded-2xl p-3" onError={() => {}} />
          <h2 className="font-display text-4xl md:text-5xl mb-4">Join Us on Every Platform</h2>
          <p className="text-green-100 mb-12 text-lg">Connect with the community wherever you are.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            {platforms.map((p) => (
              <a key={p.name} href={p.href} className="flex items-center justify-center gap-3 bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-colors rounded-xl px-6 py-4 font-semibold text-white border border-white/20">
                <span className="text-2xl">{p.icon}</span> {p.name}
              </a>
            ))}
          </div>
          <a href="https://chat.whatsapp.com/BiQWwZnBTgwFaAbLmhiF43" className="inline-flex items-center gap-2 bg-white text-green-700 font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-green-50 transition-colors text-base">
            🐍 Join the Community Now
          </a>
        </div>
      </section>
    </div>
  );
}
