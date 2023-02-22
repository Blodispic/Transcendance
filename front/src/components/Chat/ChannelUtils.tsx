import { useState } from "react";
import { HiOutlineXMark, HiPlus } from "react-icons/hi2";
import { socket } from "../../App";
import { IChannel } from "../../interface/Channel";
import { IUser } from "../../interface/User";

export function JoinChannel(props: {currentUser: any, chan: IChannel}) {
	const [passPopup, setPassPopup] = useState(false);
	
	if (props.chan === undefined)
	{	
		return (<></>);
	}
	
	if (props.chan.chanType === 2) {
		return (
			<>
			<CheckPassword trigger={passPopup} setTrigger={setPassPopup} channel={props.chan} />
			</>
		)
	}

	const handleJoin = () => {
		socket.emit('joinChannel', {chanid: props.chan.id});
	}

	return (
		<div>
			<button onClick={handleJoin}>Join</button>
		</div>
	);
}

export function LeaveChannel (props: {currentUser: any, chanid: any}) {
	
	const handleLeave = () => {
		socket.emit('leaveChannel', {chanid: props.chanid});
	}

	if (props.chanid === undefined)
	{
		return (<></>);
	}

	return (
		<div>
			<button onClick={handleLeave}>Leave</button>
		</div>
	);
}

export function BanUser(chanid: any, userid: any) {
	console.log('ban');
	socket.emit('BanUser', {chanid: chanid, userid: userid});
}

export function MuteUser(chanid: any, userid: any) {
	console.log('mute');
	socket.emit('MuteUser', {chanid: chanid, userid: userid});
	// socket.on('muteUserOK', (userId, chanId) => {});
}

export function ConfigurePassword(props: {trigger: boolean; setTrigger: Function; channel: IChannel; user: IUser}) {
	const [newPassword, setNewPassword] = useState("");


	return (
		<div className="chat-form-popup" onClick={_ => props.setTrigger(false)}>
			<div className="chat-form-inner" onClick={e => e.stopPropagation()}>
				<HiOutlineXMark className="close-icon" onClick={_ => props.setTrigger(false)} /> <br />
				<h3>Password Test</h3>
				{ //public chan
					props.channel.chanType === 0 &&
					<><input type="password" id="channel-input" placeholder="Insert password" onChange={e => { setNewPassword(e.target.value); }} /><br /></>
				}
			</div>
		</div>
	);
}

export function CheckPassword(props: {trigger: boolean; setTrigger: Function; channel: IChannel}) {
	const [password, setPassword] = useState("");
	
	return (
		<div className="chat-form-popup" onClick={_ => props.setTrigger(false)}>
			<div className="chat-form-inner" onClick={e => e.stopPropagation()}>

			<HiOutlineXMark className="close-icon" onClick={_ => props.setTrigger(false)} /> <br />
			<h3>Input password for " {props.channel.name} "</h3>
			<input type="password" id="channel-input" placeholder="Insert password" onChange={e => { setPassword(e.target.value); }} /><br />
		
			<button>Enter Channel</button>
			</div>
		</div>
	);
}