import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const SignUpModal = ({setShowModal}) => {
	
	const [email, setEmail] = useState(null);
	const [password, setPassword] = useState(null);
	const [confirmPassword, setConfirmPassword] = useState(null);
	const [error, setError] = useState(null)
	const navigate = useNavigate();
	const [cookies, setCookie, removeCookie] = useCookies(['user']);
	
	console.log(email, password, confirmPassword);
	
	const handleClick = () => {
		setShowModal(false);
	}
	
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (password !== confirmPassword) {
				setError("Passwords need to match!");
			} else {
				const response = await axios.post("http://localhost:8000/signup", {email, password});
				setCookie("Email", response.data.email);
				setCookie("UserId", response.data.userId);
				setCookie("AuthToken", response.data.token);
				const success = response.status == 201;
				
				if (success) {
					navigate("/onboarding");
				}
			}
			
		} catch(error) {
			console.log(error);
		}
	}
	
	return (
		<div className="auth-modal">
			<div className="close-icon" onClick={handleClick}>x</div>
			<h2>Sign Up</h2>
			<p>By signing up: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam nec suscipit ligula, ac sagittis justo. Nullam ex nisl, fringilla vel egestas a, volutpat nec massa.</p>
			<form onSubmit={handleSubmit}>
				<input type="email" id="email" placeholder="email" required={true} onChange={(e) => setEmail(e.target.value)}/>
				<input type="password" id="password" placeholder="password" required={true} onChange={(e) => setPassword(e.target.value)}/>
				<input type="password-check" id="password-check" placeholder="confirm password" required={true} onChange={(e) => setConfirmPassword(e.target.value)}/>
				<input type="submit" className="secondary-button"/>
				<p>{error}</p>
			</form>
		</div>
	);
}

export default SignUpModal