"use client"
import React from "react"
//import userStat from "../userStat.json"
import Link from "next/link"

export default function Main(){
	const [show,setShow] = React.useState(0)

	return(
			<div class="container">
				<div class="row sz-24">
					<div class="col-sm col-md center p-2"> <Link class="rounded no-decoration d-block color-black p-5 color-bg-t shdow-md d-flex align-items-center bold justify-content-center cursor-pointer color-s-hover" style={{height:"250px",cursor:"pointer"}} href="/wrapped/community"> <i class="fas fa-users  mx-2"></i> Community Wrap </Link> </div>
					<div class="col-sm col-md center p-2" > <Link class="rounded  p-5  d-flex align-items-center bold justify-content-center color-s-hover bg-light d-block no-decoration color-black" href="/wrapped/individual" style={{height:"250px",cursor:"pointer"}}> <i class="fas fa-user mx-2"></i> My Wrap </Link> </div>
				</div>
				
			</div>

		)
}


