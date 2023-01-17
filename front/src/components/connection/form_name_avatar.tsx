import React, { useState } from 'react';
import '../../styles/connection.scss'
import { User } from "../../interface/User";
import { Link } from 'react-router-dom';

export default function NameForm() {

    const [firstName, setFirstName] = useState('');

    return (
        <div className='center button'>
            <form>
                <label >
                    Name:
                    <input type="text" name="user" value={firstName} onChange={e => setFirstName(e.target.value)} />
                </label>

                <label >
                    profile picture:
                    <input type="file" name="avatar" accept="image/png, image/jpeg" />
                </label>

                <Link to="/Game">
                    <button>
                        <a>ok</a>
                    </button>
                </Link>
                <a>{firstName}</a>
            </form >
        </div >
    );
};
