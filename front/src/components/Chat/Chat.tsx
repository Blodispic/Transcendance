import { toUnicode } from "punycode";
import * as React from "react";
import { io } from "socket.io-client";
import '../../styles/chat.scss'

const socket = io("http://localhost:3000")

/*
FRONT -> emit message -> BACK
*/

function ChannelList() {
	return <ul>
		<li>channel 1</li>
		<li>channel 2</li>
	</ul>
}

function DMList() {
	return <ul>
		<li>DM 1</li>
		<li>DM 2</li>
	</ul>
}

function UserList() {
	return 	<ul>
		<li> user1 </li>
		<li> user2 </li>
		<li> user3 </li>
	</ul>
}

function Chat(this: any) {

const [inputMessage, setInputMessage] = React.useState("");

//array of message
const [messages, setMessages] = React.useState<Message[]>([]);

type Message = {
	inputText: string;
	//user(sender)
	//time
}

// receive input
const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
	e.preventDefault();
	console.log(e.target.value);
	setInputMessage(e.target.value);
};

// take new input string and store to 'Messages' array
const buildMessage = (e: React.FormEvent<HTMLFormElement>) => {
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
			
			{/* left side bar */}
			<div className="left-sidebar">
				<ChannelList></ChannelList>
			</div>
			{/* main chat window in the middle */}
			<div className="chat-body">
				<div className="chat-messages">
					{messages.map(message => (
						<div className="__wrap">
							{message.inputText}
						</div>
					))}
				</div>
				{/* input text box */}
				<form onSubmit={(e) => buildMessage(e)}>
					<input type="text" onChange={(e) => handleInput(e)} placeholder="type message here"/>
				</form>
			</div>

			{/* right side bar */}
			<div className="right-sidebar">
				<UserList></UserList>
			</div>
		</div>
	);
}

export default Chat
