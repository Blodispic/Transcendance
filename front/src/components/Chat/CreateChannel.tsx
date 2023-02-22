import { useEffect, useState } from "react";
import { HiOutlineXMark, HiPlus } from "react-icons/hi2";
import { socket } from "../../App";
import { IUser } from "../../interface/User";
import { useAppSelector } from "../../redux/Hook";

function InviteToChannel( props: {friend: IUser | undefined} ) {
    const [inpage, setInpage] = useState<boolean>(false);
    const [alluser, setAlluser] = useState<IUser[] | undefined>(undefined);
    const [friend, setFriend] = useState<IUser| undefined>(props.friend);
	const myUser = useAppSelector(state => state.user);

	useEffect(() => {

        if ( window.location.href.search('Game') == -1 ) {
            setInpage(true);
        }

          const get_all = async () => {
            const response = await fetch(`${process.env.REACT_APP_BACK}user`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
            })
            const data = await response.json();
            console.log("data? ", data);
            setAlluser(data.filter((User: { status: string; }) => User.status === "Online"));
            setAlluser(data.filter((User: { username: string; }) => User.username !== myUser.user?.username ));
        }
        if (props.friend === undefined)
            get_all();
        else
            setFriend(props.friend);

        console.log("les gens log ", alluser);
    }, [props]);

}


export function PopupCreateChannel(props: any) {
	const [chanName, setChanName] = useState("");
	const [password, setPassword] = useState("");
	const [chanMode, setChanMode] = useState(0);

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
		if (chanName != "")
			socket.emit('createChannel', { chanName: chanName, chanType: chanMode, password: password });
		setChanName("");
		setPassword("");
		setChanMode(0);
		props.setTrigger(false);
	}

	return (props.trigger) ? (
		<div className="chat-form-popup" onClick={_ => props.setTrigger(false)}>
			<div className="chat-form-inner" onClick={e => e.stopPropagation()}>
				<HiOutlineXMark className="close-icon" onClick={_ => props.setTrigger(false)} /> <br />
				<h3>Channel Name</h3>
				<input type="text" id="channel-input" placeholder="Insert channel name" onChange={e => { setChanName(e.target.value) }} onSubmit={() => { handleCreateNewChan(); }} />
				<h3>Channel Mode</h3>
				<input type="radio" name="chanMode" value={0} onChange={handlePublic} defaultChecked />Public
				<input type="radio" name="chanMode" value={1} onChange={handlePrivate} />Private
				<input type="radio" name="chanMode" value={2} onChange={handleProtected} />Protected <br />
				{
					chanMode === 2 &&
					<><input type="password" id="channel-input" placeholder="Insert password" onChange={e => { setPassword(e.target.value); }} /><br /></>
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
