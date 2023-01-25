import * as React from "react";
import { isFunctionDeclaration } from "typescript";
import '../../styles/chat.scss'


function CreateChannelPopup(props: any) {
	return (props.trigger) ? (
		<div className="chat-form-popup">
			<div className="chat-form-inner">
				<h3>Channel Name</h3>
				<input type="text" placeholder="Channel Name"></input>
				<h3>Channel Mode</h3>
				<input type="radio" name="Mode" value="Public" />Public <span></span>
				<input type="radio" name="Mode" value="Private" />Private <span></span>
				<input type="radio" name="Mode" value="Protected" />Protected <br /><br />
				<button>Create Channel</button>
				<button onClick={() => props.setTrigger(false)}>close</button>
			</div>
		</div>
	) : <div></div>;
}

// function handdleChannelInput() {}

export function ChannelList() {
	const [buttonPopup, setButtonPopup] = React.useState(false);

	const chanList = [
		<li>test chan 1</li>,
	]
	return (
		<div className="title"> Channels <span> <button onClick={() => setButtonPopup(true)}>add</button></span>
			{/* {chanList} */}
			<CreateChannelPopup trigger={buttonPopup} setTrigger={setButtonPopup}>
				<h3> popup test </h3>
			</CreateChannelPopup>
			{chanList}
		</div>
	);
}
