import * as React from 'react';
import { Channels } from "./Channel";
import { useEffect, useState } from "react";
import { socket } from "../../App"
import { DirectMessage } from "./DirectMessage";
import 'react-tabs/style/react-tabs.css';
import { useNavigate } from "react-router-dom";
import { page } from "../../interface/enum";
import swal from 'sweetalert';

export default function Chat() {
	const navigate = useNavigate();
	const [current, setOnglet] = useState<page>(page.PAGE_1);

	useEffect(() => {
		socket.on("RoomStart", (roomId: number) => {
            navigate("/game/" + roomId, { state: { Id: roomId } });
        });
		socket.on('exception', () => {
			swal("Format Error", "Your input is not valid for this request", "error");
		  });
		return () => {
			socket.off('exception');
		}
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
					onClick={() => { setOnglet(page.PAGE_1); navigate(`/Chat/channel/`) }}>
					<span>
						Channels
					</span>
				</button>
				<button className={`pointer ${current === page.PAGE_2 ? "" : "not-selected"}`}
					onClick={() => { setOnglet(page.PAGE_2); navigate(`/Chat/dm/`) }}>
					<span>
						DM
					</span>
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
