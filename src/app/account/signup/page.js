"use client"
import React from 'react'
// import axios from 'axios'
// import {postData} from '../../endpoints.js'
import {useRouter} from 'next/navigation';
// import Cookies from 'js-cookie';
// import {QuizBoxContext} from "../../components.js"
import Link from "next/link"

export default function SignUp(props){

	
	const router = useRouter()
	const username = React.useRef()
	const passwords = React.useRef([])
	const [message, setMessage] = React.useState()
	// const {setLoader} = React.useContext(QuizBoxContext)

	const validateInput = ()=>{
		// setLoader(true)
		checkDifference()
		if(username.current.value === ""){
			setMessage("Please enter Username")
		}
		else if(passwords.current[0].value === "" || passwords.current[1].value === ""){
			setMessage("Please Enter Password")
		}
		else if(passwords.current[0].value != passwords.current[1].value){
			setMessage('Passwords does not match')
		}
		else{
			let data = {username:username.current.value,password:passwords.current[0].value}
			// postData('signup',data).then((res)=>{
			// 	if(res){
			// 	if(res.error){
			// 		setMessage(res.msg)
			// 	}
			// 	else{
			// 		setMessage(res.message)
			// 	router.push("/account/login")}
			// }
			// else{
			// 	setMessage("Error Signing you in")
			// }}
			// )
		}
	}

	const checkDifference = ()=>{
		if(passwords.current[0].value != passwords.current[1].value){
			setMessage("Password does not match")
		}
		else{
			setMessage()
		}
	}

	React.useEffect(()=>{
		// setLoader(false)
	},[message])

	React.useEffect(()=>{
		// Cookies.remove('token')
		// document.getElementById("nav").classList.add("d-none")
		// document.body.classList.add("color-bg-t")
			// setLoader(false)
	// return ()=>setLoader(true)
},[])

	return(
		<div class="container-fluid position-fixed vh-100 color-bg-white d-flex justify-content-center w-100">

		<div class="col-sm col-md-4">
				<div class="row mb-3">
					<div class="col color-black sz-16 "> <img src="/logo.svg" class="p-2" style={{height:"25px"}} />Python Nigeria </div>
				</div>

				<div class="row sz-14 mb-5">
					<div class="col"> <div class="button color-bg-white color-black rounded-4 p-2 text-danger"> <i class="fab fa-google text-danger hide"></i> Continue with Google </div> 
					 </div>
					 <div class="col-1 right">
					 	<i class="fas fa-arrow-right bold"></i>
					 </div>
				</div>

				<div class="row my-4">
					<div class="col color-p sz-20 bold"> Sign Up </div>
				</div>

				{message &&
				<div class="row py-4">
					<div class="col text-danger sz-16"><div class="alert alert-danger">{message}</div></div>
				</div>
				}

				<div class="row align-items-center py-3">
					<div class="col-12 sz-16 pb-4"> Username </div>
					<div class="col"> <input ref={username} class="form-control sz-18 p-3" /> </div>
				</div>
				<div class="row align-items-center py-3">
					<div class="col-12 sz-16 pb-4"> Password </div>
					<div class="col"> <input type='password' class="form-control sz-18 p-3" ref={el=>passwords.current[0] = el} /> </div>
				</div>

				<div class="row align-items-center py-3">
					<div class="col-12 sz-16 pb-4"> Confirm Password </div>
					<div class="col"> <input type="password" class="form-control sz-18 p-3" ref={el=>passwords.current[1] = el} /> </div>
				</div>

				<div class="row py-4">
					<div class="col"> <button onClick={()=>validateInput()} class="color-bg-p no-border rounded-4 w-100 color-white color-bg-s-hover sz-18 p-2 py-3"> Sign-Up </button></div>
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