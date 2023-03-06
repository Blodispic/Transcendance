import { useEffect, useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import { IUser, UserStatus } from "../../interface/User";
import { useAppSelector } from "../../redux/Hook";


export default function AllPeople(props: { friend: IUser[] | undefined, setFriend: Function, myVar: boolean, setMyvar: Function }) {
    const myUser = useAppSelector(state => state.user);
    const [alluser, setAlluser] = useState<IUser[] | undefined>(undefined);
    const [allfriend, setAllFriend] = useState<IUser[] | undefined>(undefined);

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
            console.log("ca change le props")
            props.setFriend([...allfriend]);
        }
        console.log("list de friend dans funciton allPeople", allfriend);

    }, [allfriend])
    useEffect(() => {
        const get_all = async () => {
            const response = await fetch(`${process.env.REACT_APP_BACK}user`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            })
            const data = await response.json();
            setAlluser(data.filter((User: { username: string, status: string }) => User.username !== myUser.user?.username && User.status === "Online"));

        }
        get_all();
        if (props.friend)
            setAllFriend(props.friend);
    }, [])

    return (
        <div>
            <div className='avatar-inpopup'>
                <img className='avatar avatar-manu' src={`${process.env.REACT_APP_BACK}user/${myUser.user!.id}/avatar`} />
                {
                    <>

                        {
                            (window.location.href.search('Game') !== -1 || props.friend !== undefined) &&
                            <a> Vs </a>
                        }
                        {allfriend && allfriend.map(user => (

                            <div key={user.username}>
                                {
                                    (window.location.href.search('Game') === -1 && props.friend !== undefined) &&
                                    <img className='avatar avatar-manu' src={`${process.env.REACT_APP_BACK}user/${user.id}/avatar`} />
                                }
                                {

                                    (window.location.href.search('Game') !== -1 || props.friend === undefined) &&
                                    <img className='cursor-onsomoene avatar avatar-manu' src={`${process.env.REACT_APP_BACK}user/${user.id}/avatar`} onClick={_ => removeFriend(user)} />
                                }
                            </div>
                        ))}
                    </>
                }
                {
                    ((window.location.href.search('Game') !== -1 && allfriend && allfriend?.length < 1)
                        || (window.location.href.search('Game') === -1 && props.friend == undefined))
                    &&
                    <AiFillPlusCircle className="plus-circle pointer" onClick={_ => props.setMyvar(!props.myVar)} />
                }

                {
                    props.myVar === true &&
                    <div className="dropdown-container">
                        <div className=" dropdown people-list hover-style">
                            {alluser && alluser!.map(user_list => (
                                <ul key={user_list.username} >
                                    <li onClick={_ => { props.setMyvar(!props.myVar); addfriend(user_list) }}>
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
