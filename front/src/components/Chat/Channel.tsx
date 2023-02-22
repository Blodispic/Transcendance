import { useEffect, useState } from "react";
import { BsFillKeyFill } from "react-icons/bs";
import { FaCrown } from "react-icons/fa";
import { HiLockClosed } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { socket } from "../../App";
import { IChannel } from "../../interface/Channel";
import { useAppSelector } from "../../redux/Hook";
import { ChannelMessages } from "./ChannelMessages";
import CLickableMenu from "./clickableMenu";
import { AddChannel } from "./CreateChannel";

function ChannelList(props: any) {
	const [chanList, setChanList] = useState<IChannel[]>([]);
	const [chanId, setChanId] = useState("");
	const navigate = useNavigate();

	socket.on('createChannelOk', (newChanId) => {
		getChanId(newChanId);
	});

	const getChanId = (data: any) => {
		setChanId(data);
	}

	useEffect(() => {
		const fetchAllList = async () => {
			const response = await fetch(`${process.env.REACT_APP_BACK}channel/`, {
				method: 'GET',
			})
			const data = await response.json();
			setChanList(data);
		}
		fetchAllList();
	}, [chanId]);

	return (
		<div className="bottom">
			<header>All Public Channels <hr /></header>
			{chanList.map(chan => (
				<ul key={chan.name}>
					<li>
						<div onClick={_ => navigate(`/Chat/channel/${chan.id}`)}>{chan.name}
							{
								chan.chanType == 1 &&
								<HiLockClosed style={{ float: 'right' }} />
							}
							{
								chan.chanType == 2 && 
								<BsFillKeyFill style={{ float: 'right'}} />
							}
						</div>
					</li>
				</ul>
			))}
		</div>
	);
}

function JoinedChannelList() {

	return (
		<div className="title"> Joined Channels <hr />

		</div>
	);

}

function PublicChannelList() {
	

	// useEffect(() => {
	// 	const fetchAllList = async () => {
	// 		const response = await fetch(`${process.env.REACT_APP_BACK}channel/public`, {
	// 			method: 'GET',
	// 		})
	// 		const data = await response.json();
	// 		setChanList(data);
	// 	}
	// 	fetchAllList();
	// }, [chanId]);

	return (
		<div className="title">Public Channels <hr />
			<ul>
				<li>
				<p>test</p>
				</li>
			</ul>
		</div>
	);
}

function ChannelMemberList(props: { id: any }) {
	const [currentChan, setCurrentChan] = useState<IChannel | undefined>(undefined)
	const [currentId, setCurrentId] = useState<number | undefined>(undefined);

	const changeId = (id: number) => {
		if (id == currentId)
			setCurrentId(undefined);
		else
			setCurrentId(id);
	}

	useEffect(() => {
		const getChannel = async () => {
			const response = await fetch(`${process.env.REACT_APP_BACK}channel/${props.id}`, {
				method: 'GET',
			})
			const data = await response.json();
			setCurrentChan(data);
		}
		getChannel();
	}, [props]);
	
	if (currentChan?.users === undefined) {
		return (
			<div className="title"> Members <hr />
			</div>
		)
	}
	if (currentChan !== undefined)
		console.log(currentChan);

	return (
		<div className="title"> Members <hr />
			{currentChan?.users.map(user => (
				<div className="user-list">

					<ul key={user.username} onClick={e => { changeId(user.id) }}>
						<li>
							{user.username}
							{
								currentChan.owner?.find(value=> user) !== undefined &&
								<FaCrown />
							}
						</li>
					</ul>
					{
						 currentId == user.id && 
									<CLickableMenu user={user} chan={currentChan}/>
					}
				</div>
			))
			}
		</div>
	);
}

export function Channels(props: any) {

	const currentUser = useAppSelector(state => state.user);

	return (
		<div id="chat-container">
			<div className="sidebar left-sidebar">
				<JoinedChannelList />
				<ChannelList />
				<AddChannel />
			</div>
			<ChannelMessages id={props.chatId} />
			<div className="sidebar right-sidebar">
				<ChannelMemberList id={props.chatId} />
			</div>

		</div>
	);
}