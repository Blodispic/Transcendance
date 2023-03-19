import { useEffect, useState } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import swal from "sweetalert";
import { socket } from "../../App";
import { IChannel } from "../../interface/Channel";
import { addMember, removeMember } from "../../redux/chat";
import { useAppDispatch, useAppSelector } from "../../redux/Hook";

export function CheckPassword(props: { trigger: boolean, setTrigger: Function, channel: IChannel, reload: Function}) {
	const [password, setPassword] = useState("");
	const [failed, setFailed] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [inputValue, setInputValue] = useState("");
	const currentUser = useAppSelector(state => state.user.user);
	const dispatch = useAppDispatch();

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
		socket.on("joinChannelOK", (chanId) => {
			if (currentUser !== undefined) {
				dispatch(addMember({id:chanId, user:currentUser}));
				setFailed(false);
				props.reload();
				props.setTrigger(false);
			}
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

export function JoinChannel(props: {channel: IChannel, reload: Function}) {
	const [passPopup, setPassPopup] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const dispatch = useAppDispatch();
	const currentUser = useAppSelector(state => state.user.user);

	const handleJoin = () => {
		socket.emit('joinChannel', {chanid: props.channel.id});
	}
	
	useEffect(() => {
		socket.on("joinChannelFailed", (error_message) => {
			setErrorMessage(error_message);
			swal(errorMessage, "error");
		});
		socket.on("joinChannelOK", (chanId) => {
			if (currentUser !== undefined) {
				dispatch(addMember({id:chanId, user:currentUser}));
				props.reload();
				swal("You joined " + props.channel.name, "success");
			}
		});

		return () => {
			socket.off("joinChannelFailed");
			socket.off("joinChannel");
		}
	});

	return (props.channel) ? (
		<>
			{
				props.channel.id !== undefined &&
				<div>
				{
					props.channel.chanType === 0 &&
					<button style={{ float: 'right' }} onClick={e => {handleJoin()}}>Join Channel</button>
				}			
				{
					props.channel.chanType === 2 &&
					<>
					<button style={{ float: 'right' }} onClick={() => setPassPopup(true)}>Join Channel</button>
					<CheckPassword trigger={passPopup} setTrigger={setPassPopup} channel={props.channel} reload={props.reload}/>
					</>
				}
			</div>
			}
		</>
	) : <></>;
}

export function LeaveChannel(props: {channel: IChannel, reload: Function}) {
	const dispatch = useAppDispatch();
	const currentUser = useAppSelector(state => state.user.user);

	const handleLeave = () => {
		socket.emit('leaveChannel', {chanid: props.channel.id});
	}
	useEffect(() => {
		socket.on("leaveChannelOK", (chanId) => {
			if (currentUser !== undefined) {
				dispatch(removeMember({id:chanId, user:currentUser}));
				props.reload();
				swal("You left " + props.channel.name, "success");
			}
		})

		return () => {
			socket.off("leaveChannelOK");
		}
	});

	return (props.channel) ? (
		<>
			{
				props.channel.id !== undefined &&
				<div>
					<button onClick={e => {handleLeave()}}>Leave Channel</button>
				</div>
			}
		</>
	) : <></>;
}

// export function JoinLeave(props: {channel: IChannel, isJoined: boolean }) {
// 	const [passPopup, setPassPopup] = useState(false);
// 	const [errorMessage, setErrorMessage] = useState("");
// 	const dispatch = useAppDispatch();
// 	const currentUser = useAppSelector(state => state.user.user);

// 	const handleLeave = () => {
// 		socket.emit('leaveChannel', {chanid: props.channel.id});
// 	}
		
// 	const handleJoin = () => {
// 		socket.emit('joinChannel', {chanid: props.channel.id});
// 	}
	
	// useEffect(() => {
	// 	socket.on("joinChannelFailed", (error_message) => {
	// 		setErrorMessage(error_message);
	// 		swal(errorMessage, "error");
	// 	});
	// 	socket.on("joinChannelOK", (chanId) => {
	// 		dispatch(addMember({chanId, currentUser}));
	// 		swal("You joined " + props.channel.name, "success");
	// 	});
	// 	socket.on("leaveChannelOK", (chanId) => {
	// 		dispatch(removeMember({chanId, currentUser}));
	// 		swal("You left " + props.channel.name, "success");
	// 	})

	// 	return () => {
	// 		socket.off("joinChannelFailed");
	// 		socket.off("joinChannel");
	// 		socket.off("leaveChannelOK");
	// 	}
	// });

// 	if (props.channel === undefined)
// 	{	
// 		return (<></>);
// 	}
	
// 	return (props.isJoined) ? (
// 		<>
// 			{
// 				props.channel.id !== undefined &&
// 				<div>
// 					<button onClick={e => {handleLeave()}}>Leave Channel</button>
// 				</div>
// 			}
// 		</>
// 	) : (
// 		<>
// 			{
// 				props.channel.id !== undefined &&
// 				<div>
// 				{
// 					props.channel.chanType === 0 &&
// 					<button style={{ float: 'right' }} onClick={e => {handleJoin()}}>Join Channel</button>
// 				}			
// 				{
// 					props.channel.chanType === 2 &&
// 					<>
// 					<button style={{ float: 'right' }} onClick={() => setPassPopup(true)}>Join Channel</button>
// 					<CheckPassword trigger={passPopup} setTrigger={setPassPopup} channel={props.channel} />
// 					</>
// 				}
// 			</div>
// 			}
// 		</>
// 	);
// }
