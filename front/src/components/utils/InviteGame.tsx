import * as React from 'react';
import { HiOutlineXMark } from "react-icons/hi2";
import { socket } from "../../App";
import { useAppSelector } from "../../redux/Hook";
import swal from "sweetalert";


export default function InviteGame(props: { infoGame: any, setTrigger: (value: boolean) => void }) {
    
    useAppSelector(state => state.user);

    const accept = () => {
        if (swal && swal.close !== undefined && swal.stopLoading !== undefined)
        {
            swal("Success", "You've been added to the custom room.", "success");
            swal.stopLoading();
            swal.close();
        }
        socket.emit("acceptCustomGame", props.infoGame);
    }
    const decline = () => {
        socket.emit("declineCustomGame", props.infoGame);
    }

    // console.log(props.infoGame.user1.id);
    // console.log(props.infoGame.user2.id);

    return (
        <div className='chat-form-popup'>
            <div className='chat-form-inner'>
                <HiOutlineXMark className="close-icon" onClick={() => props.setTrigger(false)} /> <br />

                <h3>{props.infoGame.user1.username} Invite you in Game</h3>
                <div className='avatar-inpopup'>
                    <img className='avatar avatar-manu' src={`${process.env.REACT_APP_BACK}user/${props.infoGame.user1.id}/avatar`} alt="" />
                    <span> Vs </span>
                    <img className='avatar avatar-manu' src={`${process.env.REACT_APP_BACK}user/${props.infoGame.user2.id}/avatar` } alt="" />
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
                <button className="button-style" onClick={() => { accept(); props.setTrigger(false) }}> Accept </button>
                <button className="button-style" style={{background:'#B33A3A'}} onClick={() => {decline(); props.setTrigger(false)}}> Decline </button>


            </div>
        </div>
    )
}
