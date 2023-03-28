import * as React from 'react';
import { useEffect, useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import { IUser } from "../../interface/User";
import { useAppSelector } from "../../redux/Hook";

export default function AllPeople(props: { friend: IUser[] | undefined, setFriend: (users: IUser[]) => void }) {
    const myUser = useAppSelector(state => state);
    const [alluser, setAlluser] = useState<IUser[] | undefined>(undefined);
    const [allfriend, setAllFriend] = useState<IUser[] | undefined>(undefined);
    const [myVar, setMyvar] = useState<boolean>(false);

    const addfriend = (myfriend: IUser) => {
        if (allfriend !== undefined && allfriend.find(allfriend => allfriend.id === myfriend.id) === undefined)
            setAllFriend([...allfriend, myfriend])
        else if (allfriend === undefined)
            setAllFriend([myfriend]);
    }

    const removeFriend = (myfriend: IUser) => {
        if (allfriend !== undefined && allfriend.find(allfriend => allfriend.id === myfriend.id) !== undefined)
            setAllFriend(allfriend.filter(allfriend => allfriend.id !== myfriend.id))
    }


    useEffect(() => {
        if (allfriend !== undefined) {
            props.setFriend([...allfriend]);
        }
    }, [allfriend])
    const get_all = async () => {
        const response = await fetch(`${process.env.REACT_APP_BACK}user`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${myUser.user.myToken}`,
            },
        })
        const data = await response.json();
        if (allfriend !== undefined)
            setAlluser(
                data
                    .filter((user: { username: string, status: string }) =>
                        user.username !== myUser.user.user?.username && user.status === "Online"
                    )
                    .filter((user: { id: number }) =>
                        allfriend.findIndex((allfriend: IUser) => allfriend.id === user.id) === -1
                    )
            );
        else {
            setAlluser(data.filter((User: { username: string, status: string }) => User.username !== myUser.user.user?.username && User.status === "Online"));
        }
    }
    useEffect(() => {
        get_all();
        if (props.friend)
            setAllFriend(props.friend);
    }, [])

    return (
        <div>
            <div className='avatar-inpopup'>
               { 
                props.friend && props.friend.length < 2 &&
                <img className='avatar avatar-manu' src={`${process.env.REACT_APP_BACK}user/${myUser.user.user!.id}/avatar`} alt="" />
                }
                {
                    <>

                        {
                            (window.location.href.search('Game') !== -1 || (props.friend !== undefined && props.friend.length < 2 )) &&
                            <span> Vs </span>
                        }
                        {allfriend && allfriend.map(user => (

                            <div key={user.username}>
                                {
                                    (window.location.href.search('Game') === -1 && props.friend !== undefined) &&
                                    <img className='avatar avatar-manu' src={`${process.env.REACT_APP_BACK}user/${user.id}/avatar`} alt="" />
                                }
                                {

                                    (window.location.href.search('Game') !== -1 || props.friend === undefined) &&
                                    <img className="cursor-onsomoene avatar avatar-manu" src={`${process.env.REACT_APP_BACK}user/${user.id}/avatar`} alt="" onClick={() => removeFriend(user)}/>
                                }
                            </div>
                        ))}
                    </>
                }
                {
                    ((window.location.href.search('Game') !== -1 && allfriend && allfriend?.length !== 1)
                        || (window.location.href.search('Game') === -1 && (props.friend === undefined || (props.friend && props.friend.length > 1))))
                    &&
                    <AiFillPlusCircle className="plus-circle pointer" onClick={() =>  {get_all(); setMyvar(!myVar)}} />
                }

                {
                    myVar === true && alluser && alluser.length > 0 &&
                    <div className="dropdown-container">
                        <div className=" dropdown people-list hover-style">
                            {alluser.map(user_list => (
                                <ul key={user_list.username} >
                                    <li onClick={() => { setMyvar(!myVar); addfriend(user_list) }}>
                                        {user_list.username}
                                    </li>
                                </ul>
                            ))}
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}
