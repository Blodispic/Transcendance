import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from "react-router-dom";
import { IUser } from '../../interface/User';
import '../../styles/profile.scss';

export default function Profile() {
        const [user, setUser] = useState<IUser | undefined>(undefined);
        const [searchParams] = useSearchParams()
        let avatar: string = "";
        let { id } = useParams();

        useEffect(() => {
                if (id) {
                        const fetchid = async () => {
                                const response = await fetch(`${process.env.REACT_APP_BACK}/user/${id}`, {
                                        method: 'POST',
                                })
                                setUser(await response.json());
                        }
                        fetchid()
                }
        }, [])

        console.log(user);
        console.log("avatar", avatar);

        if (user == undefined || avatar == undefined) {
                return (
                        <div className='center'>
                                <h1>USER DONT EXIST </h1>
                        </div>
                );
        }
        return (
                <div className='all'>
                        <div className='profile-header'>
                                <div className="left-part">
                                        <div className='avatar'>
                                                <img className='logo' src={`${process.env.REACT_APP_BACK}/user/${id}/avatar`} />
                                        </div>
                                </div>
                                <div className='info-header'>

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
                                                        <span>{user.username}</span>

                                                </div>

                                                <div className=' block'>
                                                        <span >{user.status}</span>
                                                </div>
                                        </div>
                                </div>

                        </div>
                        <div className='cacher'>

                        </div>
                </div>
        );


}