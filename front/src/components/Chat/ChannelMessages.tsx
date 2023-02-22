import { useEffect, useState } from "react";
import { HiLockClosed } from "react-icons/hi2";
import { ImCog } from "react-icons/im";
import { socket } from "../../App";
import { IChannel } from "../../interface/Channel";
import { IMessage } from "../../interface/Message";
import { useAppSelector } from "../../redux/Hook";
import { JoinChannel, LeaveChannel } from "./ChannelUtils";

function ChannelHeader(props: { chan: any, user: any }) {
	const [isOnChan, setIsOnChan] = useState(false);

	return (
		<div className="body-header" >
			{props.chan.name}
			{
				props.chan !== undefined &&
				<ImCog style={{ float: 'right' }} />
			}
			{
				props.chan.chanType == 1 &&
				<HiLockClosed />}
			{
				isOnChan === false &&
				<JoinChannel currentUser={props.user.user} chan={props.chan.id} />
			}
			{/* {
			isOnChan === true &&
			<span><LeaveChannel currentUser={currentUser.user} chanid={currentChan?.id} /></span>
		} */}
		</div>
	);
}



export function ChannelMessages(props: { id: any }) {
	const [newInput, setNewInput] = useState("");
	const [messageList, setMessageList] = useState<IMessage[]>([]);
	const [currentChan, setCurrentChan] = useState<IChannel | undefined>(undefined);
	const currentUser = useAppSelector(state => state.user);
	const [isOnChan, setIsOnChan] = useState(false);
	const [announce, setAnnounce] = useState("");

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

	socket.on('muteUserOK', (userId, chanId) => {
		setAnnounce("")
	});


	// if (currentChan?.users !== undefined && currentChan?.users.find(value => currentUser.user)) {
	// 	console.log('--test--');
	// 	setIsOnChan(true);
	// }

	return (
		<div className="chat-body">
			{/* {
				currentChan !== undefined && currentUser.user !== undefined &&
			<ChannelTitle user={currentUser.user} channel={currentChan} /> */}

			<div className="body-header" >
				{currentChan?.name}
				{
					currentChan?.id &&
					<ImCog style={{ float: 'right' }} />
				}
				{
					currentChan?.chanType == 1 &&
					<HiLockClosed />}
				{
					// isOnChan === false &&
					currentChan !== undefined &&
					<JoinChannel currentUser={currentUser.user} chan={currentChan} />
				}
				{
					// isOnChan === true &&
					<LeaveChannel currentUser={currentUser.user} chanid={currentChan?.id} />
				}
				{/* <ChannelHeader chan={currentChan} user={currentUser?.user} /> */}
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
			</div>
			);
}