import { useEffect, useState } from "react";
import { HiOutlineXMark, HiPlusCircle } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { socket } from "../../App";
import { IChannel } from "../../interface/Channel";
import { useAppSelector } from "../../redux/Hook";
import '../../styles/chat.scss'

function CreateChannelPopup(props: any) {
	const [chanName, setChanName] = useState("");
	const [password, setPassword] = useState("");
	const [privateChan, setPrivateChan] = useState(false);

	const handleCreateNewChan = () => {
		if (chanName != "")
			socket.emit('createChannel', {chanName: chanName, chanType: 0, password: "test"});
		setChanName("");
		console.log(password);
		setPassword("");
		props.setTrigger(false);
	}
	return (props.trigger) ? (
		<div className="chat-form-popup" onClick={_ => props.setTrigger(false)}>
			<div className="chat-form-inner" onClick={e => e.stopPropagation()}>
				<HiOutlineXMark className="close-icon" onClick={_ => props.setTrigger(false)} /> <br />
				<h3>Channel Name</h3>
				<input type="text" id="channel-input" placeholder="Insert channel name" onChange={e => { setChanName(e.target.value) }} />
				<h3>Channel Mode</h3>
				<input type="radio" name="Mode" value="Public" />Public <span></span>
				<input type="radio" name="Mode" value="Protected" />Private <br />
				<input type="password" id="channel-input" placeholder="Insert password" onChange={e => { setPassword(e.target.value) }} /><br />
				<button onClick={() => handleCreateNewChan()}>Create Channel</button><span></span>
			</div>
		</div>
	) : <></>;
}

function ChannelList() { /** Displays all channels */
	const [chanList, setChanList] = useState<IChannel[]>([]);
	const [chanId, setChanId] = useState("");
	const navigate = useNavigate();

	socket.on('createPublicChannelOk', (newChanId) => {
		getChanId(newChanId);
	});

	const getChanId = (data: any) => {
		setChanId(data);
	}
	console.log('chanId: ' + chanId);

	useEffect(() => {
		const fetchAllList = async () => {
			const response = await fetch(`${process.env.REACT_APP_BACK}channel/`, {
				method: 'GET',
			})
			const data = await response.json();
			console.log(data);
			setChanList(data);
		}
		fetchAllList();
	}, [chanId]);

	 console.log(chanList);

	return (
		<div> 
		<header>All Channels <hr /></header>
			{chanList.map(chan => (
				<ul key={chan.name} >
					<div onClick={_ => navigate(`/Chat/channel${chan.id}`)}>{chan.name}</div>
				</ul>
			))}
		</div>
	);
}

function JoinedChannelList() { /** Displays only joined channels */

	return (
		<div className="title"> Joined Channels <hr />
			test chan1
		</div>
	);

}

function AddChannel() {
	const [buttonPopup, setButtonPopup] = useState(false);

	return (
		<div className="add-icon">
		<HiPlusCircle onClick={() => setButtonPopup(true)} />
			<CreateChannelPopup trigger={buttonPopup} setTrigger={setButtonPopup} />
		</div>
	);
}

function PublicChannelList() {
	return (
		<div className="title">Public Channels <hr />
			<ul>
				<p>test</p>
			</ul>
		</div>
	);
}

function ChannelMemberList() {

	return (
		<div className="title"> Members <hr />
		</div>
	);
}


function ChannelMessages(/*channelId: number*/) {
	const [newInput, setNewInput] = useState("");
	const [messageList, setMessageList] = useState<any[]>([]);
	const [newMessage, setNewMessage] = useState("");

	const myUser = useAppSelector(state => state.user);

	const handleSubmitNewMessage = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (newInput != "")
			socket.emit('sendMessageChannel', { chanid: 1, userid: 1, message: newInput }); //to be modified later
		setNewInput("");
	}
	socket.on('sendMessageChannelOk', (newMessage) => {
		console.log(newMessage);
		buildNewMessage(newMessage);
	})

	const buildNewMessage = (data: any) => {
		console.log(data);
		setNewMessage(data);
		console.log(newMessage);
	}

	return (
		<div className="chat-body">
			<div className="chat-messages">
				<div className="__wrap">
					<div className="message_info">
						<span className="user-avatar">
							<img src="https://www.handiclubnimois.fr/wp-content/uploads/2020/10/blank-profile-picture-973460_1280.png"></img></span>
						Username
						<span className="timestamp"> 0000/00/00 00:00</span>
					</div>
					<p>{newMessage}</p>
				</div>
			</div>
			<form id="input_form" onSubmit={(e) => { handleSubmitNewMessage(e); }}>
				<input type="text" onChange={(e) => { setNewInput(e.target.value) }}
					placeholder="type message here" value={newInput} />
			</form>

		</div>
	);
}

export function Channels() {
	return (
		<div id="chat-container">
			<div className="left-sidebar">
				<ChannelList />
				<AddChannel />
			</div>
				<ChannelMessages />
			<div className="right-sidebar">
				<ChannelMemberList />
			</div>
		</div>
	);
}