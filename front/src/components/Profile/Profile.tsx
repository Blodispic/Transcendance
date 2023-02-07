import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { IUser } from '../../interface/User';
import { HiOutlineMagnifyingGlassCircle } from "react-icons/hi2";
import { useAppSelector } from '../../redux/Hook';
import { ImCheckmark, ImCross } from "react-icons/im";
import { Header } from './Header_profile';
import { Friends } from './friend_request';
import { page } from '../../interface/enum';


export default function Profile() {
        const [currentUser, setCurrentUser] = useState<IUser | undefined>(undefined);
        let avatar: string = "";
        let { id } = useParams();
        const [pages, setpages] = useState<page>(page.PAGE_1);
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
                        {currentUser &&
                                <Header currentUser={currentUser} setCurrentUser={setCurrentUser} />
                        }
                        <div className='container'>
                        {
                                pages == page.PAGE_1 &&
                                <Friends user={currentUser} />
                        }
                        {
                                pages == page.PAGE_2 &&
                                <Friends user={currentUser} />
                        }
                        {
                                pages == page.PAGE_3 &&
                                <Friends user={currentUser} />
                        }

                        </div>
                </div>
        );


}