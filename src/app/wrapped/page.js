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
					<div class="col-sm col-md center p-2"> <div class="rounded  p-5 color-bg-t shdow-md d-flex align-items-center bold justify-content-center cursor-pointer" onClick={()=>setShow(1)} style={{height:"250px"}}> <i class="fas fa-users color-p mx-2"></i> Community Wrap </div> </div>
					<div class="col-sm col-md center p-2" > <div class="rounded  p-5 bg-light d-flex align-items-center bold justify-content-center" onClick={()=>setShow(2)} style={{height:"250px"}}> <i class="fas fa-user color-p mx-2"></i> My Wrap </div> </div>
				</div>
				
			</div>

		)
}
}

function InputWrapp(){
	const [show, setShow] = React.useState()
	const nameRef = React.useRef()

	if (show){
		return (<><IndividualWrap name={nameRef.current.value} /> </>)
	}
	return(
			<div class="rounded justify-content-center py-5 color-bg-t center">
				<div class='row sz-20'>
					<div class="col  ">
						Enter your Whatsapp No: <input ref={nameRef} class='form-contro no-border border-bottom color-bg-t col-9 py-3' />
					</div>
				</div>

				<br /> 

				<div class="row sz-20 my-4">
					<div class="col">
						<button class="bg-success color-white rounded no-border col-4 p-2" onClick={()=>setShow(true)}> Get Wrapped </button>
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
			<div class="row sz-20 bg-warning  p-5 rounded center">
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
			<div class="row my-4">
				<div class="col bold sz-24 color-p center"> Most Active Date </div>
			</div>

			<div class="row sz-18">
			{messagesDate?.map((x)=>(<div class="col-12 py-2">{x}</div>))}
			</div>

			<br />
			<div class="row my-4">
				<div class="col bold sz-24 color-p"> Most Trending topic </div>
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
	const colorClass = ["bg-warning","color-bg-s","bg-danger","bg-primary"]
	const [timer,setTimer] = React.useState(0)
	const [change ,setChange] = React.useState(0)

	React.useEffect(()=>{
		if (timer > 10){
			setChange((prev)=> prev == 4 ? 0 : prev + 1)
			setTimer(0)
		}
		else{
		var time = setInterval(()=>setTimer((prev)=>prev+1),1000)
	}
	return ()=> clearInterval(time)
	},[timer])

	return(
			<div class="container color-bg-p vh-100 position-fixed" style={{top:'0',zIndex:30,left:"0px",right:0}}>
				
				<div class="row">
				<div class="col p-1 color-white">
				<div class={"rounded " + colorClass[change]} style={{width:`${((timer/10) * 100)}%`,bottom:'40px',height:'3px'}}></div>
				</div>
				</div>

				<div class='row sz-24 color-white'>
					<div class="col bold center p-3">
						{name}
					</div>
				</div>

				

				<div class="d-flex flex-column vh-90 justify-content-center">

				{change == 0 && <div class='row center  justify-content-center animate__animated animate__fadeIn'>
				<div class={"col-6 rounded-4 py-5 bg-warning"}>
					<div class="col-12 color-black sz-24">
						Total Messages <i class="fas fa-comment"></i>
					</div>
					<div class="col sz-48 color-white">
						{data.total_messages}
					</div>
				</div>
				</div>}

				{change == 1 && <div class='row center  justify-content-center animate__animated animate__fadeIn'>
				<div class="col-6 rounded-4 py-5 bg-primary">
					<div class="col-12 color-black sz-24">
						Total Words <i class="fas fa-comment"></i>
					</div>
					<div class="col sz-48 color-white">
						{data.total_words}
					</div>
				</div>
				</div>}

				{change == 2 && <div class='row center  justify-content-center animate__animated animate__fadeIn'>
				<div class="col-6 rounded-4 py-5 bg-light">
					<div class="col-12 color-black sz-24">
						Total Files <i class="fas fa-comment"></i>
					</div>
					<div class="col sz-48 color-black">
						{data.total_files}
					</div>
				</div>
				</div>}

				{change == 3 && <div class='row center  justify-content-center animate__animated animate__fadeIn'>
				<div class="col-6 rounded-4 py-5 bg-danger">
					<div class="col-12 color-black sz-24">
						Total Links <i class="fas fa-comment"></i>
					</div>
					<div class="col sz-48 color-white">
						{data.total_links}
					</div>
				</div>
				</div>}

				{change == 4 && <div class='row center  justify-content-center animate__animated animate__fadeIn'>
				<div class="col-6 rounded-4 py-5 bg-primary">
					<div class="col-12 color-black sz-24">
						Day with most Messages <i class="fas fa-comment"></i>
					</div>
					<div class="col sz-48 color-white">
							{Object.entries(data.days_with_more_messages)[0]}
					</div>
				</div>
				</div>}






				</div>
			</div>
		)
}