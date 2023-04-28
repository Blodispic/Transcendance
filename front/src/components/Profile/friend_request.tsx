import * as React from 'react';
import { useEffect, useState } from "react";
import { ImCheckmark, ImCross } from "react-icons/im";
import { socket } from "../../App";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from '../../redux/Hook';
import swal from 'sweetalert';

interface friend {
    name: string,
    avatar: string,
    id: number,
    ReqStatus: string,
    UserStatus: string;
}
export function Friends() {

    const [friendReq, setFriendReq] = useState<friend[]>([]);
    const [friend, setFriend] = useState<friend[]>([]);
    const [updateFriend, setUpdateFriend] = useState(false);
    const navigate = useNavigate();
    const myToken = useAppSelector(state => state.user.myToken);
    

    useEffect(() => {
        const checkFriendRequest = async () => {
            const response = await fetch(`${process.env.REACT_APP_BACK}user/friendsRequest`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${myToken}`,
                },
            })
                .then(async response => {
                    const data = await response.json();
                    const pendingFriendRequests = data.filter((friendRequest: { ReqStatus: string; }) => friendRequest.ReqStatus === "Pending");
                    setFriendReq(pendingFriendRequests);
                })
        };
        const checkFriend = async () => {
            const response = await fetch(`${process.env.REACT_APP_BACK}user/friends`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${myToken}`,
                },
            })
                .then(async response => {
                    if (response.ok) {
                        const data = await response.json();
                        setFriend(data);
                    }
                })
        };
        checkFriend();
        checkFriendRequest();
        socket.on('UpdateSomeone', () => {
            setUpdateFriend(!updateFriend);
        });
        return () => {
            socket.off('UpdateSomeone');
        };
    }, [updateFriend]);


    const acceptFriendRequest = async (id: number) => {
        const response = await fetch(`${process.env.REACT_APP_BACK}user/friends/accept`, {
            method: 'POST',
            body: JSON.stringify({ friendId: id}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${myToken}`,
            },
        })
        .then (async response => {
            if (response.ok) {
                const data = await response.json();
                socket.emit("RequestAccepted", data.id);
                setUpdateFriend(!updateFriend);
            }
        })
    };

    const declineFriendRequest = async (id: number) => {
        const response = await fetch(`${process.env.REACT_APP_BACK}user/friends/decline`, {
            method: 'POST',
            body: JSON.stringify({ friendId: id }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${myToken}`,
            },
        })
        .then (async response => {
            if (response.ok) {
                const data = await response.json();
                socket.emit("RequestDeclined", data.id);
                setUpdateFriend(!updateFriend);
            }
        })
    };

    const removeFriend = async (id: number) => {
        await fetch(`${process.env.REACT_APP_BACK}user/deletefriend/0`, {
            method: 'DELETE',
            body: JSON.stringify({ friendId: id }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${myToken}`,
            },
        })
            .then(async Response => {
                if (Response.ok) {
                    swal("", "Friend Remove", "success");
                    socket.emit("RemoveFriend", id);
                    setUpdateFriend(!updateFriend);
                }
            });
    };


    const FriendsReqList = () => {
        return (friendReq && friendReq.length > 0) ? (
            <ul className="friends-list">
                {
                    friendReq.map((friend) => (
                        <li className="friend-block" key={friend.name}>
                            <div className="friend-img pointer" onClick={() => navigate(`../Profile/${friend.id}`)}>
                                <img src={`${process.env.REACT_APP_BACK}user/${friend.id}/avatar`} alt={friend.name} />
                            </div>
                            <div className="friend-info">
                                <div className="friend-name">{friend.name}</div>
                                <div className={"color-status " + friend.UserStatus}>{friend.UserStatus}</div>
                            </div>
                            <div className="friend-actions">
                                <button className="accept-button" onClick={() => acceptFriendRequest(friend.id)}><ImCheckmark /></button>
                                <button className="refuse-button" onClick={() => declineFriendRequest(friend.id)}><ImCross /></button>
                            </div>
                        </li>
                    ))}
            </ul>
        ) : <></>;
    };


    const FriendsList = () => {
        return (friend && friend.length > 0) ? (
            <ul className="friends-list">
                {
                    friend.map((friend) => (
                        <li className="friend-block" key={friend.name}>
                            <div className="friend-img pointer" onClick={() => navigate(`../Profile/${friend.id}`)}>
                                <img src={`${process.env.REACT_APP_BACK}user/${friend.id}/avatar`} alt={friend.name} />
                            </div>
                            <div className="friend-info">
                                <div className="friend-name">{friend.name}</div>
                                <div className={"color-status " + friend.UserStatus}>{friend.UserStatus}</div>
                                <button onClick={() => (removeFriend(friend.id))}> Remove Friend </button>
                            </div>
                        </li>
                    ))
                }
            </ul>
        ) : <></>;
    };

    return (
        <div className='FriendHeader'>
            <div className='FriendRequestBlock'>
                <FriendsReqList />
            </div>
            <hr className="separate-line" />
            <div className='FriendListBlock'>
                <FriendsList />
            </div>
        </div>
    )
}
