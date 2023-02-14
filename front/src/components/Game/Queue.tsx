import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../redux/Hook';
import { Player } from './Game';
import { useNavigate } from "react-router-dom";
import { socket } from '../../App';
import { debug } from 'console';
import { logDOM } from '@testing-library/react';
import "../../styles/queue.scss"
import "../../styles/connection.scss"

export default function Queue() {

    const myUser = useAppSelector(state => state.user);
    const navigate = useNavigate();
    
    function addToWaitingRoom() {
        socket.emit("addToWaitingRoom", myUser.user);
        return;
    }

    
    // function CustomRoomPopup(props: any) {
    //     const [extra, setExtra] = useState(false);
    //     const [maxScore, setMaxScore] = useState(1);
        
    //     return (props.trigger) ? (
    //         <div className='custom-popup'>
    //             <div className='custom-popup-inner' onClick={e => e.stopPropagation()}>
    //                 <h3>Create Custom Game</h3>
    //                 <input type={'checkbox'}>Extra mode</input>
    //                 <h3>Set Max Score</h3>
    //                 <input type={'range'} min={1} max={10} value={1}>

    //                 </input>
    //             </div>
    //         </div>
    //     ) : <></>;
    // }
    
	function createCustomRoom() {
        // const [customPopup, setCustomPopup] = useState(false);

        console.log("Create custom", myUser.user)
		socket.emit("createCustomGame", {user1: myUser.user, user2: myUser.user, extra: true, scoreMax: 10});
        return ;
            // <CustomRoomPopup trigger={customPopup} setTrigger={setCustomPopup} />
        // );
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
        <div className="center button">
            <div>
                <button className='button pointer color_log' onClick={(e) => addToWaitingRoom()} >
                   <Link className='cool' to="/Game/">
                           Add to Waiting Room
                  </Link>
                </button>
            </div>
            <div>
                <button className='button pointer color_log' onClick={(e) => createCustomRoom()} >
                {/* <button className='button pointer color_log' onClick={() => setCustomPopup(true)} > */}
                <Link className='cool' to="/Game/">
                       Create Custom Room
                </Link>
                </button>
            </div>
        </div>
    )
}
