import { useState } from 'react';

const MessageInput = () => {
	
	const [textArea, setTextArea] = useState(null);
	
	/**
	 * Place this line: 
	 *
	 * 		<textarea value={textArea} onChange={(e) => setTextArea(e.target.value)}/>
	 *
	 * above the button
	 */
	
	return (
		<div className="messages-input-container">
			<div className="row">
				<button className="secondary-button">Submit</button>
			</div>
		</div>
	);
}

export default MessageInput