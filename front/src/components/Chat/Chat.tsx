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
			<div className="chat-list">
				<ul>
					<li>chat room 1</li>
					<li>chat room 2</li>
				</ul>
			</div>

			<div className="chat-messages">
				{/* <div className="__message">
					<div>message test 1</div>
				</div> */}
			<div className="chat-input">
				{/* <form id="chat-input"> */}
				<input id="text-message" type="text" placeholder="type message here"></input>
				<input type="submit" value="send" className="button" />			
				{/* </form> */}
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
