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
							props.channel.users.find(obj => obj.id == props.user?.id) &&
							<>
							{props.channel.admin.find(obj => obj.id == props.user?.id) &&
							<>
								<ImCog className="config-icon" onClick={() => setPopup(true)} />
								<ConfigureChannel trigger={popup} setTrigger={setPopup} channel={props.channel} />
							</>}
							</>
						}
					</>
				}
			</>
		}

	</div>
	);
}

// export function ChannelMessages(props: { channel: IChannel }) {
// 	const currentUser = useAppSelector(state => state.user);
// 	const [newInput, setNewInput] = useState("");
// 	const [messageList, setMessageList] = useState<IMessage[]>([]);

// 	const handleSubmitNewMessage = (e: React.FormEvent<HTMLFormElement>) => {
// 		e.preventDefault();
// 		if (newInput != "") {
// 			console.log("channel message sent");
			
// 			const sendTime = new Date().toLocaleString('en-US');
// 			socket.emit('sendMessageChannel', { chanid: props.channel?.id, message: newInput, sendtime: sendTime });
// 		}
// 		setNewInput("");
// 	}
	
// 	useEffect(() => {
// 		socket.on('sendMessageChannelOK', (messageDto) => {
// 			console.log("channel message received");
// 			setMessageList([...messageList, messageDto]);
// 		});

// 		return () => {
// 			socket.off('sendMessageChannelOK');
// 		}
// 	});
		
// 	return (
// 		<div className="chat-body">
// 			<ChannelHeader user={currentUser.user} channel={props.channel} />
// 			{props.channel.users?.find(obj => obj.id == currentUser.user?.id) !== undefined &&
// 				<>
// 					<div className="chat-messages">
// 						{
// 							<div className="reverse">
// 								{messageList && messageList.map(message => (
// 									message.chanid == props.channel.id &&
// 									<div key={message.sendtime + message.message} className="__wrap">
// 										<div className="message-info">
// 											<img className="user-avatar" src={`${process.env.REACT_APP_BACK}user/${message.sender?.id}/avatar`} />
// 											<p>{message.sender?.username}</p>
// 											<p className="timestamp">{message.sendtime}</p>
// 										</div>
// 										{message.message}
// 									</div>
// 								))}
// 							</div>
// 						}
// 					</div>
// 					<form id="input_form" onSubmit={(e) => { handleSubmitNewMessage(e); }}>
// 						<input type="text" onChange={(e) => { setNewInput(e.target.value) }}
// 							placeholder="type message here" value={newInput} />
// 					</form>
// 				</>

// 			}
// 		</div>
// 	);
// }

export function ChannelMessages(props: { chanId: any }) {
	const currentUser = useAppSelector(state => state.user);
	const [newInput, setNewInput] = useState<string>("");
	const [messageList, setMessageList] = useState<IMessage[]>([]);
	const [currentChan, setCurrentChan] = useState<IChannel>();

	useEffect(() => {
		const getChannel = async () => {
			const response = await fetch(`${process.env.REACT_APP_BACK}channel/${props.chanId}`, {
				method: 'GET',
			})
			const data = await response.json();
			setCurrentChan(data);
		}
		getChannel();
	}, [props.chanId]);

	console.log("chan message - current chan: ", currentChan?.name);

	const handleSubmitNewMessage = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (newInput != "") {
			console.log("channel message sent");
			
			const sendTime = new Date().toLocaleString('en-US');
			socket.emit('sendMessageChannel', { chanid: props.chanId, message: newInput, sendtime: sendTime });
		}
		setNewInput("");
	}
	
	useEffect(() => {
		socket.on('sendMessageChannelOK', (messageDto) => {
			console.log("channel message received");
			setMessageList([...messageList, messageDto]);
		});

		return () => {
			socket.off('sendMessageChannelOK');
		}
	});
		
	return (
		<div className="chat-body">
			{
				currentChan &&
				<ChannelHeader user={currentUser.user} channel={currentChan} />
			}
			{currentChan?.users.find(obj => obj.id == currentUser.user?.id) !== undefined &&
				<>
					<div className="chat-messages">
						{
							<div className="reverse">
								{messageList && messageList.map(message => (
									message.chanid == props.chanId &&
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
