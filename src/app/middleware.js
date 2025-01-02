// import {NextResponse} from 'next/server'

// export async function middleware(request){
// 	const response = NextResponse.next();
// 	if(request.method == 'POST'){
// 		const csrfToken = request.cookies.get('csrfToken')
// 		if(csrfToken){
// 			const requestHeaders = new Headers(request.headers);
// 			requestHeaders.set('X-CSRFToken',csrfToken.value);
// 			const newResponse = NextResponse.next({
// 				request:{
// 					headers:requestHeaders
// 				}
// 			})
// 			return newResponse
// 		}
// 	}
// 	return response;
// }