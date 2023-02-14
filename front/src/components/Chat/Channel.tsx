import { useEffect, useState } from "react";
import { HiOutlineXMark, HiPlus } from "react-icons/hi2";
import { useNavigate, useParams } from "react-router-dom";
import { socket } from "../../App";
import { IChannel } from "../../interface/Channel";
import { IUser } from "../../interface/User";
import { useAppSelector } from "../../redux/Hook";
// import '../../styles/chat.scss'

function CreateChannelPopup(props: any) {
	const [chanName, setChanName] = useState("");
	const [password, setPassword] = useState("");
	const [privateChan, setPrivateChan] = useState(false);

	const handleCreateNewChan = () => {
		if (chanName != "")
			socket.emit('createPublicChannel', { channame: chanName });
		setChanName("");
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

function ChannelList(props: any) {
	const [chanList, setChanList] = useState<IChannel[]>([]);
	const [chanId, setChanId] = useState("");
	const navigate = useNavigate();

	socket.on('createPublicChannelOk', (newChanId) => {
		getChanId(newChanId);
	});

	const getChanId = (data: any) => {
		setChanId(data);
	}
	// console.log('chanId: ' + chanId);

	useEffect(() => {
		const fetchAllList = async () => {
			const response = await fetch(`${process.env.REACT_APP_BACK}channel/`, {
				method: 'GET',
			})
			const data = await response.json();
			// console.log(data);
			setChanList(data);
		}
		fetchAllList();
	}, [chanId]);


	return (
		<div> 
		<header>All Channels <hr /></header>
			{chanList.map(chan => (
				<ul key={chan.name} >
					<div onClick={_ => navigate(`/Chat/${chan.id}`)}>{chan.name}</div>
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
		<div className="add-icon" onClick={() => setButtonPopup(true)}>
			{/* <HiPlusCircle onClick={() => setButtonPopup(true)} />
			<CreateChannelPopup trigger={buttonPopup} setTrigger={setButtonPopup} /> */}
			<HiPlus className="add-button" />
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

function ChannelMemberList(props: any) {
	const [currentChan, setCurrentChan] = useState<IChannel | undefined>(undefined)

	useEffect(() => {
		const getChannel = async () => {
			const response = await fetch(`${process.env.REACT_APP_BACK}channel/${props.chanId}`, {
				method: 'GET',
			})
			const data = await response.json();
			setCurrentChan(data);
		}
		getChannel();
	}, [props]);

	if (currentChan?.users === undefined)
	{
		return(
			<div className="title"> Members <hr />
			</div>
		)
	}

	return (
		<div className="title"> Members <hr />
			{currentChan?.users.map(user => (
				<div className="user-list">
				<ul key={user.username}>
					{user.username}
				</ul>
				</div>
			))
		}
		</div>
	);
}

interface IMessage {
	chanid: number;
	userid: number;
	message: string;
}

function ChannelMessages(props: any) {
	const [newInput, setNewInput] = useState("");
	const [messageList, setMessageList] = useState<any[]>([]);
	const [newMessage, setNewMessage] = useState("");
	const [currentChan, setCurrentChan] = useState<IChannel | undefined>(undefined)

	const myUser = useAppSelector(state => state.user);
	
	useEffect(() => {
		const getChannel = async() => {
			const response = await fetch(`${process.env.REACT_APP_BACK}channel/${props.chanId}`, {
				method: 'GET',
			})
			const data = await response.json();
			setCurrentChan(data);
		}
		getChannel();
	}, [props]);

	const handleSubmitNewMessage = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (newInput != "")
		socket.emit('sendMessageChannel', { chanid: props.chanId, userid: 1, message: newInput }); //to be modified later
		setNewInput("");
	}

	socket.on('sendMessageChannelOk', (chanid: number, userid: number, message: string) => {

		setMessageList([...messageList, message]);
		console.log(messageList);
		// buildNewMessage(message);
	})
	
	// const buildNewMessage = (data: any) => {
	// 	console.log("here");
	// 	setMessageList([...messageList, data]);
	// }

	return (
		<div className="chat-body">
			<div className="title" style={{marginLeft:"10px", marginRight:"10px"}}>
				{currentChan?.name} <hr />
			</div>
			<div className="chat-messages">
				{/* <div className="__wrap"> */}
					{/* <div className="message_info"> */}
						{/* <span className="user-avatar">
							<img src="https://www.handiclubnimois.fr/wp-content/uploads/2020/10/blank-profile-picture-973460_1280.png"></img></span>
						Username
						<span className="timestamp"> 0000/00/00 00:00</span> */}
					{/* </div> */}
					{messageList.map(chat => (
						<div key={chat.newInput} className="__wrap">
							{/* <div className="message-info"> {chat.userid} </div> */}
							{chat.newInput}
						</div>
					))}
				{/* </div> */}
			</div>
			<form id="input_form" onSubmit={(e) => { handleSubmitNewMessage(e); }}>
				<input type="text" onChange={(e) => { setNewInput(e.target.value) }}
					placeholder="type message here" value={newInput} />
			</form>

		</div>
	);
}

export function Channels(props: any) {

	// console.log("props: " + props.chatId);
	return (
		<div id="chat-container">
			<div className="left-sidebar">
				<ChannelList />
				<AddChannel />
			</div>
				<ChannelMessages chanId={props.chatId} />
			<div className="right-sidebar">
				<ChannelMemberList chanId={props.chatId} />
			</div>
		</div>
	);
}