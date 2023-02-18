import { Link } from "react-router-dom";
import { IUser } from "../../interface/User";

export default function CLickableMenu(props: { user: IUser }) {

    const user: IUser = props.user;

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
                        <a>
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
                        DM
                    </li>
                </ul>
            </div>

        </div>
    )
}