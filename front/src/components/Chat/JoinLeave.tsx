import { useState } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import { socket } from "../../App";
import { IChannel } from "../../interface/Channel";

export function CheckPassword(props: {trigger: boolean, setTrigger: Function, channel: IChannel}) {
	const [password, setPassword] = useState("");

	const handleJoinWithPass = () => {
		socket.emit('joinChannel', {chanid: props.channel.id, channame: props.channel.name, password: password})
		setPassword("");
		props.setTrigger(false);
	}

	return (props.trigger) ? (
		<div className="chat-form-popup" onClick={_ => props.setTrigger(false)}>
			<div className="chat-form-inner" onClick={e => e.stopPropagation()}>

			<HiOutlineXMark className="close-icon" onClick={_ => props.setTrigger(false)} /> <br />
			<h3>Input password for " {props.channel.name} "</h3>
			<input type="password" id="channel-input" placeholder="Insert password" onChange={e => { setPassword(e.target.value); }} /><br />
		
			<button onClick={handleJoinWithPass}>Enter Channel</button>
			</div>
		</div>
	) : <></>;
}

export function JoinChannel(props: {currentUser: any, channel: IChannel }) {

	const [passPopup, setPassPopup] = useState(false);

	if (props.channel === undefined)
	{	
		return (<></>);
	}

	const handleJoin = () => {
		socket.emit('joinChannel', {chanid: props.channel.id});
	}

	return (
		<div>
			{
				props.channel.chanType === 0 &&
				<button onClick={handleJoin}>Join</button>
			}
			{
				props.channel.chanType === 1 &&
				<button onClick={handleJoin}>Join</button>
			}
			{
				props.channel.chanType === 2 &&
				<>
				<button onClick={() => setPassPopup(true)}>Join</button>
				<CheckPassword trigger={passPopup} setTrigger={setPassPopup} channel={props.channel} />
				</>
			}
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

