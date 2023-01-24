import React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../redux/Hook';

export default function Queu() {

    const myUser = useAppSelector(state => state.user);



    useEffect(() => {
        const fetchuser = async () => {
            const response = await fetch(`http://localhost:4000/game/`, {
                method: 'POST',
                body: JSON.stringify({ id: myUser.user!.id }),
            })
        }
        fetchuser()
    }, [])

    return (
        <button className="center pulse pointer" onClick={(e) => (e)} >
            <Link to="/Game/">
                <a>
                    play at foot-pong
                </a>
            </Link>
        </button>
    )
}
