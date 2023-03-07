import { useEffect, useState } from "react";
import { BsKeyFill } from "react-icons/bs";
import { HiLockClosed } from "react-icons/hi2";
import { ImCog } from "react-icons/im";
import { socket } from "../../App";
import { IChannel } from "../../interface/Channel";
import { IMessage } from "../../interface/Message";
import { IUser } from "../../interface/User";
import { useAppSelector } from "../../redux/Hook";
import { ConfigureChannel } from "./AdminCommands";
import { JoinLeave } from "./JoinLeave";

function ChannelHeader(props: { user: any, channel: IChannel}) {
	const [popup, setPopup] = useState(false);

	return (
		<div className="body-header" >
		{props.channel.name}
		{
			props.channel?.chanType == 1 &&
			<HiLockClosed />
		}
		{
			props.channel?.chanType == 2 &&
			<BsKeyFill />
		}
		{
			props.channel !== undefined &&
			<JoinLeave currentUser={props.user} channel={props.channel} />
		}
		{
			props.channel?.id &&
			<>
				{
					props.channel?.chanType !== 1 &&
					<>
						{
							props.channel.admin.find(obj => obj.id == props.user?.id) &&
							<>
								<ImCog className="config-icon" onClick={() => setPopup(true)} />
								<ConfigureChannel trigger={popup} setTrigger={setPopup} channel={props.channel} />
							</>
						}
					</>
				}
			</>
		}

	</div>
	);
}

export function ChannelMessages(props: { channel: IChannel }) {
	const currentUser = useAppSelector(state => state.user);
	const [newInput, setNewInput] = useState("");
	const [messageList, setMessageList] = useState<IMessage[]>([]);
	const [announce, setAnnounce] = useState<string[]>([]);

	const handleSubmitNewMessage = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (newInput != "") {
			const sendTime = new Date().toLocaleString('en-US');
			socket.emit('sendMessageChannel', { chanid: props.channel.id, sender: currentUser.user, message: newInput, sendtime: sendTime });
		}
		setNewInput("");
	}
	
	useEffect(() => {
		socket.on('sendMessageChannelOK', (messageDto) => {
			console.log("message ok");
			setMessageList([...messageList, messageDto]);
		});

		return () => {
			socket.off('sendMessageChannelOK');
		}
	});
		
	return (
		<div className="chat-body">
			<ChannelHeader user={currentUser.user} channel={props.channel} />
			{props.channel.users?.find(obj => obj.id == currentUser.user?.id) !== undefined &&
				<>
					<div className="chat-messages">
						{
							<div className="reverse">
								{messageList && messageList.map(message => (
									message.chanid == props.channel.id &&
									<div key={message.sendtime + message.message} className="__wrap">
										<div className="message-info">
											<img className="user-avatar" src={`${process.env.REACT_APP_BACK}user/${message.sender?.id}/avatar`} />
											<p>{message.sender?.username}</p>
											<p className="timestamp">{message.sendtime}</p>
										</div>
										{message.message}
									</div>
								))}
							</div>
						}
					</div>
					<form id="input_form" onSubmit={(e) => { handleSubmitNewMessage(e); }}>
						<input type="text" onChange={(e) => { setNewInput(e.target.value) }}
							placeholder="type message here" value={newInput} />
					</form>
				</>

			}
		</div>
	);
}


//// MANU VERSION ////
/*
export function ChannelMessages(props: { id: any }) {
	const [newInput, setNewInput] = useState("");
	const [messageList, setMessageList] = useState<IMessage[]>([]);
	const [currentChan, setCurrentChan] = useState<IChannel | undefined>(undefined);
	const currentUser = useAppSelector(state => state.user);
	const [popup, setPopup] = useState(false);
	const [reload, setReload] = useState<boolean>(false);

	const sleep =  () => new Promise(r => setTimeout(r, 2000));
	useEffect(() => {
		const getChannel = async () => {
			const response = await fetch(`${process.env.REACT_APP_BACK}channel/${props.id}`, {
				method: 'GET',
			})
			const data = await response.json();
			if (currentChan?.id !== props.id) {
				setCurrentChan(data);
				setMessageList(messageList => []);
			}
		}
		if (props.id)
			getChannel();
		}, [props]);
		
	useEffect(() => {
		socket.on('leaveChannelOK', (chanid) => {
			console.log("leavechanles");
			setReload(true);
		})
		socket.on('joinChannelOK', (chanid) => {
			console.log("join chanels");
			setReload(true);
		})
		socket.on('sendMessageChannelOK', (messageDto) => {
			setMessageList([...messageList, messageDto]);
		})
		setReload(false);
		return () => {
			socket.off('leaveChannelOK');
			socket.off('joinChannelOK');
			socket.off('sendMessageChannelOK');
		}
	}, [reload]);

	const handleSubmitNewMessage = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (newInput != "") {
			const sendTime = new Date().toLocaleString();
			socket.emit('sendMessageChannel', { chanid: currentChan?.id, sender: currentUser.user, message: newInput, sendtime: sendTime });
		}
		setNewInput("");
	}

	return (
		<div className="chat-body">
			<div className="body-header" >
				{currentChan?.name}
				{
					currentChan?.chanType == 1 &&
					<HiLockClosed />
				}
				{
					currentChan?.chanType == 2 &&
					<BsKeyFill />
				}
				{
					currentChan !== undefined &&
					<JoinLeave currentUser={currentUser.user} channel={currentChan} />
				}
				{
					currentChan?.id &&
					<>
						{
							currentChan.chanType !== 1 &&
							<>
								<ImCog className="config-icon" onClick={() => setPopup(true)} />
								<ConfigureChannel trigger={popup} setTrigger={setPopup} channel={currentChan} />
							</>
						}
					</>
				}
			</div>
			<div className="chat-messages">
				<div className="reverse">
					{messageList && messageList.map(message => (
						message.chanid == currentChan?.id &&
						<div key={message.message} className="__wrap">
							<div className="message-info">
								<img className="user-avatar" src={`${process.env.REACT_APP_BACK}user/${message.sender?.id}/avatar`}/>
								<p>{message.sender?.username}</p>
								<p className="timestamp">{message.sendtime}</p>
							</div>
							{message.message}
						</div>
					))}
				</div>
			</div>
			{
				currentChan !== undefined &&
				<>
					{
						currentChan?.users.find(elem => elem.id == currentUser.user?.id) !== undefined &&
						<form id="input_form" onSubmit={(e) => { handleSubmitNewMessage(e); }}>
							<input type="text" onChange={(e) => { setNewInput(e.target.value) }}
								placeholder="type message here" value={newInput} />
						</form>
					}
				</>

			}
		</div>
	);
}
*/