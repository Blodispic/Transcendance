import * as React from 'react';
import { useEffect, useState } from "react";
import { HiOutlineXMark, HiPlus } from "react-icons/hi2";
import { socket } from "../../App";
import { IUser } from "../../interface/User";
import { addChannel } from "../../redux/chat";
import { useAppDispatch } from "../../redux/Hook";
import AllPeople from "../utils/Allpeople";

export function PopupCreateChannel(props: { trigger: boolean, setTrigger: (value: boolean) => void }) {
	const [chanName, setChanName] = useState("");
	const [password, setPassword] = useState("");
	const [chanMode, setChanMode] = useState(0);
    const [friend, setFriend] = useState<IUser[] >([]);
	const [error, setError] = useState<string>("");
	// const [myVar, setMyvar] = useState<boolean> (false);
	const [failed, setFailed] = useState<boolean> (false);
	// const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const handlePublic = () => {
		setChanMode(0);
	}

	const handlePrivate = () => {
		setChanMode(1);
	}

	const handleProtected = () => {
		setChanMode(2);
	}

	const handleCreateNewChan = () => {
		if (chanName !== "") {
			if (password && password.length)
				socket.emit('createChannel', { chanName: chanName, password: password, chanType: chanMode, users: friend });
			else
				socket.emit('createChannel', { chanName: chanName, chanType: chanMode, users: friend });
		}
		setChanName("");
		setPassword("");
	}
	
	useEffect(() => {
		socket.on("createChannelFailed", (error_message) => {
			setFailed(true);
			setError(error_message);
		});
		socket.on("createChannelOk", (new_chanid) => {
			const fetchChanInfo = async () => {
				const response = await fetch(`${process.env.REACT_APP_BACK}channel/${new_chanid}`, {
					method: 'GET',
				})
				const data = await response.json();
				dispatch(addChannel(data));
			}
			fetchChanInfo();
			setFailed(false);
			props.setTrigger(false);
			setChanMode(0);
			// navigate(`/Chat/channel/${new_chanid}`)
		});

		return () => {
			socket.off("createChannelFailed");
			socket.off("createChannelOk");
		}
	});

	return (props.trigger) ? (
		<div className="chat-form-popup" onClick={() => {props.setTrigger(false); setChanMode(0); setFailed(false)}} >
			<div className="chat-form-inner" onClick={e => e.stopPropagation()}>
				<HiOutlineXMark className="close-icon" onClick={() => {props.setTrigger(false); setChanMode(0); setFailed(false)}} /> <br />
				<h3>Channel Name</h3>
				<input type="text" id="channel-input" placeholder="Insert channel name"  maxLength={15} onChange={e => { setChanName(e.target.value) }} onSubmit={() => { handleCreateNewChan(); }} />
				<br />
				{
					failed === true &&
					<span className="channel-error">{error}</span>
				}

				<h3>Channel Mode</h3>
				<input type="radio" name="chanMode" value={0} onChange={() => handlePublic()} defaultChecked />Public
				<input type="radio" name="chanMode" value={1} onChange={() => handlePrivate()} />Private
				<input type="radio" name="chanMode" value={2} onChange={() => handleProtected()} />Protected <br />
				{
					chanMode === 2 &&
					<><input type="password" id="channel-input" placeholder="Insert password" onChange={e => { setPassword(e.target.value); }} /><br /></>
				}
				{
					chanMode === 1 &&
					<div className="allpoeple">
					<AllPeople friend={undefined} setFriend={setFriend}  />
					</div>
				}
				<button onClick={() => handleCreateNewChan()}>Create Channel</button><span></span>
			</div>
		</div>
	) : <></>;
}

export function AddChannel() {
	const [buttonPopup, setButtonPopup] = useState(false);

	return (
		<div className="add-icon" onClick={() => setButtonPopup(true)}>
			<HiPlus className="add-button" />
			<PopupCreateChannel trigger={buttonPopup} setTrigger={setButtonPopup} />
		</div>
	);
}
