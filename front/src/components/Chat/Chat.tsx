import { toUnicode } from "punycode";
import * as React from "react";
import { io } from "socket.io-client";
import '../../styles/chat.scss'

// const socket = io("http://localhost:3000") //put backend's port number
const socket = io("http://" + window.location.hostname + ":4000");

/*
receive message from back
emit - sendmessagechannel
back will broadcast to everyone on channel
in front, listen for the message on channel
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

	const [newInput, setNewInput] = React.useState("");
	const [messageList, setMessageList] = React.useState<any[]>([]);
	// const newInput = document.getElementById('newInput');
	// const messageList = document.getElementById('messageList');
	
const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
	e.preventDefault();
	setNewInput(e.target.value);
};

// const buildMessage = (e: React.FormEvent<HTMLFormElement>) => {
// 	e.preventDefault();
// 	if (!inputMessage)
// 		return ;
// 	const newMessage: Message = {
// 		inputText: inputMessage,
// 	};
// 	setMessageList([newMessage, ...messageList]);
// 	socket.emit("sendMessage", { inputMessage });
// 	setInputMessage("");
// }

const handleSubmitNewMessage = (e: React.FormEvent<HTMLFormElement>) => {
	e.preventDefault();
	socket.emit('sendMessage', { newInput });
	setNewInput("");
}

socket.on("recMessage", ( data ) => {
	console.log({data: newInput});
	buildNewMessage({data: newInput});
})

const buildNewMessage = (data: any) => {
	setMessageList([...messageList, data]);
}
	return (
		<div id="chat-container">
			<div className="left-sidebar">
				<ChannelList></ChannelList>
				<DMList></DMList>
			</div>
			<div className="chat-body">
				<div className="chat-messages">
					{messageList.map(chat => (
						<div key={chat.value} className="__wrap">
							{chat.value}
						</div>
					))}
				</div>
				<form onSubmit={(e) => handleSubmitNewMessage(e)}>
					<input type="text" onChange={(e) => handleInput(e)} placeholder="type message here"/>
				</form>

			</div>
			<div className="right-sidebar">
				<UserList></UserList>
			</div>
		</div>
	);
}

export default Chat
