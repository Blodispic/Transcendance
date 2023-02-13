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




function Onglets(props: { currentUser: IUser, current: page, setOnglets: Function }) {

        const myUser = useAppSelector(state => state.user);
        const { currentUser, } = props;
        const { current, setOnglets } = props;
        return (
                <div className='onglets'>
                        <button className={`pointer ${current === page.PAGE_1 ? "" : "not-selected"}`}
                                onClick={e => setOnglets(page.PAGE_1)}>
                                <a >
                                        history
                                </a>
                        </button>
                        {
                                currentUser.login === myUser.user?.login &&
                                <button className={`pointer ${current === page.PAGE_2 ? "" : "not-selected"}`}
                                        onClick={e => setOnglets(page.PAGE_2)} >
                                        <a >
                                                friend_request
                                        </a>
                                </button>
                        }
                        {
                                 currentUser.login === myUser.user?.login && myUser.user?.twoFaEnable === false &&
                                <button className={`pointer ${current === page.PAGE_3 ? "" : "not-selected"}`}
                                        onClick={e => setOnglets(page.PAGE_3)}>
                                        <a >
                                                2fa
                                        </a>
                                </button>
                        }
                </div>
        )
}
export default function Profile() {
        const [currentUser, setCurrentUser] = useState<IUser | undefined>(undefined);
        let avatar: string = "";
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
        }, [id])

        useEffect(() => {
                socket.on('ChangeStatus', (state, idChange) => {
                        console.log("ca dis quoi")
                        fetchid();
                })
        }, [currentUser, Onglets])


        if (currentUser === undefined || avatar === undefined) {
                return (
                        <div className='center'>
                                <h1>USER DONT EXIST </h1>
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
                                        <History />
                                }
                                {
                                        pages == page.PAGE_2 &&
                                        <Friends user={currentUser} />
                                }
                                {
                                        pages == page.PAGE_3 &&
                                        <TwoFa />
                                }

                        </div>
                </div>
        );


}