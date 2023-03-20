import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import swal from "sweetalert";
import { socket } from "../../App";
import { IUser, UserStatus } from "../../interface/User";
import { useAppDispatch, useAppSelector } from "../../redux/Hook";
import { addBlockedUser, unBlockUser } from "../../redux/user";


export default function HeaderButtons(props: { currentUser: IUser }) {
    const currentUser: IUser = props.currentUser;
    const myUser = useAppSelector(state => state.user);
    const [relation, setRelation] = useState<string>("none");
    const dispatch = useAppDispatch();

    useEffect( () => {
        Relations();
    })
    const spectate = () => {
        socket.emit("spectateGame", currentUser.id);
    }
    const Relations = async () => {
        await fetch(`${process.env.REACT_APP_BACK}user/relations`, {
            method: 'POST',
            body: JSON.stringify({
                userId: myUser.user?.id,
                friendId: currentUser.id,
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${myUser.myToken}`,
            }
        })
            .then(async response => {
                if (response.ok) {
                    const data = await response.json();
                    setRelation(data.relation);
                }
            })
    }

    const Block = async () => {
        await fetch(`${process.env.REACT_APP_BACK}user/block/${myUser.user?.id}`, {
            method: 'POST',
            body: JSON.stringify({
                blockedId: currentUser.id,
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${myUser.myToken}`,
            }
        })
            .then(async response => {
                if (response.ok)
                    dispatch(addBlockedUser(currentUser));
                setRelation("Blocked");

            })
    }
    const UnBlock = async () => {
        await fetch(`${process.env.REACT_APP_BACK}user/unblock/${myUser.user?.id}`, {
            method: 'DELETE',
            body: JSON.stringify({
                blockedId: currentUser.id,
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${myUser.myToken}`,
            }
        })
            .then(async response => {
                if (response.ok)
                    dispatch(unBlockUser(currentUser));
                setRelation("Nobody");

            })
    }

    return (
        <>
            {
                ((myUser.user && (myUser.user.blocked === undefined || myUser.user.blocked.find(block => block.id === currentUser.id) === undefined)) && currentUser.username !== myUser.user!.username) &&
                <>
                    {
                        currentUser.status === UserStatus.INGAME &&
                        <button className="button-style" onClick={_ => spectate()}> Spectate </button>
                    }
                    <InviteButton user={myUser.user} relation={relation} />
                    <button className="button-style" style={{ background: '#B33A3A' }} onClick={_ => Block()}> Block </button>

                </>
            }
            {
                ((myUser.user && (myUser.user.blocked !== undefined && myUser.user.blocked.find(block => block.id === currentUser.id) !== undefined)) && currentUser.username !== myUser.user!.username) &&
                <button className="button-style" style={{ background: '#B33A3A' }} onClick={_ => UnBlock()}> unblock </button>

            }
        </>
    )

};


export function InviteButton(props: { user: any, relation: string}) {
    
    const user = props.user;
    const pathname = window.location.pathname;
    const pathArray = pathname.split('/');
    let { id } = useParams();
    const myToken = useAppSelector(state => state.user.myToken);
    const [relation, setRelation] = useState<string>(props.relation);

    useEffect( () => {
        setRelation(props.relation);
    })
    const sendFriendRequest = async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        await fetch(`${process.env.REACT_APP_BACK}user/friend-request/send/${id}`, {
            method: 'POST',
            body: JSON.stringify({ userId: user.id }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${myToken}`,
            }
        })
            .then(async Response => {
                if (Response.ok) {
                    setRelation("friendRequestSent");
                    swal( "Your request has been sent", "", "success");
                    socket.emit("RequestSent", id);
                }
            })
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
        let str : string = "They" + " are now your friend!";
        swal("Congrats", str, "success");
        socket.emit("RequestAccepted", data.id);
    };


    return (
        <>
            {
                relation === "Nobody" &&
                <button className="reqButton pointer white width_50" onClick={_ => (sendFriendRequest())} >
                    Add Friend
                </button>
            }
            {
                relation === "Friend" &&
                <button className="button-style" onClick={_ => (setRelation("Nobody"))}> remove Friend </button>
            }
            {
                relation === "friendRequestSent" &&
                <button className="button-style" onClick={_ => (_)}> Request already send </button>
            }
            {
                relation === "friendRequestReceived" &&
                <button className="button-style" onClick={_ => (acceptFriendRequest(user.id))}> accept in Friend </button>
            }
        </>
    );
}

