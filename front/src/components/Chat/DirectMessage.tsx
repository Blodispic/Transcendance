import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { socket } from "../../App";
import { IMessage } from "../../interface/Message";
import { IUser } from "../../interface/User";
import { useAppDispatch, useAppSelector } from "../../redux/Hook";
import { addBlockedUser, unBlockUser } from "../../redux/user";
import CustomGamePopup from "../Game/CustomGamePopup";

function DMList(props: { currentdm: IUser | undefined; setCurrentDm: Function }) {
	const [alluser, setAlluser] = useState<IUser[] | undefined>(undefined);
	const myStore = useAppSelector(state => state);
	const navigate = useNavigate();

	useEffect(() => {
		const get_all = async () => {
			const response = await fetch(`${process.env.REACT_APP_BACK}user`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${myStore.user.myToken}`,
				},
			})
			const data = await response.json();
			setAlluser(data.filter((User: { status: string; }) => User.status === "Online"));
			setAlluser(data.filter((User: { username: string; }) => User.username !== myStore.user.user?.username));
		}
		get_all();
	}, [])

	return (
		<div className="title"> Direct Messages <hr />
			{alluser != undefined &&
				<>
					{alluser && alluser.map(user => (
						<ul key={user.username} onClick={_ => {props.setCurrentDm(user); navigate(`/Chat/dm/${user.id}`)}} >
							<li >
								{user.username}
							</li>
						</ul>
					))}
				</>
			}
		</div>
	);
}

function InfoFriend(props: { user: IUser }) {
	const myUser = useAppSelector(state => state.user);
	const user: IUser = props.user;
	const [myVar, setMyvar] = useState<boolean>(false);
	const dispatch = useAppDispatch();

	const Block = async () => {
		await fetch(`${process.env.REACT_APP_BACK}user/block/${myUser.user?.id}`, {
			method: 'POST',
			body: JSON.stringify({
				blockedId: user.id,
			}),
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${myUser.myToken}`,
			}
		})
			.then(async response => {
				if (response.ok)
					dispatch(addBlockedUser(user));
			})
	}

	const UnBlock = async () => {
		await fetch(`${process.env.REACT_APP_BACK}user/unblock/${myUser.user?.id}`, {
			method: 'DELETE',
			body: JSON.stringify({
				blockedId: user.id,
			}),
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${myUser.myToken}`,
			}
		})
			.then(async response => {
				if (response.ok)
					dispatch(unBlockUser(user));
			})
	}

	return (
		<div className="title"> menu <hr />
			<div className="menu hover-style">

				<ul >
					<li >
						<Link to={`/Profile/${user.id}`}>
							Profile
						</Link>
					</li>

					<>
						<li>
							Add friend
						</li>

						<li onClick={_ => setMyvar(true)}>
							Invite Game
						</li>
						{
							((myUser.user && (myUser.user.blocked === undefined
								|| myUser.user.blocked.find(block => block.id === user.id) === undefined))
								&& user.username !== myUser.user!.username) &&
							<li onClick={_ => Block()}>
								Block
							</li>
						}
						{
							((myUser.user && (myUser.user.blocked !== undefined && myUser.user.blocked.find(block => block.id === user.id) !== undefined)) && user.username !== myUser.user!.username) &&
							<li onClick={_ => UnBlock()}>
								Unblock
							</li>
						}
					</>
				</ul>
			</div>
			{
				<CustomGamePopup trigger={myVar} setTrigger={setMyvar} friend={user} />
			}
		</div>
	);
}

export function DmMessages(props: { id: number; currentdm: IUser | undefined; setCurrentDm: Function }) {
	// props.id ---- userId of receiver 

	const [newInput, setNewInput] = useState("");
	const myUser = useAppSelector(state => state.user.user);
	const messages = useAppSelector(state => state.chat.DMs.filter(obj => obj.chanid === props.id));

	const handleSubmitNewMessage = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (newInput != "") {
			const sendtime = new Date().toLocaleString('en-US');
			socket.emit('sendDM', { IdReceiver: props.id, message: newInput, sendtime: sendtime });
		}
		setNewInput("");
	}

	return (
		<div className="chat-body">
			<div className="body-header">
				<img className="user-avatar" src={`${process.env.REACT_APP_BACK}user/${props.currentdm?.id}/avatar`} />
				{props.currentdm?.username}
			</div>
			<div className="chat-messages">
				<div className="reverse">

					{messages && messages.map((message: IMessage, index: number) => (
						<div key={index} >
							{

								((myUser?.blocked?.find(obj => obj.id === props.currentdm?.id) === undefined)) ? (
									<div className="__wrap">
										<div className="message-info">
											<img className="user-avatar" src={`${process.env.REACT_APP_BACK}user/${message.sender?.id}/avatar`} />
											{message.sender?.username}
											<span className="timestamp">{message.sendtime}</span>
										</div>
										{message.message}
									</div>
								)
									: <></>
							}
						</div>
					))}

				</div>
			</div>
			{
				props.id !== undefined &&
				<form id="input_form" onSubmit={(e) => { handleSubmitNewMessage(e); }}>
					<input type="text" onChange={(e) => { setNewInput(e.target.value) }}
						placeholder="type message here" value={newInput} />
				</form>
			}
		</div>
	);
}

export function DirectMessage(props: any) {
	const [currentDm, setCurrentDm] = useState<IUser | undefined>(undefined);
	const { id } = useParams();
	const [dmId, setDmId] = useState<number | undefined>(undefined);
	const myUser = useAppSelector(state => state);


	useEffect(() => {
		if (id !== undefined)
			setDmId(parseInt(id));
	})

	useEffect(() => {
		const get_user = async () => {
			const response = await fetch(`${process.env.REACT_APP_BACK}user/id/${dmId}`, {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${myUser.user.myToken}`,
				},
			})
			const data = await response.json();
			setCurrentDm(data);
		}
		console.log("getuser");
		get_user();
	}, [dmId]);


	return (dmId) ? (
		<div id="chat-container">
			<div className="sidebar left-sidebar">
				<DMList currentdm={currentDm} setCurrentDm={setCurrentDm} />
			</div>
			{currentDm !== undefined &&
				<>
					<DmMessages id={dmId} currentdm={currentDm} setCurrentDm={setCurrentDm} />
					<div className="sidebar left-sidebar">
						<InfoFriend user={currentDm} />
					</div>
				</>
			}

		</div>
	) : (
			<div id="chat-container">
				<div className="sidebar left-sidebar">
					<DMList currentdm={currentDm} setCurrentDm={setCurrentDm} />
				</div>
				{currentDm !== undefined &&
					<>
						<DmMessages id={props} currentdm={currentDm} setCurrentDm={setCurrentDm} />
						<div className="sidebar left-sidebar">
							<InfoFriend user={currentDm} />
						</div>
					</>
				}

			</div>
		);
}