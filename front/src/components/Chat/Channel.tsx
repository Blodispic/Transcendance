import * as React from 'react';
import { useEffect, useState } from "react";
import { BsFillKeyFill, BsFillPersonFill } from "react-icons/bs";
import { FaCrown, FaVolumeMute } from "react-icons/fa";
import { HiLockClosed } from "react-icons/hi2";
import { useNavigate, useParams } from "react-router-dom";
import { socket } from "../../App";
import { IChannel } from "../../interface/Channel";
import { IUser } from "../../interface/User";
import { addAdmin, addMember, banUser, joinChannel, muteUser, removeMember, setChannels, unBanUser, unMuteUser } from "../../redux/chat";
import { useAppDispatch, useAppSelector } from "../../redux/Hook";
import { ChannelHeader, ChannelMessages } from "./ChannelMessages";
import ClickableMenu from "./clickableMenu";
import { AddChannel } from "./CreateChannel";
import { page } from '../../interface/enum';

function JoinedChannelList() {
	const navigate = useNavigate();
	const currentUser: IUser | undefined = useAppSelector(state => state.user.user);
	const channels: IChannel[] = useAppSelector(state => state.chat.channels);

	return (
		<div className="upper">
			<header>Joined Channels <hr /></header>
			<div className='chat-list'>
				{channels && channels.map(chan => (
					<ul key={chan.name}>
						{
							chan.users.find(obj => obj.id === currentUser?.id) &&
							<li>
								<div onClick={() => navigate(`/Chat/channel/${chan.id}`)}>{chan.name}
									{
										chan.chanType === 1 &&
										<HiLockClosed className='channel-icon' />
									}
									{
										chan.chanType === 2 &&
										<BsFillKeyFill className='channel-icon' />
									}
								</div>
							</li>
						}

					</ul>
				))}
			</div>
		</div>
	);
}

function PublicChannelList() {
	const navigate = useNavigate();
	const channels: IChannel[] = useAppSelector(state => state.chat.channels);

	return (
		<div className="bottom">
			<header>All Joinable Channels <hr /></header>
			<div className='chat-list'>

				{channels && channels.map(chan => (
					<ul key={chan.name}>
						{
							chan.chanType !== 1 &&
							<li>
								<div onClick={() => navigate(`/Chat/channel/${chan.id}`)}>{chan.name}
									{
										chan.chanType === 2 &&
										<BsFillKeyFill className='channel-icon'/>
									}
								</div>
							</li>
						}
					</ul>
				))}
			</div>
		</div>
	);
}

function ChannelMemberList(props: { page: (page: page) => void }) {
	const [currentId, setCurrentId] = useState<number | undefined>(undefined);
	const currentUser = useAppSelector(state => state.user.user);
	const { id } = useParams();
	const [chanId, setChanId] = useState<number | undefined>(undefined);
	const currentChan: IChannel | undefined = useAppSelector(state =>
		state.chat.channels.find(chan => chan.id === chanId));

	useEffect(() => {
		if (id !== undefined) {
			setChanId(parseInt(id));
		}
	}, [id]);

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

			{currentChan && currentChan.admin?.map(admin => (
				<div key={admin.id} className="user-list">
					<ul onClick={() => changeId(admin.id)}>
						<li>
							{admin.username}
							{ currentChan.owner?.id === admin.id &&
								<FaCrown className='channel-icon' /> }
							{ currentChan.owner?.id !== admin.id &&
								<BsFillPersonFill className='channel-icon' /> }
							{ currentChan.muted && currentChan.muted.find(obj => obj.id === admin.id) &&
								<FaVolumeMute className='channel-icon' /> }
						</li>
					</ul>
					{ currentId === admin.id &&
						<ClickableMenu user={admin} chan={currentChan} page={props.page} /> }
				</div>
			))
			}

			{currentChan && currentChan.users?.map(user => (
				<div key={user.id} className="user-list">
					<ul onClick={() => changeId(user.id)}>
						<li>
							{currentChan.admin?.find(obj => obj.id === user.id) === undefined &&
								<>
									{user.username}
									{ currentChan.muted && currentChan.muted.find(obj => obj.id === user.id) &&
										<FaVolumeMute className='channel-icon' /> }
								</>
							}
						</li>
					</ul>
					{ (currentId === user.id && currentChan.admin.find(obj => obj.id === user.id) === undefined) &&
						<ClickableMenu user={user} chan={currentChan} page={props.page} /> }
				</div>
			))
			}

		</div>
	);
}

export function Channels(props: { page: (page: page) => void }) {
	const { id } = useParams();
	const dispatch = useAppDispatch();
	const currentUser: IUser | undefined = useAppSelector(state => state.user.user);

	useEffect(() => {
		const get_channels = async () => {
			await fetch(`${process.env.REACT_APP_BACK}channel`, {
				method: 'GET',
			}).then(async response => {
				const data = await response.json();

				if (response.ok) {
					dispatch(setChannels(data));
				}
			})
		}
		get_channels();
	}, []);

    useEffect(() => {
        socket.on("giveAdminOK", ({ userid, chanid }) => {
            dispatch(addAdmin({ chanid: chanid, userid: userid }));
        });
		socket.on("muteUser", ({chanid, userid, timer}) => {
			dispatch(muteUser({chanid: chanid, userid: userid}));

			setTimeout(() => {
				dispatch(unMuteUser({chanid: chanid, userid: userid}));
			}, timer);

		});
		socket.on("banUser", ({chanid, userid, timer}) => {
			dispatch(banUser({chanid: chanid, userid: userid}));
			dispatch(removeMember({chanid: chanid, userid: userid}));

			setTimeout(() => {
				dispatch(unBanUser({chanid: chanid, userid: userid}));
			}, timer);

		});

		socket.on("invitePrivate", (inviteDto) => {
			for (let i = 0; inviteDto.users[i]; i++) {
				dispatch(addMember({chanid: inviteDto.chanid, user: inviteDto.users[i]}));
			}
		});

		socket.on("invited", (chanId) => {
			if (currentUser !== undefined) {

				const fetchChanInfo = async () => {
					await fetch(`${process.env.REACT_APP_BACK}channel/${chanId}`, {
						method: 'GET',
					}).then(async response => {
						const data = await response.json();
						
						if (response.ok) {
							dispatch(joinChannel({ chanid: chanId, chan: data, user: currentUser }));
						}
					})
				}
				fetchChanInfo();
			}
		});

        return () => {
            socket.off("giveAdminOK");
			socket.off("muteUser");
			socket.off("banUser");
			socket.off("invitePrivate");
			socket.off("invited");
        }
    })

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
				<ChannelMemberList page={props.page} />
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
