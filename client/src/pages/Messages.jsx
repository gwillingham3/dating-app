import { useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import MatchesDisplay from '../components/MatchesDisplay';
import MessageDisplay from '../components/MessageDisplay';
import Nav from '../components/Nav';

function Messages() {
	
	const [user, setUser] = useState(null);
	const [clickedUser, setClickedUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [cookies, setCookie, removeCookie] = useCookies(['user']);
	
	const userId = cookies.UserId;
	
	const getUser = async () => {
		try {
			const response = await axios.get("http://localhost:8000/user", { params: { userId } });
			setUser(response.data);
			setIsLoading(false);
		} catch (error) {
			console.log(error);
		}
	}
	
	useEffect(() => {
		getUser();
	}, [user]);
	
	if (isLoading) {
		return <div>Loading...</div>;
	}
	
	const authToken = true;
	
	return (
		<>
			<Nav authToken={authToken} user={user}/>
			<div className="container body-container">
				<div className="row">
					<div className="matches-wrapper col-sm-4">
						<h3>Matches</h3>
						<MatchesDisplay matches={user?.matches} setClickedUser={setClickedUser}/>
					</div>
					{clickedUser && (
						<div className="messages-wrapper col-sm-8">
							<h3>Messages</h3>
							<MessageDisplay user={user} clickedUser={clickedUser}/> 
						</div>
					)}
				</div>
			</div>
		</>
	);
}	

export default Messages;