import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { IUser } from '../../interface/User';
import { HiOutlineMagnifyingGlassCircle } from "react-icons/hi2";
import { useAppSelector } from '../../redux/Hook';
import { ImCheckmark, ImCross } from "react-icons/im";
import { Header } from './Header_profile';
import { Friends } from './friend_request';
import { page } from '../../interface/enum';
import { History } from './History';
import TwoFa from './setTwoFa';
import { socket } from '../../App';
import { UserStatus } from '../../interface/User';
import Sign from '../connection/Sign';
import { Player } from '../Game/Game';




function Onglets(props: { currentUser: IUser, current: page, setOnglets: Function }) {

        const myUser = useAppSelector(state => state.user);
        const { currentUser, } = props;
        const { current, setOnglets } = props;
        return (
                <div className='onglets'>
                        <button className={`pointer ${current === page.PAGE_1 ? "" : "not-selected"}`}
                                onClick={e => setOnglets(page.PAGE_1)}>
                                <a >
                                        History
                                </a>
                        </button>
                        {
                                currentUser.login === myUser.user?.login &&
                                <button className={`pointer ${current === page.PAGE_2 ? "" : "not-selected"}`}
                                        onClick={e => setOnglets(page.PAGE_2)} >
                                        <a >
                                                Friend Request
                                        </a>
                                </button>
                        }
                        {
                                currentUser.login === myUser.user?.login &&
                                <button className={`pointer ${current === page.PAGE_3 ? "" : "not-selected"}`}
                                        onClick={e => setOnglets(page.PAGE_3)}>
                                        <a >
                                                2FA
                                        </a>
                                </button>
                        }
                         {
                                currentUser.login === myUser.user?.login &&
                                <button className={`pointer ${current === page.PAGE_4 ? "" : "not-selected"}`}
                                        onClick={e => setOnglets(page.PAGE_4)} >
                                        <a >
                                                settings
                                        </a>
                                </button>
                        }
                </div>
        )
}

export default function Profile() {
        const [currentUser, setCurrentUser] = useState<IUser | undefined>(undefined);
        let avatar: string = "";
        const navigate = useNavigate();
        let { id } = useParams();
        const [pages, setPages] = useState<page>(page.PAGE_1);
        const myUser = useAppSelector(state => state.user);
        
                const fetchid = async () => {
                        const response = await fetch(`${process.env.REACT_APP_BACK}user/id/${id}`, {
                                method: 'GET',
                        })
                        setCurrentUser(await response.json());
                }
        useEffect(() => {
                if (id)
                        fetchid();
                setPages(page.PAGE_1);
               if (myUser.user!.friends )
               console.log ("est ce que c'est mon copain",  myUser.user!.friends.find(allfriend => allfriend.id === currentUser!.id));
        }, [id])

        // useEffect(() => {
        socket.on('UpdateSomeone', (idChange, idChange2) => {
                // if (idChange2 === id || idChange === id)
                fetchid();
        })
        // }, [currentUser])

        socket.on("SpectateStart", (roomId: number, player: Player) => {
                navigate("/game/" + roomId, { state: { Id: roomId } });
        });

        useEffect(() => {
                if (currentUser?.id == myUser.user?.id)
                {
                        setCurrentUser(myUser.user);

                }
        }, [Onglets, myUser.user?.username])


        if (currentUser === undefined || avatar === undefined) {
                return (
                        <div className='center'>
                                <h1>USER DOESN'T EXIST </h1>
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
                                        pages == page.PAGE_1 &&
                                        <History user={currentUser} />
                                }
                                {
                                        pages == page.PAGE_2 &&
                                        <Friends user={currentUser} />
                                }
                                {
                                        pages == page.PAGE_3 &&
                                        <TwoFa />
                                }
                                 {
                                        pages == page.PAGE_4 &&
                                        <Sign />
                                }

                        </div>
                </div>
        );


}