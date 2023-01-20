import * as React from 'react';
import { useParams, useSearchParams } from "react-router-dom";
import Fetchid from '../utils/fetch_id';
import { IUser } from '../../interface/User';
import { useEffect, useState } from 'react';
import { userInfo } from 'os';
import '../../styles/profile.scss';

export default function Profile() {

        const [User, setUser] = useState<IUser | undefined>(undefined);
        const [searchParams] = useSearchParams()
        let { id } = useParams();

        useEffect(() => {
                if (id) {
                        console.log(id);

                        const fetchid = async () => {
                                const response = await fetch(`http://localhost:4000/user/${id}`, {
                                        method: 'Get',
                                        headers: {
                                                'Content-Type': 'application/json',
                                        },
                                })

                                let user: IUser = await response.json();
                                setUser(user);
                                console.log(user);
                        }
                        fetchid()
                }
        }, [])

        if (User == undefined) {
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
                                                <img className='logo' src={User.avatar} />
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
                                                        <span>{User.username}</span>

                                                </div>

                                                <div className=' block'>
                                                        <span >{User.status}</span>
                                                </div>
                                        </div>
                                </div>

                        </div>
                        <div className='cacher'>

                        </div>
                </div>
        );

}