import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { IUser } from '../../interface/User';
import '../../styles/profile.scss';
import { HiOutlineMagnifyingGlassCircle } from "react-icons/hi2";
import { useAppSelector } from '../../redux/Hook';

function InviteButton(props: { user: any }) {
        const { user } = props;

        const pathname = window.location.pathname;
        const pathArray = pathname.split('/');
        const friendId = pathArray[pathArray.length - 1];
        const [status, setStatus] = useState<string>('+ Add Friend');

        const sendFriendRequest = async () => {
                await fetch(`${process.env.REACT_APP_BACK}user/friend-request/send/${friendId}`, {
                        method: 'POST',
                        body: JSON.stringify(user),
                        headers: { 'Content-Type': 'application/json' }
                });
                setStatus('Pending');
        }

        useEffect(() => {
                const checkFriendRequest = async () => {
                        const response = await fetch(`${process.env.REACT_APP_BACK}user/friend-request/status/${friendId}`, {
                                method: 'POST',
                                body: JSON.stringify(user),
                                headers: { 'Content-Type': 'application/json' }
                        });
                        const data = await response.json()
                        if (data.status)
                                setStatus(data.status);
                        else
                                setStatus("+ Add Friend");
                }
                checkFriendRequest();
        }, [friendId, user]);


        return (
                <button className="button pointer white width_50" onClick={sendFriendRequest} >
                        <span className='jump'> {status} </span>
                </button>
        )
}

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
                        <div className="icon" onClick={(e) => search_man(e)} >
                                <HiOutlineMagnifyingGlassCircle />
                        </div>
                        <div className="input">
                                <input type="text" onKeyDown={handleKeyDown} onChange={e => setMan(e.target.value)} placeholder="Search..." />
                        </div>
                </div>
        )
}

function Header(props: { currentUser: IUser, setCurrentUser: Function }) {

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
                                                <span>test</span>
                                                <span>test</span>
                                                <span>test</span>

                                                <div className='rank'>
                                                        <span>RANK</span>
                                                        <span className='rank'>GOLD II </span>
                                                </div>
                                        </div>

                                        <div className='block'>

                                                <div className='block'>
                                                        <span>{currentUser.username}</span>

                                                </div>

                                                <div className=' block'>
                                                        <span >{currentUser.status}</span>
                                                </div>
                                        </div>
                                </div>

                        </div>

                </div>
        )

};

function Friends() {


        interface FriendsListProps {
                friends: { name: string, avatar: string, status: string }[];
        }


        const FriendsList = (props: FriendsListProps) => {
                return (
                  <ul className="friends-list">
                    {props.friends.map(friend => (
                      <li className="friend-block" key={friend.name}>
                        <div className="friend-img">
                          <img src={friend.avatar} alt={friend.name} />
                        </div>
                        <div className="friend-info">
                          <div className="friend-name">{friend.name}</div>
                          <div className="friend-status">{friend.status}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                );
              };
              


        const Friends = () => {
                const friends = [
                        { name: 'Ross', avatar: 'https://img.freepik.com/vecteurs-premium/panda-mignon-tenant-bambou-pouce-vers-haut-icone-vecteur-dessin-anime-illustration-nature-animale-isolee_138676-4817.jpg?w=360', status: 'Online' },
                        { name: 'Rachel', avatar: 'rachel.jpg', status: 'Online' },
                        { name: 'Joey', avatar: 'joey.jpg', status: 'Online' },
                        { name: 'Phoebe', avatar: 'phoebe.jpg', status: 'Online' },
                        { name: 'Chandler', avatar: 'chandler.jpg', status: 'Online' },
                        { name: 'Monica', avatar: 'monica.jpg', status: 'Online' },
                ];

                return <FriendsList friends={friends} />;
        };



        return (
                <div className='FriendHeader'>

                        <Friends />;
                        <div className='FriendRequestBlock'>
                        </div>

                        <div className='FriendListBlock'>

                        </div>
                </div>
        )
}
const icon = document.querySelector(".icon");
const search = document.querySelector(".search");



export default function Profile() {
        const [currentUser, setCurrentUser] = useState<IUser | undefined>(undefined);
        let avatar: string = "";
        let { id } = useParams();

        useEffect(() => {



                if (id) {
                        const fetchid = async () => {
                                const response = await fetch(`${process.env.REACT_APP_BACK}user/id/${id}`, {
                                        method: 'GET',
                                })

                                setCurrentUser(await response.json());
                        }
                        fetchid()


                }
        }, [id])


        if (currentUser === undefined || avatar === undefined) {
                return (
                        <div className='center'>
                                <h1>USER DONT EXIST </h1>
                        </div>
                );
        }
        return (
                <div className='all'>
                        <section>

                        </section>
                        {currentUser &&
                                <Header currentUser={currentUser} setCurrentUser={setCurrentUser} />
                        }

                        {
                                <Friends />
                        }
                        <div className='cacher'>

                        </div>
                </div>
        );


}