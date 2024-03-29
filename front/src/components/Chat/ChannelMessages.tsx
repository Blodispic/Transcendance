import * as React from 'react';
import { useEffect, useState } from "react";
import { BsKeyFill } from "react-icons/bs";
import { HiLockClosed } from "react-icons/hi2";
import { ImCog } from "react-icons/im";
import { useParams } from "react-router-dom";
import { socket } from "../../App";
import { IChannel } from '../../interface/Channel';
import { IMessage } from '../../interface/Message';
import { IUser } from '../../interface/User';
import { addMessage } from '../../redux/chat';
import { useAppDispatch, useAppSelector } from "../../redux/Hook";
import { ConfigureChannel, ConfigureChannelPrivate } from "./AdminCommands";
import { JoinChannel, LeaveChannel } from "./JoinLeave";

export function ChannelHeader() {
	const [popup, setPopup] = useState(false);
	const currentUser: IUser | undefined = useAppSelector(state => state.user.user);
	const { id } = useParams();
	const [chanId, setChanId] = useState<number | undefined>(undefined);
	const currentChan: IChannel | undefined = useAppSelector(state => state.chat.channels.find(chan => chan.id === chanId));

	useEffect(() => {
		if (id !== undefined) {
			setChanId(parseInt(id));
		}
	}, [id]);

	return (currentChan) ? (
		<div className="body-header" >
			{currentChan.name}
			{currentChan.chanType === 1 && <HiLockClosed className='channel-icon' />}
			{currentChan.chanType === 2 && <BsKeyFill className='channel-icon' />}
			{currentChan.users?.find(obj => obj.id === currentUser?.id) === undefined &&
				<JoinChannel channel={currentChan} />}
			{currentChan.users?.find(obj => obj.id === currentUser?.id) &&
				<LeaveChannel channel={currentChan} />}
			{currentChan.id !== undefined &&
				<>
					{currentChan.chanType !== 1 &&
						<>
							{(currentChan.users?.find(obj => obj.id === currentUser?.id) && currentChan.owner?.id === currentUser?.id) &&
								<>
									<ImCog className="config-icon" onClick={() => setPopup(true)} />
									<ConfigureChannel trigger={popup} setTrigger={setPopup} channel={currentChan} />
								</>
							}
						</>
					}
					{currentChan.chanType === 1 &&
						<>
							{(currentChan.users.find(obj => obj.id === currentUser?.id) && currentChan.owner?.id === currentUser?.id) &&
								<>
									<ImCog className="config-icon" onClick={() => setPopup(true)} />
									<ConfigureChannelPrivate trigger={popup} setTrigger={setPopup} channel={currentChan} />
								</>
							}
						</>
					}
				</>
			}
		</div>
	) : <></>;
}

function MessageBubble(props: { message: IMessage, blocked: boolean }) {

	return (props.blocked) ? (
		< div className="__wrap message_block">
			<div className="message-info "  >
				<img className="user-avatar" src={`${process.env.REACT_APP_BACK}user/${props.message.sender?.id}/avatar`} alt="" />
				<p>{props.message.sender?.username}</p>
				<p className="timestamp">{props.message.sendtime}</p>
			</div>
			<p className="text"> message from blocked user </p>
		</div>
	) : (
		<div className="__wrap">
			<div className="message-info">
				<img className="user-avatar" src={`${process.env.REACT_APP_BACK}user/${props.message.sender?.id}/avatar`} alt="" />
				<p>{props.message.sender?.username}</p>
				<p className="timestamp">{props.message.sendtime}</p>
			</div>
			{props.message.message}
		</div>
	);
}

export function ChannelMessages() {
	const currentUser = useAppSelector(state => state.user);
	const [newInput, setNewInput] = useState<string>("");
	const { id } = useParams();
	const [chanId, setChanId] = useState<number | undefined>(undefined);
	const currentChan: IChannel | undefined = useAppSelector(state =>
		state.chat.channels.find(chan => chan.id === chanId));
	const dispatch = useAppDispatch();
	const messages: IMessage[] = useAppSelector(state => state.chat.chanMs.filter(obj => obj.chanid === chanId));

	useEffect(() => {
		if (id !== undefined) {
			setChanId(parseInt(id));
		}
	}, [id]);

	useEffect(() => {
		socket.on("sendMessageChannelFailed", (errorMessage) => {
			const newMessage: IMessage = {
				chanid: currentChan?.id,
				message: errorMessage, 
			  }
			  dispatch(addMessage(newMessage));
		});
		return () => {
			socket.off("sendMessageChannelFailed");
		}})

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
										<>
											{currentUser.user?.blocked?.find(user => user.id === message.sender?.id) === undefined &&
												<MessageBubble message={message} blocked={false} />}
											{currentUser.user?.blocked?.find(user => user.id === message.sender?.id) !== undefined &&
												<MessageBubble message={message} blocked={true} />}
										</>
									}
									{(message.chanid === currentChan.id && message.sender === undefined) &&
										<div className="channel-announce"> {message.message} </div> }
								</div>
							))}
						</div>
					</div>

					<form onSubmit={(e) => { handleSubmitNewMessage(e); }}>
						<input type="text" maxLength={1000} onChange={(e) => { setNewInput(e.target.value) }}
							placeholder="type message here" value={newInput} />
					</form>
				</>
			}
		</>
	) : <></>;
}
