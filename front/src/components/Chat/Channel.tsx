import { useEffect, useState } from "react";
import { BsFillKeyFill, BsFillPersonFill } from "react-icons/bs";
import { FaCrown } from "react-icons/fa";
import { HiLockClosed, HiPlusCircle } from "react-icons/hi2";
import { useNavigate, useParams } from "react-router-dom";
import { socket } from "../../App";
import { IChannel } from "../../interface/Channel";
import { IUser } from "../../interface/User";
import { useAppSelector } from "../../redux/Hook";
import { ChannelMessages } from "./ChannelMessages";
import CLickableMenu from "./clickableMenu";
import { AddChannel } from "./CreateChannel";

function JoinedChannelList() {
	const [chanList, setChanList] = useState<IChannel[]>([]);
	const currentUser = useAppSelector(state => state.user);
	const navigate = useNavigate();

	const fetchJoined = async () => {
		const response = await fetch(`${process.env.REACT_APP_BACK}channel/user/${currentUser.user?.id}`, {
			method: 'GET',
		})
		const data = await response.json();
		setChanList(data);
	}

	useEffect(() => {
		fetchJoined();
	}, []);

	useEffect(() => {
		socket.on('updateMember', (data) => {
			fetchJoined();
		});

		return () => {
			socket.off('updateMember');
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
	const currentUser = useAppSelector(state => state.user);
	const navigate = useNavigate();

	const fetchPublic = async () => {
		const response = await fetch(`${process.env.REACT_APP_BACK}channel/public`, {
			method: 'GET',
		})
		const data = await response.json();
		setChanList(data);
	}
	useEffect(() => {
		fetchPublic();
	}, []);

	useEffect(() => {
		socket.on('createChannelOk', (newChanId) => {
			const fetchPublic = async () => {
				const response = await fetch(`${process.env.REACT_APP_BACK}channel/public`, {
					method: 'GET',
				})
				const data = await response.json();
				setChanList(data);	
			}
			fetchPublic();
		});
		return () => {
			socket.off('createChannelOk');
		};
	});

	return (
		<div className="title">

			<div className="bottom">
				<header>All Joinable Channels <hr /></header>
				{chanList && chanList.map(chan => (
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

function ChannelMemberList(props: { chanId: any }) {
	const [currentId, setCurrentId] = useState<number | undefined>(undefined);
	const [currentChan, setCurrentChan] = useState<IChannel>();

	const changeId = (id: number) => {
		if (id == currentId)
			setCurrentId(undefined);
		else
			setCurrentId(id);
	}

	const getChannel = async () => {
		const response = await fetch(`${process.env.REACT_APP_BACK}channel/${props.chanId}`, {
			method: 'GET',
		})
		const data = await response.json();
		setCurrentChan(data);
	}
	
	useEffect(() => {
		getChannel();
	}, [props]);


	useEffect(() => {
		socket.on('joinChannel', (data) => {
			getChannel();
			console.log("joinChannel received in member list");
		});

		socket.on('leaveChannel', (data) => {
			getChannel();
			console.log("leaveChannel received in member list");
		});

		return () => {
			socket.off('joinChannel');
			socket.off('leaveChannel');
		}
	});


	if (props.chanId === undefined) {
		return (
			<div className="title"> Members <hr />
			</div>
		)
	}

	return (
		<div className="title"> Members <hr />
			{currentChan && currentChan.users?.map(user => (
				<div key={user.id} className="user-list">
					<ul onClick={e => { changeId(user.id) }}>
						<li>
							{user.username}
							{
								currentChan.owner.id === user.id &&
								<FaCrown />
							}
							{
								currentChan.owner.id !== user.id &&
									currentChan.admin?.find(obj => obj.id === user.id) &&
									<BsFillPersonFill />
							}
						</li>
					</ul>
					{
						currentId == user.id &&
						<CLickableMenu user={user} chan={currentChan} />
					}
				</div>
			))
			}
		</div>
	);
}

export function Channels() {
	const [currentChan, setCurrentChan] = useState<IChannel | undefined>(undefined);
	const currentUser = useAppSelector(state => state.user);
	const { id } = useParams();

	const getChannel = async () => {
		const response = await fetch(`${process.env.REACT_APP_BACK}channel/${id}`, {
			method: 'GET',
		})
		const data = await response.json();
		setCurrentChan(data);
	}

	return (
		<div id="chat-container">
			<div className="sidebar left-sidebar">
				<JoinedChannelList />
				<AddChannel />
				<PublicChannelList />
			</div>
			{
				id !== undefined &&
				<>
					{/* <ChannelMessages channel={currentChan} /> */}
					<ChannelMessages chanId={id} reload={getChannel} />

					{
						// currentChan.users.find(obj => obj.id === currentUser.user?.id) &&
						<div className="sidebar right-sidebar">
							<ChannelMemberList chanId={id} />
						</div>
					}
				</>
			}
		</div>
	);
}
