import logo from '../assets/images/logo.jpg';
import { useCookies } from 'react-cookie';
import { useLocation, useNavigate } from 'react-router-dom';

const Nav = ({authToken, user}) => {
	
	const [cookies, setCookie, removeCookie] = useCookies(['user']);
	const location = useLocation();
	const navigate = useNavigate();
	
	const isActive = (path) => {
		const varClass = (location.pathname == path) ? "nav-link" : "nav-button";
		return varClass;
	}
	
	const logout = () => {
		removeCookie("UserId", cookies.UserId);
		removeCookie("AuthToken", cookies.AuthToken);
		window.location.reload();
		navigate("/login");
	}
	
	return (
		<nav className="navbar navbar-expand-lg bg-body-tertiary">
			<div className="container-fluid col-md-7">
				<a className="navbar-brand">
					<img className="logo" alt="Logo" src={logo}/>
				</a>
			</div>
			<div className="collapse navbar-collapse">
				<ul className="navbar-nav me-auto mb-2 mb-lg-0">
					<li className="nav-item">
						{authToken && <a className={isActive("/swiper")} href="#" onClick={() => navigate("/swiper")}>Swiper</a>}
					</li>
					<li className="nav-item">
						{authToken && <a className={isActive("/profile")} href="#" onClick={() => navigate("/profile")}>Profile</a>}
					</li>
					<li className="nav-item">
						{authToken && <a className={isActive("/messages")} href="#" onClick={() => navigate("/messages")}>Messages</a>}
					</li>
					<li className="nav-item">
						{authToken && <a className="nav-button" href="#" onClick={logout}>Log out</a>}
					</li>
				</ul>
			</div>
		</nav>
	);
}

export default Nav