import React, { useState, useEffect } from 'react';
import '../../styles/connection.scss'
import { IUser } from "../../interface/User";
import { Link } from 'react-router-dom';
import { userInfo } from 'os';

export default function NameForm(props: { user: IUser }) {
    const { user } = props;

    const [firstName, setFirstName] = useState('');
    const [file, setFile] = useState<File | undefined>(undefined);
    const [avatar, setavatar] = useState<string>('');



    useEffect(() => {
        console.log("test");

        console.log(firstName);
        console.log(file);
        console.log(avatar);

        if (firstName != '' && file && avatar != '') { // a changer le avatar est pas obligatoire ca dois plutot etre un name && button/submit
            const fetch_name_avatar = async () => {
                console.log("fetch name avatar");

                const response = await fetch(`http://localhost:4000/user/${user.login}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        newName: firstName,
                        newAvatar: file,
                    }),
                })
            }
            fetch_name_avatar()
        }
    },)

    const onChangeFile = (e: any) => {
        const myFile: File = e.target.files[0];
        console.log(e.target.files)
        setFile(myFile)
        setavatar(URL.createObjectURL(myFile));
    }
    return (
        <div className='center button'>
            <form>
                <label >
                    Name:
                    <input type="text" name="user" value={firstName} onChange={e => setFirstName(e.target.value)} />
                </label>

                <label >
                    profile picture:
                    <input type="file" name="avatar" onChange={e => onChangeFile(e)} accept="image/png, image/jpeg" />
                </label>
                {
                    file && avatar != '' &&
                    <img src={avatar} />
                }

                {/* <Link to="/Game"> */}
                <button>
                    <a>okk</a>
                </button>
                {/* </Link> */}
                <a>{firstName}</a>
                <a>{avatar}</a>
            </form >
        </div >
    );
};
