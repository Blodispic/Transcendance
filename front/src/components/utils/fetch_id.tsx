import * as React from 'react';
import { IUser } from '../../interface/User';
import { useState, useEffect } from 'react';
import { useAppSelector } from '../../redux/Hook';


export default function Fetchid(id: number) {

    let [user, setUser] = useState<IUser>();
    const myToken = useAppSelector(state => state.user.myToken);

    useEffect(() => {
        const fetchid = async () => {
            const response = await fetch(`${process.env.REACT_APP_BACK}user/2`, {
                method: 'Get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${myToken}`,

                },
            })

            let user: IUser = await response.json();
            setUser(user);

        }
        fetchid()
    }, [])
    return user;

}

