import { useEffect, useState } from "react";
import { BsFillKeyFill, BsFillPersonFill } from "react-icons/bs";
import { FaCrown } from "react-icons/fa";
import { HiLockClosed } from "react-icons/hi2";
import { useNavigate, useParams } from "react-router-dom";
import { socket } from "../../App";
import { IChannel } from "../../interface/Channel";
import { addChannel, addMember, removeMember } from "../../redux/chat";
import { useAppDispatch, useAppSelector } from "../../redux/Hook";
import { ChannelHeader, ChannelMessages } from "./ChannelMessages";
import CLickableMenu from "./clickableMenu";
import { AddChannel } from "./CreateChannel";

// function JoinedChannelList(props: {chanList: IChannel[]}) {
function JoinedChannelList() {
	const navigate = useNavigate();
	const [chanList, setChanList] = useState<IChannel[] | undefined>(undefined);
	const currentUser = useAppSelector(state => state.user);
	const [reload, setReload] = useState(0);

	const handleReload = () => {
		setReload(reload + 1);
	}

	useEffect(() => {
		const fetchJoined = async () => {
			const response = await fetch(`${process.env.REACT_APP_BACK}channel/user/${currentUser.user?.id}`, {
				method: 'GET',
			})
			const data = await response.json();
			setChanList(data);
			// console.log("---", reload,": fetchJoined ---");
		}
		fetchJoined();
		}, [reload]);


	useEffect(() => {
		socket.on("joinChannelOK", (data) => {
			handleReload();
		});
		socket.on("leaveChannelOK", (data) => {
			handleReload();
		});

		return () => {
				socket.off("joinChannelOK");
				socket.off("leaveChannelOK");
			}
	});
	
	return (
		<div className="title">
			<header>Joined Channels <hr /></header>
			{chanList && chanList.map(chan => (
				<ul key={chan.name}>
					<li>
						<div onClick={_ => navigate(`/Chat/channel/${chan.id}`)}>{chan.name}
							{
								chan.chanType === 1 &&
								<HiLockClosed style={{ float: 'right' }} />
							}
							{
								chan.chanType === 2 &&
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
	const navigate = useNavigate();
	const channels = useAppSelector(state => state.chat.channels);

	// need to apply chan mode condition to hide private chan
	return (
		<div className="title">

			<div className="bottom">
				<header>All Joinable Channels <hr /></header>
				{channels && channels.map(chan => (
					<ul key={chan.name} onClick={e => {  }}>
						<li>
							<div onClick={_ => navigate(`/Chat/channel/${chan.id}`)}>{chan.name}
								{
									chan.chanType === 1 &&
									<HiLockClosed style={{ float: 'right' }} />
								}
								{
									chan.chanType === 2 &&
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

function ChannelMemberList() {
	const [currentId, setCurrentId] = useState<number | undefined>(undefined);
	const currentUser = useAppSelector(state => state.user.user);
	// const currentChan = useAppSelector(state => 
	// 	state.chat.channels.find(chan => chan.id === props.chanId));
	const dispatch = useAppDispatch();

		const { id } = useParams();
		const [chanId, setChanId] = useState<number | undefined>(undefined);
	
		useEffect(() => {
			if (id !== undefined) {
				setChanId(parseInt(id));
			}
		}, [id]);
	
		const currentChan = useAppSelector(state => 
			state.chat.channels.find(chan => chan.id === chanId));

		useEffect(() => {
			socket.on("joinChannel", (user) => {
				dispatch(addMember({id: currentChan?.id, user: user}));
			});
	
			socket.on("leaveChannel", (user) => {
				dispatch(removeMember({id: currentChan?.id, user: user}));
			});
			return () => {
					socket.off("joinChannel");
					socket.off("leaveChannel");
				}
		});
		
	const changeId = (id: number) => {
		if (id === currentId)
			setCurrentId(undefined);
		else
			setCurrentId(id);
	}

	if (currentChan?.users === undefined || (currentChan.users?.find(obj => obj.id === currentUser?.id) === undefined)) {
		return (
			<div className="title"> Members <hr />
			</div>
		)
	}

	return (
		<div className="title"> Members <hr />
			{currentChan && currentChan.users?.map(user => (
				<div key={user.id} className="user-list">
					<ul onClick={e => changeId(user.id)}>
						<li>
							{user.username}
							{
								currentChan.owner?.id === user.id &&
								<FaCrown />
							}
							{
								currentChan.owner?.id !== user.id &&
									currentChan.admin?.find(obj => obj.id === user.id) &&
									<BsFillPersonFill />
							}
						</li>
					</ul>
					{
						currentId === user.id &&
						<CLickableMenu user={user} chan={currentChan} />
					}
				</div>
			))
			}
		</div>
	);
}

export function Channels() {
	const currentUser = useAppSelector(state => state.user);
	const [joinedList, setJoinedList] = useState<IChannel[]>([]);
	const { id } = useParams();
	// const [chanId, setChanId] = useState<number | undefined>(undefined);

	// useEffect(() => {
	// 	if (id !== undefined) {
	// 		setChanId(parseInt(id));
	// 	}
	// }, [id]);

	return (id) ? (
		<div id="chat-container">
			<div className="sidebar left-sidebar">
				<JoinedChannelList />
				<AddChannel />
				<PublicChannelList />
			</div>
			<div className="chat-body">
				<ChannelHeader />
				<ChannelMessages />
			</div>
			<div className="sidebar right-sidebar">
				{
					// currentChan.users.find(obj => obj.id === currentUser.user?.id) &&
					currentUser.user &&
					<ChannelMemberList />
				}
			</div>
		</div>
	) : (
		<div id="chat-container">
			<div className="sidebar left-sidebar">
				<JoinedChannelList />
				<AddChannel />
				<PublicChannelList />
			</div>
		</div>
	);
}







// export function Channels() {
// 	const currentUser = useAppSelector(state => state.user);
// 	const [currentChan, setCurrentChan] = useState<IChannel | undefined>(undefined);
// 	const [joinedList, setJoinedList] = useState<IChannel[]>([]);
// 	const [publicList, setPublicList] = useState<IChannel[]>([]);
// 	const [reload, setReload] = useState(0);
// 	const { id } = useParams();

// 	useEffect(() => {
// 		const fetchCurrentChan = async () => {
// 			const response = await fetch(`${process.env.REACT_APP_BACK}channel/${id}`, {
// 				method: 'GET',
// 			})
// 			const data = await response.json();
// 			setCurrentChan(data);
// 			// console.log("---", reload,": fetchChan ---");
// 		}
// 		// const fetchJoined = async () => {
// 		// 	const response = await fetch(`${process.env.REACT_APP_BACK}channel/user/${currentUser.user?.id}`, {
// 		// 		method: 'GET',
// 		// 	})
// 		// 	const data = await response.json();
// 		// 	setJoinedList(data);
// 		// 	console.log("---", reload,": fetchJoined ---");
// 		// }
// 		const fetchPublic = async () => {
// 			const response = await fetch(`${process.env.REACT_APP_BACK}channel/public`, {
// 				method: 'GET',
// 			})
// 			const data = await response.json();
// 			setPublicList(data);
// 			// console.log("---", reload,": fetchPublic ---");
// 		}

// 		// socket.on("createChannelOk", (data) => {
// 		// 	console.log("+++ create chan +++");
// 		// 	handleReload();
// 		// });

// 		// socket.on("updateJoined", (data) => {
// 		// 	console.log("+++ joined update +++");
// 		// 	handleReload();
// 		// });

// 		socket.on("updateMember", (data) => {
// 			console.log("+++ member update +++");
// 			handleReload();
// 		});

// 		fetchCurrentChan();
// 		// fetchJoined();
// 		fetchPublic();
		
// 		return () => {
// 				socket.off("updateMember");
// 				// socket.off("updateJoined");
// 				// socket.off("createChannelOk");
// 			}
// 	}, [id, reload]);

// 	const handleReload = () => {
// 		setReload(reload + 1);
// 	}

// 	if (currentChan !== undefined)
// 		console.log(reload, " channame: ", currentChan?.name ," | users: ", currentChan.users?.length , " | joined: ", joinedList?.length);

// 	return (id) ? (
// 		<div id="chat-container">
// 			<div className="sidebar left-sidebar">
// 				<JoinedChannelList />
// 				<AddChannel />
// 				<PublicChannelList chanList={publicList} reload={handleReload}/>
// 			</div>

// 			{
// 				currentChan !== undefined &&
// 				<>
// 					<div className="chat-body">
// 						<ChannelHeader user={currentUser.user} channel={currentChan} reload={handleReload} />
// 						<ChannelMessages chan={currentChan} />
// 					</div>
// 					<div className="sidebar right-sidebar">
// 						{
// 							// currentChan.users.find(obj => obj.id === currentUser.user?.id) &&
// 							currentUser.user &&
// 							<ChannelMemberList user={currentUser.user} chan={currentChan} reload={handleReload} />
// 						}
// 					</div>
// 				</>
// 			}
// 		</div>
// 	) : (
// 		<div id="chat-container">
// 			<div className="sidebar left-sidebar">
// 				<JoinedChannelList />
// 				<AddChannel />
// 				<PublicChannelList chanList={publicList} reload={handleReload}/>
// 			</div>
// 		</div>
// 	);
// }




	/**
	 *  useEffect(() => {
	Promise.all([
	  fetch('https://jsonplaceholder.typicode.com/users'),
	  fetch('https://jsonplaceholder.typicode.com/posts'),
	])
	  .then(([resUsers, resPosts]) => 
		Promise.all([resUsers.json(), resPosts.json()])
	  )
	  .then(([dataUsers, dataPosts]) => {
		setUsers(dataUsers);
		setPosts(dataPosts);
		setCombinedData(dataUsers.concat(dataPosts));
	  });
  }, []);

	 */

	// 	useEffect(() => {
	// 	socket.on("updateMember", () => {
	// 		Promise.all([
	// 			fetch(`${process.env.REACT_APP_BACK}channel/${id}`, { method: 'GET', }),
	// 			fetch(`${process.env.REACT_APP_BACK}channel/user/${currentUser.user?.id}`, { method: 'GET', })
	// 		])
	// 			.then(([resChan, resJoined]) => Promise.all([resChan.json(), resJoined.json()]))
	// 			.then(([dataChan, dataJoined]) => {
	// 				setCurrentChan(dataChan);
	// 				setJoinedList(dataJoined);
	// 				console.log("1: Promise.All : channame: ", currentChan?.name ," | users: ", currentChan?.users.length , " | joined: ", joinedList.length);
	// 			})
	// 	});

	// 	return () => {
	// 		socket.off("updateMember");
	// 	}
	// });

	// useEffect(() => {
	// 	socket.on("createChannelOk", (data) => {
	// 		const fetchPublic = async () => {
	// 			const response = await fetch(`${process.env.REACT_APP_BACK}channel/public`, {
	// 				method: 'GET',
	// 			})
	// 			const data = await response.json();
	// 			setPublicList(data);
	// 			console.log("--- 1: fetchPublic (createChannelOk) ---");
	// 		}
	// 		fetchPublic();
	// 	});

	// 	return () => {
	// 		socket.off("createChannelOk");
	// 	}
	// });

	// useEffect(() => {
	// 	socket.on("updateMember", () => {
	// 		const fetchCurrentChan = async () => {
	// 			const response = await fetch(`${process.env.REACT_APP_BACK}channel/${id}`, {
	// 				method: 'GET',
	// 			})
	// 			const data = await response.json();
	// 			setCurrentChan(data);
	// 			console.log("--- 1: fetchCurrentChan (updateMember) ---");
	// 	}

	// 	fetchCurrentChan();
	// 	});

	// 	return () => {
	// 		socket.off("updateMember");
	// 	}
	// });

	// useEffect(() => {
	// 	socket.on("updateMember", () => {
	// 		const fetchJoined = async() => {
	// 			const response = await fetch(`${process.env.REACT_APP_BACK}channel/user/${currentUser.user?.id}`, {
	// 				method: 'GET',
	// 			})
	// 			const data = await response.json();
	// 			setJoinedList(data);
	// 			console.log("--- 1: fetchJoined (updateMember) ---");
	// 	}
	// 	fetchJoined();
	// 	});

	// 	return () => {
	// 		socket.off("updateMember");
	// 	}
	// });
