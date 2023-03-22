import { Channels } from "./Channel";
import { useEffect, useState } from "react";
import { socket } from "../../App"
import { DirectMessage } from "./DirectMessage";
import 'react-tabs/style/react-tabs.css';
import { useNavigate, useParams } from "react-router-dom";
import { page } from "../../interface/enum";
import { Player } from "../Game/Game";

export default function Chat() {
	const navigate = useNavigate();
	const [current, setOnglet] = useState<page>(page.PAGE_1);
	const { id } = useParams();
	const [reload, setReload] = useState<boolean>(false);
		

	useEffect(() => {
		setReload(false);
	}, [reload]);

	useEffect(() => {
		socket.on('leaveChannelOK', (chanid) => {
			setReload(true);
		})
		socket.on('joinChannelOK', (chanid) => {
			setReload(true);
		})
		return () => {
			socket.off('leaveChannelOK');
			socket.off('joinChannelOK');
		}
	}, []);

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
				// <Channels chanId={id} />
				<Channels />

			}
			{
				current == page.PAGE_2 &&
				<DirectMessage dmId={id}/>
			}

		</div>
	);
}
