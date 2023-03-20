import { Channels } from "./Channel";
import { useEffect, useState } from "react";
import { socket } from "../../App"
import { DirectMessage } from "./DirectMessage";
import 'react-tabs/style/react-tabs.css';
import { useNavigate, useParams } from "react-router-dom";
import { page } from "../../interface/enum";
import { Player } from "../Game/Game";
import { useAppDispatch, useAppSelector } from "../../redux/Hook";
import { IMessage } from "../../interface/Message";
import { addDM, addMessage, removePass, setPass } from "../../redux/chat";

export default function Chat() {
	const navigate = useNavigate();
	const [current, setOnglet] = useState<page>(page.PAGE_1);
	const { id } = useParams();
	const dispatch = useAppDispatch();
	const myUser = useAppSelector(state => state.user.user);

	// const [reload, setReload] = useState<boolean>(false);

	useEffect(() => {
		socket.on('sendMessageChannelOK', (messageDto) => {
			dispatch(addMessage(messageDto));
		});

		socket.on('sendDmOK', (sendDmDto) => {
			const newMessage: IMessage = sendDmDto;
			newMessage.sender = myUser;
			dispatch(addDM(newMessage));
		})
		socket.on('ReceiveDM', (receiveDmDto) => {
			dispatch(addDM(receiveDmDto));
		})

		socket.on("addPasswordOK", (chanId) => {
			dispatch(setPass(chanId));
		})

		socket.on("rmPasswordOK", (chanId) => {
			dispatch(removePass(chanId));
		});
		return () => {
			socket.off('sendMessageChannelOK');
			socket.off('sendDmOK');
			socket.off('ReceiveDM');
			socket.off("addPasswordOK");
			socket.off("rmPasswordOK");
		};
	});


	// useEffect(() => {
	// 	setReload(false);
	// }, [reload]);

	// useEffect(() => {
	// 	socket.on('leaveChannelOK', (chanid) => {
	// 		console.log("leavechanles");
	// 		setReload(true);
	// 	})
	// 	socket.on('joinChannelOK', (chanid) => {
	// 		console.log("join chanels ok");
	// 		setReload(true);
	// 	})
	// 	return () => {
	// 		socket.off('leaveChannelOK');
	// 		socket.off('joinChannelOK');
	// 	}
	// }, []);

	useEffect(() => {
		socket.on("RoomStart", (roomId: number, player: Player) => {
            navigate("/game/" + roomId, { state: { Id: roomId } });
        });
	})

	return (
		<div className="chat-tab">
			<div className='onglets Chat-onglets'>
				<button className={`pointer ${current === page.PAGE_1 ? "" : "not-selected"}`}
					onClick={e => { setOnglet(page.PAGE_1); navigate(`/Chat/channel/`) }}>
					<a >
						Channels
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
				current === page.PAGE_1 &&
				<Channels page={setOnglet}/>

			}
			{
				current === page.PAGE_2 &&
				<DirectMessage dmId={id}/>
			}

		</div>
	);
}
