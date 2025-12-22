"use client"
import React from "react"
import { useState, useRef, useEffect } from "react"

export default function InputWrapp(){
	const [show, setShow] = useState(false)
	const [wrapData, setWrapData] = useState(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")
	const nameRef = useRef()
	
  
	const handleGetWrapped = async () => {
		setLoading(true)
		setError("")
		
		try {
			// Fetch the JSON file
			const response = await fetch('/wrap.json')
			const data = await response.json()
			
			const userName = nameRef.current.value.trim()
			
			// Check if user exists in individual data
			if (data.individual && data.individual[userName]) {
				setWrapData({
					user: userName,
					stats: data.individual[userName],
					yearInfo: data.year_info
				})
				setShow(true)
			} else {
				setError("User not found in wrap data. Please check the number and try again.")
			}
		} catch (err) {
			setError("Failed to load wrap data. Make sure wrap.json is in the public folder.")
			console.error(err)
		} finally {
			setLoading(false)
		}
	}

	if (show && wrapData){
		return <IndividualWrap data={wrapData} onBack={() => setShow(false)} />
	}

	return(
			<div className="container">
				<div className="row justify-content-center">
					<div className="col-12 col-md-6">
						<div className="shadow-lg border-0 rounded-4">
							<div className="p-5">
								<p className="text-center text-mutd mb-4 color-white hide">
									Enter your name as it appears in the WhatsApp chat
								</p>
								
								<input 
									ref={nameRef} 
									type="text" 
									className="form-control form-control-lg mb-3 w-100 rounded-3"
									placeholder="Your whatsapp Number"
									style={{fontSize: '1.2rem'}}
								/>
								
								{error && (
									<div className="alert alert-danger rounded-3" role="alert">
										{error}
									</div>
								)}
								
								<button 
									className="bt btn-lg w-100 text-white fw-bold no-border rounded-3 py-3 color-bg-s"
									style={{backgroud: 'linear-gradient(to bottom, #013220, #004d1a)'}}
									onClick={handleGetWrapped}
									disabled={loading}
								>
									{loading ? (
										<>
											<span className="spinner-border spinner-border-sm me-2"></span>
											Loading...
										</>
									) : (
										'Get My Wrapped 🚀'
									)}
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
	)
}

function IndividualWrap({data, onBack}){
	const [currentPage, setCurrentPage] = useState(0)
	const [progress, setProgress] = useState(0)
	
	const stats = data.stats
	const yearInfo = data.yearInfo
	const userName = data.user

	const audioRef = useRef(null)
	// Add this right after your existing state declarations
const [quizAnswers, setQuizAnswers] = useState({
  mostActive: null,
  groupName: null,
  oS : null,
})

const [showQuizResult, setShowQuizResult] = useState({
  mostActive: false,
  groupName: false,
  oS : false,
  
})

const handleQuizAnswer = (quizType, answer, correctAnswer) => {
  setQuizAnswers(prev => ({...prev, [quizType]: answer}))
  setShowQuizResult(prev => ({...prev, [quizType]: true}))
  
  // Auto-advance after showing result (3 seconds)
  setTimeout(() => {
    nextPage()
    setShowQuizResult(prev => ({...prev, [quizType]: false}))
  }, 3000)
}
	
	React.useEffect(()=>{
		if (!audioRef.current) {
			audioRef.current = new Audio("/wrap.mp3")
			audioRef.current.loop = true
		}
		audioRef.current.play()
		
		return () => {
			if (audioRef.current) {
				audioRef.current.pause()
				audioRef.current.currentTime = 0
			}
		}
	},[])

	const nextPage = () => {
		if (currentPage < pages.length - 1) {
			setCurrentPage(prev => prev + 1)
			setProgress(0)
		}
	}

	const prevPage = () => {
		if (currentPage > 0) {
			setCurrentPage(prev => prev - 1)
			setProgress(0)
		}
	}
  
  
	const pages = [
		// Welcome page
		{
			gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
			content: (
				<div className="text-center text-white">
					<h1 className="display-3 fw-bold mb-4">
						Let's rewind your year in the group...
					</h1>
					<p className="fs-4">
						🥂🥂
					</p>
				</div>
			)
		},
		
				{
			gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
			content: (
				<div className="text-center text-white">
					<h1 className="disply-5 sz-20 fw-bold mb-4">
						Before we continue, let's take a quick look at the group's raw output this year.
					</h1>
					<p className="fs-5">
					 😎😎
					</p>
				</div>
			)
		},

		// NEW: Community Overview
		{
			gradient: 'linear-gradient(135deg, #fc4a1a 0%, #f7b733 100%)',
			content: (
				<div className="text-center text-white">
					<h2 className="fs-2 mb-4 bold">
						Python 9ja Stats
					</h2>
					<div className="row g-3">
						<div className="col-12">
							<div className="bg-white bg-opacity-25 rounded-4 p-4">
								<div className="sz-48 fw-bold">{yearInfo.community?.total_messages?.toLocaleString() || 'N/A'}</div>
								<div className="fs-6 color-black">Total Messages</div>
							</div>
						</div>
						<div className="col-6">
							<div className="bg-white bg-opacity-25 rounded-4 p-4">
								<div className="sz-48 fw-bold">{yearInfo.community?.active_members || 'N/A'}</div>
								<div className="fs-6 color-black">Active Members</div>
							</div>
						</div>
						<div className="col-6">
							<div className="bg-white bg-opacity-25 rounded-4 p-4">
								<div className="sz-16 color-black">Busiest Day</div>
								<div className="fs-5 fw-bold">{yearInfo.community?.busiest_day || 'N/A'}</div>
							</div>
						</div>
					</div>
					<p className="fs-6 opacity-75 mt-4">
						
					</p>
				</div>
			)
		},
		
						{
			gradient: 'linear-gradient(135deg, #9d50bb 0%, #6e48aa 100%)',
			content: (
				<div className="text-center text-white">
					<h1 className="display-3 fw-bold mb-4">
						Now let's see YOUR impact...
					</h1>
					<p className="fs-4">
					 📊
					</p>
				</div>
			)
		},

		 
		
		// Total messages
		{
			gradient: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)',
			content: (
				<div className="text-center text-white">
					<div className="mb-4">
						<i className="fas fa-comments" style={{fontSize: '5rem'}}></i>
					</div>
					<h2 className="sz-24 mb-3 hide">Your thumbs worked overtime!</h2>
					<div className="displa-1 fw-bold sz-60 mb-3 color-black">
						{stats.total_messages.toLocaleString()}
					</div>
					<p className="fs-4">messages sent!!!</p>
					<p className="fs-6 mt-3 opacity-90">
						Active for {stats.total_days_active} days • Avg {stats.avg_messages_per_active_day} msgs/day
					</p>
				</div>
			)
		},

		// Percentile
		{
			gradient: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
			content: (
				<div className="text-center text-white">
					<div className="mb-4">
						<i className="fas fa-trophy" style={{fontSize: '5rem'}}></i>
					</div>
					<h2 className="fs-3 mb-3">You're in the top</h2>
					<div className="diplay-1 fw-bold mb-3 sz-60">
						{(100 - stats.percentile).toFixed(1)}%
					</div>
					<p className="sz-18">of most active members! 🌟</p>
				</div>
			)
		},
		
				{
  gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  content: (
    <div className="text-center text-white">
      {!showQuizResult.oS ? (
        <>
          <h2 className="fs-3 mb-4"> Before we continue </h2>
          <p className="fs-4 mb-5">Pick a side 🤧</p>
          <div className="d-flex flex-column gap-3">
            {['Windows', 'Linux'].map((name, idx) => (
              <button 
                key={idx}
                className="btn btn-lg btn-light rounded-pill py-3 animate__animated animate__fadeInUp"
                style={{animationDelay: `${idx * 0.1}s`}}
                onClick={() => handleQuizAnswer('oS', name, 'Python Nigeria')}
              >
                {name}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="animate__animated animate__zoomIn">
          {quizAnswers.oS === 'Windows' ? (
            <>
              <div className="mb-4" style={{fontSize: '6rem'}}>🎊</div>
              <h2 className="fs-2 mb-3">Windows!</h2>
              <p className="fs-4"> You’re officially a legend 🏆</p>
            </>
          ) : (
            <>
              <div className="mb-4" style={{fontSize: '6rem'}}> 🥺🥺 </div>
              <h2 className="fs-2 mb-3">Linux!</h2>
              <p className="fs-4">Poor soul<strong></strong></p>
              <p className="fs-6 opacity-75 mt-3">May God lead you to the right path ! 😊</p>
            </>
          )}
        </div>
      )}
    </div>
  )
},

		// NEW: Community Comparison
		{
			gradient: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
			content: (
				<div className="text-center text-white">
					<h2 className="fs-3 mb-5">
						You  🆚  The Group
					</h2>
					<div className="d-flex flex-column gap-4">
						<div>
							<div className="bg-white bg-opacity-25 rounded-4 p-4">
								<div className="d-flex justify-content-between align-items-center">
									<div className="text-start">
										<div className="fs-5 opacity-75">Your Messages</div>
										<div className="fs-2 fw-bold">{stats.total_messages}</div>
									</div>
									<div className="fs-1"></div>
								</div>
								<div className="progress mt-3" style={{height: '10px'}}>
									<div 
										className="progress-bar bg-warning" 
										style={{width: `${stats.percentile}%`}}
									></div>
								</div>
								<div className="fs-6 opacity-75 mt-2">
									{stats.percentile.toFixed(1)}% of top contributor
								</div>
							</div>
						</div>
						
						<div>
							<div className="bg-white bg-opacity-25 rounded-4 p-4">
								<div className="fs-5">Group Average</div>
								<div className="fs-3 fw-bold">
									{yearInfo.community?.avg_messages_per_user || 'N/A'} messages/person
								</div>
							</div>
						</div>
					</div>
				</div>
			)
		},

		// Streak stats
		{
			gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
			content: (
				<div className="text-center text-white">
					<div className="mb-4">
						<i className="fas fa-fire" style={{fontSize: '5rem'}}></i>
					</div>
					<h2 className="fs-3 mb-3">Your longest streak?</h2>
					<div className="sz-60  fw-bold mb-3">
						{stats.longest_streak_days}
					</div>
					<p className="fs-4">days straight! 🔥</p>
					{stats.current_streak_days > 0 && (
						<p className="fs-5 mt-4 hide">
							Current streak: <strong>{stats.current_streak_days} days</strong> ⚡
						</p>
					)}
				</div>
			)
		},

		// Response time
		{
			gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
			content: (
				<div className="text-center text-white">
					<div className="mb-4">
						<i className="fas fa-bolt" style={{fontSize: '5rem'}}></i>
					</div>
					<h2 className="fs-3 mb-3">Your average reply time?</h2>
					{stats.avg_response_time_minutes ? (
						<>
							<div className="sz-60 fw-bold mb-3">
								{stats.avg_response_time_minutes.toFixed(1)}
							</div>
							<p className="fs-3">minutes ⚡</p>
							<p className="fs-4 mt-4">Lightning fast responder! 🚀</p>
						</>
					) : (
						<p className="fs-4 animate__animated animate__fadeIn animate__delay-1s">You're more of a conversation starter! 💡</p>
					)}
				</div>
			)
		},

		// Weekend vs Weekday
		{
			gradient: 'linear-gradient(135deg, #fc466b 0%, #3f5efb 100%)',
			content: (
				<div className="text-center text-white">
					<div className="mb-4">
						{stats.weekend_percentage > 40 ? (
							<i className="fas fa-umbrella-beach" style={{fontSize: '5rem'}}></i>
						) : (
							<i className="fas fa-briefcase" style={{fontSize: '5rem'}}></i>
						)}
					</div>
					<h2 className="fs-3 mb-4">
						{stats.weekend_percentage > 40 ? 'Weekend Warrior!' : 'Weekday Grinder! '}
					</h2>
					<div className="row g-4">
						<div className="col-6">
							<div className="bg-white bg-opacity-25 rounded-4 p-3">
								<div className="fs-1 fw-bold">{stats.weekday_messages}</div>
								<div className="fs-5">Weekday</div>
							</div>
						</div>
						<div className="col-6">
							<div className="bg-white bg-opacity-25 rounded-4 p-3">
								<div className="fs-1 fw-bold">{stats.weekend_messages}</div>
								<div className="fs-5">Weekend</div>
							</div>
						</div>
					</div>
				</div>
			)
		},

		// Time preference
		{
			gradient: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
			content: (
				<div className="text-center text-white">
					<div className="mb-4">
						{stats.time_preference === 'night_owl' && <i className="fas fa-moon" style={{fontSize: '5rem'}}></i>}
						{stats.time_preference === 'early_bird' && <i className="fas fa-sun" style={{fontSize: '5rem'}}></i>}
						{stats.time_preference === 'daytime' && <i className="fas fa-cloud-sun" style={{fontSize: '5rem'}}></i>}
					</div>
					<h2 className="fs-3 mb-4">
						{stats.time_preference === 'night_owl' && "You're officially a Night Owl! 🦉"}
						{stats.time_preference === 'early_bird' && "Early Bird Energy!"}
						{stats.time_preference === 'daytime' && "Daytime Warrior!"}
					</h2>
					<div className="row g-3">
						<div className="col-4">
							<div className="bg-white bg-opacity-25 rounded-3 p-2">
								<div className="fs-4 fw-bold">{stats.early_bird_messages}</div>
								<div className="fs-6">Morning</div>
							</div>
						</div>
						<div className="col-4">
							<div className="bg-white bg-opacity-25 rounded-3 p-2">
								<div className="fs-4 fw-bold">{stats.daytime_messages}</div>
								<div className="fs-6">Daytime</div>
							</div>
						</div>
						<div className="col-4">
							<div className="bg-white bg-opacity-25 rounded-3 p-2">
								<div className="fs-4 fw-bold">{stats.night_owl_messages}</div>
								<div className="fs-6">Night</div>
							</div>
						</div>
					</div>
				</div>
			)
		},

		// Replies received
		{
			gradient: 'linear-gradient(135deg, #0f2027 0%, #2c5364 100%)',
			content: (
				<div className="text-center text-white">
					<div className="mb-4">
						<i className="fas fa-reply-all" style={{fontSize: '5rem'}}></i>
					</div>
					<h2 className="fs-3 mb-3">People replied to you</h2>
					<div className="display-1 fw-bold mb-3">
						{stats.replies_received}
					</div>
					<p className="fs-4">times! Reply magnet! 🧲</p>
				</div>
			)
		},

		// Conversation starters
		{
			gradient: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)',
			content: (
				<div className="text-center text-white">
					<div className="mb-4">
						<i className="fas fa-lightbulb" style={{fontSize: '5rem'}}></i>
					</div>
					<h2 className="fs-3 mb-3">You started</h2>
					<div className="sz-60 fw-bold mb-3">
						{stats.conversation_starters}
					</div>
					<p className="fs-4">conversations this year! 💡</p>
				</div>
			)
		},

		// Questions vs Helping
		{
			gradient: 'linear-gradient(135deg, #f857a6 0%, #ff5858 100%)',
			content: (
				<div className="text-center text-white">
					<h2 className="fs-3 mb-3  mt-5">
					  <br /> Your Communication Style</h2>
					<div className="row g-4">
						<div className="col-12">
							<div className="bg-white bg-opacity-25 rounded-4 p-4">
								<div className="mb-3">
									<i className="fas fa-question-circle" style={{fontSize: '3rem'}}></i>
								</div>
								<div className="fs-1 fw-bold">{stats.question_messages}</div>
								<div className="fs-5">Questions</div>
								<div className="fs-6 opacity-75 mt-2">Asked 🔍</div>
							</div>
						</div>
						<div className="col-12">
							<div className="bg-white bg-opacity-25 rounded-4 p-4">
								<div className="mb-3">
									<i className="fas fa-hands-helping" style={{fontSize: '3rem'}}></i>
								</div>
								<div className="fs-1 fw-bold">{stats.helping_messages}</div>
								<div className="fs-5">Helpful</div>
								<div className="fs-6 opacity-75 mt-2">Responses 🦸</div>
							</div>
						</div>
					</div>
				</div>
			)
		},

		// Topic Interests
		{
			gradient: 'linear-gradient(135deg, #4e54c8 0%, #8f94fb 100%)',
			content: (
				<div className="text-center text-white">
					<h2 className="fs-3 mb-4 text-warning">Your Top Interests 🎯</h2>
					{stats.topic_interests && stats.topic_interests.length > 0 ? (
						<div className="d-flex flex-column gap-3">
							{stats.topic_interests.map((topic, idx) => (
								<div key={idx} className={`bg-white bg-opacity-25 rounded-4 p-4 animate__animated animate__fadeInRight`} style={{animationDelay: `${idx * 0.3}s`}}>
									<div className="d-flex justify-content-between align-items-center">
										<div className="text-start">
											<div className="fs-4 fw-bold">{topic.name}</div>
											<div className="fs-6 opacity-75">{topic.count} mentions</div>
										</div>
										<div className="fs-1">
											{idx === 0 && '🥇'}
											{idx === 1 && '🥈'}
											{idx === 2 && '🥉'}
										</div>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="fs-4 animate__animated animate__fadeIn animate__delay-1s">
							<p>You're a generalist!</p>
							<p className="fs-6 opacity-75 mt-3">No specific topic dominated your chats 🌐</p>
						</div>
					)}
				</div>
			)
		},

		// Favorite emoji
		{
			gradient: 'linear-gradient(135deg, #ffd89b 0%, #19547b 100%)',
			content: (
				<div className="text-center text-white">
					<h2 className="fs-3 mb-4 animate__animated animate__fadeInDown">Your signature move?</h2>
					{stats.favorite_emoji ? (
						<>
							<div className="display-1 mb-4 animate__animated animate__bounceIn animate__delay-1s" style={{fontSize: '8rem'}}>
								{stats.favorite_emoji}
							</div>
							<p className="fs-4 animate__animated animate__fadeInUp animate__delay-2s">That's basically your brand now! 😄</p>
						</>
					) : (
						<p className="fs-4 animate__animated animate__fadeIn animate__delay-1s">You keep it text-only! 📝</p>
					)}
				</div>
			)
		},

		// User Roles
		{
			gradient: 'linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)',
			content: (
				<div className="text-center text-white">
					<br />
					<h2 className="fs-2 mb-3 mt-5 pt-3 animate__animated animate__fadeInDown text-warning">Your Special Roles! 🎭</h2>
					{stats.user_roles && stats.user_roles.length > 0 ? (
						<div className="d-flex flex-column gap-3 justify-content-left">
							{stats.user_roles.slice(0, 4).map((role, idx) => (
								<div key={idx} className={`bg-whit border-bottom g-opacity-25 roundd-4 p-4 left animate__animated animate__zoomIn`} style={{animationDelay: `${idx * 0.3}s`}}>
									<div className="fs-3 fw-bold mb-2">{role.title}</div>
									<div className="fs-6 opacity-75">{role.description}</div>
								</div>
							))}
						</div>
					) : (
						<p className="fs-4 animate__animated animate__fadeIn animate__delay-1s">Keep participating to unlock roles! 🎯</p>
					)}
				</div>
			)
		},

		// Fun badges
		{
			gradient: 'linear-gradient(135deg, #13547a 0%, #80d0c7 100%)',
			content: (
				<div className="text-center text-white">
					<h2 className="fs-2 mb-5 animate__animated animate__fadeInDown">Badges Earned! 🏆</h2>
					{stats.fun_badges.length > 0 ? (
						<div className="row g-4">
							{stats.fun_badges.map((badge, idx) => (
								<div key={idx} className={`col-6 animate__animated animate__flipInX`} style={{animationDelay: `${idx * 0.2}s`}}>
									<div className="bg-white bg-opacity-25 rounded-4 p-4">
										<div className="fs-1 mb-2">
											{badge === 'emoji_king' && '👑'}
											{badge === 'link_sharer' && '🔗'}
											{badge === 'media_master' && '📸'}
											{badge === 'night_owl' && '🦉'}
											{badge === 'weekend_warrior' && '⚔️'}
											{badge === 'streak_master' && '🔥'}
											{badge === 'quick_responder' && '⚡'}
										</div>
										<div className="fs-6 fw-bold">
											{badge.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
										</div>
									</div>
								</div>
							))}
						</div>
					) : (
						<p className="fs-4 animate__animated animate__fadeIn animate__delay-1s">Keep chatting to unlock badges! 🎯</p>
					)}
				</div>
			)
		},
		{
  gradient: 'linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)',
  content: (
    <div className="text-center text-white">
      {!showQuizResult.mostActive ? (
        <>
          <h2 className="fs-3 mb-4">Quick Quiz! 🤔</h2>
          <p className="fs-4 mb-5">Who do you think was the most active member this year?</p>
          <div className="d-flex flex-column gap-3">
            {['Ebulamicheal', 'Ada Ihueze', 'New Genesis', 'Mario Caleb',"Chukwuebuka"].map((name, idx) => (
              <button 
                key={idx}
                className="btn btn-lg btn-light rounded-pill py-3 animate__animated animate__fadeInUp"
                style={{animationDelay: `${idx * 0.1}s`}}
                onClick={() => handleQuizAnswer('mostActive', name, 'New Genesis')}
              >
                {name}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="animate__animated animate__zoomIn">
          {quizAnswers.mostActive === 'New Genesis' ? (
            <>
              <div className="mb-4" style={{fontSize: '6rem'}}>🎉</div>
              <h2 className="fs-2 mb-3">Correct!</h2>
              <p className="fs-4">You know your group well! 👏</p>
            </>
          ) : (
            <>
              <div className="mb-4" style={{fontSize: '6rem'}}>😅</div>
              <h2 className="fs-2 mb-3">Nice try!</h2>
              <p className="fs-4">It was actually <strong>New Genesis</strong></p>
            </>
          )}
        </div>
      )}
    </div>
  )
},

		// NEW: Top Members Leaderboard
		{
			gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
			content: (
				<div className="text-center text-white">
					<h2 className="fs-3 mb-4">
						Group Champions 👑
					</h2>
					<p className="fs-6 opacity-75 mb-4">
						The most active members of 2024
					</p>
					<div className="d-flex flex-column gap-3">
						{[
  { name: "New Genesis", message: "3705", userName: "09152307875" },
  { name: "Chukwuebuka", message: "3608", userName: "08073194769" },
  { name: "Ada Ihueze", message: "3404", userName: "Ada Ihueze" },
  { name: "Mario Caleb", message: "1869", userName: "07059822507" },
  { name: "Loulou🙄", message: "1809", userName: "Loulou🙄" }
].map((member, idx) => (
							<div 
								key={idx} 
								className="bg-white bg-opacity-25 rounded-4 p-3"
							>
								<div className="d-flex justify-content-between align-items-center">
									<div className="d-flex align-items-center gap-3">
										<div className="fs-3">
											{idx === 0 && '🥇'}
											{idx === 1 && '🥈'}
											{idx === 2 && '🥉'}
											{idx > 2 && `${idx + 1}.`}
										</div>
										<div className="text-start">
											<div className="fw-bold">{member.userName === userName ? 'You! 🎉' : member.name}</div>
											<div className="fs-6 opacity-75">{member.message} messages</div>
										</div>
									</div>
									{member.name === userName && (
										<div className="fs-4">⭐</div>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
			)
		},

		// Activity Level
		{
			gradient: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
			content: (
				<div className="text-center text-white">
					<div className="mb-4 animate__animated animate__tada">
						<i className="fas fa-award" style={{fontSize: '5rem'}}></i>
					</div>
					<h2 className="fs-3 mb-3 animate__animated animate__fadeInDown">Your Community Status</h2>
					<div className="display-4 fw-bold mb-4 animate__animated animate__bounceIn animate__delay-1s">
						{stats.activity_title}
					</div>
					<p className="fs-5 opacity-75 animate__animated animate__fadeInUp animate__delay-2s">
						{stats.activity_level === 'core_legend' && "You're the backbone of this group! 💪"}
						{stats.activity_level === 'super_active' && "Always here when we need you! 🌟"}
						{stats.activity_level === 'very_active' && "A reliable presence in the group! ⚡"}
						{stats.activity_level === 'active' && "Great to have you around! 👍"}
						{stats.activity_level === 'regular' && "You show up when it matters! 💬"}
						{stats.activity_level === 'occasional' && "Member by faith, not by activity 🌙"}
						{stats.activity_level === 'lurker' && " Rumored to exist 👀"}
						{stats.activity_level === 'ghost' && "Survived the cleanup. For now 👻"}
						{stats.activity_level === 'rare_sighting' && "One message away from extinction.🦄"}
					</p>
				</div>
			)
		},
		
		{
  gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  content: (
    <div className="text-center text-white">
      {!showQuizResult.groupName ? (
        <>
          <h2 className="fs-3 mb-4">Final Quiz! 🧠</h2>
          <p className="fs-4 mb-5">What was Python 9ja previously called?</p>
          <div className="d-flex flex-column gap-3">
            {['Python Nigeria', 'Naija Python', 'Python Devs NG', '9ja Coders'].map((name, idx) => (
              <button 
                key={idx}
                className="btn btn-lg btn-light rounded-pill py-3 animate__animated animate__fadeInUp"
                style={{animationDelay: `${idx * 0.1}s`}}
                onClick={() => handleQuizAnswer('groupName', name, 'Python Nigeria')}
              >
                {name}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="animate__animated animate__zoomIn">
          {quizAnswers.groupName === 'Python Nigeria' ? (
            <>
              <div className="mb-4" style={{fontSize: '6rem'}}>🎊</div>
              <h2 className="fs-2 mb-3">Perfect!</h2>
              <p className="fs-4">You've been here since the beginning! 🏆</p>
            </>
          ) : (
            <>
              <div className="mb-4" style={{fontSize: '6rem'}}>📚</div>
              <h2 className="fs-2 mb-3">Oops!</h2>
              <p className="fs-4">It was <strong>Python Nigeria</strong></p>
              <p className="fs-6 opacity-75 mt-3">Now you know! 😊</p>
            </>
          )}
        </div>
      )}
    </div>
  )
},

		// Closing page
		{
			gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
			content: (
				<div className="text-center text-white">
					<h1 className="display-4 fw-bold mb-4 animate__animated animate__jackInTheBox">
						That was your 2024! ✨
					</h1>
					<p className="fs-3 mb-5 animate__animated animate__fadeInUp animate__delay-1s">
						Here's to an even better 2025! 🥂
					</p>
					<button 
						className="btn btn-light btn-lg rounded-pill px-5 py-3 animate__animated animate__pulse animate__delay-2s animate__infinite"
						onClick={onBack}
					>
						View Another User
					</button>
				</div>
			)
		}
	]

	return(
		<div 
			className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column"
			style={{
				background: pages[currentPage].gradient,
				zIndex: 9999,
				transition: 'background 0.5s ease',overflow:'auto'
			}}
		>
			{/* Progress bar */}
			<div className="position-absolute top-0 start-0 w-100 p-3">
				<div className="d-flex gap-1">
					{pages.map((_, idx) => (
						<div 
							key={idx}
							className="flex-fill bg-white bg-opacity-25 rounded-pill"
							style={{height: '4px'}}
						>
							{idx === currentPage && (
								<div 
									className="bg-white rounded-pill h-100"
									style={{width: `${progress}%`, transition: 'width 0.1s linear'}}
								/>
							)}
							{idx < currentPage && (
								<div className="bg-white rounded-pill h-100 w-100" />
							)}
						</div>
					))}
				</div>
			</div>

			{/* User name */}
			<div className="position-absolue top-0 start-0 w-100 text-center pt-5 mt-4">
				<h3 className="text-white fw-bold animate__animated animate__fadeIn">{userName}</h3>
			</div>

			{/* Content - KEY PROP FORCES RE-RENDER AND RESTARTS ANIMATIONS */}
			<div key={currentPage} className="flex-grow-1 d-flex align-items-center justify-content-center p-4">
				<div className="container">
					<div className="row justify-content-center">
						<div className="col-12 col-md-8 col-lg-6">
							{pages[currentPage].content}
						</div>
					</div>
				</div>
			</div>

			{/* Navigation */}
			<div className="position-absolute bottom-0 start-0 w-100 p-4">
				<div className="d-flex justify-content-between">
					<button 
						className="btn btn-light rounded-circle"
						style={{width: '60px', height: '60px'}}
						onClick={prevPage}
						disabled={currentPage === 0}
					>
						<i className="fas fa-arrow-left"></i>
					</button>
					<button 
						className="btn btn-light rounded-circle"
						style={{width: '60px', height: '60px'}}
						onClick={nextPage}
						disabled={currentPage === pages.length - 1}
					>
						<i className="fas fa-arrow-right"></i>
					</button>
				</div>
			</div>
		</div>
	)
}