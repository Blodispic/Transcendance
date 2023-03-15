import { HiOutlineXMark } from "react-icons/hi2";
import { socket } from "../../App";
import { IUser } from "../../interface/User";
import { useAppSelector } from "../../redux/Hook";


export default function InviteGame(props : {infoGame: any, setTrigger: Function}) {


    const myUser = useAppSelector(state => state.user);

    const accept = () => {
        socket.emit("acceptCustomGame", props.infoGame);
    }
    const decline = () => {
        socket.emit("declineCustomGame", props.infoGame);
    }

    console.log(props.infoGame.user1.id);

    return (
        <div className='chat-form-popup'>
            <div className='chat-form-inner'>
                <HiOutlineXMark className="close-icon" onClick={_ => props.setTrigger(false)} /> <br />

                <h3>{props.infoGame.user1.username} Invite you in Game</h3>
                <div className='avatar-inpopup'>
                    <img className='avatar avatar-manu' src={`${process.env.REACT_APP_BACK}user/${props.infoGame.user1.id}/avatar`} />
                    <a> Vs </a>
                    <img className='avatar avatar-manu' src={`${process.env.REACT_APP_BACK}user/${props.infoGame.user2.id}/avatar`} />
                </div>
                {
                    props.infoGame.extra === true &&
                    <h3>with Extra Mode</h3>
                }
                {
                    props.infoGame.extra === false &&
                    <h3>without Extra Mode</h3>
                }
                <h3>Score to win : {props.infoGame.scoreMax} </h3>
                <button className="button-style" onClick={_ => { accept(); props.setTrigger(false) }}> Accept </button>
                <button className="button-style" style={{background:'#B33A3A'}} onClick={_ => {decline(); props.setTrigger(false)}}> Decline </button>

            </div>
        </div>
    )
}
