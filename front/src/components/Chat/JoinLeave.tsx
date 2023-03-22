import { useEffect, useState } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import { useDispatch } from "react-redux";
import { socket } from "../../App";
import { IChannel } from "../../interface/Channel";
import { IUser } from "../../interface/User";

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
				<button style={{ float: 'right' }} onClick={_ => handleJoin()}>Join Channel</button>
			}			
			{
				props.channel.chanType === 2 &&
				<>
				<button style={{ float: 'right' }} onClick={() => setPassPopup(true)}>Join Channel</button>
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
			<button onClick={_ => handleLeave()}>Leave Channel</button>
		</div>
	);
}

export function JoinLeave(props: {currentUser: any, channel: IChannel}) {

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
