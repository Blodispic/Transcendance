import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IChannel } from "../../interface/Channel";
import { IUser } from "../../interface/User";
import { useAppSelector } from "../../redux/Hook";
import CustomGamePopup from "../Game/CustomGamePopup";
import { AddAdmin, BanUser, MuteUser } from "./AdminCommands";

export default function CLickableMenu(props: { user: IUser, chan: IChannel }) {

    const user: IUser = props.user;
    const [myVar, setMyvar] = useState<boolean>(false);
    const myUser = useAppSelector(state => state.user.user)

    if (props.chan.owner !== undefined)
        console.log("owner: ", props.chan.owner.username);
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
                                <Link to={`/Chat/dm/${user.id}`}>
                                    DM
                                </Link>
                            </li>
                            {/* ---admin menu--- show if  [myUser] === [owner] || ([myuser] === [admin] &&  [currentuser] !== [admin] ) */}
                            {
                                // props.chan.owner == myUser &&
                                <>
                                    {/* show if [currentUser] !=== admin */}
                                    {

                                        <li>
                                            <a onClick={_ => AddAdmin(props.chan.id, props.user.id)}>
                                                Add to Admin
                                            </a>
                                        </li>
                                    }
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
                                    <li>
                                        <a>
                                            Kick
                                        </a>
                                    </li>
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