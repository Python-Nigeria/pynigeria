"use client"
import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function PopUp(){
	const [pop,showPop] = React.useState()
	const route = useRouter()

	const changePage = () =>{
		showPop(false)
		route.push('/membership')
	}

	React.useEffect(()=>{
		showPop(false)
		const timer = setTimeout(()=>showPop(true),2000)
		return ()=> clearTimeout(timer)
	},[])

	if(!pop){
		return null
	}

	return(
			<div class="position-fixed container-fluid d-flex align-items-center justify-content-center vh-100 ease" style={{botto:'5%',top:'0%',backgroundColor:"rgba(0,0,0,0.5)",overflow:'hidden'}}>
			<div class="position-relative shadow-lg color-bg-white p-5 col-md-6" >
				<div class="row my-3">
						<div class="col font-motserrat-bold sz-20 center">
								<i class="fas fa-calendar"></i> Happy New Year!!! <i class="fas fa-"></i>
						</div>
				</div>

				<p class="sz-14 py-2 center"> Wishing you a prosperous and joyful New Year! As we begin 2025, we would like to remind all members to verify their membership status </p>
				<div class="alert alert-warning sz-14 mb-5 center">
				<div class="row">
					<div class="col bold"> Important Membership Notice </div>
				</div>
					Please check your membership eligibility status to ensure continued access through 2025. Members that are not active may be removed
				</div>
				<div class="row my-4">
					<div class="col color-white center"><button onClick={()=>changePage()} class="no-decoration p-3 sz-16 color-bg-p d-inline-block col-md-5 rounded col-10">Verify Membership</button> </div>

				</div>
				<div class="row">
					<div class="col center"> <button class="no-border bg-danger color-white  rounded btn-danger  p-3 col-md-4 col-10 sz-16" onClick={()=>showPop(false)}> Close </button > </div>
				</div>
			</div>
		</div>
		)
}