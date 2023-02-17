import { useEffect, useState } from "react";
import { HiLockClosed, HiOutlineXMark, HiPlus } from "react-icons/hi2";
import { useNavigate, useParams } from "react-router-dom";
import { socket } from "../../App";
import { IChannel } from "../../interface/Channel";
import { IUser } from "../../interface/User";
import { useAppSelector } from "../../redux/Hook";

function PopupCreateChannel(props: any) {
	const [chanName, setChanName] = useState("");
	const [password, setPassword] = useState("");
	const [privateChan, setPrivateChan] = useState(0);

	const handlePrivate = () => {
		setPrivateChan(1);
	}

	const handlePublic = () => {
		setPrivateChan(0);
	}
	const handleCreateNewChan = () => {
		if (chanName != "")
			socket.emit('createChannel', { chanName: chanName, chanType: privateChan, password: password });
		setChanName("");
		setPassword("");
		setPrivateChan(0);
		props.setTrigger(false);
	}

	return (props.trigger) ? (
		<div className="chat-form-popup" onClick={_ => props.setTrigger(false)}>
			<div className="chat-form-inner" onClick={e => e.stopPropagation()}>
				<HiOutlineXMark className="close-icon" onClick={_ => props.setTrigger(false)} /> <br />
				<h3>Channel Name</h3>
				<input type="text" id="channel-input" placeholder="Insert channel name" onChange={e => { setChanName(e.target.value) }} />
				<h3>Channel Mode</h3>
				<input type="radio" name="chanMode" value={0} onChange={handlePublic} defaultChecked />Public <span></span>
				<input type="radio" name="chanMode" value={1} onChange={handlePrivate} />Private <br />
				{
					privateChan == 1 &&
					<><input type="password" id="channel-input" placeholder="Insert password" onChange={e => { setPassword(e.target.value); }} /><br /></>
				}
				<button onClick={() => handleCreateNewChan()}>Create Channel</button><span></span>
			</div>
		</div>
	) : <></>;
}

function ChannelList(props: any) {
	const [chanList, setChanList] = useState<IChannel[]>([]);
	const [chanId, setChanId] = useState("");
	const navigate = useNavigate();

	socket.on('createChannelOk', (newChanId) => {
		getChanId(newChanId);
	});

	const getChanId = (data: any) => {
		setChanId(data);
	}

	useEffect(() => {
		const fetchAllList = async () => {
			const response = await fetch(`${process.env.REACT_APP_BACK}channel/`, {
				method: 'GET',
			})
			const data = await response.json();
			setChanList(data);
		}
		fetchAllList();
	}, [chanId]);

	return (
		<div>
			<header>All Channels <hr /></header>
			{chanList.map(chan => (
				<ul key={chan.name} >
					<div onClick={_ => navigate(`/Chat/channel/${chan.id}`)}>{chan.name}
						{
							chan.chanType == 1 &&
							<HiLockClosed style={{ float: 'right' }} />}
					</div>
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
			<HiPlus className="add-button" />
			<PopupCreateChannel trigger={buttonPopup} setTrigger={setButtonPopup} />
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

function ChannelMemberList(props: { id: any }) {
	const [currentChan, setCurrentChan] = useState<IChannel | undefined>(undefined)

	useEffect(() => {
		const getChannel = async () => {
			const response = await fetch(`${process.env.REACT_APP_BACK}channel/${props.id}`, {
				method: 'GET',
			})
			const data = await response.json();
			setCurrentChan(data);
		}
		getChannel();
	}, [props]);

	if (currentChan?.users === undefined) {
		return (
			<div className="title"> Members <hr />
			</div>
		)
	}

	return (
		<div className="title"> Members <hr />
			{currentChan?.users.map(user => (
				<div className="user-list" key={user.username}>
					<ul>
						{user.username}
					</ul>
				</div>
			))
			}
		</div>
	);
}

interface IMessage {
	chanid?: number;
	userid?: number;
	sender?: IUser;
	usertowho?: IUser;
	message: string;
}

function ChannelMessages(props: { id: any }) {
	const [newInput, setNewInput] = useState("");
	const [messageList, setMessageList] = useState<IMessage[]>([]);
	const [currentChan, setCurrentChan] = useState<IChannel | undefined>(undefined);
	const currentUser = useAppSelector(state => state.user);
	const [sender, setSender] = useState<IUser | undefined>(undefined);

	// const myUser = useAppSelector(state => state.user);

	useEffect(() => {
		const getChannel = async () => {
			const response = await fetch(`${process.env.REACT_APP_BACK}channel/${props.id}`, {
				method: 'GET',
			})
			const data = await response.json();
			setCurrentChan(data);
			setMessageList(messageList => []);
		}
		getChannel();
	}, [props]);

	const handleSubmitNewMessage = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (newInput != "")
			socket.emit('sendMessageChannel', { chanid: props.id, sender: currentUser.user, message: newInput });
		setNewInput("");
	}

	socket.on('sendMessageChannelOK', (messageDto) => {
		setMessageList([...messageList, messageDto]);
	})

	return (
		<div className="chat-body">
			<div className="title" style={{ marginLeft: "10px", marginRight: "10px" }}>
				{currentChan?.name}
				{
					currentChan?.chanType == 1 &&
					<HiLockClosed />}
				<hr />
			</div>
			<div className="chat-messages">
				{messageList.map(message => (
					<div key={message.message} className="__wrap">
						<div className="message-info">
							<img className="user-avatar" src={message.sender?.avatar} />
							{message.sender?.username}
							<span className="timestamp">0000/00/00  00:00</span>
						</div>
						{message.message}
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

function ChannelPage(props: { chanid: any }) {
	return (
		<div id="chat-container">
			<div className="left-sidebar">
				<ChannelList />
				<AddChannel />
			</div>
			<ChannelMessages id={props.chanid} />
			<div className="right-sidebar">
				<ChannelMemberList id={props.chanid} />
			</div>
		</div>
	);
}

export function Channels(props: any) {

	return (
		<div id="chat-container">
			<div className="left-sidebar">
				<ChannelList />
				<AddChannel />
			</div>
			<ChannelMessages id={props.chatId} />
			<div className="right-sidebar">
				<ChannelMemberList id={props.chatId} />
			</div>
		</div>
	);
}