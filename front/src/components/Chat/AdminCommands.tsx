import * as React from 'react';
import { useEffect, useState } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import { socket } from "../../App";
import { IChannel } from "../../interface/Channel";
import { IUser } from "../../interface/User";
import { useAppSelector } from "../../redux/Hook";
import { AiFillPlusCircle } from 'react-icons/ai';

export function BanUser(props: { chanid: any, userid: any, trigger: boolean, setTrigger: (value: boolean) => void }) {
	const [timeout, setTimeout] = useState<string>("");
	const [failed, setFailed] = useState<boolean>(false);
	const [errorMessage, setError] = useState<string>("");

	const handleBan = () => {
		if (timeout === "")
			socket.emit('BanUser', { chanid: props.chanid, userid: props.userid });
		else
			socket.emit('BanUser', { chanid: props.chanid, userid: props.userid, timeout: parseInt(timeout) * 1000 });
	}
	
	useEffect(() => {
		socket.on("banUserFailed", (errorMessage) => {
			setFailed(true);
			setError(errorMessage);
		});
		socket.on("banUserOK", ({chanid, userid}) => {
			props.setTrigger(false);
			setFailed(false);
		});
		return () => {
			socket.off("banUserFailed");
			socket.off("banUserOK");
		}
	})

	return (props.trigger) ? (
		<div className="chat-form-popup" onClick={() => (props.setTrigger(false))}>
			<div className="clickable-pop-up-inner" onClick={e => e.stopPropagation()}>
				<HiOutlineXMark className="close-icon" onClick={() => (props.setTrigger(false))} />
				<br />
				<h3>Ban User</h3>
				<h4>Set time (optional)</h4>
				<input type="number" id="clickable-input" min="0" onChange={e => { setTimeout(e.target.value) }} />seconds
				<br /><br />
				{
					failed === true &&
					<span className="channel-error"> {errorMessage}</span>
				}
				<button onClick={() => handleBan()}>Ban User</button>
			</div>
		</div>
	) : <></>;
}

export function MuteUser(props: { chanid: any, userid: any, trigger: boolean, setTrigger: (value: boolean) => void }) {
	const [timeout, setTimeout] = useState<string>("");
	const [failed, setFailed] = useState<boolean>(false);
	const [errorMessage, setError] = useState<string>("");

	const handleMute = () => {
		if (timeout === "")
			socket.emit('MuteUser', { chanid: props.chanid, userid: props.userid });
		else
			socket.emit('MuteUser', { chanid: props.chanid, userid: props.userid, timeout: parseInt(timeout) * 1000 });
	}


	useEffect(() => {
		socket.on("muteUserFailed", (errorMessage) => {
			setFailed(true);
			setError(errorMessage);
		});
		socket.on("muteUserOK", ({chanid, userid}) => {
			props.setTrigger(false);
			setFailed(false);
		});
		return () => {
			socket.off("muteUserFailed");
			socket.off("muteUserOK");
		}
	})

	return (props.trigger) ? (
		<div className="chat-form-popup" onClick={() => (props.setTrigger(false))}>
			<div className="clickable-pop-up-inner" onClick={e => e.stopPropagation()}>
				<HiOutlineXMark className="close-icon" onClick={() => (props.setTrigger(false))} />
				<br />
				<h3>Mute User</h3>
				<h4>Set time (optional)</h4>
				<input type="number" id="clickable-input" min="0" onChange={e => { setTimeout(e.target.value) }} />seconds
				<br /><br />
				{
					failed === true &&
					<span className="channel-error"> {errorMessage}</span>
				}
				<button onClick={_ => handleMute()}>Mute User</button>
			</div>
		</div>
	) : <></>;
}

export function KickUser(chanid: any, userid: any) {
	socket.emit('BanUser', { chanid: chanid, userid: userid, timeout: 1 });
}

export function ConfigureChannelPrivate(props: { trigger: boolean, setTrigger: (value: boolean) => void, channel: IChannel }) {
	const [alreadyhere, setAlreadyhere] = useState<IUser[]>(props.channel.users);
	const [allfriend, setAllFriend] = useState<IUser[]>([]);
	const [alluser, setAlluser] = useState<IUser[]>([]);
	const [myVar, setMyvar] = useState<boolean>(false);
	const myUser = useAppSelector(state => state);

	const AddPeoplePrivate = () => {
		if (allfriend.length > 0)
			socket.emit('AddPeoplePrivate', { chanId: props.channel.id, users: allfriend.map(user => user.id) });
	}
	const cleanlist = () => {
		setAlluser([]);
		setAllFriend([]);
		setAlreadyhere([])
		setMyvar(false)
	}

	const addfriend = (myfriend: IUser) => {
		if (allfriend !== undefined && allfriend.find(allfriend => allfriend.id === myfriend.id) === undefined)
			setAllFriend([...allfriend, myfriend])
		else if (allfriend === undefined)
			setAllFriend([myfriend]);
	}
	const removeFriend = (myfriend: IUser) => {
		if (allfriend !== undefined && allfriend.find(allfriend => allfriend.id === myfriend.id) !== undefined)
			setAllFriend(allfriend.filter(allfriend => allfriend.id !== myfriend.id))
	}
	useEffect(() => {
		setAlreadyhere(props.channel.users);
		socket.on("AddPeoplePrivateOk", (error_message) => {
		});
		return () => {
			socket.off("AddPeoplePrivateOk");
		}
	}, []);
	const get_all = async () => {
		const response = await fetch(`${process.env.REACT_APP_BACK}user`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${myUser.user.myToken}`,
			},
		})
		const data = await response.json();
		setAlluser(
			data
			  .filter((user: { username: string, status: string}) => 
				user.username !== myUser.user.user?.username && user.status === "Online"
			  )
			  .filter((user: { id: number }) => 
				alreadyhere.findIndex((alreadyhereuser: IUser) => alreadyhereuser.id === user.id) === -1
			  )
			  .filter((user: { id: number }) => 
			  allfriend.findIndex((allfriend: IUser) => allfriend.id === user.id) === -1
			)
			
		  );
	}

	return (props.trigger) ? (
		<div className="chat-form-popup" onClick={_ => {cleanlist(); props.setTrigger(false)}}>
			<div className="chat-form-inner" onClick={e => {e.stopPropagation()}}>
				<HiOutlineXMark className="close-icon" onClick={_ => {cleanlist();props.setTrigger(false)}} /> <br />
				<div className='allpoeple'>
					{

						<>
							<div>
								{alreadyhere && alreadyhere.map(user => (
									<div className='avatar-inpopup'
										key={user.username}>
										<img className='avatar avatar-manu' src={`${process.env.REACT_APP_BACK}user/${user.id}/avatar`} alt="" />
									</div>
								))}
							</div>
							<div className='avatar-inpopup'>
								{allfriend && allfriend.map(user => (
									<div
										key={user.username}>
										<img className="cursor-onsomoene avatar avatar-manu" src={`${process.env.REACT_APP_BACK}user/${user.id}/avatar`} alt="" onClick={() => removeFriend(user)} />
									</div>
								))}
								<AiFillPlusCircle className="plus-circle pointer" onClick={() => { get_all(); setMyvar(!myVar) }} />
							</div>
						</>

					}
					{
						myVar === true && alluser && alluser.length > 0 &&
						<div className="dropdown-container">
							<div className=" dropdown people-list hover-style">
								{alluser.map(user_list => (
									<ul key={user_list.username} >
										<li onClick={() => { setMyvar(!myVar); addfriend(user_list) }}>
											{user_list.username}
										</li>
									</ul>
								))}
							</div>
						</div>
					}
				</div>
				<button onClick={() => { AddPeoplePrivate(); props.setTrigger(false) }}> Save Setting </button>
			</div>
		</div>
	) : <></>;
}

export function ConfigureChannel(props: { trigger: boolean, setTrigger: (value: boolean) => void, channel: IChannel }) {
	const [newPassword, setNewPassword] = useState("");

	const setPassword = () => {
		if (props.channel.chanType === 0 && newPassword !== undefined) {
			socket.emit('addPassword', { chanid: props.channel.id, password: newPassword });
		}
		else if (props.channel.chanType === 2) {
			socket.emit('changePassword', { chanid: props.channel.id, password: newPassword });
		}
		props.setTrigger(false);
	}

	const removePassword = () => {
		socket.emit('rmPassword', { chanid: props.channel.id });
		props.setTrigger(false);
	}

	return (props.trigger) ? (
		<div className="chat-form-popup" onClick={() => props.setTrigger(false)}>
			<div className="chat-form-inner" onClick={e => e.stopPropagation()}>
				<HiOutlineXMark className="close-icon" onClick={() => props.setTrigger(false)} /> <br />
				{
					props.channel.chanType === 0 &&
					<>
						<h3>Set Password</h3>
						<input type="password" id="channel-input" placeholder="Insert password" onChange={e => { setNewPassword(e.target.value); }} /><br />
					</>
				}
				{
					props.channel.chanType === 2 &&
					<>
						<h3> Remove Password </h3>
						<button style={{ background: '#B33A3A' }} onClick={removePassword}> Remove Password </button>
						<h3>Change Password</h3>
						<input type="password" id="channel-input" placeholder="Insert new password" onChange={e => { setNewPassword(e.target.value); }} /><br />
					</>
				}
				<button onClick={setPassword}> Save Setting </button>
			</div>
		</div>
	) : <></>;
}
