import { useEffect, useState } from "react";
import { BsKeyFill } from "react-icons/bs";
import { HiLockClosed } from "react-icons/hi2";
import { ImCog } from "react-icons/im";
import { useParams } from "react-router-dom";
import { socket } from "../../App";
import { addMessage } from "../../redux/chat";
import { useAppDispatch, useAppSelector } from "../../redux/Hook";
import { ConfigureChannel } from "./AdminCommands";
import { JoinChannel, JoinLeave, LeaveChannel } from "./JoinLeave";

export function ChannelHeader() {
	const [popup, setPopup] = useState(false);
	const currentUser = useAppSelector(state => state.user.user);
	const { id } = useParams();
	const [chanId, setChanId] = useState<number | undefined>(undefined);

	useEffect(() => {
		if (id !== undefined) {
			setChanId(parseInt(id));
		}
	}, [id]);

	const currentChan = useAppSelector(state => 
		state.chat.channels.find(chan => chan.id === chanId));
	
	console.log("currentHeader: ", currentChan?.users);

	return (currentChan) ? (
		<div className="body-header" >
		{currentChan.name}
		{
			currentChan.chanType === 1 &&
			<HiLockClosed />
		}
		{
			currentChan.chanType === 2 &&
			<BsKeyFill />
		}
		{
			currentChan.users?.find(obj => obj.id === currentUser?.id) === undefined &&
			<JoinChannel channel={currentChan}/>
		}
		{
			currentChan.users?.find(obj => obj.id === currentUser?.id) &&
			<LeaveChannel channel={currentChan} />
		}
		{
			currentChan.id &&
			<>
				{
					currentChan.chanType !== 1 &&
					<>
						{
							currentChan.users?.find(obj => obj.id === currentUser?.id) &&
							<>
							{currentChan.owner.id === currentUser?.id&&
							<>
								<ImCog className="config-icon" onClick={_ => setPopup(true)} />
								<ConfigureChannel trigger={popup} setTrigger={setPopup} channel={currentChan} />
							</>}
							</>
						}
					</>
				}
			</>
		}
	</div>
	) : <></>;
}

export function ChannelMessages() {
	const currentUser = useAppSelector(state => state.user);
	const [newInput, setNewInput] = useState<string>("");
	// const currentChan = useAppSelector(state => state.chat.channels.find(chan => chan.id === props.chanId));
	const dispatch = useAppDispatch();
	// const [chanId, setChanId] = useState(props.chanId);

	const { id } = useParams();
	const [chanId, setChanId] = useState<number | undefined>(undefined);

	useEffect(() => {
		if (id !== undefined) {
			setChanId(parseInt(id));
		}
	}, [id]);

	console.log("ChanMessage: ", id, " | number: ", chanId);
	const currentChan = useAppSelector(state => 
		state.chat.channels.find(chan => chan.id === chanId));

	const handleSubmitNewMessage = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (newInput !== "") {			
			const sendTime = new Date().toLocaleString('en-US');
			socket.emit('sendMessageChannel', { chanid: currentChan?.id, message: newInput, sendtime: sendTime });
		}
		setNewInput("");
	}
	
	useEffect(() => {
		socket.on('sendMessageChannelOK', (messageDto) => {
			console.log(messageDto);
			dispatch(addMessage({id:chanId, message:messageDto}));
			// setMessageList([...messageList, messageDto]);
		});

		return () => {
			socket.off('sendMessageChannelOK');
		}
	});
		
	return (currentChan) ? (
		<>
			{currentChan.users?.find(obj => obj.id === currentUser.user?.id) !== undefined &&
				<>
					<div className="chat-messages">
						{
							<div className="reverse">
								{currentChan.messages && currentChan.messages.map(message => (
									message.chanid === currentChan.id &&
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
	) : <></>;
}
