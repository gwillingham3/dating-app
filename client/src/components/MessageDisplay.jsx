import { useState } from 'react';
import axios from 'axios';
import MessageLog from './MessageLog';

const MessageDisplay = ( { user, clickedUser } ) => {
	 
	const [textArea, setTextArea] = useState(null);
	const [usersMessages, setUsersMessages] = useState(null);
	const [correspondentsMessages, setCorrespondentsMessages] = useState(null);
	
	const userId = user?.user_id;
	const clickedUserId = clickedUser?.user_id;
	
	const getUsersMessages = async () => {
		try {
			const response = await axios.get("http://localhost:8000/messages", { params: {userId: userId, correspondingUserId: clickedUserId} });
			setUsersMessages(response.data);
		} catch (error) {
			console.log(error);
		}
	}
	
	const getCorrespondentsMessages = async () => {
		try {
			const response = await axios.get("http://localhost:8000/messages", { params: {userId: clickedUserId, correspondingUserId: userId} });
			setCorrespondentsMessages(response.data);
		} catch (error) {
			console.log(error);
		}
	}
	
	const addMessage = async () => {
		const message = {
			timestamp: new Date().toISOString(),
			from_userId: userId,
			to_userId: clickedUserId,
			content: textArea
		}
		
		try {
			await axios.post("http://localhost:8000/message", {message});
			getUsersMessages();
			getCorrespondentsMessages();
			setTextArea("");
		} catch (error) {
			console.log(error);
		}
	}
	
	if (clickedUser === null) {
		return (
			<div className="messages-container">
				<div>Click on a user to open up the messages</div>
			</div>
		);
	}
	
	return (
		<div className="messages-container">
			<div className="row">
				<MessageLog user={user} clickedUser={clickedUser}/>
				<div className="messages-input-container">
					<div className="row justify-content-center">
						<textarea value={textArea} name="message-input" className="col-sm-8" onChange={(e) => setTextArea(e.target.value)}/>
						<button className="secondary-button col-sm-3" onClick={() => addMessage()}>Submit</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default MessageDisplay