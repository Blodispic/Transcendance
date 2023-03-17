import { useEffect, useState } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import { useDispatch } from "react-redux";
import { socket } from "../../App";
import { IChannel } from "../../interface/Channel";
import { IUser } from "../../interface/User";

export function CheckPassword(props: { trigger: boolean, setTrigger: Function, channel: IChannel, reload: Function }) {
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
			props.reload();
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
					<span className="channel-error">{errorMessage}</span>
				}
				<br />
				<button onClick={_ => handleJoinWithPass()}>Enter Channel</button>
			</div>
		</div>
	) : <></>;
}

export function JoinLeave(props: {currentUser: any, channel: IChannel, isJoined: boolean, reload: Function }) {
	const [passPopup, setPassPopup] = useState(false);
	
	const handleLeave = () => {
		socket.emit('leaveChannel', {chanid: props.channel.id});
	}
		
	const handleJoin = () => {
		socket.emit('joinChannel', {chanid: props.channel.id});
	}
	
	if (props.channel === undefined)
	{	
		return (<></>);
	}

	return (props.isJoined) ? (
		<>
			{
				props.channel.id !== undefined &&
				<div>
					<button onClick={e => {handleLeave(); props.reload()}}>Leave Channel</button>
				</div>
			}
		</>
	) : (
		<>
			{
				props.channel.id !== undefined &&
				<div>
				{
					props.channel.chanType === 0 &&
					<button style={{ float: 'right' }} onClick={e => {handleJoin(); props.reload()}}>Join Channel</button>
				}			
				{
					props.channel.chanType === 2 &&
					<>
					<button style={{ float: 'right' }} onClick={() => setPassPopup(true)}>Join Channel</button>
					<CheckPassword trigger={passPopup} setTrigger={setPassPopup} channel={props.channel} reload={props.reload} />
					</>
				}
			</div>
			}
		</>
	);
}
