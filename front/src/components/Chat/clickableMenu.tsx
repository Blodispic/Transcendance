import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IChannel } from "../../interface/Channel";
import { IUser } from "../../interface/User";
import { useAppDispatch, useAppSelector } from "../../redux/Hook";
import CustomGamePopup from "../Game/CustomGamePopup";
import { AddAdmin, BanUser, KickUser, MuteUser } from "./AdminCommands";
import { page } from "../../interface/enum";
import { DirectMessage } from "./DirectMessage";
import { socket } from "../../App";
import { addAdmin } from "../../redux/chat";

export default function CLickableMenu(props: { user: IUser, chan: IChannel }) {

    const user: IUser = props.user;
    const [myVar, setMyvar] = useState<boolean>(false);
    const myUser = useAppSelector(state => state.user.user)
    const [timeMute, setTimeMute] = useState(false);
    const [timeBan, setTimeBan] = useState(false);
    const [onglet, setOnglet] = useState<page>(page.PAGE_1);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    /**
     * For DM tab change, useEffect can be used to reload the page
     * 
     */
    const handleAddAdmin = () => {
        socket.emit('GiveAdmin', {chanid: props.chan.id, userid: props.user.id});
    }
    
    useEffect(() => {
        socket.on("giveAdminOK", ({userId, chanId}) =>{
            dispatch(addAdmin({id: chanId, user: props.user}));
        });
        return () => {
            socket.off("giveAdminOK");
        }
    })

    return (
        <div className="dropdown-container">
            <div className="dropdown clickable-menu hover-style">
                <ul >
                    <li >
                        <Link to={`/Profile/${user.id}`}>
                            Profile
                        </Link>
                    </li>
                    {
                        user.id !== myUser?.id &&
                        <>
                            <li onClick={_ => setMyvar(true)}>
                                Invite Game
                            </li>
                            <li>
                                {/* <Link to={`/Chat/dm/${user.id}`}> */}
                                <div onClick={e => { setOnglet(page.PAGE_2); navigate(`/Chat/dm/`); {DirectMessage(props.user.id)} }}>
                                    <a>
                                    DM
                                    </a>
                                    {/* {
                                        onglet == page.PAGE_2 &&
                                        <DirectMessage dmId={props.user.id}/>
                                    } */}
                                </div> 
                                {/* </Link> */}
                            </li>
                            {
                                props.chan.admin?.find(obj => obj.id === myUser?.id) &&
                                <>
                                    {
                                        props.chan.admin?.find(obj => obj.id === props.user.id) == undefined &&
                                        <>
                                            <li>
                                                <a onClick={_ => handleAddAdmin()}>
                                                    Add to Admin
                                                </a>
                                            </li>
                                        </>
                                    }
                                    {
                                        props.chan.owner?.id !== props.user.id &&
                                        <>
                                            {
                                                props.chan.muted?.find(obj => obj.id === props.user.id) === undefined &&
                                                <li>
                                                <a onClick={() => setTimeMute(true)}>
                                                    Mute
                                                    <MuteUser chanid={props.chan.id} userid={user.id} trigger={timeMute} setTrigger={setTimeMute} />
                                                </a>
                                            </li>
                                            }
                                            
                                            {
                                                props.chan.banned?.find(obj => obj.id === props.user.id) === undefined &&
                                                <li>
                                                <a onClick={() => setTimeBan(true)}>
                                                    Ban
                                                    <BanUser chanid={props.chan.id} userid={user.id} trigger={timeBan} setTrigger={setTimeBan} />
                                                </a>
                                              </li>
                                            }

                                            <li>
                                                <a onClick={() => KickUser(props.chan.id, user.id)}>
                                                    Kick
                                                </a>
                                            </li>
                                        </>
                                    }
                                </>

                            }
                        </>
                    }
                </ul>
            </div>
            {
                <CustomGamePopup trigger={myVar} setTrigger={setMyvar} friend={props.user} />
            }
        </div>
    )
}
