import React from "react"


export default function Layout({children}){
	return(
		<div class="container-fluid min-vh-100" style={{background: 'linear-gradient(to bottom, #013220, #004d1a)'}}>
		<div class="row mb-4">
					<div class="col sz-md-48 bold center color-white my-2">
					  <div class=" p-2 sz-24 hide">
					    <img src="/logo.svg" class="img-fluid" style={{height:'50px',width:'auto'}}/> Python 9ja
					  </div>
					  <div class="row align-items-center p-2 my-3">
					    <div class="col-12 sz-72 justify-content-left" style={{maginRight:"-40px"}}>
					       🎉 
					    </div>
					    <div class="col center my-0">
					      <div class="text-warning sz-72 ">2025</div> 
					      <div class="sz-36" style={{marginTop:"-35px"}}>wrapped </div>
					  </div>
					</div>
				</div>
				<br />
				{children}
		</div>
		</div>
		)
}