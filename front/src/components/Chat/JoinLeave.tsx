import { useEffect, useState } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import { useDispatch } from "react-redux";
import { socket } from "../../App";
import { IChannel } from "../../interface/Channel";
import { IUser } from "../../interface/User";
import { useAppSelector } from "../../redux/Hook";

export function CheckPassword(props: { trigger: boolean, setTrigger: Function, channel: IChannel }) {
	const [password, setPassword] = useState("");
	const [failed, setFailed] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [inputValue, setInputValue] = useState("");

	const handleJoinWithPass = () => {
		socket.emit('joinChannel', { chanid: props.channel.id, channame: props.channel.name, password: password });
		setPassword("");
		setInputValue("");
	}

	useEffect(() => {
		socket.on("joinChannelFailed", (error_message) => {
			setErrorMessage(error_message);
			setFailed(true);
		});
		socket.on("joinChannel", (new_chanid) => {
			setFailed(false);
			props.setTrigger(false);
		});

		return () => {
			socket.off("joinChannelFailed");
			socket.off("joinChannel");
		}
	});

	return (props.trigger) ? (
		<div className="chat-form-popup" onClick={_ => (props.setTrigger(false), setFailed(false))}>
			<div className="chat-form-inner" onClick={e => e.stopPropagation()}>

				<HiOutlineXMark className="close-icon" onClick={_ => (props.setTrigger(false), setFailed(false))} /> <br />
				<h3>Input password for " {props.channel.name} "</h3>
				<input type="password" id="channel-input" placeholder="Input password" value={password} onChange={e => { setPassword(e.target.value); }} /><br />
				{
					failed === true &&
					<a className="channel-error">{errorMessage}</a>
				}
				<br />
				<button onClick={_ => handleJoinWithPass()}>Enter Channel</button>
			</div>
		</div>
	) : <></>;
}

export function JoinChannel(props: {channel: IChannel }) {
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
				<button onClick={handleJoin}>Join Channel</button>
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

export function LeaveChannel (props: {channel: IChannel}) {
	
	const handleLeave = () => {
		socket.emit('leaveChannel', {chanid: props.channel.id});
	}

	if (props.channel.id === undefined)
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
	// const [isOnChan, setIsOnChannel] = useState(props.onChan);

	// if (props.channel?.users.find(elem => elem.id == props.currentUser.id))
	// 	setIsOnChannel(true);
	
	// const handleClick = () => {
	// 	setIsOnChannel(!isOnChan);
	// }

	// return (
	// 	<div onClick={handleClick}>{isOnChan ? <LeaveChannel chanid={props.channel.id} /> :  <JoinChannel channel={props.channel} />}</div>
	// );

	return (
		<>
			{
				props.channel.id !== undefined &&
				<>
					{
						props.channel?.users.find(elem => elem.id == props.currentUser.id) &&
						<LeaveChannel channel={props.channel} />
					}
					{
						props.channel?.users.find(elem => elem.id == props.currentUser.id) === undefined &&
						<JoinChannel channel={props.channel} />
					}
				</>
			}

		</>
	);

}


// MANU VERSION //
// export function JoinLeave(props: {currentUser: any, channel: IChannel}) {
// 	const [buttonText, setButtonText] = useState("Join");
// 	// const [isOnChan, setIsOnChannel] = useState(false);
	
// 	// const handleClick = () => {
// 	// 	setIsOnChannel(!isOnChan);
// 	// }
// 	// return (
// 	// 	<button onClick={handleClick}>{isOnChan ? "Leave" : "Join"}</button>
// 	// );

// 	return (
// 		<>
// 			{
// 				props.channel.id !== undefined &&
// 				<>
// 					{
// 						props.channel?.users.find(elem => elem.id == props.currentUser.id) &&
// 						<LeaveChannel currentUser={props.currentUser} chanid={props.channel.id} />
// 					}
// 					{
// 						props.channel?.users.find(elem => elem.id == props.currentUser.id) === undefined &&
// 						<JoinChannel currentUser={props.currentUser} channel={props.channel} />
// 					}
// 				</>
// 			}

// 		</>
// 	);
// }


