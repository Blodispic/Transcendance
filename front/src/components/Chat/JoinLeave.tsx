import { useEffect, useState } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import swal from "sweetalert";
import { socket } from "../../App";
import { IChannel } from "../../interface/Channel";
import { addMember, removeMember, updateMember } from "../../redux/chat";
import { useAppDispatch, useAppSelector } from "../../redux/Hook";

export function CheckPassword(props: { trigger: boolean, setTrigger: Function, channel: IChannel}) {
	const [password, setPassword] = useState("");
	const [failed, setFailed] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [inputValue, setInputValue] = useState("");
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

		return () => {
			socket.off("joinChannelFailed");
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

export function JoinChannel(props: {channel: IChannel}) {
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
				const fetchChanInfo = async () => {
					const response = await fetch(`${process.env.REACT_APP_BACK}channel/${chanId}`, {
						method: 'GET',
					})
					const data = await response.json();
					dispatch(updateMember({id: chanId, chan: data}));
					dispatch(addMember({id:chanId, user:currentUser}));
				}
				fetchChanInfo();
				setPassPopup(false);
				swal("You joined " + props.channel.name, "success");
			}
		});

		return () => {
			socket.off("joinChannelFailed");
			socket.off("joinChannelOK");
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
					<CheckPassword trigger={passPopup} setTrigger={setPassPopup} channel={props.channel} />
					</>
				}
			</div>
			}
		</>
	) : <></>;
}

export function LeaveChannel(props: {channel: IChannel}) {
	const dispatch = useAppDispatch();
	const currentUser = useAppSelector(state => state.user.user);

	const handleLeave = () => {
		socket.emit('leaveChannel', {chanid: props.channel.id});
	}
	useEffect(() => {
		socket.on("leaveChannelOK", (chanId) => {
			if (currentUser !== undefined) {
				dispatch(removeMember({id:chanId, user:currentUser}));
				swal("You left " + props.channel.name, "success");
			}
		})
		socket.on("leaveChannelFailed", (err_message) => {
			if (currentUser !== undefined) {
				swal(err_message, "error");
			}
		})

		return () => {
			socket.off("leaveChannelOK");
			socket.off("leaveChannelFailed");
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
