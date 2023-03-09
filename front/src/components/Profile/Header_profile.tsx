import { useEffect, useState } from "react";
import { HiOutlineMagnifyingGlassCircle } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { socket } from "../../App";
import { IUser, UserStatus } from "../../interface/User";
import { useAppDispatch, useAppSelector } from "../../redux/Hook";
import { addBlockedUser, unBlockUser } from "../../redux/user";
import { InviteButton } from "./friend_request";

function Search(props: { currentUser: IUser, setcurrentUser: Function }) {

        const { currentUser, setcurrentUser } = props;
        const navigate = useNavigate();
        const [username, setMan] = useState<string | undefined>(undefined)
        const myToken = useAppSelector(state => state.user.myToken);

        const search_man = async (e: any) => {
                if (username) {
                        e.preventDefault();
                        const response = await fetch(`${process.env.REACT_APP_BACK}user/username/${username}`, {
                                method: 'GET',
                                headers: {
                                        'Authorization': `Bearer ${myToken}`,
                                    },
                        })
                        .then(async response => {
                                if (response.ok){
                                        const data = await response.json()
                                        setcurrentUser(data);       
                                        navigate(`../Profile/${data.id}`);
                                }
                        })
                }

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
        const [relation, setRelation] = useState<String>("none"); 
        const dispatch = useAppDispatch();

        let winPercentage = 0;

        useEffect( () => {
                console.log("blocked", myUser.user?.blocked, currentUser.id);
                if ((myUser.user!.blocked!.find(block => block.id === currentUser.id) === undefined))
                        console.log("ca rentre dans le if")
        })
        if (totalGames > 0)
                winPercentage = (currentUser.win / totalGames) * 100

        const formattedPercentage = winPercentage.toFixed(2) + '%';

        const spectate = () => {
                socket.emit("spectateGame", currentUser.id);
        }
        const rank = () => {
                if (currentUser.elo >= 1900)
                        return 'DIAMOND';
                else if (currentUser.elo >= 1500)
                        return 'PLATINUM';
                else if (currentUser.elo >= 1100)
                        return 'GOLD';
                else if (currentUser.elo >= 700)
                        return 'SILVER';
                return 'BRONZE'
        };
        const rank2 = () => {
                const thresholds = [2500, 2200, 2100, 2000, 1900, 1800, 1700, 1600, 1500, 1400, 1300, 1200, 1100, 1000, 900, 800, 700, 600, 500, 400];
                const rankNames = ['MANUTIER', 'DIAMOND I', 'DIAMOND II', 'DIAMOND III', 'DIAMOND IV', 'PLATINUM I', 'PLATINUM II', 'PLATINUM III', 'PLATINUM IV', 'GOLD I', 'GOLD II', 'GOLD III', 'GOLD IV', 'SILVER I', 'SILVER II', 'SILVER III', 'SILVER IV', 'BRONZE I', 'BRONZE II', 'BRONZE III', 'BRONZE IV'];
                for (let i = 0; i < thresholds.length; i++) {
                        if (currentUser.elo >= thresholds[i]) {
                                return rankNames[i];
                        }
                }
                return rankNames[rankNames.length - 1];
        };
        const Relation = async () => {
                await fetch(`${process.env.REACT_APP_BACK}user/relation`, {
                        method: 'POST',
                        body: JSON.stringify({
                                userId: myUser.user?.id,
                                friendId: currentUser.id,
                        }),
                        headers: {
                                'Authorization': `Bearer ${myUser.myToken}`,
                        }
                })
                        .then(async response => {
                                if (response.ok) {
                                        const data = await response.json();
                                        setRelation(data);
                                }
                        })
        }

        const Block = async () => {
                await fetch(`${process.env.REACT_APP_BACK}user/block/${myUser.user?.id}`, {
                        method: 'POST',
                        body: JSON.stringify({
                                blockedId: currentUser.id,
                        }),
                        headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${myUser.myToken}`,
                        }
                })
                        .then(async response => {
                                if (response.ok) {
                                        console.log("ok je peux block");
                                        dispatch(addBlockedUser(currentUser));
                                }
                        })
        }
        const UnBlock = async () => {
                await fetch(`${process.env.REACT_APP_BACK}user/unblock/${myUser.user?.id}`, {
                        method: 'POST',
                        body: JSON.stringify({
                                blockedId: currentUser.id,
                        }),
                        headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${myUser.myToken}`,
                        }
                })
                        .then(async response => {
                                if (response.ok) {
                                        console.log("ok je peux block");
                                        dispatch(unBlockUser(currentUser));
                                }
                        })
        }
        return (
                <div className='profile-header'>

ch
                        <div className='info-container'>
                                <div className="left-part">
                                        <div className='avatar'>
                                                <img className='logo' src={`${process.env.REACT_APP_BACK}user/${currentUser.id}/avatar`} />
                                        </div>
                                        {
                                                                ((myUser.user && (myUser.user.blocked === undefined || myUser.user.blocked.find(block => block.id === currentUser.id) === undefined)) && currentUser.username !== myUser.user!.username )&& 
                                                <>
                                                        {
                                                               (myUser.user!.friends === undefined || myUser.user!.friends.find(allfriend => allfriend.id === currentUser.id) === undefined) &&
                                                                // myUser.user!.friends !== undefined && myUser.user!.friends.find(allfriend => allfriend.id === currentUser.id) === undefined &&
                                                                <InviteButton user={myUser.user} />
                                                        }
                                                        {
                                                                currentUser.status === UserStatus.INGAME &&
                                                                <button className="button-style" onClick={_ => spectate()}> Spectate </button>
                                                        }
                                                        {
                                                                (myUser.user && (myUser.user.blocked === undefined || myUser.user.blocked.find(block => block.id === currentUser.id) === undefined)) &&
                                                                //  comment check si le user est blocked ? on met userblock: IUser[] dans l'interface user ? ou je fetch(/user/id/blockedList) pour avoir la list des user que moi j'ai blocker ?
                                                                <button className="button-style" style={{ background: '#B33A3A' }} onClick={_ => Block()}> Block </button>
                                                        }
                                                        
                                                </>
                                        }
                                        {
                                                                ((myUser.user && (myUser.user.blocked !== undefined && myUser.user.blocked.find(block => block.id === currentUser.id) !== undefined)) && currentUser.username !== myUser.user!.username )&& 
                                                                <button className="button-style" style={{ background: '#B33A3A' }} onClick={_ => UnBlock()}> unblock </button>

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
      
                                                </div>
                                        </div>
                                </div>

                        </div>

                </div>
        )

};
