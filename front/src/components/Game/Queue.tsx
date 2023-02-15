import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../redux/Hook';
import { Player } from './Game';
import { useNavigate } from "react-router-dom";
import { socket } from '../../App';
import { debug } from 'console';
import { logDOM } from '@testing-library/react';
import { HiOutlineXMark } from 'react-icons/hi2';


function CustomGamePopup(props: any) {
    const [extra, setExtra] = useState(false);
    const [maxScore, setMaxScore] = useState(1);

    return (props.trigger) ? (
        <div className='custom-popup'>
            <div className='custom-popup-inner'>
                <HiOutlineXMark className="close-icon" onClick={_ => props.setTrigger(false)} /> <br />
                Create Custom Game
                <div className='sub-element'>Set Extra Mode <br />
                    <label> <input type="checkbox" /> Extra mode </label>
                </div>

                <div className='sub-element'> Set Max Score <br />
                    <input type="range" name='rangeInput' min="1" max="10"></input> <br />
                </div>
                <button className='button pointer color_log'>
                    <div className='cool'>Create</div></button>
            </div>
        </div>
    ) : <></>;
}

export default function Queue() {

    const myUser = useAppSelector(state => state.user);
    const navigate = useNavigate();
    const [customPopup, setCustomPopup] = useState(false);

    function addToWaitingRoom() {
        socket.emit("addToWaitingRoom", myUser.user);
        return;
    }

    function CreateCustomRoom() {
        console.log("Create custom", myUser.user)
        // socket.emit("createCustomGame", {user1: myUser.user, user2: myUser.user, extra: true, scoreMax: 10});

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
                <div className='center'>
                    <div className='button'>
                <button className='button pointer color_log' onClick={(e) => addToWaitingRoom()} >
                   <Link className='cool' to="/Game/">
                         Start game
                  </Link>
                </button>

                <button className='button pointer color_log' onClick={() => setCustomPopup(true)} >
                <Link className='cool' to="/Game/">
                    Create Game
                </Link>
                </button>
            </div>
        </div>
        <CustomGamePopup trigger={customPopup} setTrigger={setCustomPopup} />
        </>
    )
}
