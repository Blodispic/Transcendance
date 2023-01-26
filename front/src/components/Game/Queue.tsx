import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../redux/Hook';
import { socket, Player } from './Game';
import { useNavigate } from "react-router-dom";
// import { socket } from '../../App';

export default function Queue() {

	const myUser = useAppSelector(state => state.user);
	const navigate = useNavigate();

	function addToWaitingRoom() {
		socket.emit("addToWaitingRoom", myUser.user);
		return ;
	}

	socket.on("RoomStart", (roomId: number, player: Player) => {
		navigate("/game/" + roomId, {state: {Id: roomId}});
	});

    useEffect(() => {
        const fetchuser = async () => {
            await fetch(`${process.env.REACT_APP_BACK}game/`, {
                method: 'POST',
                body: JSON.stringify({ id: myUser.user!.id }),
            })
        }
        fetchuser()
    }, [])

    return (
        <button className="center pulse pointer" onClick={(e) => addToWaitingRoom()} >
            <Link to="/Game/">
                <a>
                    Add to Waiting Room
                </a>
            </Link>
        </button>
    )
}