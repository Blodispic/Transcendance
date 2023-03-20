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
        console.log(myUser.user?.id, currentUser.id)
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
                    console.log("relation ", data);
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
                if (response.ok) {
                    dispatch(addBlockedUser(currentUser));
                    setRelation("Blocked");
                }

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
                if (response.ok) {
                    dispatch(unBlockUser(currentUser));
                    setRelation("Nobody");
                }
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
                    <InviteButton user={currentUser} relation={relation} setRelation={setRelation} />
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


export function InviteButton(props: { user: any, relation: string, setRelation: Function}) {
    
    const user = props.user;
    const myUser = useAppSelector(state => state.user);
    const pathname = window.location.pathname;
    const pathArray = pathname.split('/');
    // let { id } = useParams();
    const myToken = useAppSelector(state => state.user.myToken);

    useEffect( () => {
        console.log("ca eload?")
        // setRelation(props.relation);
    })
    const sendFriendRequest = async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        await fetch(`${process.env.REACT_APP_BACK}user/friend-request/send/${user.id}`, {
            method: 'POST',
            body: JSON.stringify({ userId: myUser.user!.id }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${myToken}`,
            }
        })
            .then(async Response => {
                if (Response.ok) {
                    props.setRelation("friendRequestSent");
                    swal( "Your request has been sent", "", "success");
                    socket.emit("RequestSent", user.id);

                }
            })
    }

    const acceptFriendRequest = async () => {
        const response = await fetch(`${process.env.REACT_APP_BACK}user/friends/accept`, {
            method: 'POST',
            body: JSON.stringify({ friendId: user.id, userId: myUser.user!.id }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${myToken}`,
            },
        })
        .then ( async Response => {
            if (Response.ok)
            {
                let str : string = "They" + " are now your friend!";
                swal("Congrats", str, "success");
                socket.emit("RequestAccepted", user.id);
                props.setRelation("Friend");

            }
        });
    };

    const removeFriend = async () => {
        console.log("delete frined en front ", user.id, myUser.user!.id )
        const response = await fetch(`${process.env.REACT_APP_BACK}user/deletefriend/${myUser.user?.id}`, {
            method: 'DELETE',
            body: JSON.stringify({ friendId: user.id}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${myToken}`,
            },
        })
            .then(async Response => {
                console.log(".then")
                if (Response.ok) {
                console.log("response ok")
                    swal("", "Friend Remove", "success");
                    socket.emit("RemoveFriend", user.id);
                    props.setRelation("Nobody");
                }
            });
    };

    return (
        <>
            {
                props.relation === "Nobody" &&
                <button className="reqButton pointer white width_50" onClick={_ => (sendFriendRequest())} >
                    Add Friend {(props.relation)}
                </button>
            }
            {
                props.relation === "Friend" &&
                <button className="button-style" onClick={_ => (removeFriend())}> remove Friend </button>
            }
            {
                props.relation === "friendRequestSent" &&
                <button className="button-style" onClick={_ => (_)}> Request already send </button>
            }
            {
                props.relation === "friendRequestReceived" &&
                <button className="button-style" onClick={_ => (acceptFriendRequest())}> accept in Friend </button>
            }
        </>
    );
}

