import { useState } from "react";
import { HiPlus } from "react-icons/hi2";
import { socket } from "../../App";

export function JoinChannel(props: {currentUser: any, chanid: any}) {

	const handleJoin = () => {
		socket.emit('joinChannel', {chanid: props.chanid});
	}

	if (props.chanid === undefined)
	{	
		return (<></>);
	}

	return (
		<div>
			<button onClick={handleJoin}>Join</button>
		</div>
	);
}

export function LeaveChannel (props: {currentUser: any, chanid: any}) {
	
	const handleLeave = () => {
		socket.emit('leaveChannel', {chanid: props.chanid});
	}

	if (props.chanid === undefined)
	{
		return (<></>);
	}

	return (
		<div>
			<button onClick={handleLeave}>Leave</button>
		</div>
	);
}

export function BanUser(chanid: any, userid: any) {
	console.log('ban');
	socket.emit('BanUser', {chanid: chanid, userid: userid});
}

export function MuteUser(chanid: any, userid: any) {
	console.log('mute');
	socket.emit('MuteUser', {chanid: chanid, userid: userid});
	// socket.on('muteUserOK', (userId, chanId) => {});
}