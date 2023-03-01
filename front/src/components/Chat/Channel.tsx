import { useEffect, useState } from "react";
import { BsFillKeyFill } from "react-icons/bs";
import { FaCrown } from "react-icons/fa";
import { HiLockClosed } from "react-icons/hi2";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { socket } from "../../App";
import { IChannel } from "../../interface/Channel";
import { addChannel, channelSlice } from "../../redux/channel";
import { useAppSelector } from "../../redux/Hook";
import { ChannelMessages } from "./ChannelMessages";
import CLickableMenu from "./clickableMenu";
import { AddChannel } from "./CreateChannel";

function GetChannelList() {
	const channels = useAppSelector(state => state.channel);
	const navigate = useNavigate();
	
	useEffect(() => {
		const fetchChanList = async () => {
			const response = await fetch(`${process.env.REACT_APP_BACK}channel/`, {
			method: 'GET',
		})
		const data = await response.json();
	}
	fetchChanList();
	}, []);

	console.log('chan redux: ', channels.channels);
	return (
		<div className="title">
			<header>All Channels <hr /></header>
			{channels && channels.channels.map(chan => (
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
	);}


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
								<BsFillKeyFill style={{ float: 'right'}} />
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
			setChanList(data);
		}
		// console.log('here');
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
								<BsFillKeyFill style={{ float: 'right'}} />
							}
						</div>
					</li>
				</ul>
			))}
		</div>
	);
}

function ChannelMemberList(props: { id: any }) {
	const [currentChan, setCurrentChan] = useState<IChannel | undefined>(undefined)
	// const currentChan = useAppSelector(state => state.channel);
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

	return (
		<div className="title"> Members <hr />
			{currentChan && currentChan.users.map(user => (
				<div className="user-list">
					<ul key={user.id} onClick={e => { changeId(user.id) }}>
						<li>
							{user.username}
							{
								currentChan.admin?.find(obj => obj === user) &&
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
	const [currentChan, setCurrentChan] = useState<IChannel | undefined>(undefined);

	return (
		<div id="chat-container">
			<div className="sidebar left-sidebar">
				{/* <JoinedChannelList /> */}
				{/* <ChannelList /> */}
				<GetChannelList />
				<PublicChannelList />
				<AddChannel />
			</div>
	
					<ChannelMessages id={props.chatId} currentChan={currentChan} setCurrentChan={setCurrentChan}/>
				<div className="sidebar right-sidebar">
					<ChannelMemberList id={props.chatId} />
				</div>

		</div>
	);
}