import { useEffect, useState } from "react";
import { BsKeyFill } from "react-icons/bs";
import { HiLockClosed } from "react-icons/hi2";
import { ImCog } from "react-icons/im";
import { useParams } from "react-router-dom";
import { socket } from "../../App";
import { useAppSelector } from "../../redux/Hook";
import { ConfigureChannel } from "./AdminCommands";
import { JoinChannel, LeaveChannel } from "./JoinLeave";

export function ChannelHeader() {
	const [popup, setPopup] = useState(false);
	const currentUser = useAppSelector(state => state.user.user);
	const { id } = useParams();
	const [chanId, setChanId] = useState<number | undefined>(undefined);
	const currentChan = useAppSelector(state => state.chat.channels.find(chan => chan.id === chanId));

	useEffect(() => {
		if (id !== undefined) {
			setChanId(parseInt(id));
		}
	}, [id]);

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
				<JoinChannel channel={currentChan} />
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
									{currentChan.owner.id === currentUser?.id &&
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
	const { id } = useParams();
	const [chanId, setChanId] = useState<number | undefined>(undefined);
	const currentChan = useAppSelector(state =>
		state.chat.channels.find(chan => chan.id === chanId));
	const messages = useAppSelector(state => state.chat.chanMs.filter(obj => obj.chanid === chanId));

	useEffect(() => {
		if (id !== undefined) {
			setChanId(parseInt(id));
		}
	}, [id]);

	const handleSubmitNewMessage = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (newInput !== "") {
			socket.emit('sendMessageChannel', { chanid: currentChan?.id, message: newInput});
		}
		setNewInput("");
	}

	return (currentChan) ? (
		<>
			{currentChan.users?.find(obj => obj.id === currentUser.user?.id) !== undefined &&
				<>
					<div className="chat-messages">
						<div className="reverse">

							{messages && messages.map((message, index) => (
								<div key={index}>
									{(message.chanid === currentChan.id && message.sender !== undefined) &&
										<div className="__wrap">
											<div className="message-info">
												<img className="user-avatar" src={`${process.env.REACT_APP_BACK}user/${message.sender?.id}/avatar`} />
												<p>{message.sender?.username}</p>
												<p className="timestamp">{message.sendtime}</p>
											</div>
											{message.message}
										</div>
									}
									{(message.chanid === currentChan.id && message.sender === undefined) &&
										<div className="channel-announce">
											{message.message}
										</div>
									}
								</div>

							))
							}

						</div>
					</div>

					<form id="input_form" onSubmit={(e) => { handleSubmitNewMessage(e); }}>
						<input type="text" maxLength={1000} onChange={(e) => { setNewInput(e.target.value) }}
							placeholder="type message here" value={newInput} />
					</form>
				</>
			}
		</>
	) : <></>;
}
