import { Channels } from "./Channel";
import { useEffect, useState } from "react";
import { socket } from "../../App"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { DirectMessage } from "./DirectMessage";
import 'react-tabs/style/react-tabs.css';
import { useNavigate, useParams } from "react-router-dom";
import { page } from "../../interface/enum";

export function ChatBody() {

	const [newInput, setNewInput] = useState("");
	const [messageList, setMessageList] = useState<any[]>([]);
	let { id } = useParams();

	const handleSubmitNewMessage = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (newInput != "")
			socket.emit('sendMessageUser', { newInput }); //
		setNewInput("");
	}

	socket.on('sendMessageUserOk', (messageUserDto) => {
		buildNewMessage(messageUserDto);
	})

	const buildNewMessage = (data: any) => {
		setMessageList([...messageList, data]);
	}

	return (
		<div className="chat-body">
			<div className="chat-messages">
				{messageList.map((chat) => (
					<div key={chat.newInput} className="__wrap">
						<div className="message_info">
							<span className="user-avatar">
								<img src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/apple/81/woman-gesturing-ok-type-1-2_1f646-1f3fb-200d-2640-fe0f.png"></img></span>
							UserName
							<span className="timestamp"> 0000/00/00 00:00</span>
						</div>
						<p>{chat.newInput}</p>
					</div>
				))}
			</div>
			{
				id !== undefined && 
				<form id="input_form" onSubmit={(e) => { handleSubmitNewMessage(e); }}>
					<input type="text" onChange={(e) => { setNewInput(e.target.value) }}
						placeholder="type message here" value={newInput} />
				</form>
			}

		</div>
	);
}

export default function Chat() {
	const navigate = useNavigate();
	const [current, setOnglet] = useState<page>(page.PAGE_1);
	const { id } = useParams();

	return (
		<div className="chat-tab">
			<div className='onglets Chat-onglets'>
				<button className={`pointer ${current === page.PAGE_1 ? "" : "not-selected"}`}
					onClick={e => { setOnglet(page.PAGE_1); navigate(`/Chat/channel/`) }}>
					<a >
						Chanels
					</a>
				</button>
				<button className={`pointer ${current === page.PAGE_2 ? "" : "not-selected"}`}
					onClick={e => { setOnglet(page.PAGE_2); navigate(`/Chat/dm/`) }}>
					<a >
						DM
					</a>
				</button>
			</div>
			{
				current == page.PAGE_1 &&
				<Channels chatId={id} />
			}
			{
				current == page.PAGE_2 &&
				<DirectMessage />
			}

		</div>
		// <Tabs className="chat-tab">
		// 	<TabList>
		// 		<Tab onClick={_ => navigate(`/Chat/channel/`)} >Channels</Tab>
		// 		<Tab onClick={_ => navigate(`/Chat/dm/`)}>DM</Tab>
		// 	</TabList>
		// <TabPanel>
		// 	<Channels chatId={id}/>
		// </TabPanel>
		// <TabPanel>
		// 	<DirectMessage />
		// </TabPanel>
		// </Tabs>
	);
}
