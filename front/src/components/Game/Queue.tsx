import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../redux/Hook';
import { Player } from './Game';
import { useNavigate } from "react-router-dom";
import { socket } from '../../App';
import { debug } from 'console';
import { logDOM } from '@testing-library/react';
import { HiOutlineXMark } from 'react-icons/hi2';
import CustomGamePopup from './CustomGamePopup';


export default function Queue() {

    const myUser = useAppSelector(state => state.user);
    const navigate = useNavigate();
    const [customPopup, setCustomPopup] = useState(false);

    

    function addToWaitingRoom() {
        socket.emit("addToWaitingRoom", myUser.user);
        return;
    }



    useEffect(() => {
        socket.on("RoomStart", (roomId: number, player: Player) => {
            navigate("/game/" + roomId, { state: { Id: roomId } });
        });

        const fetchuser = async () => {
            if (myUser.user) {
                await fetch(`${process.env.REACT_APP_BACK}game/${myUser.user.id}}`, {
                    method: 'POST',
                    credentials: 'include'
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
        <CustomGamePopup trigger={customPopup} setTrigger={setCustomPopup} friend={undefined} />
        </>
    )
}
