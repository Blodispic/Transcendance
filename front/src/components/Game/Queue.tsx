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
import swal from 'sweetalert';


export default function Queue() {

    const myStore  = useAppSelector(state => state);
    const navigate = useNavigate();
    const [customPopup, setCustomPopup] = useState(false);

    function addToWaitingRoom() {
        socket.auth = {
            user: myStore.user.user,
        };
        socket.emit("addToWaitingRoom");
        return;
    }

    useEffect(() => {
        if (socket)
        {
            socket.on("RoomStart", (roomId: number, player: Player) => {
                if (swal && swal.close != undefined && swal.stopLoading != undefined)
                {
                    swal("Success", "You've been added to the custom room.", "success");
                    swal.stopLoading();
                    swal.close();
                }
                navigate("/game/" + roomId, { state: { Id: roomId } });
            });

            socket.on("WaitingRoomSuccess", (message: string) => {
                if (message)
                    swal("Success", message, "success");
                else
                    swal("Success", "You've been added to the waiting room.", "success");
            });

            socket.on("WaitingRoomFailure", (message: string) => {
                swal("Failure", message, "error");
            });
        }

        const fetchuser = async () => {
            if (myStore.user.user) {
                await fetch(`${process.env.REACT_APP_BACK}game/${myStore.user.user.id}}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${myStore.user.myToken}`,
                    },
                })
            }
        }
        fetchuser()
        return () => {
            socket.off("RoomStart");
            socket.off("WaitingRoomSuccess");
            socket.off("WaitingRoomFailure");
          }
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
