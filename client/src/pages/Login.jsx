import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import SignUpModal from '../components/SignUpModal';

function Login() {
	
	const authToken = false;
	const [showModal, setShowModal] = useState(false);
	const [email, setEmail] = useState(null);
	const [password, setPassword] = useState(null);
	const [error, setError] = useState(null)
	const navigate = useNavigate();
	const [cookies, setCookie, removeCookie] = useCookies(['user']);
	
	const handleClick = (e) => {
		e.preventDefault();
		console.log("opening modal to sign up");
		setShowModal((showModal) => true);
	};
	
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post("http://localhost:8000/login", {email, password});
			setCookie("Email", response.data.email);
			setCookie("UserId", response.data.userId);
			setCookie("AuthToken", response.data.token);
			const success = response.status == 201;
			
			if (success) {
				navigate("swiper");
			}
		} catch(error) {
			console.log(error);
		}
	};
	
	return (
		<>
			<div className="container">
				<div className="d-flex justify-content-center h-100">
					<div className="card">
						<div className="card-header">
							<h3>Sign In</h3>
							<div className="d-flex justify-content-end social_icon">
								<span><i className="fab fa-facebook-square"></i></span>
								<span><i className="fab fa-google-plus-square"></i></span>
								<span><i className="fab fa-twitter-square"></i></span>
							</div>
						</div>
						<div className="card-body">
							<form onSubmit={handleSubmit}>
								<div className="input-group form-group">
									<div className="input-group-prepend">
										<span className="input-group-text"><i className="fas fa-user"></i></span>
									</div>
									<input type="text" className="form-control" placeholder="email" onChange={(e) => setEmail(e.target.value)}/>
									
								</div>
								<div className="input-group form-group">
									<div className="input-group-prepend">
										<span className="input-group-text"><i className="fas fa-key"></i></span>
									</div>
									<input type="password" className="form-control" placeholder="password" onChange={(e) => setPassword(e.target.value)}/>
								</div>
								<div className="row align-items-center remember">
									
									<input type="checkbox"/>Remember Me
								</div>
								<div className="form-group">
									<input type="submit" value="Login" className="btn float-right login_btn"/>
								</div>
							</form>
						</div>
						<div className="card-footer">
							<div className="d-flex justify-content-center links">
								Don't have an account?<a href="#" onClick={handleClick}>Sign Up</a>
							</div>
							{showModal && <SignUpModal setShowModal={setShowModal}/>}
							<div className="d-flex justify-content-center">
								<a href="#">Forgot your password?</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}	

export default Login;