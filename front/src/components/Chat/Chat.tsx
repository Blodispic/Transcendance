import { toUnicode } from "punycode";
import * as React from "react";
import { io } from "socket.io-client";
import '../../styles/chat.scss'
import { ChannelList } from "./Channel";
import { FormSetChannel } from "./Channel";

const socket = io("http://" + window.location.hostname + ":4000");

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

function ChatBody() {
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
		<div className="chat-body">
			<div className="chat-messages">
				{messageList.map((chat) => (

					<div key={chat.newInput} className="__wrap">
						<div className="message_info">
							<span className="user-avatar"><img src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/apple/81/woman-gesturing-ok-type-1-2_1f646-1f3fb-200d-2640-fe0f.png"></img></span>
							UserName
							<span className="timestamp"> 0000/00/00 00:00</span>
						</div>
						<p>{chat.newInput}</p>
					</div>
				))}
			</div>
			<form id="input_form" onSubmit={(e) => { handleSubmitNewMessage(e); }}>
				<input type="text" onChange={(e) => { setNewInput(e.target.value) }}
					placeholder="type message here" value={newInput} />
			</form>

		</div>
	);
}

function Chat() {
	const [chanelSet, setChanelSet] = React.useState(false)
	return (
		<div id="chat-container">
			<div className="left-sidebar">
				<ChannelList />
			</div>

			{ chanelSet == false &&
				<FormSetChannel />
			}
			{ chanelSet == true &&
				<ChatBody />
			}


			<div className="right-sidebar">
				<UserList />
			</div>
		</div>
	);
}

export default Chat
