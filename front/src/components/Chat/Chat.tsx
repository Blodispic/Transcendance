import * as React from "react";
import '../../styles/chat.scss'

function Chat() {
	const [currentMessage, setCurrentMessage] = React.useState("");

	const sendMessage = async () => {
		if (currentMessage !== "") {
			const messageData = {
				message: currentMessage
			};
		}
	}

	return (
		<div id="chat-container">
		<div className="layer">
			<div className="header">
				<span className="font-link"> Welcome to Chat </span>
			</div>
			<div className="body"></div>
			<div className="footer">
				<input type="text" placeholder="Type a message..." />
				<input type="submit" value="send" className="button" />			
			</div>
		</div>

		</div>
	);
}

export default Chat