"use client"
import React from "react";
import {animate,motion , useScroll, useMotionValueEvent} from "motion/react";
import { useRouter ,useSearchParams,usePathname } from 'next/navigation'

export default function Nav(){
	const path = usePathname()
	const [isScrolled,setIsScrolled]= React.useState(false)
	const {scrollY} = useScroll()
	const animateClass = `${isScrolled ? "color-bg-p color-white" : "color-bg-t color-black"}`

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

	return(
		<nav id="nav" class={`container-fluid sz-14 sticky-top ${path === "/" ? animateClass : "color-bg-p color-white" } ease`} style={{zIndex:'20'}} >
        <div class="row">
          <div class="col-8 p-4 ">
            <i class="fab fa-python"></i> Python Nigeria
          </div>
          <div class="col font-poppins p-4 right display-sm-none"> 
            membership 
          </div>
          <div class="col font-poppins p-4 right display-sm-none">
            about us
          </div>
        </div>
        </nav>
		)
}