import { useEffect, useState } from "react";
import { BsFillKeyFill, BsFillPersonFill } from "react-icons/bs";
import { FaCrown } from "react-icons/fa";
import { HiLockClosed } from "react-icons/hi2";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
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

	
	useEffect(() => {
		const fetchJoined = async () => {
			const response = await fetch(`${process.env.REACT_APP_BACK}channel/user/${currentUser.user?.id}`, {
				method: 'GET',
			})
			const data = await response.json();
			setChanList(data);
			console.log("joined chan: " , chanList);
		}
		fetchJoined();
	}, []);



	
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
	const navigate = useNavigate();

	useEffect(() => {
		const fetchPublic = async () => {
			const response = await fetch(`${process.env.REACT_APP_BACK}channel/public`, {
				method: 'GET',
			})
			const data = await response.json();
			setChanList(data);
		}
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
		</div>
	);
}

function ChannelMemberList(props: { channel: IChannel }) {
	const [currentId, setCurrentId] = useState<number | undefined>(undefined);
	const [currentChan, setCurrentChan] = useState<IChannel>(props.channel);

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
								props.channel.owner.id === user.id &&
								<FaCrown />
							}
							{
								props.channel.owner.id !== user.id &&
									props.channel.admin?.find(obj => obj.id === user.id) &&
									<BsFillPersonFill />
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
	const currentUser = useAppSelector(state => state.user);

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
		});

		socket.on('leaveChannel', (data) => {
			getChannel();
		});

		return () => {
			socket.off('joinChannel');
			socket.off('leaveChannel');
		}
	});

	return (
		<div id="chat-container">
			<div className="sidebar left-sidebar">
				<JoinedChannelList />
				<AddChannel />
				<PublicChannelList />
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