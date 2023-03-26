import * as React from 'react';
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import swal from "sweetalert";
import { socket } from "../../App";
import { IMessage } from "../../interface/Message";
import { IUser } from "../../interface/User";
import { useAppDispatch, useAppSelector } from "../../redux/Hook";
import { addBlockedUser, unBlockUser } from "../../redux/user";
import CustomGamePopup from "../Game/CustomGamePopup";

function DMList(props: { currentdm: IUser | undefined; setCurrentDm: (user: IUser | undefined) => void }) {
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
			{alluser !== undefined &&
				<>
					{alluser && alluser.map(user => (
						<ul key={user.username} onClick={() => {props.setCurrentDm(user); navigate(`/Chat/dm/${user.id}`)}} >
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
	const [relation, setRelation] = useState<string>("");
	const myToken = useAppSelector(state => state.user.myToken);

	useEffect(() => {
		Relations();
	})

	const Relations = async () => {
		await fetch(`${process.env.REACT_APP_BACK}user/relations`, {
			method: 'POST',
			body: JSON.stringify({
				userId: myUser.user?.id,
				friendId: user.id,
			}),
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${myUser.myToken}`,
			}
		})
			.then(async response => {
				if (response.ok) {
					const data = await response.json();
					setRelation(data.relation);
				}
			})
	}

	const sendFriendRequest = async () => {
		await new Promise((resolve) => setTimeout(resolve, 1000));

		await fetch(`${process.env.REACT_APP_BACK}user/friend-request/send/${user.id}`, {
			method: 'POST',
			body: JSON.stringify({ userId: myUser.user!.id }),
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${myToken}`,
			}
		})
			.then(async Response => {
				if (Response.ok) {
					setRelation("friendRequestSent");
					swal("Your request has been sent", "", "success");
					socket.emit("RequestSent", user.id);

				}
			})
	}

	const acceptFriendRequest = async () => {
		await fetch(`${process.env.REACT_APP_BACK}user/friends/accept`, {
			method: 'POST',
			body: JSON.stringify({ friendId: user.id, userId: myUser.user!.id }),
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${myToken}`,
			},
		})
			.then(async Response => {
				if (Response.ok) {
					const str: string = "They are now your friend!";
					swal("Congrats", str, "success");
					socket.emit("RequestAccepted", user.id);
					setRelation("Friend");

				}
			});
	};

	const removeFriend = async () => {
		await fetch(`${process.env.REACT_APP_BACK}user/deletefriend/${myUser.user?.id}`, {
			method: 'DELETE',
			body: JSON.stringify({ friendId: user.id }),
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${myToken}`,
			},
		})
			.then(async Response => {
				if (Response.ok) {
					swal("", "Friend Remove", "success");
					socket.emit("RemoveFriend", user.id);
					setRelation("Nobody");
				}
			});
	};

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
				setRelation("Blocked");
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
				setRelation("Nobody");
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
						{
							relation === "Nobody" &&
							<span onClick={() => (sendFriendRequest())} >
								Add Friend
							</span>
						}
						{
							relation === "Friend" &&
							<span onClick={() => (removeFriend())}> Remove Friend </span>
						}
						{
							relation === "friendRequestSent" &&
							<li> Request already sent </li>
						}
						{
							relation === "friendRequestReceived" &&
							<span onClick={() => (acceptFriendRequest())}> accept in Friend </span>
						}


						<span onClick={() => setMyvar(true)}>
							Invite Game
						</span>

						{
							((myUser.user && (myUser.user.blocked === undefined
								|| myUser.user.blocked.find(block => block.id === user.id) === undefined))
								&& user.username !== myUser.user!.username) &&
							<li onClick={() => Block()}>
								Block
							</li>
						}

						{
							((myUser.user && (myUser.user.blocked !== undefined && myUser.user.blocked.find(block => block.id === user.id) !== undefined)) && user.username !== myUser.user!.username) &&
							<div onClick={() => UnBlock()}>
								Unblock
							</div>
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

export function DmMessages(props: { id: number; currentdm: IUser | undefined; setCurrentDm: (user: IUser | undefined) => void }) {
	const [newInput, setNewInput] = useState("");
	const myUser = useAppSelector(state => state.user.user);
	const messages: IMessage[] = useAppSelector(state => state.chat.DMs.filter(obj => obj.chanid === props.id));

	const handleSubmitNewMessage = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (newInput !== "") {
			const sendtime = new Date().toLocaleString('en-US');
			socket.emit('sendDM', { IdReceiver: props.id, message: newInput, sendtime: sendtime });
		}
		setNewInput("");
	}

	return (
		<div className="chat-body">
			<div className="body-header">
				<img className="user-avatar" src={`${process.env.REACT_APP_BACK}user/${props.currentdm?.id}/avatar`} alt="" />
				{props.currentdm?.username}
			</div>
			<div className="chat-messages">
				<div className="reverse">

					{messages && messages.map((message: IMessage, index: number) => (
						<div key={index} >
							{

								myUser?.blocked?.find(obj => obj.id === props.currentdm?.id) === undefined &&
									<div className="__wrap">
										<div className="message-info">
											<img className="user-avatar" src={`${process.env.REACT_APP_BACK}user/${message.sender?.id}/avatar`} alt="" />
											{message.sender?.username}
											<span className="timestamp">{message.sendtime}</span>
										</div>
										{message.message}
									</div>

							}
						</div>
					))}

				</div>
			</div>
			{
				props.id !== undefined &&
				<form id="input_form" onSubmit={(e) => { handleSubmitNewMessage(e); }}>
					<input type="text" maxLength={1000} onChange={(e) => { setNewInput(e.target.value) }}
						placeholder="type message here" value={newInput} />
				</form>
			}
		</div>
	);
}

export function DirectMessage() {
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
			if (dmId) {
				const response = await fetch(`${process.env.REACT_APP_BACK}user/id/${dmId}`, {
					method: 'GET',
					headers: {
						'Authorization': `Bearer ${myUser.user.myToken}`,
					},
				})
				const data = await response.json();
				setCurrentDm(data);
			}
		}
		// console.log("getuser");
		get_user();
	}, [dmId]);


	return (id) ? (
		<div id="chat-container">
			<div className="sidebar left-sidebar">
				<DMList currentdm={currentDm} setCurrentDm={setCurrentDm} />
			</div>
			{(currentDm !== undefined && dmId !== undefined) &&
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
			</div>
		);
}