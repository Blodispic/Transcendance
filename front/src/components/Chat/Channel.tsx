import * as React from "react";
import { HiOutlineXMark, HiPlusCircle } from "react-icons/hi2";
import { IconBase } from "react-icons/lib";
import { Value } from "sass";
import { isFunctionDeclaration } from "typescript";
import { socket } from "../../App";
import '../../styles/chat.scss'


	
/**
 * Displays popup form when add channel button is clicked; takes input and sends info to the back
 * @todo handle channel mode + password input
 */
function CreateChannelPopup(props: any) {
	const [chanName, setChanName] = React.useState("");
	// const [chanList, setChanList] = React.useState<any[]>([]); //temporary data type; to be replaced;

	// socket.on('createPublicChannelOk', (createPublicChannelDto) => {
	// 	setChanList([...chanList, createPublicChannelDto]);
	// });
	// console.log(chanList);

	const handleCreateNewChan = () => {
		console.log({ chanName });
		if (chanName != "")
			socket.emit('createPublicChannel', { channame: chanName });
		setChanName("");
		// channel mode here
		props.setTrigger(false);
	}

	return (props.trigger) ? (
		<div className="chat-form-popup">
			<div className="chat-form-inner">
				<HiOutlineXMark className="close-icon" onClick={() => props.setTrigger(false)} /> <br />
				<h3>Channel Name</h3>
				<input type="text" id="channel-input" onChange={(e) => { setChanName(e.target.value) }} />
				<h3>Channel Mode</h3>
				<input type="radio" name="Mode" value="Public" />Public <span></span>
				<input type="radio" name="Mode" value="Private" />Private <span></span>
				<input type="radio" name="Mode" value="Protected" />Protected <br /><br />
				<button onClick={() => handleCreateNewChan()}>Create Channel</button><span></span>
				{/* <button onClick={() => props.setTrigger(false)}>close</button> */}
			</div>
		</div>
	) : <div></div>;
}

export function ChannelList() {
	const [buttonPopup, setButtonPopup] = React.useState(false);
	const [chanList, setChanList] = React.useState<any[]>([]); //temporary data type; to be replaced;

	socket.on('createPublicChannelOk', (createPublicChannelDto) => {
		setChanList([...chanList, createPublicChannelDto]);
	});
	console.log(chanList);

	// display channel list (with lock icon on private channel)

	return (
		<div className="title"> Channels <span><HiPlusCircle className="add-icon" onClick={() => setButtonPopup(true)} /></span>
			{/* <button onClick={() => setButtonPopup(true)}>add</button>*/}
			<CreateChannelPopup trigger={buttonPopup} setTrigger={setButtonPopup} />
			{chanList.map((chan) => (
				<ul>
					{chan.chanName}
				</ul>
			))}
		</div>
	);
}
