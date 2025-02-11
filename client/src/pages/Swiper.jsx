import { useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import TinderCard from 'react-tinder-card';
import Nav from '../components/Nav';

function Swiper() {
	
	
	const [user, setUser] = useState(null);
	const [users, setUsers] = useState(null);
	const [lastDirection, setLastDirection] = useState();
	const [cookies, setCookie, removeCookie] = useCookies(['user']);
	
	const userId = cookies.UserId;
	
	// gets the logged in user
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
		filterUsersByGender();
	}, [user, users]);
	
	// gets a list of users that match the user's sexual preference
	const filterUsersByGender = async () => {
		try {
			const response = await axios.get("http://localhost:8000/filter-users-by-gender", { params: { gender: user?.sexual_preference } });
			setUsers(response.data);
		} catch (error) {
			console.log(error);
		}
	}
	
	/**
	 * adds to the list of matched users and then will check to see if the likedUser actually likes them back so that a match can be made
	 * so currently just a list of likes
	 *
	 * TODO: make it so that you can only like a user once
	 */
	const updateLikes = async (likedUserId) => {
		try {
			const response = await axios.put("http://localhost:8000/update-likes", { userId, likedUserId });
			getUser();
		} catch (error) {
			console.log(error);
		}
	}
	
	// issue here. whole things works but really delayed?
	// list of users that shouldn't show up for you to like which includes yourself
	const likedUserIds = user?.matches.map( ({ user_id }) => user_id ).concat(userId);
	
	const filteredUsers = users?.filter(
		user => !likedUserIds.includes(user.user_id)
	);
	
	const authToken = true;
	
	
	const swipe = (direction, swipedUser) => {
		console.log("removing: " + swipedUser.first_name);
		
		if (direction === "right") {
			updateLikes(swipedUser.user_id);
			console.log(user.matches);
		} else {
			// removeUser();
		}
		setLastDirection(direction);
		console.log("the last direction was: " + direction);
	}

	const swiped = (direction, swipedUser) => {
		console.log('removing: ' + swipedUser.first_name);
		
		if (direction === "right") {
			updateLikes(swipedUser.user_id);
		}
		setLastDirection(direction);
	}

	const outOfFrame = (name) => {
		console.log(name + ' left the screen!');
	}
	
	return (
		<>
			<Nav authToken={authToken} user={user}/>
			<div className="container swiper">
				<h3>Swiper (Main part of the app)</h3>
				<div className="card-container">
					{filteredUsers?.map((user) =>
						<TinderCard className='swipe' key={user.first_name} onSwipe={(dir) => swiped(dir, user)} onCardLeftScreen={() => outOfFrame(user.first_name)}>
							<div style={{ backgroundImage: 'url(' + user.profile_image + ')' }} className='card'>
								<h3>{user.first_name}</h3>
								<div className="buttons">
									<button onClick={() => swipe('left', user)}>Pass</button>
									<button onClick={() => swipe('right', user)}>Like</button>
								</div>
							</div>
						</TinderCard>
					)}
				</div>
				{lastDirection ? (
					<h2 key={lastDirection} className='infoText'>
					  You swiped {lastDirection}
					</h2>
				  ) : (
					<h2 className='infoText'>
					  Swipe a card or press a button to get Restore Card button visible!
					</h2>
				)}
			</div>
		</>
	);
}	

export default Swiper;