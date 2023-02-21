import { useEffect, useState } from "react";
import { HiLockClosed, HiOutlineXMark, HiPlus } from "react-icons/hi2";
import { useNavigate, useParams } from "react-router-dom";
import { socket } from "../../App";
import { IChannel } from "../../interface/Channel";
import { IUser } from "../../interface/User";
import { useAppSelector } from "../../redux/Hook";
import CLickableMenu from "./clickableMenu";

function PopupCreateChannel(props: any) {
	const [chanName, setChanName] = useState("");
	const [password, setPassword] = useState("");
	const [chanMode, setChanMode] = useState(0);

	const handlePublic = () => {
		setChanMode(0);
	}
	
	const handlePrivate = () => {
		setChanMode(1);
	}

	const handleProtected = () => {
		setChanMode(2);
	}

	const handleCreateNewChan = () => {
		if (chanName != "")
			socket.emit('createChannel', { chanName: chanName, chanType: chanMode, password: password });
		setChanName("");
		setPassword("");
		setChanMode(0);
		props.setTrigger(false);
	}

	return (props.trigger) ? (
		<div className="chat-form-popup" onClick={_ => props.setTrigger(false)}>
			<div className="chat-form-inner" onClick={e => e.stopPropagation()}>
				<HiOutlineXMark className="close-icon" onClick={_ => props.setTrigger(false)} /> <br />
				<h3>Channel Name</h3>
				<input type="text" id="channel-input" placeholder="Insert channel name" maxLength={15} onChange={e => { setChanName(e.target.value) }} onSubmit={() => { handleCreateNewChan(); }} />
				<h3>Channel Mode</h3>
				<input type="radio" name="chanMode" value={0} onChange={handlePublic} defaultChecked />Public
				<input type="radio" name="chanMode" value={1} onChange={handlePrivate} />Private
				<input type="radio" name="chanMode" value={2} onChange={handleProtected} />Protected <br />
				{
					chanMode === 2 &&
					<><input type="password" id="channel-input" placeholder="Insert password" onChange={e => { setPassword(e.target.value); }} /><br /></>
				}
				<button onClick={() => handleCreateNewChan()}>Create Channel</button><span></span>
			</div>
		</div>
	) : <></>;
}
function JoinChannel(props: {currentUser: any, chanid: any}) {

	const handleJoin = () => {
		socket.emit('joinChannel', {chanid: props.chanid});
	}

	if (props.chanid === undefined)
	{	
		return (<></>);
	}

	return (
		<div>
			<button onClick={handleJoin}>Join</button>
		</div>
	);
}

function LeaveChannel (props: {currentUser: any, chanid: any}) {
	
	const handleLeave = () => {
		socket.emit('leaveChannel', {chanid: props.chanid});
	}

	if (props.chanid === undefined)
	{
		return (<></>);
	}

	return (
		<div>
			<button onClick={handleLeave}>Leave</button>
		</div>
	);
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
		<div className="bottom">
			<header>All Public Channels <hr /></header>
			{chanList.map(chan => (
				<ul key={chan.name}>
					<li>
						<div onClick={_ => navigate(`/Chat/channel/${chan.id}`)}>{chan.name}
							{
								chan.chanType == 1 &&
								<HiLockClosed style={{ float: 'right' }} />
							}
						</div>
					</li>
				</ul>
			))}
		</div>
	);
}

function JoinedChannelList() {

	return (
		<div className="title"> Joined Channels <hr />

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
	

	// useEffect(() => {
	// 	const fetchAllList = async () => {
	// 		const response = await fetch(`${process.env.REACT_APP_BACK}channel/public`, {
	// 			method: 'GET',
	// 		})
	// 		const data = await response.json();
	// 		setChanList(data);
	// 	}
	// 	fetchAllList();
	// }, [chanId]);

	return (
		<div className="title">Public Channels <hr />
			<ul>
				<li>
				<p>test</p>
				</li>
			</ul>
		</div>
	);
}

function ChannelMemberList(props: { id: any }) {
	const [currentChan, setCurrentChan] = useState<IChannel | undefined>(undefined)
	const [currentId, setCurrentId] = useState<number | undefined>(undefined);

	const changeId = (id: number) => {
		if (id == currentId)
			setCurrentId(undefined);
		else
			setCurrentId(id);
	}

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
				<div className="user-list">

					<ul key={user.username} onClick={e => { changeId(user.id) }}>
						<li>
							{user.username}
						</li>
					</ul>
					{
						 currentId == user.id && 
									<CLickableMenu user={user}/>
					}
				</div>
			))
			}
		</div>
	);
}

export interface IMessage {
	chanid?: number;
	userid?: number;
	sender?: IUser;
	usertowho?: IUser;
	message: string;
}

function ChannelTitle(props: {user: IUser, channel: IChannel}) {
	
	const [isOnChannel, setIsOnChannel] = useState(false);

	if (props.channel.users.find(element => props.user)) {
		setIsOnChannel(true);
	}
		
	return (
			<div className="title" style={{ marginLeft: "10px", marginRight: "10px" }}>
			{props.channel?.name}
			{
				props.channel.chanType == 1 &&
				<HiLockClosed />}
			{
				isOnChannel === false && 
				<span><JoinChannel currentUser={props.user} chanid={props.channel.id} /></span>
			}
			{
				isOnChannel === true && 
				<span><LeaveChannel currentUser={props.user} chanid={props.channel.id} /></span>
			}
			<hr />
		</div>
	);
}


function ChannelMessages(props: { id: any }) {
	const [newInput, setNewInput] = useState("");
	const [messageList, setMessageList] = useState<IMessage[]>([]);
	const [currentChan, setCurrentChan] = useState<IChannel | undefined>(undefined);
	const currentUser = useAppSelector(state => state.user);
	const [isOnChan, setIsOnChan] = useState(false);

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

	// if (currentChan?.users !== undefined && currentChan?.users.find(currentUser.user)) {
	// 	setIsOnChan(true);
	// }

	return (
		<div className="chat-body">
			{/* {
				currentChan !== undefined && currentUser.user !== undefined &&
			<ChannelTitle user={currentUser.user} channel={currentChan} />
			} */}
						<div className="title" style={{ marginLeft: "10px", marginRight: "10px" }}>
			{currentChan?.name}
			{
				currentChan?.chanType == 1 &&
				<HiLockClosed />}
			{
				isOnChan === false && 
				<span><JoinChannel currentUser={currentUser.user} chanid={currentChan?.id} /></span>
			}
			{
				isOnChan === true && 
				<span><LeaveChannel currentUser={currentUser.user} chanid={currentChan?.id} /></span>
			}
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
			{
				props.id !== undefined && 
				<form id="input_form" onSubmit={(e) => { handleSubmitNewMessage(e); }}>
					<input type="text" onChange={(e) => { setNewInput(e.target.value) }}
						placeholder="type message here" value={newInput} />
				</form>
			}
		</div>
	);
}

export function Channels(props: any) {

	const currentUser = useAppSelector(state => state.user);

	return (
		<div id="chat-container">
			<div className="sidebar left-sidebar">
				<JoinedChannelList />
				<AddChannel />
				<ChannelList />
			</div>
			<ChannelMessages id={props.chatId} />
			<div className="sidebar right-sidebar">
				<ChannelMemberList id={props.chatId} />
			</div>

		</div>
	);
}