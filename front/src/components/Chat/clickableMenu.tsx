import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IChannel } from "../../interface/Channel";
import { IUser } from "../../interface/User";
import { useAppSelector } from "../../redux/Hook";
import CustomGamePopup from "../Game/CustomGamePopup";
import { BanUser, MuteUser } from "./ChannelUtils";

export default function CLickableMenu(props: { user: IUser, chan: IChannel }) {

    const user: IUser = props.user;
    const [myVar, setMyvar] = useState<boolean>(false);
    const myUser = useAppSelector(state => state.user.user)

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
                            <li>
                                <a onClick={() => MuteUser(props.chan.id, user.id)}>
                                    Mute
                                </a>
                            </li>
                            <li>
                                <a onClick={() => BanUser(props.chan.id, user.id)}>
                                    Ban
                                </a>
                            </li>
                            <li onClick={_ => setMyvar(true)}>
                                Invite Game
                            </li>
                            <li>
                                <Link to={`/Chat/dm/${user.id}`}>
                                    DM
                                </Link>
                            </li>
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