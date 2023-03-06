import { useEffect, useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import { IUser, UserStatus } from "../../interface/User";
import { useAppSelector } from "../../redux/Hook";


export default function AllPeople(props: { friend: IUser[] | undefined, setFriend: Function, myVar: boolean, setMyvar: Function }) {
    const myUser = useAppSelector(state => state.user);
    const [alluser, setAlluser] = useState<IUser[] | undefined>(undefined);
    const [allfriend, setAllFriend] = useState<IUser[] | undefined> (undefined);

    const addfriend = (myfriend: IUser) => {
        console.log ("Ca add friend quand meme ");

        if (allfriend !== undefined && allfriend.find(allfriend => allfriend.id === myfriend.id) === undefined) {

            console.log("Ca passe la dans le if");
            setAllFriend([...allfriend, myfriend])
        }
        else if (allfriend === undefined) {
            console.log("Ca passe la dans le else");
            setAllFriend([myfriend]);
        }
        console.log(allfriend);

    }

    const removeFriend = (myfriend: IUser) => {

        if (allfriend !== undefined && allfriend.find(allfriend => allfriend.id === myfriend.id) !== undefined )
        setAllFriend(allfriend.filter(allfriend => allfriend.id !== myfriend.id ))

    }

    useEffect(() => { 
        console.log(allfriend);
        if (allfriend !== undefined )
        props.setFriend(...allfriend);
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
        <div className='avatar-inpopup'>
            <img className='avatar avatar-manu' src={`${process.env.REACT_APP_BACK}user/${myUser.user!.id}/avatar`} />
            {
                <>

                    {
                        (window.location.href.search('Game') !== -1 || props.friend !== undefined) &&
                        <a> Vs </a>
                    }
                    {allfriend && allfriend.map(user => (

                        <>
                            {
                                (window.location.href.search('Game') === -1 && props.friend !== undefined) &&
                                <img key={user.username} className='avatar avatar-manu' src={`${process.env.REACT_APP_BACK}user/${user.id}/avatar`}/>
                            }
                            {

                                (window.location.href.search('Game') !== -1 || props.friend === undefined) &&
                                <img key={user.username} className='cursor-onsomoene avatar avatar-manu' src={`${process.env.REACT_APP_BACK}user/${user.id}/avatar`} onClick={_ => removeFriend(user)} />
                            }
                        </>
                    ))}
                </>
            }
            {
                (window.location.href.search('Game') !== -1 &&  allfriend && allfriend?.length < 1 ) &&
                <AiFillPlusCircle className="plus-circle pointer" onClick={_ => props.setMyvar(!props.myVar)} />
            }
                        {
                (window.location.href.search('Game') === -1 && props.friend == undefined) &&
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
    )
}

// export default function AllPeople(props: { friend: IUser[], setFriend: Function, myVar: boolean, setMyvar: Function }) {
//     const myUser = useAppSelector(state => state.user);
//     const [alluser, setAlluser] = useState<IUser[]>([]);
//     const [allfriend, setAllFriend] = useState<IUser[]> ([]);

//     const addfriend = (myfriend: IUser) => {

//         if (props.friend && props.friend.find(friend => friend.id === myfriend.id) === undefined) {
//             // console.log("mes amis", allfriend);
//             setAllFriend([...allfriend, myfriend])
//             props.setFriend([...props.friend, myfriend]);
//         }
//         else if (props.friend === undefined)
//             props.setFriend([myfriend]);
//     }


//     const removeFriend = (myfriend: IUser) => {
//         if ( allfriend && allfriend.find(friend => friend.id === myfriend.id) === undefined) {
//             setAllFriend(allfriend.filter(allfriend => allfriend.id !== myfriend.id))
//             props.setFriend(props.friend.filter(friend => friend.id !== myfriend.id))
//         }


//     }


//     useEffect(() => {
//     }, [allfriend])

//     useEffect(() => {
//         const get_all = async () => {
//             const response = await fetch(`${process.env.REACT_APP_BACK}user`, {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 credentials: 'include',
//             })
//             const data = await response.json();
//             // setAlluser(data.filter((User: { }) => ));
//             setAlluser(data.filter((User: { username: string; status: string; }) => User.status === "Online" && User.username !== myUser.user?.username));
//         }
//         if (props.friend?.length === undefined || props.friend.length === 0)
//             get_all();
//         else
//             setAllFriend(props.friend);
//     }, [])


//     return (
//         <div className='avatar-inpopup'>
//             <img className='avatar avatar-manu' src={myUser.user?.avatar} />
//             {
//                 allfriend !== undefined && allfriend[1] !== null &&
//                 <>
//                     {
//                         window.location.href.search('Game') !== -1 &&
//                         <a> Vs </a>
//                     }
//                     {allfriend && allfriend.map(user => (

//                         <img className='cursor-onsomoene avatar avatar-manu' src={`${process.env.REACT_APP_BACK}user/${user.id}/avatar`} onClick={_ => removeFriend(user) }/>
//                     ))}
//                 </>
//             }
//             {
//                 (window.location.href.search('Game') === -1 || allfriend === undefined) &&
//                 <AiFillPlusCircle className="plus-circle pointer" onClick={_ => props.setMyvar(!props.myVar)} />
//             }
//             {
//                 props.myVar === true &&
//                 <div className="dropdown-container">
//                     <div className=" dropdown people-list hover-style">
                        
//                     {alluser && alluser!.map(user => (
//                             <ul key={user.username} >
//                                 <li onClick={_ => { props.setMyvar(!props.myVar); addfriend(user) }}>
//                                     {user.username}
//                                 </li>
//                             </ul>
//                         ))}
//                     </div>
//                 </div>
//             }
//         </div>
//     )
// }
