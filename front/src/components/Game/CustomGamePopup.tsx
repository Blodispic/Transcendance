import { useEffect, useState } from "react";
import { HiOutlineXMark } from "react-icons/hi2";

import { AiFillPlusCircle } from "react-icons/ai";
import { socket } from "../../App";
import { useAppSelector } from "../../redux/Hook";
import { IUser } from "../../interface/User";
import { useSearchParams } from "react-router-dom";

export default function CustomGamePopup(props: {trigger: boolean; setTrigger: Function; friend: IUser | undefined} ) {
    const [extra, setExtra] = useState(false);
    const [maxScore, setMaxScore] = useState(1);
    const [myVar, setMyvar] = useState<boolean>(false);
    const [alluser, setAlluser] = useState<IUser[] | undefined>(undefined);
    const myUser = useAppSelector(state => state.user);
    const [friend, setFriend] = useState<IUser| undefined>(props.friend);
    const [inpage, setInpage] = useState<boolean>(false);


    const canErase = () => {
        if (inpage === false)
            setFriend(undefined);
    }

    useEffect(() => {

        if ( window.location.href.search('Game') == -1 ) {
            setInpage(true);
        }

          const get_all = async () => {
            const response = await fetch(`${process.env.REACT_APP_BACK}user`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
            })
            const data = await response.json();
            console.log("data? ", data);
            setAlluser(data.filter((User: { status: string; }) => User.status === "Online"));
            setAlluser(data.filter((User: { username: string; }) => User.username !== myUser.user?.username ));
        }
        if (props.friend === undefined)
            get_all();
        else
            setFriend(props.friend);

        console.log("les gens log ", alluser);
    }, [props])

    const changeScore = (event: any) => {
        console.log(event.target.value);
        setMaxScore(event.target.value);
    };

    const changeExtra = (event: any) => {
        console.log(event.target.checked);
        setExtra(event.target.checked);
    };
    function CreateCustomRoom(extra: any, Max: any) {
        console.log("extra = " + extra + ", Max = " + Max);
        socket.emit("createCustomGame", { user1: myUser.user, user2: friend, extra: extra, scoreMax: Max });

        return;
    }

    return (props.trigger) ? (
        <div className='custom-popup'>
            <div className='custom-popup-inner'>
            {/* ; setFriend(undefined) */}
                <HiOutlineXMark className="close-icon" onClick={_ => {props.setTrigger(false); setMyvar(false); canErase() }} /> <br /> 
                Create Custom Game
                <div className='avatar-inpopup'>
                    <img className='avatar' src={myUser.user?.avatar} />
                    {
                        friend !== undefined &&
                        <>
                            <a> Vs </a>
                            {
                                friend.avatar !== null &&
                                <img className='avatar' src={friend.avatar} />
                            }
                                               {
                                friend.avatar === null &&
                                <img className='avatar' src={`${process.env.REACT_APP_BACK}user/${friend.id}/avatar`} />
                            }
                        </>
                    }
                    {
                        friend === undefined &&
                        <AiFillPlusCircle className="plus-circle pointer" onClick={_ => setMyvar(!myVar)} />
                    }
                    {
                        myVar === true &&
                        <div className="dropdown-container">
                            <div className=" dropdown people-list hover-style">
                                {alluser!.map(user => (
                                    <ul key={user.username} >
                                        <li onClick={_ => {setFriend(user);  setMyvar(!myVar)}}>
                                            {user.username}
                                        </li>
                                    </ul>
                                ))}
                            </div>
                        </div>
                    }
                </div>
                <div className='sub-element'>Set Extra Mode <br />
                    <label> <input type="checkbox" onChange={changeExtra} /> Extra mode </label>
                </div>

                <div className='sub-element'> Set Max Score <br />
                    <input type="range" name='rangeInput' min="1" max="10" id="inVal" value={maxScore} onChange={changeScore}></input>
                    <output>{maxScore}</output> <br />
                </div>
                <button className='button pointer color_log' onClick={() => CreateCustomRoom(extra, maxScore)}>
                    <div className='cool'>Create</div></button>
            </div>
        </div>
    ) : <></>;
}
