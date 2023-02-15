import { useEffect, useState } from "react";
import { HiOutlineXMark, HiPlus } from "react-icons/hi2";
import { useNavigate, useParams } from "react-router-dom";
import { Tab, TabList, Tabs } from "react-tabs";
import { socket } from "../../App";
import { IChannel } from "../../interface/Channel";
import { useAppSelector } from "../../redux/Hook";

function CreateChannelPopup(props: any) {
	const [chanName, setChanName] = useState("");
	const [password, setPassword] = useState("");
	const [privateChan, setPrivateChan] = useState(false);

	const handleCreateNewChan = () => {
		if (chanName != "")
			socket.emit('createChannel', {chanName: chanName, chanType: 0, password: "test"});
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
					<div onClick={_ => navigate(`/Chat/channel/${chan.id}`)}>{chan.name}</div>
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

function ChannelMemberList(props: {id: any}) {
	const [currentChan, setCurrentChan] = useState<IChannel | undefined>(undefined)

	useEffect(() => {
		const getChannel = async () => {
			const response = await fetch(`${process.env.REACT_APP_BACK}channel/${props}`, {
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
					<ul key={user.username}>
						{user.username}
					</ul>
				</div>
			))
			}
		</div>
	);
}

function ChannelMessages(props: {id: any}) {
	const [newInput, setNewInput] = useState("");
	const [messageList, setMessageList] = useState<string[]>([]);
	const [currentChan, setCurrentChan] = useState<IChannel | undefined>(undefined)
	const currentUser = useAppSelector(state => state.user);

	const myUser = useAppSelector(state => state.user);

	useEffect(() => {
		const getChannel = async () => {
			const response = await fetch(`${process.env.REACT_APP_BACK}channel/channel/${props}`, {
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
			socket.emit('sendMessageChannel', { chanid: props, userid: currentUser.user?.id, message: newInput });
		setNewInput("");
	}

	socket.on('sendMessageChannelOK', (message: string) => {
		setMessageList([...messageList, message]);
	})

	return (
		<div className="chat-body">
			<div className="title" style={{ marginLeft: "10px", marginRight: "10px" }}>
				{currentChan?.name} <hr />
			</div>
			<div className="chat-messages">
				{messageList.map(message => (
					<div key={message} className="__wrap">
						<div className="message-info">
							<img className="user-avatar" src={`${process.env.REACT_APP_BACK}user/${currentUser.user?.id}/avatar`} />
							{currentUser.user?.username}
						</div>
						{message}
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

export function Channels() {
	const navigate = useNavigate();
	const { id } = useParams();


	return (
		<div id="chat-container">
			<Tabs className="chat-tab">
				<TabList>
					<Tab onClick={_ => navigate(`/Chat/channel`)} >Channels</Tab>
					<Tab onClick={_ => navigate(`/Chat/dm`)}>DM</Tab>
				</TabList>
			</Tabs>
			<div className="left-sidebar">
				<ChannelList />
				<AddChannel />
			</div>
			{	
				id && 
					<ChannelMessages id={id} />
				// <div className="right-sidebar">
					// <ChannelMemberList id={id} />
				// </div>
			}
		</div>
	);
}