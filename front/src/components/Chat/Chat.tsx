import { toUnicode } from "punycode";
import * as React from "react";
import { io } from "socket.io-client";
import '../../styles/chat.scss'

const socket = io("http://" + window.location.hostname + ":4000");

function ChannelList() {
	const chanList = [
		<li>chan 1</li>,
		<li>chan 2</li>
	]
	return <ul>
		{chanList}
	</ul>
}

function DMList() {
	return <ul>
		<li>DM 1</li>
		<li>DM 2</li>
	</ul>
}

function UserList() {
	return <ul>
		<li> user1 </li>
		<li> user2 </li>
		<li> user3 </li>
	</ul>
}

function Chat() {

	
	const [newInput, setNewInput] = React.useState("");
	const [messageList, setMessageList] = React.useState<any[]>([]);

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.value == "")
			return;
		setNewInput(e.target.value);
	};

	const handleSubmitNewMessage = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (newInput != "")
			socket.emit('sendMessage', { newInput });
		setNewInput("");
	}

	socket.on('recMessage', (data) => {
		buildNewMessage(data);
	})

	const buildNewMessage = (data: any) => {
		setMessageList([...messageList, data]);
	}
	return (
		<div id="chat-container">
			<div className="left-sidebar">
				<ChannelList />
			</div>
			<div className="chat-body">
				<div className="chat-messages">
					{messageList.map((chat) => (
						<div key={chat.newInput} className="__wrap">
							{chat.newInput}
						</div>
					))}
				</div>
				<form id="input_form" onSubmit={(e) => { handleSubmitNewMessage(e); }}>
					<input type="text" onChange={(e) => { setNewInput(e.target.value) }}
						placeholder="type message here" value={newInput} />
				</form>

			</div>
			<div className="right-sidebar">
				<UserList />
			</div>
		</div>
	);
}

export default Chat
