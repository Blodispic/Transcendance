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

export function BanUser(props: {chanid: any, userid: any}) {
	socket.emit('BanUser', {chanid: props.chanid, userid: props.userid});
}