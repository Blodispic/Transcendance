import * as React from 'react';
import { useEffect, useState } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import { socket } from "../../App";
import { IChannel } from "../../interface/Channel";
import { IUser } from "../../interface/User";
import AllPeople from "../utils/Allpeople";
import { useAppDispatch } from "../../redux/Hook";

export function BanUser(props: { chanid: any, userid: any, trigger: boolean, setTrigger: (value: boolean) => void }) {
	const [timeout, setTimeout] = useState<string>("");
	const [failed, setFailed] = useState<boolean>(false);
	const [errorMessage, setError] = useState<string>("");

	const handleBan = () => {
		if (timeout === "")
			socket.emit('BanUser', { chanid: props.chanid, userid: props.userid });
		else
			socket.emit('BanUser', { chanid: props.chanid, userid: props.userid, timeout: parseInt(timeout) * 1000 });
	}
	
	useEffect(() => {
		socket.on("banUserFailed", (errorMessage) => {
			setFailed(true);
			setError(errorMessage);
		});
		socket.on("banUserOK", ({chanid, userid}) => {
			props.setTrigger(false);
			setFailed(false);
		});
		return () => {
			socket.off("banUserFailed");
			socket.off("banUserOK");
		}
	})

	return (props.trigger) ? (
		<div className="chat-form-popup" onClick={() => (props.setTrigger(false))}>
			<div className="clickable-pop-up-inner" onClick={e => e.stopPropagation()}>
				<HiOutlineXMark className="close-icon" onClick={() => (props.setTrigger(false))} />
				<br />
				<h3>Ban User</h3>
				<h4>Set time (optional)</h4>
				<input type="number" id="clickable-input" min="0" onChange={e => { setTimeout(e.target.value) }} />seconds
				<br /><br />
				{
					failed === true &&
					<span className="channel-error"> {errorMessage}</span>
				}
				<button onClick={() => handleBan()}>Ban User</button>
			</div>
		</div>
	) : <></>;
}

export function MuteUser(props: { chanid: any, userid: any, trigger: boolean, setTrigger: (value: boolean) => void }) {
	const [timeout, setTimeout] = useState<string>("");
	const [failed, setFailed] = useState<boolean>(false);
	const [errorMessage, setError] = useState<string>("");

	const handleMute = () => {
		if (timeout === "")
			socket.emit('MuteUser', { chanid: props.chanid, userid: props.userid });
		else
			socket.emit('MuteUser', { chanid: props.chanid, userid: props.userid, timeout: parseInt(timeout) * 1000 });
	}


	useEffect(() => {
		socket.on("muteUserFailed", (errorMessage) => {
			setFailed(true);
			setError(errorMessage);
		});
		socket.on("muteUserOK", ({chanid, userid}) => {
			props.setTrigger(false);
			setFailed(false);
		});
		return () => {
			socket.off("muteUserFailed");
			socket.off("muteUserOK");
		}
	})

	return (props.trigger) ? (
		<div className="chat-form-popup" onClick={() => (props.setTrigger(false))}>
			<div className="clickable-pop-up-inner" onClick={e => e.stopPropagation()}>
				<HiOutlineXMark className="close-icon" onClick={() => (props.setTrigger(false))} />
				<br />
				<h3>Mute User</h3>
				<h4>Set time (optional)</h4>
				<input type="number" id="clickable-input" min="0" onChange={e => { setTimeout(e.target.value) }} />seconds
				<br /><br />
				{
					failed === true &&
					<span className="channel-error"> {errorMessage}</span>
				}
				<button onClick={_ => handleMute()}>Mute User</button>
			</div>
		</div>
	) : <></>;
}

export function KickUser(chanid: any, userid: any) {
	socket.emit('BanUser', { chanid: chanid, userid: userid, timeout: 1 });
}

export function ConfigureChannelPrivate(props: {trigger: boolean, setTrigger: (value: boolean) => void, channel: IChannel}) {
    const [friend, setFriend] = useState<IUser[] >(props.channel.users);
	
	const AddPeoplePrivate = () => {
		if (friend.length > 0)
			socket.emit('AddPeoplePrivate', { chanId: props.channel.id, users: friend });
	}
	
	useEffect(() => {
		socket.on("AddPeoplePrivateOk", (error_message) => {
		});
		return () => {
			socket.off("AddPeoplePrivateOk");
		}
	});

	return (props.trigger) ? (
		<div className="chat-form-popup" onClick={_ => props.setTrigger(false)}>
			<div className="chat-form-inner" onClick={e => e.stopPropagation()}>
				<HiOutlineXMark className="close-icon" onClick={_ => props.setTrigger(false)} /> <br />
				{
					
					<div className="allpoeple">
					<AllPeople friend={friend} setFriend={setFriend} />
					</div>
				}
				<button onClick={() => {AddPeoplePrivate(); props.setTrigger(false)}}> Save Setting </button>
			</div>
		</div>
	) : <></>;
}

export function ConfigureChannel(props: {trigger: boolean, setTrigger: (value: boolean) => void, channel: IChannel}) {
	const [newPassword, setNewPassword] = useState("");

	const setPassword = () => {
		if (props.channel.chanType === 0 && newPassword !== undefined) {
			socket.emit('addPassword', { chanid: props.channel.id, password: newPassword });
		}
		else if (props.channel.chanType === 2) {
			socket.emit('changePassword', { chanid: props.channel.id, password: newPassword });
		}
		props.setTrigger(false);
	}

	const removePassword = () => {
		socket.emit('rmPassword', { chanid: props.channel.id, pass: "" });
		props.setTrigger(false);
	}

	return (props.trigger) ? (
		<div className="chat-form-popup" onClick={() => props.setTrigger(false)}>
			<div className="chat-form-inner" onClick={e => e.stopPropagation()}>
				<HiOutlineXMark className="close-icon" onClick={() => props.setTrigger(false)} /> <br />
				{
					props.channel.chanType === 0 &&
					<>
						<h3>Set Password</h3>
						<input type="password" id="channel-input" placeholder="Insert password" onChange={e => { setNewPassword(e.target.value); }} /><br />
					</>
				}
				{
					props.channel.chanType === 2 &&
					<>
						<h3> Remove Password </h3>
						<button style={{ background: '#B33A3A' }} onClick={removePassword}> Remove Password </button>
						<h3>Change Password</h3>
						<input type="password" id="channel-input" placeholder="Insert new password" onChange={e => { setNewPassword(e.target.value); }} /><br />
					</>
				}
				<button onClick={setPassword}> Save Setting </button>
			</div>
		</div>
	) : <></>;
}
