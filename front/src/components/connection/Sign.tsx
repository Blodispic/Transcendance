import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../../App';
import { UserStatus } from '../../interface/User';
import { useAppDispatch, useAppSelector } from '../../redux/Hook';
import { change_avatar, change_name, set_status } from "../../redux/user";

export default function Sign() {


    const [newname, setNewname] = useState('');
    const [file, setFile] = useState<File | undefined>(undefined);
    const [avatar, setavatar] = useState<string>('');
    const formData = new FormData();
    const myUser = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [nameExist, SetNameExist] = useState<Boolean>(false);


    const fetch_name_avatar = async (e: any) => {

        e.preventDefault();
        if (newname !== '' && myUser.user) {

            if (file) {
                formData.append('file', file);
                await fetch(`${process.env.REACT_APP_BACK}user/${myUser.user.id}/avatar`, {
                    method: 'PATCH',
                    body: formData,
                })
                formData.delete('file');
                dispatch(change_avatar(avatar));
            }

            await fetch(`${process.env.REACT_APP_BACK}user/${myUser.user.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: newname }),
            })
                .then(async response => {
                    if (!response.ok)
                        SetNameExist(true);
                    else {
                        console.log("response", response);
                        dispatch(change_name(newname));
                        dispatch(set_status(UserStatus.ONLINE));
                        navigate("/Home");
                    }

                })
                .catch( error => {
                    console.log ("JY ARRIVE ???? ")
                })
        }
    }

    const onChangeFile = (e: any) => {
        const myFile: File = e.target.files[0];
        setFile(myFile)
        setavatar(URL.createObjectURL(myFile));
    }
    return (
        <div className='center form  white'>
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
                        newname &&
                        <button onClick={(e) => fetch_name_avatar(e)}>
                            <a>ok</a>
                        </button>
                    }
                    {
                        nameExist && 
                        <a> this username already use</a>
                    }
                </form >
            </div >
        </div>
    );
};
