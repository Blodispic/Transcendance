import * as React from 'react';
import { useEffect, useState } from "react";
import { ImCheckmark, ImCross } from "react-icons/im";
import { socket } from "../../App";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from '../../redux/Hook';
import swal from 'sweetalert';

export function Friends() {

    const [friendReq, setFriendReq] = useState<{ name: string, avatar: string, id: number, ReqStatus: string, UserStatus: string }[]>([]);
    const [friend, setFriend] = useState<{ name: string, avatar: string, id: number, ReqStatus: string, UserStatus: string }[]>([]);
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
            });
            const data = await response.json();
            const pendingFriendRequests = data.filter((friendRequest: { ReqStatus: string; }) => friendRequest.ReqStatus === "Pending");
            setFriendReq(pendingFriendRequests);
        };

        checkFriendRequest();
        socket.on('UpdateSomeone', () => {
            setUpdateFriend(!updateFriend);
        });
            return () => {
        socket.off('UpdateSomeone');
    };
    }, [updateFriend]);

    useEffect(() => {
        const checkFriend = async () => {
            const response = await fetch(`${process.env.REACT_APP_BACK}user/friends`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${myToken}`,
                },
            });
            const data = await response.json();
            setFriend(data);
        };

        checkFriend();
            return () => {
        // socket.off('UpdateSomeone');
    };
    }, [setUpdateFriend, updateFriend]);

    interface FriendsListProps {
        friends: { name: string, avatar: string, id: number, ReqStatus: string, UserStatus: string }[];
    }

    const acceptFriendRequest = async (id: number) => {
        const response = await fetch(`${process.env.REACT_APP_BACK}user/friends/accept`, {
            method: 'POST',
            body: JSON.stringify({ friendId: id}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${myToken}`,
            },
        });
        const data = await response.json();
        setFriendReq((prevFriendReq) => prevFriendReq.filter((req) => req.id !== id));
        const str : string = "They are now your friend!";
        swal("Congrats", str, "success");
        socket.emit("RequestAccepted", data.id);
        setUpdateFriend(prevFlag => !prevFlag);
    };

    const declineFriendRequest = async (id: number) => {
        const response = await fetch(`${process.env.REACT_APP_BACK}user/friends/decline`, {
            method: 'POST',
            body: JSON.stringify({ friendId: id }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${myToken}`,
            },
        });
        const data = await response.json();
        setUpdateFriend(prevFlag => !prevFlag);
        console.log("data = ", data)
        const str : string = "You declined their friend request!"
        swal("Congrats", str, "success");
        socket.emit("RequestDeclined", data.id);
        setUpdateFriend(prevFlag => !prevFlag);
    };

    const FriendsReqList = (props: FriendsListProps) => {
        return (
            <ul className="friends-list">
                {props.friends && props.friends.length > 0 ? (
                    props.friends.map((friend) => (
                        <li className="friend-block" key={friend.name}>
                            <div className="friend-img pointer" onClick={() => navigate(`../Profile/${friend.id}`)}>
                                <img src={`${process.env.REACT_APP_BACK}user/${friend.id}/avatar`} alt={friend.name} />
                            </div>
                            <div className="friend-info">
                                <div className="friend-name">{friend.name}</div>
                                <div className={"color-status " + friend.UserStatus}>{friend.UserStatus}</div>
                            </div>
                            <div className="friend-actions">
                                <button className="accept-button" onClick={() => acceptFriendRequest(friend.id)}>
                                    <ImCheckmark />
                                </button>
                                <button className="refuse-button" onClick={() => declineFriendRequest(friend.id)}>
                                    <ImCross />
                                </button>
                            </div>
                        </li>
                    ))
                ) : (
                    <></>
                )}
            </ul>
        );
    };




    const FriendsReq = () => {
        return <FriendsReqList friends={friendReq} />;
    }

    const FriendsList = (props: FriendsListProps) => {
        return (
            <ul className="friends-list">
                {props.friends && props.friends.length > 0 ? (
                    props.friends.map((friend) => (
                        <li className="friend-block" key={friend.name}>
                            <div className="friend-img pointer" onClick={() => navigate(`../Profile/${friend.id}`)}>
                                <img src={`${process.env.REACT_APP_BACK}user/${friend.id}/avatar`} alt={friend.name} />
                            </div>
                            <div className="friend-info">
                                <div className="friend-name">{friend.name}</div>
                                <div className={"color-status " + friend.UserStatus}>{friend.UserStatus}</div>
                            </div>
                        </li>
                    ))
                ) : (
                    <></>
                )}
            </ul>
        );
    };




    const Friends = () => {
        return <FriendsList friends={friend} />;
    }

    return (
        <div className='FriendHeader'>

            <div className='FriendRequestBlock'>
                <FriendsReq />
            </div>
            <hr className="separate-line" />
            <div className='FriendListBlock'>
                <Friends />
            </div>
        </div>
    )
}
