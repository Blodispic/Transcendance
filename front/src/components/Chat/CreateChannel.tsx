import { useEffect, useState } from "react";
import { HiOutlineXMark, HiPlus } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { socket } from "../../App";
import { IUser } from "../../interface/User";
import { addChannel } from "../../redux/chat";
import { useAppDispatch } from "../../redux/Hook";
import AllPeople from "../utils/Allpeople";

export function PopupCreateChannel(props: {trigger: boolean, setTrigger: Function}) {
	const [chanName, setChanName] = useState("");
	const [password, setPassword] = useState("");
	const [chanMode, setChanMode] = useState(0);
    const [friend, setFriend] = useState<IUser[] >([]);
	const [myVar, setMyvar] = useState<boolean> (false);
	const [failed, setFailed] = useState<boolean> (false);
	const navigate = useNavigate();
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

	// useEffect( () => {
	// }, [friend] )

	const handleCreateNewChan = () => {
		if (chanName !== "")
			socket.emit('createChannel', { chanName: chanName, password: password, chanType: chanMode, users: friend });
		setChanName("");
		setPassword("");
		setChanMode(0);
	}

	useEffect(() => {
		socket.on("createChannelFailed", (error_message) => {
			setFailed(true);
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
			// navigate(`/Chat/channel/${new_chanid}`)
		});

		return () => {
			socket.off("createChannelFailed");
			socket.off("createChannelOk");
		}
	});

	return (props.trigger) ? (
		<div className="chat-form-popup" onClick={_ => (props.setTrigger(false), setChanMode(0), setFailed(false)) } >
			<div className="chat-form-inner" onClick={e => e.stopPropagation()}>
				<HiOutlineXMark className="close-icon" onClick={_ => (props.setTrigger(false), setChanMode(0), setFailed(false)) } /> <br />
				<h3>Channel Name</h3>
				<input type="text" id="channel-input" placeholder="Insert channel name" onChange={e => { setChanName(e.target.value) }} onSubmit={() => { handleCreateNewChan(); }} />
				<br />
				{
					failed === true &&
					<span className="channel-error">Channel name already exists</span>
				}
				
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
					<AllPeople friend={undefined} setFriend={setFriend} myVar={myVar} setMyvar={setMyvar}  />
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
