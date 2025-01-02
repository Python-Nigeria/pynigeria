"use client"
import React from 'react'
import {FormEvent} from 'react'
import {endpoint} from "../../endpoints.js"
import {useRouter} from 'next/navigation';
import Cookies from 'js-cookie';
// import {QuizBoxContext} from "../../components.js"
import Link from "next/link"

export default function SignUp(props){
	const router = useRouter()
	const username = React.useRef()
	const email = React.useRef()
	const [message, setMessage] = React.useState()
	// const {setLoader} = React.useContext(QuizBoxContext)

	const validateInput = async ()=>{
		const token = Cookies.get('csrfToken')
	
		if(email.current.value === ''){
			return setMessage("Email is required")
		}
		try{
			const detail = {
				method: 'POST',
				headers: {
					'Content-Type':'application/json',
					"X-CSRFToken" : token
				},
			 	body: JSON.stringify({"email" : email.current.value}) 
			 }
			const request = await fetch("http://127.0.0.1:8000/api/v1/authentication/register/",detail)
			const response = await request.json()
			if(!response.ok ){
				return setMessage(response.detail)
			}
			setMessage(response.message)
		}
		catch(error){
			setMessage(error.toString())
		}
	
	}


	React.useEffect(()=>{
		// setLoader(false)
	},[message])

	React.useEffect(()=>{
		let checkCookies = Cookies.get('csrfToken')
		if(!checkCookies){
		fetch(`http://127.0.0.1:8000/api/v1/authentication/csrfToken/`).then(x=>x.json()).then(x=>Cookies.set('csrfToken',x.csrfToken))
		}
	},[])

	return(
		<div class="container-fluid position-fixed vh-100 color-bg-white d-flex justify-content-center w-100">

		<div class="col-sm col-md-4">
				<div class="row mb-5">
					<div class="col color-black sz-16 center"> <img src="/logo.svg" class="p-2" style={{height:"25px"}} />Python Nigeria </div>
				</div>


				<div class="row my-4">
					<div class="col color-p sz-20 bold"> Sign Up </div>
				</div>

				{message &&
				<div class="row py-4">
					<div class="col text-danger sz-16"><div class="alert alert-danger">{message}</div></div>
				</div>
				}

				{/*
				<div class="row align-items-center py-3">
					<div class="col-12 sz-16 pb-4"> Username </div>
					<div class="col"> <input ref={username} class="form-control sz-18 p-3" /> </div>
				</div>
				*/}

				<div class="row align-items-center py-3">
					<div class="col-12 sz-16 pb-4"> Email </div>
					<div class="col"> <input onFocus={()=>setMessage()} type='email' class="form-control sz-18 p-3" ref={email} /> </div>
				</div>

				<div class="row py-4">
					<div class="col"> <button onClick={()=>validateInput()} class="color-bg-p no-border rounded-4 w-100 color-white color-bg-s-hover sz-18 p-2 py-3"> Sign-Up </button></div>
				</div>

				<div class="row py-4">
					<div class="col"> <button class="color-bg-white no-border text-danger rounded-4 w-100 color-white color-bg-t-hover sz-18 p-2 py-3"> <i class="fab fa-google text-danger rounded-circle border p-2"></i> Continue with Google </button></div>
				</div>

				<div class="row border-top">
				<div class="col center p-2 py3">
				<Link href="/account/login" class="no-decoration sz-16 "> Log in </Link> 
				</div>
			</div>
			</div>
			</div>
		)
}



function CSRFToken(){
	if(document.cookie && document.cookie !== ""){
		const cookies = document.cookie.split(';');
		console.log(cookies)
	}
}