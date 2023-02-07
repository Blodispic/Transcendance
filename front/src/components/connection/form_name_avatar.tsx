import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/Hook';
import { change_name, log_unlog } from "../../redux/user";

export default function NameForm() {


    const [newname, setNewname] = useState('');
    const [file, setFile] = useState<File | undefined>(undefined);
    const [avatar, setavatar] = useState<string>('');
    const formData = new FormData();
    const myUser = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();

    const fetch_name_avatar = async (e: any) => {
        e.preventDefault();
        if (myUser.user !== undefined) {

            await fetch(`${process.env.REACT_APP_BACK}user/${myUser.user.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: newname }),
            })

            if (file) {
                formData.append('file', file);
                await fetch(`${process.env.REACT_APP_BACK}user/${myUser.user.id}/avatar`, {
                    method: 'PATCH',
                    body: formData,
                })
                formData.delete('file');
            }
            dispatch(change_name(newname));
            dispatch(log_unlog());
        }
    }

    const onChangeFile = (e: any) => {
        const myFile: File = e.target.files[0];
        console.log(e.target.files)
        setFile(myFile)
        setavatar(URL.createObjectURL(myFile));
    }
    return (
        <div className='center form  white'>
            <div className=' color_sign'>
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
                        file && avatar !== '' &&
                        <img src={avatar} />
                    }
                    {
                        newname &&
                        <button onClick={(e) => fetch_name_avatar(e)}>
                            <a>okk</a>
                        </button>
                    }
                </form >
            </div >
        </div>
    );
};
