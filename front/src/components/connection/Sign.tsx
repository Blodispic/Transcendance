import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserStatus } from '../../interface/User';
import { useAppDispatch, useAppSelector } from '../../redux/Hook';
import { change_avatar, change_name, set_status } from "../../redux/user";

export default function Sign() {


    const [newname, setNewname] = useState('');
    const [file, setFile] = useState<File | undefined>(undefined);
    const [avatar, setavatar] = useState<string>('');
    const formData = new FormData();
    const myUser = useAppSelector(state => state.user);
    const myToken = useAppSelector(state => state.user.myToken);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [nameExist, SetNameExist] = useState<boolean>(false);


    const fetch_name_avatar = async (e: any) => {
        e.preventDefault();
        if (file && myUser.user) {
            formData.append('file', file);
            await fetch(`${process.env.REACT_APP_BACK}user/${myUser.user.id}/avatar`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${myToken}`,
                },
                body: formData,
            })
            formData.delete('file');
            dispatch(change_avatar(avatar));
        }

        if (newname !== '' && myUser.user) {
            if (newname) {
                await fetch(`${process.env.REACT_APP_BACK}user/${myUser.user.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${myToken}`,
                    },
                    body: JSON.stringify({ username: newname }),
                })
                    .then(async response => {
                        if (!response.ok)
                        {
                            SetNameExist(true);
                        }
                        else {
                            SetNameExist(false);
                            dispatch(change_name(newname));
                            dispatch(set_status(UserStatus.ONLINE));
                            if (window.location.href.search('Profile') === -1) {
                                navigate("/Home");
                            }
                        }

                    })
            }
        }
    }



    const onChangeFile = (e: any) => {
        const myFile: File = e.target.files[0];
        setFile(myFile)
        setavatar(URL.createObjectURL(myFile));
    }
    return (
        <div className='center2'>
        <div className=' form  white'>
            <div className=' color_sign'>
                <form>
                    <label >
                        Name:
                        <input type="text" name="user" value={newname} maxLength={15} onChange={e => setNewname(e.target.value)} />
                    </label>

                    <label >
                        profile picture:
                        <input type="file" name="avatar" onChange={e => onChangeFile(e)} accept="image/png, image/jpeg" />
                    </label>
                    {
                       ( newname || (file && window.location.href.search('Profile') !== -1 )) &&
                        <button onClick={(e) => fetch_name_avatar(e)}>
                            <span>ok</span>
                        </button>
                    }
                    {
                        nameExist && 
                        <span> this username already use</span>
                    }
                </form >
            </div >
        </div>
        </div>
    );
}
