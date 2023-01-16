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
		{/* <div className="layer">
			<div className="header">
				<span className="font-link"> Welcome to Chat </span>
			</div>
			<div className="body"></div>
			<div className="footer">
				<input type="text" placeholder="Type a message..." />
				<input type="submit" value="send" className="button" />			
			</div>
		</div> */}
			<div className="chat-list">
				<ul>
					<li>chat room 1</li>
					<li>chat room 2</li>
				</ul>
			</div>

			<div className="messages">
				<p> messages </p>
				<div className="message-input">
					<input id="text-message" type="text" placeholder="type message here"></input>
					{/* <textarea> message input </textarea> */}
					{/* <div className="input-container">
						<input type="text" placeholder="type message here" />
					</div> */}
				<input type="submit" value="send" className="button" />			

				</div>
			</div>


			<div className="user-list">
				<ul>
					<li> user1 </li>
					<li> user2 </li>
					<li> user3 </li>
				</ul>
			</div>

		</div>
	);
}

export default Chat
