import { useEffect, useState } from "react";
import { HiOutlineXMark } from "react-icons/hi2";

import { AiFillPlusCircle } from "react-icons/ai";
import { socket } from "../../App";
import { useAppSelector } from "../../redux/Hook";
import { IUser } from "../../interface/User";
import { useSearchParams } from "react-router-dom";
import AllPeople from "../utils/Allpeople";
import swal from 'sweetalert';


export default function CustomGamePopup(props: {trigger: boolean; setTrigger: Function; friend: IUser | undefined} ) {
    const [extra, setExtra] = useState<boolean>(false);
    const [maxScore, setMaxScore] = useState(1);
    const [myVar, setMyvar] = useState<boolean>(false);

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
        if ( window.location.href.search('Game') == -1 ) {
            setInpage(true);
        }
        socket.on("GameDeclined", (username: string) => {
            swal("Invitation Declined", username + " declined your game", "error");
        });


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
            console.log("Error: User doesn't exist");
            swal("Error", "User doesn't exist", "error");
            return ;
        }
        socket.emit("createCustomGame", { user1: myUser.user?.id, user2: friend[0], extra: extra, scoreMax: Max });
        props.setTrigger(false);
        setMyvar(false);
        // setTimeout(() => {
        //     swal("Timeout", "User didn't respond", "error");
        //   }, 11000)
        return;
    }

    return (props.trigger) ? (
        <div className='custom-popup'>
            <div className='custom-popup-inner'>
            {/* ; setFriend(undefined) */}
                <HiOutlineXMark className="close-icon" onClick={_ => {props.setTrigger(false); setMyvar(false); canErase() }} /> <br /> 
                Create Custom Game
                <AllPeople friend={friend} setFriend={setFriend} myVar={myVar} setMyvar={setMyvar} />

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
