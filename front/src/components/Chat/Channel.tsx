import { useEffect, useState } from "react";
import { BsFillKeyFill } from "react-icons/bs";
import { FaCrown } from "react-icons/fa";
import { HiLockClosed } from "react-icons/hi2";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { socket } from "../../App";
import { IChannel } from "../../interface/Channel";
import { IUser } from "../../interface/User";
import { addChannel, channelSlice } from "../../redux/channel";
import { useAppSelector } from "../../redux/Hook";
import { ChannelMessages } from "./ChannelMessages";
import CLickableMenu from "./clickableMenu";
import { AddChannel } from "./CreateChannel";

function JoinedChannelList() {
	const [chanList, setChanList] = useState<IChannel[]>([]);
	const [chanId, setChanId] = useState("");
	const currentUser = useAppSelector(state => state.user);
	const navigate = useNavigate();

	// useEffect(() => {
	// 	const fetchJoined = async () => {
	// 		const response = await fetch(`${process.env.REACT_APP_BACK}user/channel/${currentUser.user?.id}`, {
	// 			method: 'GET',
	// 		})
	// 		const data = await response.json();
	// 		setChanList(data);
	// 	}
	// 	fetchJoined();
	// }, []);

	return (
		<div className="title">
			<header>Joined Channels <hr /></header>
			{chanList && chanList.map(chan => (
				<ul key={chan.name}>
					<li>
						<div onClick={_ => navigate(`/Chat/channel/${chan.id}`)}>{chan.name}
							{
								chan.chanType == 1 &&
								<HiLockClosed style={{ float: 'right' }} />
							}
							{
								chan.chanType == 2 &&
								<BsFillKeyFill style={{ float: 'right' }} />
							}
						</div>
					</li>
				</ul>
			))}
		</div>
	);
}

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
		<div className="title">
			<header>All Channels <hr /></header>
			{chanList && chanList.map(chan => (
				<ul key={chan.name}>
					<li>
						<div onClick={_ => navigate(`/Chat/channel/${chan.id}`)}>{chan.name}
							{
								chan.chanType == 1 &&
								<HiLockClosed style={{ float: 'right' }} />
							}
							{
								chan.chanType == 2 &&
								<BsFillKeyFill style={{ float: 'right' }} />
							}
						</div>
					</li>
				</ul>
			))}
		</div>
	);
}

function PublicChannelList() {
	const [chanList, setChanList] = useState<IChannel[]>([]);
	const [chanId, setChanId] = useState("");
	const navigate = useNavigate();


	useEffect(() => {
		const fetchPublic = async () => {
			const response = await fetch(`${process.env.REACT_APP_BACK}channel/public`, {
				method: 'GET',
			})
			const data = await response.json();
			// console.log('data: ', data);
			setChanList(data);
		}
		fetchPublic();
	}, []);


	// useEffect(() => {
	// 	const fetchProtected = async () => {
	// 		const response = await fetch(`${process.env.REACT_APP_BACK}channel/protected`, {
	// 			method: 'GET',
	// 		})
	// 		const data = await response.json();
	// 		setChanList(data);
	// 	}
	// 	// console.log('here');
	// 	fetchProtected();
	// }, []);

	return (
		<div className="bottom">
			<header>All Channels <hr /></header>
			{chanList && chanList.map(chan => (
				<ul key={chan.name}>
					<li>
						<div onClick={_ => navigate(`/Chat/channel/${chan.id}`)}>{chan.name}
							{
								chan.chanType == 1 &&
								<HiLockClosed style={{ float: 'right' }} />
							}
							{
								chan.chanType == 2 &&
								<BsFillKeyFill style={{ float: 'right' }} />
							}
						</div>
					</li>
				</ul>
			))}
		</div>
	);
}

// function ChannelMemberList(props: { chanId: any }) {
// 	const [currentChan, setCurrentChan] = useState<IChannel | undefined>(undefined)
// 	// const currentChan = useAppSelector(state => state.channel);
// 	const [currentId, setCurrentId] = useState<number | undefined>(undefined);
// 	const [members, setMembers] = useState<IUser[]>([]);

// 	const changeId = (id: number) => {
// 		if (id == currentId)
// 			setCurrentId(undefined);
// 		else
// 			setCurrentId(id);
// 	}

// 	useEffect(() => {
// 		const getChannel = async () => {
// 			const response = await fetch(`${process.env.REACT_APP_BACK}channel/${props.chanId}`, {
// 				method: 'GET',
// 			})
// 			const data = await response.json();
// 			setCurrentChan(data);
// 		}
// 		getChannel();
// 	}, [props]);

// 	if (currentChan !== undefined && members == undefined)
// 		setMembers(currentChan?.users);

// 	// socket.on("joinChannel", (newUser) => {
// 	// 	console.log(newUser);
// 	// 	setMembers([...members, newUser]);
// 	// })

// 	if (currentChan?.users === undefined) {
// 		return (
// 			<div className="title"> Members <hr />
// 			</div>
// 		)
// 	}

// 	return (
// 		<div className="title"> Members <hr />
// 			{currentChan && currentChan.users?.map(user => (
// 				<div className="user-list">
// 					<ul key={user.id} onClick={e => { changeId(user.id) }}>
// 						<li>
// 							{user.username}
// 							{
// 								currentChan.admin?.find(obj => obj === user) &&
// 								<FaCrown />
// 							}
// 						</li>
// 					</ul>
// 					{
// 						currentId == user.id &&
// 						<CLickableMenu user={user} chan={currentChan} />
// 					}
// 				</div>
// 			))
// 			}
// 		</div>
// 	);
// }

function ChannelMemberList(props: { channel: IChannel }) {
	const [currentId, setCurrentId] = useState<number | undefined>(undefined);

	const changeId = (id: number) => {
		if (id == currentId)
			setCurrentId(undefined);
		else
			setCurrentId(id);
	}
		
	if (props.channel?.users === undefined) {
		return (
			<div className="title"> Members <hr />
			</div>
		)
	}

	return (
		<div className="title"> Members <hr />
			{props.channel && props.channel.users?.map(user => (
				<div key={user.id} className="user-list">
					<ul onClick={e => { changeId(user.id) }}>
						<li>
							{user.username}
							{
								props.channel.admin?.find(obj => obj.id === user.id) &&
								<FaCrown />
							}
						</li>
					</ul>
					{
						currentId == user.id &&
						<CLickableMenu user={user} chan={props.channel} />
					}
				</div>
			))
			}
		</div>
	);

}

export function Channels(props: any) {
	const [currentChan, setCurrentChan] = useState<IChannel | undefined>(undefined);
	const [update, setUpdate] = useState(0);
	const currentUser = useAppSelector(state => state.user);

	useEffect(() => {
		const getChannel = async () => {
			const response = await fetch(`${process.env.REACT_APP_BACK}channel/${props.chanId}`, {
				method: 'GET',
			})
			const data = await response.json();
			setCurrentChan(data);
		}
			getChannel();
 	}, [props]);

	return (
		<div id="chat-container">
			<div className="sidebar left-sidebar">
				{/* <ChannelList /> */}
				<JoinedChannelList />
				<PublicChannelList />
				<AddChannel />
			</div>
			{
				currentChan?.id !== undefined &&
				<>
					<ChannelMessages channel={currentChan} />
					{
						currentChan.users.find(obj => obj.id === currentUser.user?.id) &&
						<div className="sidebar right-sidebar">
						<ChannelMemberList channel={currentChan} />
					</div>
					}
				</>
			}
		</div>
	);
}