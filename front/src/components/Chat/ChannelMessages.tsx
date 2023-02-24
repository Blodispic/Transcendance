import { useEffect, useState } from "react";
import { BsKeyFill } from "react-icons/bs";
import { HiLockClosed } from "react-icons/hi2";
import { ImCog } from "react-icons/im";
import { socket } from "../../App";
import { IChannel } from "../../interface/Channel";
import { IMessage } from "../../interface/Message";
import { useAppSelector } from "../../redux/Hook";
import { ConfigurePass } from "./AdminCommands";
import { JoinChannel, LeaveChannel } from "./JoinLeave";

export function ChannelMessages(props: { id: any }) {
	const [newInput, setNewInput] = useState("");
	const [messageList, setMessageList] = useState<IMessage[]>([]);
	const [currentChan, setCurrentChan] = useState<IChannel | undefined>(undefined);
	const currentUser = useAppSelector(state => state.user);
	const [popup, setPopup] = useState(false);
	const [isOnChannel, setIsOnChannel] = useState(false);
	let date: string;

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
			socket.emit('sendMessageChannel', { chanid: currentChan?.id, sender: currentUser.user, message: newInput });
		setNewInput("");
	}

	socket.on('sendMessageChannelOK', (messageDto) => {
		setMessageList([...messageList, messageDto]);
	})
	date = new Date().toLocaleString();

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
					<>
						<JoinChannel currentUser={currentUser.user} channel={currentChan} />

						<LeaveChannel currentUser={currentUser.user} chanid={currentChan?.id} />
					</>
				}
				{/* <ChannelHeader chan={currentChan} user={currentUser?.user} /> */}
				<div className="chat-messages">
					{messageList.map(message => (
						message.chanid == currentChan?.id && 
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
					currentChan?.id &&
					<>
						{
							currentChan.chanType !== 1 &&
							<>
								<ImCog style={{ float: 'right' }} onClick={() => setPopup(true)} />
								<ConfigurePass trigger={popup} setTrigger={setPopup} channel={currentChan} />
							</>
						}
					</>
				}
				{/* <ChannelHeader chan={currentChan} user={currentUser?.user} /> */}
			</div>
			<div className="chat-messages">
				<div className="reverse">
				{messageList && messageList.map(message => (
					message.chanid == currentChan?.id &&
					<div key={message.message} className="__wrap">
						<div className="message-info">
							<img className="user-avatar" src={message.sender?.avatar} />
							<p>{message.sender?.username}</p>
							<p className="timestamp">{date}</p>
						</div>
						{message.message}
					</div>
				))}
			</div>
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