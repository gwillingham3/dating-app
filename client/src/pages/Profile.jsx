import { useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import Nav from '../components/Nav';

function Profile() {
	
	// Write ideas for what else to do with this page
	
	const [user, setUser] = useState(null);
	const [cookies, setCookie, removeCookie] = useCookies(['user']);
	
	const userId = cookies.UserId;
	
	const getUser = async () => {
		
		try {
			const response = await axios.get("http://localhost:8000/user", { params: { userId } });
			setUser(response.data);
		} catch (error) {
			console.log(error);
		}
	}
	
	useEffect(() => {
		getUser();
	}, [user]);
	
	/**
	 * user object fields
	 *
	 *	- UserId: user.user_id
	 *	- Email: user.email
	 *	- About: user.about
	 *	- DoB Day: user.dob_day
	 *	- DoB Month: user.dob_month
	 *	- DoB Year: user.dob_year
	 *  - First Name: user.first_name
	 *	- Gender Identity: user.gender_identity
	 *  - Last Name: user.last_name
	 *  - Matches (array): user.matches
	 *	- Profile Image: user.profile_image
	 *	- Sexual Preference: user.sexual_preference
	 *	- Show Gender: user.show_gender
	 */
	
	const authToken = true;
	
	return (
		<>
			<Nav authToken={authToken} user={user}/>
			<div className="container body-container">
				<h3>{user?.first_name} {user?.last_name} Profile</h3>
				<div className="img-container">
					<img src="" alt="photo of user"/> 
				</div>
			</div>
		</>
	);
}	

export default Profile;