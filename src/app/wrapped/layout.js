import React from "react"


export default function Layout({children}){
	return(
		<>
		<div class="row my-4">
					<div class="col sz-48 sz-md-48 bold center">
						<span class="text-danger">2024</span> wrapped
					</div>
				</div>
				<br />
				{children}
		</>
		)
}