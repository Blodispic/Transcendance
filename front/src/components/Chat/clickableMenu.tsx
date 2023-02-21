import { useState } from "react";
import { Link } from "react-router-dom";
import { IChannel } from "../../interface/Channel";
import { IUser } from "../../interface/User";

export default function CLickableMenu(props: { user: IUser, chan: IChannel }) {

    const user: IUser = props.user;
    console.log('chanid: ', props.chan.id);

    return (
        <div className="dropdown-container">
            <div className="dropdown clickable-menu hover-style">
                <ul >
                    <li >
                        <Link to={`/Profile/${user.id}`}>
                            Profile
                        </Link>
                    </li>
                    <li>
                        <a >
                            Mute
                        </a>
                    </li>
                    <li>
                        Ban
                    </li>
                    <li>
                        Invite Game
                    </li>
                    <li>
                        <Link to={`/Chat/dm/${user.id}`}>
                        DM
                        </Link>
                    </li>
                </ul>
            </div>

        </div>
    )
}