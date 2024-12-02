"use client"
import React from "react"
import msgUser from "../messageUser.json"
import msgDate from "../messageDates.json"
import userStat from "../userStat.json"

export default function Main(){
	const [show,setShow] = React.useState(0)

	if(show === 1){
		return(
				<> <Wrapped /> </>
			)
	}

	else if(show === 2){
		return(
			<>
				<InputWrapp />
			</>
			)
	}
	else{
	return(
			<div class="container">
				<div class="row sz-24">
					<div class="col-sm col-md center p-2"> <div class="rounded  p-5 color-bg-t shdow-md d-flex align-items-center bold justify-content-center cursor-pointer color-s-hover" onClick={()=>setShow(1)} style={{height:"250px",cursor:"pointer"}}> <i class="fas fa-users  mx-2"></i> Community Wrap </div> </div>
					<div class="col-sm col-md center p-2" > <div class="rounded  p-5  d-flex align-items-center bold justify-content-center color-s-hover bg-light" onClick={()=>setShow(2)} style={{height:"250px",cursor:"pointer"}}> <i class="fas fa-user mx-2"></i> My Wrap </div> </div>
				</div>
				
			</div>

		)
}
}

const formatNumber = (number)=>{
	let propose = "0706943651"
	if(number.charAt(0) === "0"){
		let n = number.slice(1,50) //706943651
		let update = "+234" + number.slice(1,50) 
		return update
	}
	return number
}

const formatDate = (date)=>{
	let newDate = date.slice(0,1)
	return newDate
}

function InputWrapp(){
	const [show, setShow] = React.useState()
	const nameRef = React.useRef()

	if (show){
		return (<><IndividualWrap name={formatNumber(nameRef.current.value)} /> </>)
	}
	return(
			<div class="rounded justify-content-center py-5 center container">
				<div class='row sz-20'>
					<div class="col  ">
					 <input ref={nameRef} class='no-border border-bottom bg-light input-hover col-md-7 col-12 py-4 my-4 sz-20 center' placeholder="Enter your Whatsapp Nmber" />
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
function RangeList({items,total,i}){
	return(
			<div class="row py-3">
			<div class="col-1 color-grey">{i + 1}</div>
			 <div class="col  ">  {items.name}</div>
			 {i < 3 && <div class="col"> <span class="color-grey "><i class="fas fa-medal"></i></span> </div>}
				<div class={`col right hide d-none`}><div class="bg-danger text-danger right" style={{width:`${Math.ceil(items.messages/total * 300)}%`}}>.</div> </div> 
			</div>
		)
}

function Wrapped(){
	const data = {total_messages:76728,total_words:613514,total_files:12354,total_emoji:28772,total_links:1097}
	const [messagePerUser,setMessagePerUser] = React.useState([{name:"",messages:""}])
	const [list , setList] = React.useState()
	const [messagesDate, setMessagesDate] = React.useState()
	
	React.useEffect(()=>{
		setMessagePerUser(msgUser.messages_by_sender.slice(0,100))
		setMessagesDate(msgDate.most_active_date.slice(0,20))
	},[])

	return(
		<div class="container">
		<div class="d-flex justify-content-center flex-column">
			<div class="row sz-20 bg-warning px-3 p-5 rounded center">
				<div class="col bold"> Total Members </div>
				<div class="col"> 1670 </div>
				<div class="w-100"></div>
				<div class="col bold"> Total Messages </div>
				<div class="col"> {data.total_messages} </div>
				<div class="w-100"></div>
				<div class="col bold"> Total Words </div>
				<div class="col"> {data.total_words} </div>
				<div class="w-100"></div>
				<div class="col bold"> Total Files </div>
				<div class="col"> {data.total_files} </div>
				<div class="w-100"></div>
				<div class="col bold"> Total Emoji </div>
				<div class="col"> {data.total_emoji} </div>
				<div class="w-100"></div>
				<div class="col bold"> Total Links </div>
				<div class="col"> {data.total_links} </div>
			</div>

			<br />
			<div class="row my-4">
				<div class="col bold sz-24 color-p center "> Top 100 most Active Members </div>
			</div>
			<br />

			<div class="row sz-20 sz-sm-18">
			<div class="col">{messagePerUser.map((e,i)=><RangeList items={e} total={data.total_messages} i={i} />)}</div>
			</div>

			<br />
			<div class="row my-4 hide d-none">
				<div class="col bold sz-24 color-p center"> Most Active Date </div>
			</div>

			<div class="row sz-18 hide d-none">
			{messagesDate?.map((x)=>(<div class="col-12 py-2">{x}</div>))}
			</div>

			<br />
			<div class="row my-4">
				<div class="col bold sz-24 color-p">  </div>
			</div>

			<div class="row sz-24">
			<div class="col"></div>
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
			<div class={"container-fluid vh-100 position-fixed "} style={{top:'0',zIndex:30,left:"0px",right:0,backgroundColor:"#E7F9E9"}}>
				
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

				<div class="row color-black bold position-absolute w-100 justify-content-center sz-20" style={{bottom:"70px"}}>
					<div class="col p-3"><i class="fas fa-arrow-left" onClick={()=>{setChange((prev)=> prev == 0 ? 5 : prev - 1);setTimer(0)}} ></i>  </div>
					<div class="col p-3 right"><i class="fas fa-arrow-right" onClick={()=>{setChange((prev)=> prev == 5 ? 0 : prev + 1);setTimer(0)}}></i> </div>
				</div>
			</div>
		)
}