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

	useEffect(() => {
		socket.on("RoomStart", (roomId: number, player: Player) => {
            navigate("/game/" + roomId, { state: { Id: roomId } });
        });
	})

	if (window.location.href.search('channel') !== -1 && current !== page.PAGE_1) {
		setOnglet(page.PAGE_1);	
	}

	if (window.location.href.search('dm') !== -1 && current !== page.PAGE_2) {
		setOnglet(page.PAGE_2);	
	}

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
				<DirectMessage />
			}

		</div>
	);
}
