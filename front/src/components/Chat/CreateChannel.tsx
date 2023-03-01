import { useEffect, useState } from "react";
import { HiOutlineXMark, HiPlus } from "react-icons/hi2";
import { socket } from "../../App";
import { IUser } from "../../interface/User";
import { useAppSelector } from "../../redux/Hook";
import AllPeople from "../utils/Allpeople";

export function PopupCreateChannel(props: any) {
	const [chanName, setChanName] = useState("");
	const [password, setPassword] = useState("");
	const [chanMode, setChanMode] = useState(0);
    const [friend, setFriend] = useState<IUser[] >([]);
	const [myVar, setMyvar] = useState<boolean> (false);

	const handlePublic = () => {
		setChanMode(0);
	}
	
	const handlePrivate = () => {
		setChanMode(1);
	}

	const handleProtected = () => {
		setChanMode(2);
	}

	useEffect( () => {
		console.log("icic la", [friend]);
	}, [friend] )

	const handleCreateNewChan = () => {
		console.log("friend", [friend]);
		if (chanName != "")
			socket.emit('createChannel', { chanName: chanName, chanType: chanMode, password: password, users: [friend] });
		setChanName("");
		setPassword("");
		setChanMode(0);
		props.setTrigger(false);
	}

	return (props.trigger) ? (
		<div className="chat-form-popup" onClick={_ => (props.setTrigger(false), setChanMode(0))}>
			<div className="chat-form-inner" onClick={e => e.stopPropagation()}>
				<HiOutlineXMark className="close-icon" onClick={_ => (props.setTrigger(false), setChanMode(0)) } /> <br />
				<h3>Channel Name</h3>
				<input type="text" id="channel-input" placeholder="Insert channel name" onChange={e => { setChanName(e.target.value) }} onSubmit={() => { handleCreateNewChan(); }} />
				<h3>Channel Mode</h3>
				<input type="radio" name="chanMode" value={0} onChange={_ => handlePublic()} defaultChecked />Public
				<input type="radio" name="chanMode" value={1} onChange={_ => handlePrivate()} />Private
				<input type="radio" name="chanMode" value={2} onChange={_ => handleProtected()} />Protected <br />
				{
					chanMode === 2 &&
					<><input type="password" id="channel-input" placeholder="Insert password" onChange={e => { setPassword(e.target.value); }} /><br /></>
				}
				{
					chanMode === 1 &&
					<div className="allpoeple">
					<AllPeople friend={friend} setFriend={setFriend} myVar={myVar} setMyvar={setMyvar}  />
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
