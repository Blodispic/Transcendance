import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { socket } from "../../App";
import { IMessage } from "../../interface/Message";
import { IUser } from "../../interface/User";
import { addDM } from "../../redux/chat";
import { useAppDispatch, useAppSelector } from "../../redux/Hook";
import { addBlockedUser, unBlockUser } from "../../redux/user";
import CustomGamePopup from "../Game/CustomGamePopup";

function DMList(props: {currentdm: IUser | undefined; setCurrentDm: Function}) {
	const [alluser, setAlluser] = useState<IUser[] | undefined>(undefined);
	const myStore = useAppSelector(state => state);

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
						<ul key={user.username} onClick={_ => props.setCurrentDm(user)} >
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

function InfoFriend(props: {user: IUser}) {
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
                    dispatch(unBlockUser (user));
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

export function DmMessages(props: { id: any; currentdm: IUser | undefined; setCurrentDm: Function}) {
	const [newInput, setNewInput] = useState("");
	const myUser = useAppSelector(state => state.user.user);
	const dispatch = useAppDispatch();
	const messages = useAppSelector(state => state.chat.DMs);

	const handleSubmitNewMessage = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (newInput != "") {
			const sendtime = new Date().toLocaleString('en-US');
			socket.emit('sendDM', { IdReceiver: props.currentdm?.id, message: newInput, sendtime: sendtime });
		}
		setNewInput("");
	}

	useEffect(() => {
		socket.on('sendDmOK', (sendDmDto) => {
			const newMessage: IMessage = sendDmDto;
			newMessage.sender = myUser;
			dispatch(addDM(newMessage));
		})
		socket.on('ReceiveDM', (receiveDmDto) => {
			dispatch(addDM(receiveDmDto));
		})
		return () => {
			socket.off('sendDmOK');
			socket.off('ReceiveDM');
		};
	});

	return (
		<div className="chat-body">
			<div className="body-header">
				<img className="user-avatar" src={props.currentdm?.avatar} />
				{props.currentdm?.username}
			</div>
			<div className="chat-messages">
				<div className="reverse">

				{messages && messages.map(message => (
					( (myUser?.blocked?.find(obj => obj.id === props.currentdm?.id) === undefined && message.sender?.id === props.currentdm?.id) 
						|| (message.sender?.id === myUser?.id && message.IdReceiver === props.currentdm?.id)) ? (
						<div key={message.sender?.id + message.message} className="__wrap">
						<div className="message-info">
							<img className="user-avatar" src={message.sender?.avatar} />
							{message.sender?.username}
							<span className="timestamp">{message.sendtime}</span>
						</div>
						{message.message}
					</div>

					) 
					: <></>
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

// export function DmMessages(props: { id: any; currentdm: IUser | undefined; setCurrentDm: Function}) {

// 	const [newInput, setNewInput] = useState("");
// 	const [messageList, setMessageList] = useState<IMessage[]>([]);
// 	const [blockedId, setBlockedId] = useState(0);
// 	const myUser = useAppSelector(state => state.user);

// 	const handleSubmitNewMessage = (e: React.FormEvent<HTMLFormElement>) => {
// 		e.preventDefault();
// 		if (newInput != "") {
	
// 			const sendtime = new Date().toLocaleString('en-US');
// 			socket.emit('sendDM', { IdReceiver: props.currentdm?.id, message: newInput, sendtime: sendtime });

// 			const newMessage: IMessage = {sender: myUser!.user, message: newInput, usertowho: props.currentdm, sendtime: sendtime};

// 			setMessageList([...messageList, newMessage]);
// 		}
// 		setNewInput("");
// 	}

// 	useEffect(() => {
// 		socket.on('ReceiveDM', (receiveDmDto) => {
// 			setMessageList([...messageList, receiveDmDto]);
// 		})
// 		return () => {
// 			socket.off('ReceiveDM');
// 		};
// 	});

// 	useEffect(() => {
// 		setMessageList([]);
// 	}, [props.currentdm]);

// 	return (
// 		<div className="chat-body">
// 			<div className="body-header">
// 				<img className="user-avatar" src={props.currentdm?.avatar} />
// 				{props.currentdm?.username}
// 			</div>
// 			<div className="chat-messages">
// 				<div className="reverse">

// 				{messageList && messageList.map(message => (
// 					<div key={message.sendtime + message.message} className="__wrap">
// 						<div className="message-info">
// 							<img className="user-avatar" src={message.sender?.avatar} />
// 							{message.sender?.username}
// 							<span className="timestamp">{message.sendtime}</span>
// 						</div>
// 						{message.message}
// 					</div>
// 				))}
// 				</div>
// 			</div>
// 			{
// 				props.id !== undefined &&
// 				<form id="input_form" onSubmit={(e) => { handleSubmitNewMessage(e); }}>
// 					<input type="text" onChange={(e) => { setNewInput(e.target.value) }}
// 						placeholder="type message here" value={newInput} />
// 				</form>
// 			}
// 		</div>
// 	);
// }


export function DirectMessage(props: any) {
	const [currentDm, setCurrentDm] = useState<IUser | undefined>(undefined);

	return (
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