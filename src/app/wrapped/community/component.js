"use client"
import React from "react"
import msgUser from "../../messageUser.json"
import msgDate from "../../messageDates.json"


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


export default function Wrapped(){
	const data = {total_messages:77658,total_words:632115,total_files:12691,total_emoji:29383,total_links:1363}
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