import { useEffect, useState } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import { useDispatch } from "react-redux";
import { socket } from "../../App";
import { IChannel } from "../../interface/Channel";
import { IUser } from "../../interface/User";
import { useAppSelector } from "../../redux/Hook";

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
	const currentChan = useAppSelector(state => state.channel);
	const dispatch = useDispatch();

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
			{/* { //private channel: needs improvement // we cant join a private chanels no need this { }
				props.channel.chanType === 1 &&
				<button onClick={handleJoin}>Join</button>
			} */}
			{
				props.channel.chanType === 2 &&
				<>
				<button onClick={() => setPassPopup(true)}>Join Channel</button>
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
			<button onClick={handleLeave}>Leave Channel</button>
		</div>
	);
}

export function JoinLeave(props: {currentUser: any, channel: IChannel}) {
	const [buttonText, setButtonText] = useState("Join");
	// const [isOnChan, setIsOnChannel] = useState(false);
	
	// const handleClick = () => {
	// 	setIsOnChannel(!isOnChan);
	// }
	// return (
	// 	<button onClick={handleClick}>{isOnChan ? "Leave" : "Join"}</button>
	// );

	return (
		<>
			{
				props.channel.id !== undefined &&
				<>
					{
						props.channel?.users.find(elem => elem.id == props.currentUser.id) &&
						<LeaveChannel currentUser={props.currentUser} chanid={props.channel.id} />
					}
					{
						props.channel?.users.find(elem => elem.id == props.currentUser.id) === undefined &&
						<JoinChannel currentUser={props.currentUser} channel={props.channel} />
					}
				</>
			}

		</>
	);
}

