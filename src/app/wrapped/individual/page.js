"use client"
import React from "react"
import userStat from "../../userStat.json"

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

const formatDate = (date)=>{
	let newDate = date.slice(0,1)
	return newDate
}

export default function InputWrapp(){
	const [show, setShow] = React.useState()
	const nameRef = React.useRef()

	if (show){
		return (<><IndividualWrap name={formatNumber(nameRef.current.value)} /> </>)
	}
	return(
			<div class="rounded justify-content-center py-5 center container">
				<div class='row sz-20'>
					<div class="col  ">
					 <input ref={nameRef} type="number" max="20" class='no-border border-bottom bg-light input-hover col-md-7 col-12 py-4 my-4 sz-20 center' placeholder="Enter your Whatsapp Nmber" />
					</div>
				</div>
				<div class="row sz-20 my-4">
					<div class="col">
						<button class="bg-danger color-white rounded no-border col-12 col-md-7 p-3" onClick={()=>setShow(true)}> Get Wrapped </button>
					</div>
				</div>

				</div>

		)
}



function IndividualWrap({name}){
	const  data = userStat[name]
	const colorClass = ["bg-warning","bg-primary","color-purple","bg-danger","bg-light","color-bg-red","color-bg-purple"]
	const [timer,setTimer] = React.useState(0)
	const [change ,setChange] = React.useState(1)

	React.useEffect(()=>{
		if(change != 5){
		if (timer > 5){
			setChange((prev)=> prev == 5 ? 0 : prev + 1)
			setTimer(0)
		}
		else{
		var time = setInterval(()=>setTimer((prev)=>prev+1),800)
	}
	
}
return ()=> clearInterval(time)
	},[timer])

	if(!data){
		return(
				<div class="alert alert-danger sz-18"> Data for this User is not found </div>
			)
	}

	return(
			<div class={"container-fuid p-md-5 vh-100 position-fixed "} style={{top:'0',zIndex:30,left:"0px",right:0,backgroundColor:"#E7F9E9"}}>
				
				<div class="row">
				<div class="col p-1 color-white">
				<div class={"rounded " + colorClass[change]} style={{width:`${((timer/5) * 100)}%`,bottom:'40px',height:'3px'}}></div>
				</div>
				</div>

				<div class='row sz-24 color-black'>
					<div class="col bold center p-3">
						{name}
					</div>
				</div>

				

				<div class="d-flex flex-column vh-80 justify-content-center">

				{change == 0 && <div class='row center  justify-content-center animate__animated animate__fadeIn'>
				<div class={"col-10 rounded-4 py-5 bg-warning"}>
					<div class="col-12 color-black sz-24">
						 Total Messages <i class="fas fa-comment"></i> 
					</div>
					<div class="col sz-48 color-white">
						{data.total_messages}
					</div>
				</div>
				</div>}

				{change == 1 && <div class='row center  justify-content-center animate__animated animate__fadeIn'>
				<div class="col-10 rounded-4 py-5 bg-primary">
					<div class="col-12 color-black sz-24">
						 Total Words <i class="fas fa-pen"></i>
					</div>
					<div class="col sz-48 color-white">
						{data.total_words}
					</div>
				</div>
				</div>}

				{change == 2 && <div class='row center  justify-content-center animate__animated animate__fadeIn'>
				<div class="col-10 rounded-4 py-5 color-bg-s">
					<div class="col-12 color-black sz-24">
						Total Files <i class="fas fa-file"></i>
					</div>
					<div class="col sz-48 color-white">
						{data.total_files}
					</div>
				</div>
				</div>}

				{change == 3 && <div class='row center  justify-content-center animate__animated animate__fadeIn'>
				<div class="col-10 rounded-4 py-5 color-bg-red">
					<div class="col-12 color-black sz-24">
						Total Links <i class="fas fa-links"></i>
					</div>
					<div class="col sz-48 color-white">
						{data.total_links}
					</div>
				</div>
				</div>}

				{change == 4 && <div class='row center  justify-content-center animate__animated animate__fadeIn'>
				<div class="col-10 rounded-4 py-5 color-bg-purple">
					<div class="col-12 color-black sz-24">
						Day with most Messages <i class="fas fa-calendar"></i>
					</div>
					<div class="col sz-48 color-white">
							{formatDate(Object.entries(data.days_with_more_messages)[0])}
					</div>
				</div>
				</div>}


				{
					change == 5 && 
					<div class='row animate__animated animate__fadeIn  justify-contents-center p-1'>
						<div class="col-6 center">
							<div class="rounded-4 py-5 p-2 bg-warning">
									<div class="row">
									<div class="col-12 color-black sz-24">Messages 
									</div>
									<div class="col sz-48 color-white">
										{data.total_messages}
									</div>
									</div>
							</div>
						</div>
				
				<div class="col-6 center">
						<div class="rounded-4 py-5 p-2 bg-primary">
					<div class="row">
					<div class="col-12 color-black sz-24">
						  Words 
					</div>
					<div class="col sz-48 color-white">
						{data.total_words}
					</div>
						</div>
				</div>
				</div>

				<div class="col-6 p-2 center">
					<div class="rounded-4 py-5 color-bg-s p-2">
					<div class="row">
					<div class="col-12 color-black sz-24">
						 Files 
					</div>
					<div class="col sz-48 color-white">
						{data.total_files}
					</div>
				</div>
				</div>
				</div>

				<div class="col-6 center p-2">
					<div class="rounded-4 py-5 color-bg-red p-2">
					<div class="row">
					<div class="col-12 color-black sz-24">
					 Links 
					</div>
					<div class="col sz-48 color-white">
						{data.total_links}
					</div>
				</div>
					</div>
					</div>

				</div>
				}

				</div>

				<div class="row color-black bold sz-20 p-3 position-absolute container-fluid" style={{bottom:"70px",left:'0px'}}>
					<div class="col p-3"><i class="fas fa-arrow-left" onClick={()=>{setChange((prev)=> prev == 0 ? 5 : prev - 1);setTimer(0)}} ></i>  </div>
					<div class="col p-3 right"><i class="fas fa-arrow-right" onClick={()=>{setChange((prev)=> prev == 5 ? 0 : prev + 1);setTimer(0)}}></i> </div>
				</div>
			</div>
		)
}