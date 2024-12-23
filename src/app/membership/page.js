"use client"
import React from 'react'
import basic from '../members.json'

export default function App(){
	const [verify,setVerify] = React.useState()
	const [number , setNumber] = React.useState()

	return(
			<div class="container-fluid vh-90 d-flex flex-column justify-content-center align-items-center p-0" style={{backgroundImage:"url('/logo.svg')",backgroundSize:'contain',backgroundRepeat:'no-repeat',backgroundPosition:'center'}}>
					<div class="vh-100 container-fluid d-flex color-bg-white p-3 center justify-content-center align-items-center" style={{backgroundColor:"rgba(250,250,250,0.5)"}}>
						<div class="color-bg-white shadow col-md-7 col-12 p-3 py-5">
								{verify ? <Verify number={number}/> : <Input setVerify={setVerify} setNumber={setNumber} />}		

					</div>
				</div>
			</div>
		)
}

function Input({setVerify, setNumber}){
	const nameRef = React.useRef()
	return(
		<>
				<div class="row mb-4">
							<div class="col sz-18">
									Verify Membership here
							</div>
							</div>

							<div class='row sz-20'>
					<div class="col  ">
					 <input ref={nameRef} type="number" max="20" class='no-border bg-light input-hover col-md-7 col-12 py-4 my-4 sz-20 center rounded-4' placeholder="Enter your Whatsapp Nmber" />
					</div>
				</div>
				<div class="row sz-20 my-4">
					<div class="col">
						<button class="color-bg-p color-white rounded no-border col-12 col-md-7 p-3" onClick={()=>{setNumber(nameRef.current.value);setVerify(true)}}> Verify </button>
					</div>
				</div>
			</>
		)
}


const formatNumber = (number)=>{
	if(number.charAt(0) === "0"){
		let update = "+234" + number.slice(1,50) 
		return update
	}
	else if(number.charAt(0) === "+"){
		let n = number.slice(1,50)
		let update = "+" + n

		return update
	}
	return "+" + number.toString()
}

function Verify({number}){
	const data = basic
	const [valid,setValid] = React.useState()
	const [loader , setLoader] = React.useState()
	const validate = ()=>{
		if(basic.includes(formatNumber(number.toString()))){
			setValid(true)
		}
		else{
			setValid(false)
		}
	}

	React.useEffect(()=>{
		setLoader(true)
		validate()
		const timer = setTimeout(()=>setLoader(false),2000)

		return ()=> clearTimeout(timer)
	},[number])

	if(loader){
		return(
			<Loading />
			)
	}

	if(!valid){
		return(
			<>
			<div class="row mb-3 text-danger">
				<div class="col sz-24"> <i class="fas fa-times text-danger"></i> Verification Failed </div>
			</div>

			<div class="row">
				<div class="col sz-20">
					<span class="text-danger">{number}</span> is not a member of Python Nigeria Community
				</div>
			</div>
		</>

			)
	}
	return(
		<>
			<div class="row mb-3 text-success">
				<div class="col sz-24"> <i class="fas fa-check text-success"></i> Verification successful </div>
			</div>

			<div class="row">
				<div class="col sz-20">
					<span class="color-s">{number}</span> is a member of Python Nigeria Community
				</div>
			</div>
		</>

		)
}

function Loading(){
	return(
		<>
		<i class="spinner-border p-3" ></i>
		</>
	)
}