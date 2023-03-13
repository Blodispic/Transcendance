import react, { useEffect, useState } from "react";
import { ImCheckmark, ImCross } from "react-icons/im";
import { IUser } from "../../interface/User";
import { socket } from "../../App";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from '../../redux/Hook';
import swal from 'sweetalert';

export function InviteButton(props: { user: any }) {
    const { user } = props;

    const pathname = window.location.pathname;
    const pathArray = pathname.split('/');
    // const id = pathArray[pathArray.length - 1];
    const [ReqStatus, setStatus] = useState<string>('+ Add Friend');
    const [myVar, setMyVar] = useState<boolean>(true);
    let { id } = useParams();
    const myToken = useAppSelector(state => state.user.myToken);


    const ifFriend = async () => {
        await fetch(`${process.env.REACT_APP_BACK}user/friend/check`, {
            method: 'POST',
            body: JSON.stringify({
                myId: user.id,
                friendId: id,
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${myToken}`,
            },
        })
            .then(async response => {
                console.log("truefalse")
                const data = await response.json();
                // console.log(data);
                // check for error response
                if (response.ok) {
                    setMyVar(!data);
                }

            })
    }

    const sendFriendRequest = async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        await fetch(`${process.env.REACT_APP_BACK}user/friend-request/send/${id}`, {
            method: 'POST',
            body: JSON.stringify({ userId: user.id }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${myToken}`,

            },
        });
        setStatus('Pending');
        swal("Pending", "Your request has been sent", "success");
        socket.emit("RequestSent", id);
    }

    useEffect(() => {

        const checkFriendRequest = async () => {
            const response = await fetch(`${process.env.REACT_APP_BACK}user/friend-request/status/${id}`, {
                method: 'POST',
                body: JSON.stringify({ userId: user.id }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${myToken}`,
             },
            });
            const data = await response.json()
            if (data.ReqStatus)
                setStatus(data.ReqStatus);
            else
                setStatus("+ Add Friend");
        }
        console.log("friend id", id);
        if (id) {
            ifFriend();
            checkFriendRequest();
        }
    }, [id, user]);


    return (myVar) ? (

        <button className="reqButton pointer white width_50" onClick={_ => (setMyVar(false), sendFriendRequest())} >
            {ReqStatus}
        </button>
    ) : <></>;
}


export function Friends(props: { user: IUser }) {
    const { user } = props;
    const [friendReq, setFriendReq] = useState<{ name: string, avatar: string, id: number, ReqStatus: string, UserStatus: string }[]>([]);
    const [friend, setFriend] = useState<{ name: string, avatar: string, id: number, ReqStatus: string, UserStatus: string }[]>([]);
    const [updateFriend, setUpdateFriend] = useState(false);
    const navigate = useNavigate();
    const myToken = useAppSelector(state => state.user.myToken);

    useEffect(() => {
        const checkFriendRequest = async () => {
            const response = await fetch(`${process.env.REACT_APP_BACK}user/friendsRequest`, {
                method: 'POST',
                body: JSON.stringify({ userId: user.id }),
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
            setUpdateFriend(prevFlag => !prevFlag);
        });
            return () => {
        socket.off('UpdateSomeone');
    };
    }, [updateFriend]);

    useEffect(() => {
        const checkFriend = async () => {
            const response = await fetch(`${process.env.REACT_APP_BACK}user/friends`, {
                method: 'POST',
                body: JSON.stringify({ userId: user.id }),
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
        socket.off('UpdateSomeone');
    };
    }, [setUpdateFriend, updateFriend]);

    interface FriendsListProps {
        friends: { name: string, avatar: string, id: number, ReqStatus: string, UserStatus: string }[];
    }

    const acceptFriendRequest = async (id: number) => {
        const response = await fetch(`${process.env.REACT_APP_BACK}user/friends/accept`, {
            method: 'POST',
            body: JSON.stringify({ friendId: id, userId: user.id }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${myToken}`,
            },
        });
        const data = await response.json();
        setFriendReq((prevFriendReq) => prevFriendReq.filter((req) => req.id !== id));
        // console.log("Data :", data);
        let str : string = "They" + " are now your friend!";
        swal("Congrats", str, "success");
        socket.emit("RequestAccepted", data.id);
    };

    const declineFriendRequest = async (id: number) => {
        const response = await fetch(`${process.env.REACT_APP_BACK}user/friends/decline`, {
            method: 'POST',
            body: JSON.stringify({ friend: id, userId: user.id }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${myToken}`,
            },
        });
        const data = await response.json();
        setFriendReq(prevState => prevState.filter(declined => declined.id !== id));
        let str : string = "You declined " + "their" + " friend request!"
        swal("Congrats", str, "success");
        socket.emit("RequestDeclined", data.id);
    };

    const FriendsReqList = (props: FriendsListProps) => {
        return (
            <ul className="friends-list">
                {props.friends && props.friends.length > 0 ? (
                    props.friends.map((friend) => (
                        <li className="friend-block" key={friend.name}>
                            <div className="friend-img pointer" onClick={_ => navigate(`../Profile/${friend.id}`)}>
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
                            <div className="friend-img pointer" onClick={_ => navigate(`../Profile/${friend.id}`)}>
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
