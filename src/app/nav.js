"use client"
import React from "react";
import {animate,motion , useScroll, useMotionValueEvent} from "motion/react";
import { useRouter ,useSearchParams,usePathname } from 'next/navigation'
import Link from "next/link"

export default function Nav(){
	const path = usePathname()
	const excludedPath= ["/account/signup"]
	const [isScrolled,setIsScrolled]= React.useState(false)
	const {scrollY} = useScroll()
	const animateClass = `${isScrolled ? "color-bg-white color-black" : "color-bg-white color-black"}`

	React.useEffect(()=>{
		const handleScroll = () =>{
			if (window.scrollY > 50){
				setIsScrolled(true);
			}
			else{
				setIsScrolled(false)
			}
		}
		window.addEventListener('scroll',handleScroll,{passive:true})

		return ()=> window.removeEventListener('scroll',handleScroll)
	},[])

	if(excludedPath.includes(path)){
		return(<></>)
	}

	return(
		<nav id="nav" class={`container-fluid sz-14 sticky-top py-2 py-md-3 ${path === "/" ? animateClass : "color-bg-p color-white" } ease`} style={{zIndex:'20'}} >
        <div class="row align-items-center">
          <div class="col-6 p-4 sz-16 bold">
            <i class="fab fa-python color-s"></i> Python Nigeria
          </div>
          <div class="col font-poppins p-4 right display-sm-none"> 
            Dashboard 
          </div>
          <div class="col font-poppins p-4 right display-sm-none">
            Jobs
          </div>
          <div class="col font-poppins p-4 right display-sm-none">
            Forums
          </div>
          <div class="col font-poppins p-4 right display-sm-none">
            Resorces
          </div>
          <div class="col font-poppins p-4 right display-sm-none">
            <Link class="color-bg-p color-white no-decoration p-2 rounded" href="/"> Join Us </Link>
          </div>
          <div class="col d-md-none right sz-24">
          	<i class="fas fa-bars"></i>
          </div>
        </div>
        </nav>
		)
}