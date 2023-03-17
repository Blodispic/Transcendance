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

// export function ChannelHeader(props: { user: any, channel: IChannel}) {
export function ChannelHeader(props: { user: any, channel: IChannel, reload: Function}) {
	const [popup, setPopup] = useState(false);
	let isJoined: boolean = false;

	if (props.channel.users?.find(obj => obj.id === props.user?.id))
	{
		isJoined = true;
	}

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
			<>
			<JoinLeave currentUser={props.user} channel={props.channel} isJoined={isJoined} reload={props.reload} />
			{/* <JoinChannel channel={props.channel} />
			<LeaveChannel channel={props.channel} /> */}
			</>	
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
							{props.channel.owner.id === props.user?.id&&
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

export function ChannelMessages(props: { chan: IChannel }) {
	const currentUser = useAppSelector(state => state.user);
	const [newInput, setNewInput] = useState<string>("");
	const [messageList, setMessageList] = useState<IMessage[]>([]);

	const handleSubmitNewMessage = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (newInput != "") {			
			const sendTime = new Date().toLocaleString('en-US');
			socket.emit('sendMessageChannel', { chanid: props.chan.id, message: newInput, sendtime: sendTime });
		}
		setNewInput("");
	}
	
	useEffect(() => {
		socket.on('sendMessageChannelOK', (messageDto) => {
			setMessageList([...messageList, messageDto]);
		});

		return () => {
			socket.off('sendMessageChannelOK');
		}
	});
		
	return (
		<>
			{props.chan.users?.find(obj => obj.id == currentUser.user?.id) !== undefined &&
				<>
					<div className="chat-messages">
						{
							<div className="reverse">
								{messageList && messageList.map(message => (
									message.chanid == props.chan.id &&
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
		</>
	);
}
