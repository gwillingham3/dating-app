import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Profile from './pages/Profile';
import Swiper from './pages/Swiper';
import Messages from './pages/Messages';
import './App.css'

function App() {
	
	const [cookies, setCookie, removeCookie] = useCookies(['user']);
	
	const authToken = cookies.AuthToken;

	return (
		<>	
			<div className="app-container container">
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<Login/>}/>
						{ authToken && <Route path="/onboarding" element={<Onboarding/>}/> }
						{ authToken && <Route path="/profile" element={<Profile/>}/> }
						{ authToken && <Route path="/swiper" element={<Swiper/>}/> }
						{ authToken && <Route path="/messages" element={<Messages/>}/> }
					</Routes>
				</BrowserRouter>
			</div>
		</>
	)
}

export default App;
