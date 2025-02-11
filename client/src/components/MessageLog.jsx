import { useEffect, useState } from 'react';
import axios from 'axios';

const MessageLog = ( { user, clickedUser } ) => {
	
	/**
	 * Message Structure:
	 *
	 * _id - (Don't worry about this)
	 * timestamp - self-explanatory
	 * from_userId
	 * to_userId
	 * message
	 */
	 
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
	
	useEffect(() => {
		getUsersMessages();
		getCorrespondentsMessages();
	}, []);
	
	const messages = [];
	
	usersMessages?.forEach(message => {
		const formattedMessage = {};
		formattedMessage["name"] = user?.first_name;
		formattedMessage["message"] = message.content;
		formattedMessage["timestamp"] = message.timestamp;
		messages.push(formattedMessage);
	});
	
	correspondentsMessages?.forEach(message => {
		const formattedMessage = {};
		formattedMessage["name"] = clickedUser?.first_name;
		formattedMessage["message"] = message.content;
		formattedMessage["timestamp"] = message.timestamp;
		messages.push(formattedMessage);
	});
	
	const descendingOrderMessages = messages?.sort((a,b) => a.timestamp.localeCompare(b.timestamp));
	
	return (
		<div className="message-log-container">
			{descendingOrderMessages?.map((message, _index) => (
				<div key={_index} className="row message-container">
					<div className="message-header">
						<p>{message.name}</p>
					</div>
					<p>{message.message}</p>
					<div className="message-footer">
						<p>Sent at: {message.timestamp}</p>
					</div>
				</div>
			))}
		</div>
	);
}

export default MessageLog