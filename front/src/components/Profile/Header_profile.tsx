import { useEffect, useState } from "react";
import { HiOutlineMagnifyingGlassCircle } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { socket } from "../../App";
import { IUser, UserStatus } from "../../interface/User";
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
        const totalGames = currentUser.win + currentUser.lose;

        let winPercentage = 0;

        if (totalGames > 0)
                winPercentage = (currentUser.win / totalGames) * 100

        const formattedPercentage = winPercentage.toFixed(2) + '%';

        const spectate = () => {
                socket.emit("spectateGame", currentUser);
        }
        const rank = () => {
                if (currentUser.elo >= 1900) {
                        return 'DIAMOND';
                }
                else if (currentUser.elo >= 1500) {
                        return 'PLATINUM';
                }
                else if (currentUser.elo >= 1100) {
                        return 'GOLD';
                }
                else if (currentUser.elo >= 700) {
                        return 'SILVER';
                }
                else
                        return 'BRONZE'
        };
        const rank2 = () => {
                if (currentUser.elo >= 2500) {
                        return 'MANUTIER';
                }else if (currentUser.elo >= 2200) {
                        return 'DIAMOND I';
                }else if (currentUser.elo >= 2100) {
                        return 'DIAMOND II';
                }else if (currentUser.elo >= 2000) {
                        return 'DIAMOND III';
                }else if (currentUser.elo >= 1900) {
                        return 'DIAMOND IV';
                }else if (currentUser.elo >= 1800) {
                        return 'PLATINUM I';
                }else if (currentUser.elo >= 1700) {
                        return 'PLATINUM II';
                }else if (currentUser.elo >= 1600) {
                        return 'PLATINUM III';
                }else if (currentUser.elo >= 1500) {
                        return 'PLATINUM IV';
                }else if (currentUser.elo >= 1400) {
                        return 'GOLD I';
                }else if (currentUser.elo >= 1300) {
                        return 'GOLD II';
                }else if (currentUser.elo >= 1200) {
                        return 'GOLD III';
                }else if (currentUser.elo >= 1100) {
                        return 'GOLD IV';
                }else if (currentUser.elo >= 1000) {
                        return 'SILVER I';
                }else if (currentUser.elo >= 900) {
                        return 'SILVER II';
                }else if (currentUser.elo >= 800) {
                        return 'SILVER III';
                }else if (currentUser.elo >= 700) {
                        return 'SILVER IV';
                }else if (currentUser.elo >= 600) {
                        return 'BRONZE I';
                }else if (currentUser.elo >= 500) {
                        return 'BRONZE II';
                }else if (currentUser.elo >= 400) {
                        return 'BRONZE III';
                }else
                        return 'BRONZE IV'
        };

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
                                                <div className='stat'>
                                                        <span>Win</span>
                                                        <span className='win'>{currentUser.win}</span>
                                                </div>

                                                <div className='stat'>
                                                        <span>Lose</span>
                                                        <span className='lose'>{currentUser.lose}</span>
                                                </div>

                                                <div className='stat'>
                                                        <span>Winrate</span>
                                                        <span className='winrate'>{formattedPercentage}</span>
                                                </div>
                                                <div className='rank'>
                                                        <span>RANK</span>
                                                        <span className={`rank ${rank().toLowerCase()}`}>{rank2()}</span>
                                                </div>
                                        </div>

                                        <div className='block'>

                                                <div className='block'>
                                                        <span>{currentUser.username}</span>

                                                </div>

                                                <div className=' block'>
                                                        <>

                                                        <span className={"color-status " + currentUser.status}>{currentUser.status}</span>
                                                        </>
                                                        {
                                                                currentUser.status === UserStatus.INGAME &&
                                                                <>
                                                                <button className="button-style" onClick={_ => spectate() }> Spectate </button>
                                                                </>

                                                        }
                                                </div>
                                        </div>
                                </div>

                        </div>

                </div>
        )

};
