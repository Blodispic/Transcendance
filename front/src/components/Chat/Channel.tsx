import * as React from "react";
import { Value } from "sass";
import { isFunctionDeclaration } from "typescript";
import '../../styles/chat.scss'

function CreateChannelPopup(props: any) {
	// const [chanName, setChanName] = React.useState("");

	// const handdleCreateNewChan = () => {
		
	// }

	return (props.trigger) ? (
		<div className="chat-form-popup">
			<div className="chat-form-inner">
				<h3>Channel Name</h3>
				<input type="text" placeholder="Channel Name" />
				<h3>Channel Mode</h3>
				<input type="radio" name="Mode" value="Public" />Public <span></span>
				<input type="radio" name="Mode" value="Private" />Private <span></span>
				<input type="radio" name="Mode" value="Protected" />Protected <br /><br />
				<button>Create Channel</button><span></span>
				<button onClick={() => props.setTrigger(false)}>close</button>
			</div>
		</div>
	) : <div></div>;
}

export function ChannelList() {
	const [buttonPopup, setButtonPopup] = React.useState(false);

	const chanList = [
		<li>test chan 1</li>,
	]
	return (
		<div className="title"> Channels <span> <button onClick={() => setButtonPopup(true)}>add</button></span>
			<CreateChannelPopup trigger={buttonPopup} setTrigger={setButtonPopup} />
			{chanList}
		</div>
	);
}
