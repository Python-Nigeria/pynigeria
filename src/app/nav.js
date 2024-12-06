"use client"
import React from "react";
import {animate,motion , useScroll, useMotionValueEvent} from "motion/react";

export default function Nav(){
	const [isScrolled,setIsScrolled]= React.useState(false)
	const {scrollY} = useScroll()

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
		<nav class={`container-fluid sz-14 sticky-top ease-in-out color-bg-p ${isScrolled ? "color-bg-p color-white ease" : "color-black color-bg-t ease"} `} style={{zIndex:'20'}} >
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