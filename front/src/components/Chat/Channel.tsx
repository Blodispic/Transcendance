import * as React from "react";
import { Value } from "sass";
import { isFunctionDeclaration } from "typescript";
import { socket } from "../../App";


/**
 * Displays popup form when add channel button is clicked; takes input and sends info to the back
 * @todo handle channel mode later
 */
function CreateChannelPopup(props: any) {
	const [chanName, setChanName] = React.useState("");

	const handleCreateNewChan = () => {
		console.log({chanName});
		if (chanName != "")
			socket.emit('joinChannel', {chanName});
		setChanName("");
		// channel mode here
		props.setTrigger(false);
	}

	return (props.trigger) ? (
		<div className="chat-form-popup">
			<div className="chat-form-inner">
				<h3>Channel Name</h3>
				<input type="text" placeholder="New channel name" onChange={(e) => {setChanName(e.target.value)}}/>
				<h3>Channel Mode</h3>
				<input type="radio" name="Mode" value="Public" />Public <span></span>
				<input type="radio" name="Mode" value="Private" />Private <span></span>
				<input type="radio" name="Mode" value="Protected" />Protected <br /><br />
				<button onClick={() => handleCreateNewChan()}>Create Channel</button><span></span>
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
