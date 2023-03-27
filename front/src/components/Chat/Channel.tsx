import * as React from 'react';
import { useEffect, useState } from "react";
import { AiOutlineStop } from "react-icons/ai";
import { BsFillKeyFill, BsFillPersonFill } from "react-icons/bs";
import { FaCrown, FaVolumeMute } from "react-icons/fa";
import { HiLockClosed } from "react-icons/hi2";
import { useNavigate, useParams } from "react-router-dom";
import { socket } from "../../App";
import { IChannel } from "../../interface/Channel";
import { IUser } from "../../interface/User";
import { addAdmin, banUser, muteUser, setChannels, unBanUser, unMuteUser } from "../../redux/chat";
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
			{channels && channels.map(chan => (
				<ul key={chan.name}>
					{
						chan.users.find(obj => obj.id === currentUser?.id) &&
						<li>
							<div onClick={() => navigate(`/Chat/channel/${chan.id}`)}>{chan.name}
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
					}

				</ul>
			))}
		</div>
	);
}

function PublicChannelList() {
	const navigate = useNavigate();
	const channels: IChannel[] = useAppSelector(state => state.chat.channels);

	return (
		<div className="bottom">
				<header>All Joinable Channels <hr /></header>
				{channels && channels.map(chan => (
					<ul key={chan.name}>
						{
							chan.chanType !== 1 &&
							<li>
								<div onClick={() => navigate(`/Chat/channel/${chan.id}`)}>{chan.name}
									{
										chan.chanType === 2 &&
										<BsFillKeyFill style={{ paddingLeft: '10px' }} />
									}
								</div>
							</li>
						}
					</ul>
				))}
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
			{currentChan && currentChan.users?.map(user => (
				<div key={user.id} className="user-list">
					<ul onClick={() => changeId(user.id)}>
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
							{
								currentChan.banned && currentChan.banned.find(obj => obj.id === user.id) &&
								<AiOutlineStop />
							}
							{
								currentChan.muted && currentChan.muted.find(obj => obj.id === user.id) &&
								<FaVolumeMute />
							}
						</li>
					</ul>
					{
						currentId === user.id &&
						<ClickableMenu user={user} chan={currentChan} page={props.page} />
					}
				</div>
			))
			}
		</div>
	);
}

export function Channels(props: { page: (page: page) => void }) {
	const { id } = useParams();
	const dispatch = useAppDispatch();

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

			setTimeout(() => {
				dispatch(unBanUser({chanid: chanid, userid: userid}));
			}, timer);

		});
        return () => {
            socket.off("giveAdminOK");
			socket.off("muteUser");
			socket.off("banUser");
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
