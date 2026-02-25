"use client"
import { useRouter ,useSearchParams,usePathname } from 'next/navigation'
import Link from "next/link"
import React, { useState, useEffect } from "react";

export default function Nav(){
	const path = usePathname()
	const excludedPath= ["/account/signup","/account/signin"]
	const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

	

	if(excludedPath.includes(path)){
		return(<></>)
	}

	return(
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-transparent"}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.svg" className="w-8 h-8 green-gradiet rouded-lg flex items-center justify-center text-white font-bold text-sm"/>
         
            <span className="font-display font-bold text-lg text-green-800">Python<span className="text-green-500">9ja</span></span>
             </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-gray-600">
            <a href="#about" className="nav-link hover:text-green-700 transition-colors">About</a>
            <a href="#community" className="nav-link hover:text-green-700 transition-colors">Community</a>
            <Link href="/jobs" className="nav-link hover:text-green-700 transition-colors">Jobs</Link>
            <Link href="/news" className="nav-link hover:text-green-700 transition-colors">Tech News</Link>
            <Link href="/account/signin" className="px-4 py-2 rounded-lg border border-green-600 text-green-700 hover:bg-green-50 transition-colors text-sm font-semibold">Sign In</Link>
            <Link href="/account/signup" className="px-4 py-2 rounded-lg green-gradient text-white hover:opacity-90 transition-opacity text-sm font-semibold shadow-sm">Join Free</Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-gray-700" onClick={() => setMenuOpen(!menuOpen)}>
            <div className={`w-5 h-0.5 bg-current mb-1 transition-all ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`}></div>
            <div className={`w-5 h-0.5 bg-current mb-1 transition-all ${menuOpen ? "opacity-0" : ""}`}></div>
            <div className={`w-5 h-0.5 bg-current transition-all ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}></div>
          </button>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-3 text-sm">
            <a href="#about" className="text-gray-700 hover:text-green-700 py-1" onClick={() => setMenuOpen(false)}>About</a>
            <a href="#community" className="text-gray-700 hover:text-green-700 py-1" onClick={() => setMenuOpen(false)}>Community</a>
            <Link href="/jobs" className="text-gray-700 hover:text-green-700 py-1">Jobs</Link>
            <Link href="/news" className="text-gray-700 hover:text-green-700 py-1">Tech News</Link>
            <div className="flex gap-3 pt-2">
              <Link href="/account/signin" className="flex-1 text-center py-2 rounded-lg border border-green-600 text-green-700 font-semibold">Sign In</Link>
              <Link href="/account/signup" className="flex-1 text-center py-2 rounded-lg green-gradient text-white font-semibold">Join Free</Link>
            </div>
          </div>
        )}
      </nav>
	
		)
}


function Dropdown ({close}){
	return(
		<div class="container-fluid  border-top sz-18 vh-100 display-fixed ease">
		<br />
    <div class="py-3"><a class="dropdown-item" href="/membership">Membership</a></div>
    <div class="py-3"><a class="dropdown-item" href="#">Jobs</a></div>
    <div class="py-3"><a class="dropdown-item" href="#">Forums</a></div>
    <div class="py-3"><a class="dropdown-item" href="#">Resorces</a></div>

    <div class="my-2 mt-4"><button class="btn btn-danger w-100" onClick={()=>close()}> Close </button></div>
		</div>
	)
}