import React from "react"


export default function Layout({children}){
	return(
		<div class="container">
		<div class="row my-4">
					<div class="col sz-36 sz-md-48 bold center color-s">
						<span class="text-danger">2024</span> <br/>wrapped
					
					</div>
				</div>
				<br />
				{children}
		</div>
		)
}