import React, { useState, useEffect } from 'react';
import '../../styles/connection.scss'
import { IUser } from "../../interface/User";
import { Link } from 'react-router-dom';
import { userInfo } from 'os';
import { stringify } from 'querystring';
import { useAppSelector } from '../../redux/Hook';

export default function NameForm() {


    const [newname, setNewname] = useState('');
    const [file, setFile] = useState<File | undefined>(undefined);
    const [avatar, setavatar] = useState<string>('');
    const formData = new FormData();
    const myUser = useAppSelector(state => state.user);

    const fetch_name_avatar = async (e: any) => {
        e.preventDefault();
        if (myUser.user != undefined) {
            formData.append('username', newname);
            if (file)
                formData.append('file', file);

            console.log("ICIIIIIII");
            // await fetch(`http://localhost:4000/user/${myUser.user.id}`, {
            //     method: 'PATCH',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({ username: newname }),
            // })
            const response = await fetch(`http://localhost:4000/user/${myUser.user.id}/setavatar`, {
                method: 'POST',
                // headers: {
                //     'Content-Type': 'multipart/form-data',
                // },
                body: formData,
            })
            formData.delete('newname');
            if (file)
                formData.delete('file');
        }
    }

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
                    <input type="text" name="user" value={newname} onChange={e => setNewname(e.target.value)} />
                </label>

                <label >
                    profile picture:
                    <input type="file" name="avatar" onChange={e => onChangeFile(e)} accept="image/png, image/jpeg" />
                </label>
                {
                    file && avatar != '' &&
                    <img src={avatar} />
                }
                <button onClick={(e) => fetch_name_avatar(e)}>
                    <a>okk</a>
                </button>
                <a>{newname}</a>
                <a>{avatar}</a>
            </form >
        </div >
    );
};
