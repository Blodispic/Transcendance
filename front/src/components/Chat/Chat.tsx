import { toUnicode } from "punycode";
import * as React from "react";
import { io } from "socket.io-client";
import '../../styles/chat.scss'

// const socket = io("http://localhost:3000")

// const message = document.getElementById('message');
// const messages = document.getElementById('messages');

// const handleSubmitNewMessage = () => {
// 	socket.emit('message', { data: message })
// }

// socket.on('message', ({ data }) => {
// 	handleNewMessage(data);
// })

// const handleNewMessage = (message: string) => {
// 	messages?.appendChild(buildNewMessage(message));
// }

// const buildNewMessage = (message: string) => {
// 	const li = document.createElement("li");
// 	li.appendChild(document.createTextNode(message))
// 	return li;
// }


function Chat() {

	const [inputMessage, setInputMessage] = React.useState("");

	//array of message
	const [messages, setMessages] = React.useState<Message[]>([]);
	
	type Message = {
		inputText: string;
		//user(sender)
		//time
	}

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		console.log(e.target.value);
		setInputMessage(e.target.value);
	};

	const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!inputMessage)
			return ;
		const newMessage: Message = {
			inputText: inputMessage,
		};
		setMessages([newMessage, ...messages]);
		setInputMessage(inputMessage);
	}

	return (
		<div id="chat-container">
			<div className="chat-list">
				<ul>
					<li>chat room 1</li>
					<li>chat room 2</li>
				</ul>
			</div>
	
			<div className="chat-body">
				<div className="chat-messages">
					{messages.map(message => (
						<div className="__wrap">
							{message.inputText}
						</div>
					))}
				</div>
				<form onSubmit={(e) => handleSend(e)}>
					<input type="text" onChange={(e) => handleInput(e)} placeholder="type message here"/>
				</form>

			</div>

			{/* list of users on the right */}
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

