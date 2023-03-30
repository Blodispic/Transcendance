import * as React from 'react';
import { useEffect, useState } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import swal from "sweetalert";
import { socket } from "../../App";
import { IChannel } from "../../interface/Channel";
import { IUser } from "../../interface/User";
import { removeChanMessage, removeMember, joinChannel } from "../../redux/chat";
import { useAppDispatch, useAppSelector } from "../../redux/Hook";

export function CheckPassword(props: { trigger: boolean, setTrigger: (value: boolean) => void, channel: IChannel }) {
	const [password, setPassword] = useState<string>("");
	const [failed, setFailed] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string>("");
	const [, setInputValue] = useState<string>("");

	const handleJoinWithPass = () => {
		socket.emit('joinChannel', { chanid: props.channel.id, password: password });
		setPassword("");
		setInputValue("");
	}

	useEffect(() => {
		socket.on("joinChannelFailed", (error_message) => {
			setErrorMessage(error_message);
			setFailed(true);
		});
		socket.on('exception', () => {
			swal("Format Error", "Your input is not valid for this request", "error");
		  });

		return () => {
			socket.off("joinChannelFailed");
			socket.off('exception');
		}
	});

	return (props.trigger) ? (
		<div className="chat-form-popup" onClick={() => {props.setTrigger(false); setFailed(false)}}>
			<div className="chat-form-inner" onClick={e => e.stopPropagation()}>

				<HiOutlineXMark className="close-icon" onClick={() => {props.setTrigger(false); setFailed(false)}} /> <br />
				<h3>Input password for &quot; {props.channel.name} &quot;</h3>
				<input type="password" id="channel-input" placeholder="Input password" value={password} onChange={e => { setPassword(e.target.value); }} /><br />
				{
					failed === true &&
					<span className="channel-error">{errorMessage}</span>
				}
				<br />
				<button onClick={() => handleJoinWithPass()}>Enter Channel</button>
			</div>
		</div>
	) : <></>;
}

export function JoinChannel(props: { channel: IChannel }) {
	const [passPopup, setPassPopup] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const dispatch = useAppDispatch();
	const currentUser: IUser | undefined = useAppSelector(state => state.user.user);

	const handleJoin = () => {
		socket.emit('joinChannel', { chanid: props.channel.id });
	}

	useEffect(() => {
		socket.on("joinChannelFailed", (error_message) => {
			setErrorMessage(error_message);
			swal("Error", errorMessage, "error");
		});
		socket.on("joinChannelOK", (chanId) => {
			if (currentUser !== undefined) {
				const fetchChanInfo = async () => {
					await fetch(`${process.env.REACT_APP_BACK}channel/${chanId}`, {
						method: 'GET',
					}).then(async response => {
						const data = await response.json();

						if (response.ok) {
							dispatch(joinChannel({ chanid: chanId, chan: data, user: currentUser }));
						}
					})
				}
				fetchChanInfo();
				setPassPopup(false);
				swal("You joined [ " + props.channel.name + " ] ", " ");
				setTimeout(() => {
					if (swal && swal.close)
					  swal.close()
				  }, 1000);
			}
		});
		socket.on('exception', () => {
			swal("Format Error", "Your input is not valid for this request", "error");
		  });

		return () => {
			socket.off("joinChannelFailed");
			socket.off("joinChannelOK");
			socket.off('exception');
		}
	});

	return (props.channel) ? (
		<>
			{
				props.channel.id !== undefined &&
				<div>
					{
						props.channel.chanType === 0 &&
						<button onClick={() => { handleJoin() }}>Join Channel</button>
					}
					{
						props.channel.chanType === 2 &&
						<>
							<button onClick={() => setPassPopup(true)}>Join Channel</button>
							<CheckPassword trigger={passPopup} setTrigger={setPassPopup} channel={props.channel} />
						</>
					}
				</div>
			}
		</>
	) : <></>;
}

export function LeaveChannel(props: { channel: IChannel }) {
	const dispatch = useAppDispatch();
	const currentUser: IUser | undefined = useAppSelector(state => state.user.user);

	const handleLeave = () => {
		socket.emit('leaveChannel', { chanid: props.channel.id });
	}
	useEffect(() => {
		socket.on("leaveChannelOK", (chanId) => {
			if (currentUser !== undefined) {
				dispatch(removeMember({ chanid: chanId, userid: currentUser.id }));
				dispatch(removeChanMessage(chanId));
				swal("You left [ " + props.channel.name + " ] ", " ");
				setTimeout(() => {
					if (swal && swal.close)
					  swal.close()
				  }, 1000);
			}
		})
		socket.on("leaveChannelFailed", (err_message) => {
			if (currentUser !== undefined) {
				swal(err_message, "error");
				setTimeout(() => {
					if (swal && swal.close)
					  swal.close()
				  }, 1000);
			}
		})
		socket.on('exception', () => {
			swal("Format Error", "Your input is not valid for this request", "error");
		  });

		return () => {
			socket.off("leaveChannelOK");
			socket.off("leaveChannelFailed");
			socket.off('exception');
		}
	});

	return (props.channel) ? (
		<>
			{
				props.channel.id !== undefined &&
				<div>
					<button onClick={() => { handleLeave() }}>Leave Channel</button>
				</div>
			}
		</>
	) : <></>;
}
