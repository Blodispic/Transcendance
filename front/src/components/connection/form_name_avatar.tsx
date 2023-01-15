import React, { useState } from 'react';
import '../../styles/connection.scss'
import { User } from "../../interface/User";

const NameForm = () => {

    const [firstName, setFirstName] = useState('');

    return (
        <div className='button'>
            <form>
                <label >
                    Name:
                    <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} />
                </label>

                <label >
                    profile picture:
                    <input type="file" name="avatar" accept="image/png, image/jpeg" />
                </label>

                <label>
                    <input type="submit" value="ok" />
                </label>
                <a>{firstName}</a>
            </form >
        </div >
    );
};

export default NameForm;
