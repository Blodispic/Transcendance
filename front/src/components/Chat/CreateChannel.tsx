import * as React from 'react';
import { useEffect, useState } from "react";
import { HiOutlineXMark, HiPlus } from "react-icons/hi2";
import { useNavigate } from 'react-router-dom';
import { socket } from "../../App";
import { IUser } from "../../interface/User";
import { addChannel } from "../../redux/chat";
import { useAppDispatch, useAppSelector } from "../../redux/Hook";
import AllPeople from "../utils/Allpeople";

export function PopupCreateChannel(props: { trigger: boolean, setTrigger: (value: boolean) => void }) {
	const [chanName, setChanName] = useState("");
	const [password, setPassword] = useState("");
	const [chanMode, setChanMode] = useState(0);
	const [friend, setFriend] = useState<IUser[]>([]);
	const [error, setError] = useState<string>("");
	const [failed, setFailed] = useState<boolean>(false);
	const currentUser: IUser | undefined = useAppSelector(state => state.user.user);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

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
				socket.emit('createChannel', { chanName: chanName.trim(), password: password, chanType: chanMode, usersId: friend.map( user => user.id) });
			else
				socket.emit('createChannel', { chanName: chanName.trim(), chanType: chanMode, usersId: friend.map( user => user.id) });
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
				await fetch(`${process.env.REACT_APP_BACK}channel/${new_chanid}`, {
					method: 'GET',
				}).then(async response => {
					const data = await response.json();
					
					if (response.ok) {
						dispatch(addChannel(data));
						if (data.owner.id === currentUser?.id)
							navigate(`/Chat/channel/${new_chanid}`);
					}
				})
					
			}
			fetchChanInfo();
			setFailed(false);
			props.setTrigger(false);
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
				<div className='channel-input'>
				<input type="text" placeholder="Insert channel name"  maxLength={15} onChange={e => { setChanName(e.target.value) }} onSubmit={() => { handleCreateNewChan(); }} />
				</div>
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
					<div className='channel-input'>
					<input type="password" placeholder="Insert password" onChange={e => { setPassword(e.target.value); }} /><br />
					</div>
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
