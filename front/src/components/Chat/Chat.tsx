import { toUnicode } from "punycode";
import { io, Socket } from "socket.io-client";
import '../../styles/chat.scss'
import { ChannelList } from "./Channel";
import React from "react";
import { socket } from "../../App"

function DMList() {
	return <ul>
		<li>DM 1</li>
		<li>DM 2</li>
	</ul>
}

function UserInfo() {
	return (
		<h3>UserName</h3>
	);
}

function ChatBody() {
	
	const [newInput, setNewInput] = React.useState("");
	const [messageList, setMessageList] = React.useState<any[]>([]);

	const handleSubmitNewMessage = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (newInput != "")
			socket.emit('sendMessageUser', { newInput }); //
		setNewInput("");
	}

	socket.on('sendMessageUserOk', (messageUserDto) => {
		buildNewMessage(messageUserDto);
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
					placeholder="type message here" value={newInput}/>
			</form>

		</div>
	);
}

export default function Chat() {
	const [channelSet, setChannelSet] = React.useState(false)
	const [DmSet, setDmSet] = React.useState(true)

	return (
		<div id="chat-container">
			<div className="left-sidebar">
				<ChannelList />
				{/* <DMList /> */}
			</div>
			
			{ channelSet == false && DmSet == true &&
				<ChatBody />
			}
			<div className="right-sidebar">
				<UserInfo />
			</div>
		</div>
	);
}
