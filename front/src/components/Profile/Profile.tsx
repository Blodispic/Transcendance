import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { IUser } from '../../interface/User';
import { useAppSelector } from '../../redux/Hook';
import { Header } from './Header_profile';
import { Friends } from './friend_request';
import { page } from '../../interface/enum';
import { History } from './History';
import TwoFa from './setTwoFa';
import { socket } from '../../App';
import Sign from '../connection/Sign';




function Onglets(props: { currentUser: IUser, current: page, setOnglets: (page: page) => void }) {

        const myUser = useAppSelector(state => state.user);
        const { currentUser, } = props;
        const { current, setOnglets } = props;
        return (
                <div className='onglets'>
                        <button className={`pointer ${current === page.PAGE_1 ? "" : "not-selected"}`}
                                onClick={() => setOnglets(page.PAGE_1)}>
                                <div>
                                        History
                                </div>
                        </button>
                        {
                                currentUser.login === myUser.user?.login &&
                                <button className={`pointer ${current === page.PAGE_2 ? "" : "not-selected"}`}
                                        onClick={() => setOnglets(page.PAGE_2)} >
                                        <div>
                                                Friends
                                        </div>
                                </button>
                        }
                        {
                                currentUser.login === myUser.user?.login &&
                                <button className={`pointer ${current === page.PAGE_3 ? "" : "not-selected"}`}
                                        onClick={() => setOnglets(page.PAGE_3)}>
                                        <div>
                                                2FA
                                        </div>
                                </button>
                        }
                        {
                                currentUser.login === myUser.user?.login &&
                                <button className={`pointer ${current === page.PAGE_4 ? "" : "not-selected"}`}
                                        onClick={() => setOnglets(page.PAGE_4)} >
                                        <div>
                                                Settings
                                        </div>
                                </button>
                        }
                </div>
        )
}

export default function Profile() {
        const [currentUser, setCurrentUser] = useState<IUser | undefined>(undefined);
        const navigate = useNavigate();
        const { id } = useParams();
        const [pages, setPages] = useState<page>(page.PAGE_1);
        const myUser = useAppSelector(state => state);
        const [updateStatus, setUpdateStatus] = useState(false);

        const fetchid = async () => {
                console.log("ca reload ducoup ")
                const response = await fetch(`${process.env.REACT_APP_BACK}user/id/${id}`, {
                        method: 'GET',
                        headers: {
                                'Authorization': `Bearer ${myUser.user.myToken}`,
                        }
                })
                setCurrentUser(await response.json());
        }

        useEffect(() => {
                socket.on("RoomStart", (roomId: number) => {
                        navigate("/game/" + roomId, { state: { Id: roomId } });
                });

                if (id)
                        fetchid();
                setPages(page.PAGE_1);
                // if (myUser.user.user!.friends)
                socket.on('UpdateSomeone', () => {
                        console.log("ca passe pas ?");
                        setUpdateStatus(!updateStatus);
                        // fetchid();
                })

                socket.on("SpectateStart", (roomId: number) => {
                        navigate("/game/" + roomId, { state: { Id: roomId } });
                });
                
                return () => {
                        // socket.off('UpdateSomeone');
                        socket.off('SpectateStart');
                };
        }, [id, updateStatus])

        useEffect(() => {
                if (currentUser?.id === myUser.user.user?.id) {
                        setCurrentUser(myUser.user.user);

                }
        }, [Onglets, currentUser?.id,  myUser.user.user?.username, id])


        if (currentUser === undefined) {
                return (
                        <div className='center'>
                                <h1>USER DOESN&apos;T EXIST </h1>

                        </div>
                );
        }

        return (
                <div className='all'>
                        {currentUser &&
                                <Header currentUser={currentUser} setCurrentUser={setCurrentUser} />
                        }
                        <div className='container'>
                                <Onglets currentUser={currentUser} current={pages} setOnglets={setPages} />
                                {
                                        pages === page.PAGE_1 &&
                                        <History user={currentUser} />
                                }
                                {
                                        pages === page.PAGE_2 &&
                                        <Friends />
                                }
                                {
                                        pages === page.PAGE_3 &&
                                        <TwoFa />
                                }
                                {
                                        pages === page.PAGE_4 &&
                                        <Sign />
                                }

                        </div>
                </div>
        );


}