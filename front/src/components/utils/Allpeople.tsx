import { useEffect, useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import { IUser, UserStatus } from "../../interface/User";
import { useAppSelector } from "../../redux/Hook";

export default function AllPeople(props: { friend: IUser[] | undefined, setFriend: Function, myVar: boolean, setMyvar: Function }) {
    const myUser = useAppSelector(state => state.user);
    const [alluser, setAlluser] = useState<IUser[] | undefined>(undefined);
    const [allfriend, setAllFriend] = useState<IUser[]> ([]);

    const addfriend = (myfriend: IUser) => {

        if (allfriend.find(allfriend => allfriend.id === myfriend.id) === undefined )
        setAllFriend([...allfriend, myfriend])

    }

    const removeFriend = (myfriend: IUser) => {

        if (allfriend.find(allfriend => allfriend.id === myfriend.id) !== undefined )
        setAllFriend(allfriend.filter(allfriend => allfriend.id !== myfriend.id ))

    }

    useEffect(() => { 
        props.setFriend(...allfriend);
    }, [allfriend])

    useEffect(() => {
    const get_all = async () => {
        const response = await fetch(`${process.env.REACT_APP_BACK}user`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
        })
        const data = await response.json();
        // setAlluser(data.filter((User: { }) => ));
        setAlluser(data.filter((User: { username: string; status: string;  }) => User.status === "Online" && User.username !== myUser.user?.username ));
    }
    if (props.friend === undefined)
        get_all();
    else
        props.setFriend(props.friend);
}, [] )


    return (
        <div className='avatar-inpopup'>
            <img className='avatar avatar-manu' src={myUser.user?.avatar} />
            {
                props.friend !== undefined &&
                <>
                    {
                        window.location.href.search('Game') !== -1 &&
                        <a> Vs </a>
                    }
                    {allfriend && allfriend.map(user => (

                        <img className='cursor-onsomoene avatar avatar-manu' src={`${process.env.REACT_APP_BACK}user/${user.id}/avatar`} onClick={_ => removeFriend(user) }/>

                    ))}
                </>
            }
            {
                (window.location.href.search('Game') === -1 || props.friend === undefined) &&
                <AiFillPlusCircle className="plus-circle pointer" onClick={_ => props.setMyvar(!props.myVar)} />
            }
            {
                props.myVar === true &&
                <div className="dropdown-container">
                    <div className=" dropdown people-list hover-style">
                    {alluser && alluser!.map(user => (
                            <ul key={user.username} >
                                <li onClick={_ => { props.setFriend(user); props.setMyvar(!props.myVar); addfriend(user) }}>
                                    {user.username}
                                </li>
                            </ul>
                        ))}
                    </div>
                </div>
            }
        </div>
    )
}