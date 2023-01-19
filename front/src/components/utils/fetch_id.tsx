import * as React from 'react';
import { IUser } from '../../interface/User';
import { useState, useEffect } from 'react';


export default function Fetchid(id: number) {

    let [user, setUser] = useState<IUser>();
    console.log('user', user)

    useEffect(() => {
        const fetchid = async () => {
            const response = await fetch('http://localhost:4000/user/2', {
                method: 'Get',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            let user: IUser = await response.json();
            setUser(user);

        }
        fetchid()
    }, [])
    console.log(user);
    return user;

}

// export async function Fetchid(id: number) {

//     const response = await fetch('http://localhost:4000/user/2', {
//         method: 'Get',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//     })
//     const user: IUser = await response.json();
//     console.log(user.username); // ici ca marche 

//     return user;

// }