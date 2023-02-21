import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../../App";
import { IMessage } from "../../interface/Message";
import { IUser } from "../../interface/User";
import { useAppSelector } from "../../redux/Hook";
import { ChatBody } from "./Chat";


// make a list of friends that had conversation with
function DMList() {
	return (
		<div className="title"> Direct Messages <hr />
		</div>
	);
}

function AllFriendList() {
	return (
		<div className="title"> All Friends <hr />
		</div>
	);
}


export function DmMessages(props: {id: any}) {

	const [newInput, setNewInput] = useState("");
	const [messageList, setMessageList] = useState<IMessage[]>([]);
	const [currentDm, setCurrentDm] = useState<IUser | undefined>(undefined);
	const currentUser = useAppSelector(state => state.user);

	const handleSubmitNewMessage = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (newInput != "")
			socket.emit('sendMessageUser', { newInput }); //
		setNewInput("");
	}

	socket.on('sendMessageUserOk', (message) => {
		buildNewMessage(message);
	})

	const buildNewMessage = (data: any) => {
		setMessageList([...messageList, data]);
	}

	useEffect(() => {
		const getChannel = async () => {
			const response = await fetch(`${process.env.REACT_APP_BACK}dm/${props.id}`, {
				method: 'GET',
			})
			const data = await response.json();
			setCurrentDm(data);
			setMessageList(messageList => []);
		}
		getChannel();
	}, [props]);

	return (
		<div className="chat-body">
			<div className="chat-messages">
				{messageList.map((dm) => (
					<div key={dm.message} className="__wrap">
						<div className="message-info">
							<img className="user-avatar" src={dm.sender?.avatar} />
							{dm.sender?.username}
							<span className="timestamp">0000/00/00  00:00</span>
						</div>
						{dm.message}
					</div>
				))}
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

	return (
		<div id="chat-container">
		<div className="sidebar left-sidebar">
			<DMList />
		</div>
			<DmMessages id={props}/>
		<div className="sidebar right-sidebar">
			<AllFriendList />
		</div>
	</div>
	);
}