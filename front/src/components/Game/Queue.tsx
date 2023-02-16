import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../redux/Hook';
import { Player } from './Game';
import { useNavigate } from "react-router-dom";
import { socket } from '../../App';
import { debug } from 'console';
import { logDOM } from '@testing-library/react';
import { HiOutlineXMark } from 'react-icons/hi2';




export default function Queue() {

    const myUser = useAppSelector(state => state.user);
    const navigate = useNavigate();
    const [customPopup, setCustomPopup] = useState(false);

    function CustomGamePopup(props: any) {
        const [extra, setExtra] = useState(1);
        const [maxScore, setMaxScore] = useState(1);
        
        const changeScore = (event: any) => {
            setMaxScore(event.target.value);
          };
    
        const changeExtra = (event: any) => {
            setMaxScore(event.target.value);
          };
        
        return (props.trigger) ? (
            <div className='custom-popup'>
                <div className='custom-popup-inner'>
                    <HiOutlineXMark className="close-icon" onClick={_ => props.setTrigger(false)} /> <br />
                    Create Custom Game
                    <div className='sub-element'>Set Extra Mode <br />
                        <label> <input type="checkbox" value={extra} onChange={changeExtra} /> Extra mode </label>
                    </div>
    
                    <div className='sub-element'> Set Max Score <br />
                        <input type="range" name='rangeInput' min="1" max="10" value={maxScore} onChange={changeScore}></input>
                        <output>{maxScore}</output> <br />
                    </div>
                    <button className='button pointer color_log' onClick={() => CreateCustomRoom(extra, maxScore)}>
                        <div className='cool'>Create</div></button>
                </div>
            </div>
        ) : <></>;
    }

    function addToWaitingRoom() {
        socket.emit("addToWaitingRoom", myUser.user);
        return;
    }

    function CreateCustomRoom(extraNum: number, Max: number) {
        // console.log("Create custom", myUser.user)
        let extraBool :boolean;
        if (extraNum === 2)
            extraBool = true;
        else
            extraBool = false;
        console.log(extraBool + ", " + Max);
        socket.emit("createCustomGame", {user1: myUser.user, user2: myUser.user, extra: extraBool, scoreMax: Max});

        return;
    }

    socket.on("RoomStart", (roomId: number, player: Player) => {
        navigate("/game/" + roomId, { state: { Id: roomId } });
    });

    useEffect(() => {
        const fetchuser = async () => {
            if (myUser.user) {
                await fetch(`${process.env.REACT_APP_BACK}game/${myUser.user.id}}`, {
                    method: 'POST',
                })
            }
        }
        fetchuser()
    }, [])

    return (
        <>
            <div className="center button pulse">
                <div>
                    <button className='button pointer color_log' onClick={(e) => addToWaitingRoom()} >
                        <Link className='cool' to="/Game/">
                            Add to Waiting Room
                        </Link>
                    </button>
                </div>
                <div>
                    <button className='button pointer color_log' onClick={() => setCustomPopup(true)} >
                        <div className='cool'>Create Custom Room</div>
                    </button>
                </div>
            </div>
            <CustomGamePopup trigger={customPopup} setTrigger={setCustomPopup} />
        </>
    )
}
