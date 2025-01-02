"use client"
import React from "react";
import {animate,motion , useScroll, useMotionValueEvent} from "motion/react";
import { useRouter ,useSearchParams,usePathname } from 'next/navigation'
import Link from "next/link"

export default function Nav(){
	const path = usePathname()
	const excludedPath= ["/account/signup"]
	const [isScrolled,setIsScrolled]= React.useState(false)
	const [dropdown , showDrop] = React.useState(false)
	const {scrollY} = useScroll()
	const animateClass = `${isScrolled ? "color-bg-white color-black shadow-sm" : "color-bg-white color-black"}`

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
		<nav id="nav" class={`container-fluid sz-14 sticky-top p-4 py-3 py-md-3 ${path === "/" ? animateClass : "color-bg-white color-black shadow-sm" } ease`} style={{zIndex:'20'}} >
        <div class="row align-items-center">
          <div class="col col-md-6 p-2 sz-16 bold">
          <div class="row align-items-center">
          <div class="col-1 col-md-1  p-0">
            <img src="/logo.svg" class="img-fluid" style={{height:'25px',width:'auto'}}/> </div>
            <div class="col p-1">Python Nigeria</div>
          </div>
          </div>
          <div class="col font-poppins p-4 right display-sm-none"> 
            <Link href="/membership" class="no-decoration"> Membership </Link> 
          </div>
          <div class="col font-poppins p-4 right display-sm-none">
            <Link href="/job" class="no-decoration">Jobs</Link>
          </div>
          <div class="col font-poppins p-4 right display-sm-none">
            Forums
          </div>
          <div class="col font-poppins p-4 right display-sm-none">
            Resorces
          </div>
          <div class="col font-poppins p-4 right display-sm-none color-white">
            <Link class="color-bg-p color-white no-decoration p-2 rounded" href="/"> Join Us </Link>
          </div>
          <div class="col-2 d-md-none right sz-20">
          	{!dropdown && <span onClick={()=>showDrop(true)}> <i class="fas fa-ellipsis-v font-montserrat-bold color-p"></i><i class="fas fa-ellipsis-v font-montserrat-bold color-p"></i><i class="fas fa-ellipsis-v font-montserrat-bold color-p"></i> </span>}
          </div>
        </div>
        {dropdown && <Dropdown close={()=>showDrop(false)} /> }
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