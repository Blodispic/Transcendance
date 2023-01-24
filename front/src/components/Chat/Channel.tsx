import { toUnicode } from "punycode";
import * as React from "react";
import { io } from "socket.io-client";
import '../../styles/chat.scss'


export function FormSetChannel() {
	return (
		<div className="chat-body">
			<div className="create-channel">
			<h3>Channel Name</h3>
			<input type="text" placeholder="Channel Name"></input>
			
			<h3>Channel Mode</h3>
			<input type="radio" name="Mode" value="Public" />Public <span></span>
			<input type="radio" name="Mode" value="Private" />Private <span></span>
			<input type="radio" name="Mode" value="Protected" />Protected <br></br>
			<button>Create Channel</button>
			</div>
		</div>
	)
}

export const CreateChannelForm = (e: React.MouseEvent<HTMLButtonElement>) => {
	return (
		<div className="chat-body">
			Create Channel Test
		</div>
	)
}

export function ChannelList() {
	// const [chanName, setChanName] = React.useState("");
	// const [chanList, setChanList] = React.useState<Channel []>([]);

	const chanList = [
		<li>chan 1</li>,
	]
	// const handleSubmitNewMessage = (e: React.FormEvent<HTMLFormElement>) => {
	// <form id="input_form" onSubmit={(e) => { handleSubmitNewMessage(e); }}>
	return (
		// <div className="title"> Channels <span className="button"> <button onClick={(e) => {CreateChannelForm(e)}}>add</button></span>
		// <div className="title"> Channels <span> <button onClick={(e) => {CreateChannelForm(e)}}>add</button></span>
		<div className="title"> Channels <span> <button onClick={(e) => CreateChannelForm(e)}>add</button></span>
			{chanList}
		</div>
	);
}
