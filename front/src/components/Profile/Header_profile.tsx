import { useState } from "react";
import { HiOutlineMagnifyingGlassCircle } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { IUser } from "../../interface/User";
import { useAppSelector } from "../../redux/Hook";
import { InviteButton } from "./friend_request";

function Search(props: { currentUser: IUser, setcurrentUser: Function }) {

    const { currentUser, setcurrentUser } = props;
    const navigate = useNavigate();
    const [username, setMan] = useState<string | undefined>(undefined)

    const search_man = async (e: any) => {
            e.preventDefault();
            const response = await fetch(`${process.env.REACT_APP_BACK}user/username/${username}`, {
                    method: 'GET',
            })
            const data = await response.json()

            setcurrentUser(data);

            navigate(`../Profile/${data.id}`);

    }

    const handleKeyDown = (event: any) => {
            if (event.key === "Enter") {
                    search_man(event);
            }
    };

    return (
            <div className="search">
                    <div className="icon-search" onClick={(e) => search_man(e)} >
                            <HiOutlineMagnifyingGlassCircle />
                    </div>
                    <div className="input">
                            <input type="text" onKeyDown={handleKeyDown} onChange={e => setMan(e.target.value)} placeholder="Search..." />
                    </div>
            </div>
    )
}


export function Header(props: { currentUser: IUser, setCurrentUser: Function }) {

    const { currentUser, setCurrentUser } = props;
    const myUser = useAppSelector(state => state.user);
    return (
            <div className='profile-header'>


                    <div className='info-container'>
                            <div className="left-part">
                                    <div className='avatar'>
                                            <img className='logo' src={`${process.env.REACT_APP_BACK}user/${currentUser.id}/avatar`} />
                                    </div>
                                    {
                                            currentUser.username !== myUser.user!.username &&
                                            <InviteButton user={myUser.user} />
                                    }
                            </div>
                            
                            <div className='info-header'>
                                    <Search currentUser={currentUser} setcurrentUser={setCurrentUser} />
                                    <div className='stat-header'>
                                            <span>Win: {currentUser.win}</span>
                                            <span>Lose: {currentUser.lose}</span>``
                                            <span>test</span>

                                            <div className='rank'>
                                                    <span>RANK</span>
                                                    <span className='rank'>&nbsp;GOLD II </span>
                                            </div>
                                    </div>

                                    <div className='block'>

                                            <div className='block'>
                                                    <span>{currentUser.username}</span>

                                            </div>

                                            <div className=' block'>
                                                    <span className={"color-status " + currentUser.status}>{currentUser.status}</span>
                                            </div>
                                    </div>
                            </div>

                    </div>

            </div>
    )

};
