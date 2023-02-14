import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../redux/Hook';
import { Player } from './Game';
import { useNavigate } from "react-router-dom";
import { socket } from '../../App';
import { debug } from 'console';
import { logDOM } from '@testing-library/react';

export default function Queue() {

    const myUser = useAppSelector(state => state.user);
    const navigate = useNavigate();

    function addToWaitingRoom() {
        socket.emit("addToWaitingRoom", myUser.user);
        return;
    }

	function createCustomRoom() {
		console.log("Create custom", myUser.user)
		socket.emit("createCustomGame", {user1: myUser.user, user2: myUser.user, extra: true, scoreMax: 10});
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
        <div className="center">
            <div>
                <button className='button' onClick={(e) => addToWaitingRoom()} >
                   <Link to="/Game/">
                           Add to Waiting Room
                  </Link>
                </button>
            </div>
            <div>
                <button className='button' onClick={(e) => createCustomRoom()} >
                <Link to="/Game/">
                       Create Custom Room
                </Link>
                </button>
            </div>
        </div>
    )
}
