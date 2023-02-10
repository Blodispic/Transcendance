import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../redux/Hook';
import { Player } from './Game';
import { useNavigate } from "react-router-dom";
import { socket } from '../../App';
import { debug } from 'console';

export default function Queue() {

    const myUser = useAppSelector(state => state.user);
    const navigate = useNavigate();

    function addToWaitingRoom() {
        socket.emit("addToWaitingRoom", myUser.user);
        return;
    }

    function createCustomRoom() {
        socket.emit("addToWaitingRoom", myUser.user);
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
        <div>
            <button className="center pulse pointer" onClick={(e) => addToWaitingRoom()} >
                <Link to="/Game/">
                        Add to Waiting Room
                </Link>
            </button>

            <button className="center pulse pointer" onClick={(e) => createCustomRoom()} >
            <Link to="/Game/">
                    Create Custom Room
            </Link>
            </button>
        </div>
    )
}
