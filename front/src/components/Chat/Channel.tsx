import { useEffect, useState } from "react";
import { BsFillKeyFill, BsFillPersonFill } from "react-icons/bs";
import { FaCrown } from "react-icons/fa";
import { HiLockClosed, HiPlusCircle } from "react-icons/hi2";
import { useNavigate, useParams } from "react-router-dom";
import { socket } from "../../App";
import { IChannel } from "../../interface/Channel";
import { IUser } from "../../interface/User";
import { useAppSelector } from "../../redux/Hook";
import { ChannelHeader, ChannelMessages } from "./ChannelMessages";
import CLickableMenu from "./clickableMenu";
import { AddChannel } from "./CreateChannel";

function JoinedChannelList(props: {chanList: IChannel[]}) {
	// const [chanList, setChanList] = useState<IChannel[]>([]);
	const currentUser = useAppSelector(state => state.user);
	const navigate = useNavigate();

	// const fetchJoined = async () => {
	// 	const response = await fetch(`${process.env.REACT_APP_BACK}channel/user/${currentUser.user?.id}`, {
	// 		method: 'GET',
	// 	})
	// 	const data = await response.json();
	// 	setChanList(data);
	// }

	// useEffect(() => {
	// 	fetchJoined();
	// }, []);

	// useEffect(() => {
	// 	socket.on('updateMember', (data) => {
	// 		fetchJoined();
	// 		console.log("updatemember received in JoinedChannel List");
	// 	});

	// 	return () => {
	// 		socket.off('updateMember');
	// 	}
	// });

	
	return (
		<div className="title">
			<header>Joined Channels <hr /></header>
			{props.chanList && props.chanList.map(chan => (
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

function PublicChannelList(props: {chanList: IChannel[]}) {
	// const [chanList, setChanList] = useState<IChannel[]>([]);
	const currentUser = useAppSelector(state => state.user);
	const navigate = useNavigate();

	// const fetchPublic = async () => {
	// 	const response = await fetch(`${process.env.REACT_APP_BACK}channel/public`, {
	// 		method: 'GET',
	// 	})
	// 	const data = await response.json();
	// 	setChanList(data);
	// }
	// useEffect(() => {
	// 	fetchPublic();
	// }, []);

	// useEffect(() => {
	// 	socket.on('createChannelOk', (newChanId) => {
	// 		const fetchPublic = async () => {
	// 			const response = await fetch(`${process.env.REACT_APP_BACK}channel/public`, {
	// 				method: 'GET',
	// 			})
	// 			const data = await response.json();
	// 			setChanList(data);	
	// 		}
	// 		fetchPublic();
	// 	});
	// 	return () => {
	// 		socket.off('createChannelOk');
	// 	};
	// });

	return (
		<div className="title">

			<div className="bottom">
				<header>All Joinable Channels <hr /></header>
				{props.chanList && props.chanList.map(chan => (
					<ul key={chan.name} onClick={e => {  }}>
						<li>
							<div onClick={_ => navigate(`/Chat/channel/${chan.id}`)}>{chan.name}
								{
									chan.chanType == 1 &&
									<HiLockClosed style={{ float: 'right' }} />
								}
								{
									chan.chanType == 2 &&
									<BsFillKeyFill style={{ paddingLeft: '10px' }} />
								}
							</div>
						</li>
					</ul>
				))}
			</div>
		</div>
	);
}

function ChannelMemberList(props: { chan: IChannel }) {
	const [currentId, setCurrentId] = useState<number | undefined>(undefined);

	const changeId = (id: number) => {
		if (id == currentId)
			setCurrentId(undefined);
		else
			setCurrentId(id);
	}

	// const getChannel = async () => {
	// 	const response = await fetch(`${process.env.REACT_APP_BACK}channel/${props.chanId}`, {
	// 		method: 'GET',
	// 	})
	// 	const data = await response.json();
	// 	setCurrentChan(data);
	// }

	// useEffect(() => {
	// 	socket.on("updateMember", (data) => {
	// 		// getChannel();
	// 		props.reload();
	// 		console.log("updateMember received in member list");
	// 	});

	// 	return () => {
	// 		socket.off("updateMember");
	// 	}
	// });

	if (props.chan.users === undefined) {
		return (
			<div className="title"> Members <hr />
			</div>
		)
	}


	return (
		<div className="title"> Members <hr />
			{props.chan && props.chan.users?.map(user => (
				<div key={user.id} className="user-list">
					<ul onClick={e => { changeId(user.id) }}>
						<li>
							{user.username}
							{
								props.chan.owner?.id === user.id &&
								<FaCrown />
							}
							{
								props.chan.owner?.id !== user.id &&
									props.chan.admin?.find(obj => obj.id === user.id) &&
									<BsFillPersonFill />
							}
						</li>
					</ul>
					{
						currentId == user.id &&
						<CLickableMenu user={user} chan={props.chan} />
					}
				</div>
			))
			}
		</div>
	);

	// return (
	// 	<div className="title"> Members <hr />
	// 		{currentChan && currentChan.users?.map(user => (
	// 			<div key={user.id} className="user-list">
	// 				<ul onClick={e => { changeId(user.id) }}>
	// 					<li>
	// 						{user.username}
	// 						{
	// 							currentChan.owner.id === user.id &&
	// 							<FaCrown />
	// 						}
	// 						{
	// 							currentChan.owner.id !== user.id &&
	// 								currentChan.admin?.find(obj => obj.id === user.id) &&
	// 								<BsFillPersonFill />
	// 						}
	// 					</li>
	// 				</ul>
	// 				{
	// 					currentId == user.id &&
	// 					<CLickableMenu user={user} chan={currentChan} />
	// 				}
	// 			</div>
	// 		))
	// 		}
	// 	</div>
	// );
}

export function Channels() {
	const currentUser = useAppSelector(state => state.user);
	const [currentChan, setCurrentChan] = useState<IChannel | undefined>(undefined);
	const [joinedList, setJoinedList] = useState<IChannel[]>([]);
	const [publicList, setPublicList] = useState<IChannel[]>([]);
	const [reload, setReload] = useState(0);
	const { id } = useParams();

	useEffect(() => {
		const fetchCurrentChan = async () => {
			const response = await fetch(`${process.env.REACT_APP_BACK}channel/${id}`, {
				method: 'GET',
			})
			const data = await response.json();
			setCurrentChan(data);
			console.log("--- 0: fetchChan ---");
		}
		const fetchJoined = async () => {
			const response = await fetch(`${process.env.REACT_APP_BACK}channel/user/${currentUser.user?.id}`, {
				method: 'GET',
			})
			const data = await response.json();
			setJoinedList(data);
			console.log("--- 0: fetchJoined ---");
		}
		const fetchPublic = async () => {
			const response = await fetch(`${process.env.REACT_APP_BACK}channel/public`, {
				method: 'GET',
			})
			const data = await response.json();
			setPublicList(data);
			console.log("--- 0: fetchPublic ---");
		}
		fetchCurrentChan();
		fetchJoined();
		fetchPublic();
	}, [id]);

	const handleReload = () => {
		setReload(reload + 1);
	}

	useEffect(() => {
		socket.on("updateMember", (data) => {
			const fetchCurrentChan = async () => {
				const response = await fetch(`${process.env.REACT_APP_BACK}channel/${id}`, {
					method: 'GET',
				})
				const data = await response.json();
				setCurrentChan(data);
				console.log("--- 1: fetchCurrentChan (updateMember) ---");
		}
			const fetchJoined = async() => {
				const response = await fetch(`${process.env.REACT_APP_BACK}channel/user/${currentUser.user?.id}`, {
					method: 'GET',
				})
				const data = await response.json();
				setJoinedList(data);
				console.log("--- 1: fetchJoined (updateMember) ---");
		}
		fetchCurrentChan();
		fetchJoined();
		});

		socket.on("createChannelOk", (data) => {
			const fetchPublic = async () => {
				const response = await fetch(`${process.env.REACT_APP_BACK}channel/public`, {
					method: 'GET',
				})
				const data = await response.json();
				setPublicList(data);	
				console.log("--- 1: fetchPublic (createChannelOk) ---");
			}
			fetchPublic();
		});

		return () => {
			socket.off("updateMember");
			socket.off("createChannelOk");
		}
	});

	return (id) ? (
		<div id="chat-container">
			<div className="sidebar left-sidebar">
				<JoinedChannelList chanList={joinedList} />
				<AddChannel />
				<PublicChannelList chanList={publicList} />
			</div>

			{
				currentChan !== undefined &&
				<>
					<div className="chat-body">
						<ChannelHeader user={currentUser.user} channel={currentChan} reload={handleReload} />
						<ChannelMessages chan={currentChan} />
					</div>
					<div className="sidebar right-sidebar">
						{
							// currentChan.users.find(obj => obj.id === currentUser.user?.id) &&
							currentChan?.users &&
							<ChannelMemberList chan={currentChan} />
						}
					</div>
				</>
			}
		</div>
	) : (
		<div id="chat-container">
			<div className="sidebar left-sidebar">
				<JoinedChannelList chanList={joinedList} />
				<AddChannel />
				<PublicChannelList chanList={publicList} />
			</div>
		</div>
	);
}
