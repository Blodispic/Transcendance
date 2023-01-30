import { useState } from "react";
import { HiOutlineXMark, HiPlusCircle } from "react-icons/hi2";
import { socket } from "../../App";
import '../../styles/chat.scss'

/**
 * Displays popup form when add channel button is clicked; takes input and sends info to the back
 * @todo handle channel mode + password input
 */
function CreateChannelPopup(props: any) {
	const [chanName, setChanName] = useState("");
	const handleCreateNewChan = () => {
		console.log({ chanName });
		if (chanName != "")
			socket.emit('createPublicChannel', { channame: chanName });
		setChanName("");
		// channel mode here
		props.setTrigger(false);
	}

	return (props.trigger) ? (
		<div className="chat-form-popup" onClick={_ => props.setTrigger(false)}>
			<div className="chat-form-inner" onClick={e => e.stopPropagation()}>
				<HiOutlineXMark className="close-icon" onClick={_ => props.setTrigger(false)} /> <br />
				<h3>Channel Name</h3>
				<input type="text" id="channel-input" onChange={e => { setChanName(e.target.value) }} />
				<h3>Channel Mode</h3>
				<input type="radio" name="Mode" value="Public" />Public <span></span>
				<input type="radio" name="Mode" value="Private" />Private <span></span>
				<input type="radio" name="Mode" value="Protected" />Protected <br /><br />
				<button onClick={() => handleCreateNewChan()}>Create Channel</button><span></span>
				{/* <button onClick={() => props.setTrigger(false)}>close</button> */}
			</div>
		</div>
	) : <></>;
}

function ChannelList() {
	const [buttonPopup, setButtonPopup] = useState(false);
	const [chanList, setChanList] = useState<any[]>([]); //temporary data type; to be replaced;

	socket.on('createPublicChannelOk', (createPublicChannelDto) => {
		setChanList([...chanList, createPublicChannelDto]);
	});
	console.log(chanList);

	return (
		<div className="title"> Channels <span><HiPlusCircle className="add-icon" onClick={() => setButtonPopup(true)} /></span><hr />
			<CreateChannelPopup trigger={buttonPopup} setTrigger={setButtonPopup} />
			{chanList.map((chan) => (
				<ul>
					<p>{chan.chanName}</p>
				</ul>
			))}
		</div>
	);
}

function ChannelMemberList() {
	return (
		<div className="title"> Members <hr />
		</div>
	);
}

export function ChannelMessages() {
	
	const [newInput, setNewInput] = useState("");
	const [messageList, setMessageList] = useState<any[]>([]);

	const handleSubmitNewMessage = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (newInput != "")
			socket.emit('sendMessageChannel', { newInput }); //
		setNewInput("");
	}

	socket.on('sendMessageChannelOk', (messageChannelDto) => {
		buildNewMessage(messageChannelDto);
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
							<span className="user-avatar">
								<img src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/apple/81/woman-gesturing-ok-type-1-2_1f646-1f3fb-200d-2640-fe0f.png"></img></span>
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


export function Channels() {
	return (
		<div id="chat-container">
		<div className="left-sidebar">
			<ChannelList />
		</div>
			<ChannelMessages />
		<div className="right-sidebar">
			<ChannelMemberList />
		</div>
	</div>
	);
}