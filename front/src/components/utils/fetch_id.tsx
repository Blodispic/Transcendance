import * as React from 'react';
import { IUser } from '../../interface/User';
import { useState, useEffect } from 'react';


export default function Fetchid(id: number) {

    let [user, setUser] = useState<IUser>();

    useEffect(() => {
        const fetchid = async () => {
            const response = await fetch(`${process.env.REACT_APP_BACK}user/2`, {
                method: 'Get',
                headers: {
                    'Content-Type': 'application/json',
                    credentials: 'include',
                },
            })

            let user: IUser = await response.json();
            setUser(user);

        }
        fetchid()
    }, [])
    return user;

}

