import * as React from 'react';
import { useEffect, useState } from "react";
import { HiOutlineXMark } from "react-icons/hi2";

import { socket } from "../../App";
import { useAppSelector } from "../../redux/Hook";
import { IUser } from "../../interface/User";
import AllPeople from "../utils/Allpeople";
import swal from 'sweetalert';


export default function CustomGamePopup(props: {trigger: boolean; setTrigger: (arg: boolean) => void; friend: IUser | undefined} ) {
    const [extra, setExtra] = useState<boolean>(false);
    const [maxScore, setMaxScore] = useState(1);

    const myUser = useAppSelector(state => state.user);
    const [friend, setFriend] = useState<IUser[]  >([]);
    const [inpage, setInpage] = useState<boolean>(false);


    const canErase = () => {
        if (inpage === false)
            setFriend([]);
    }

    useEffect(() => {
        if (props.friend !== undefined)
            setFriend([props.friend])
        if ( window.location.href.search('Game') === -1 ) {
            setInpage(true);
        }
    }, [props])

    const changeScore = (event: any) => {
        setMaxScore(event.target.value);
    };

    const changeExtra = (event: any) => {
        setExtra(event.target.checked);
    };

    function CreateCustomRoom(extra: any, Max: any) {         
        if (!myUser.user || !friend || !friend[0])
        {
            swal("Error", "User doesn't exist", "error");
            return ;
        }
        socket.emit("createCustomGame", { user1: myUser.user.id, user2: friend[0].id, extra: extra, scoreMax: Max });
        props.setTrigger(false);
        setFriend([]);
        return;
    }

    return (props.trigger) ? (
        <div className='custom-popup'>
            <div className='custom-popup-inner'>
                <HiOutlineXMark className="close-icon" onClick={() => {props.setTrigger(false);  canErase() }} /> <br /> 
                Create Custom Game
                <AllPeople friend={friend} setFriend={setFriend} />

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
