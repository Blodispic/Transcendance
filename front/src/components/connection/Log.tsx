import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserStatus } from "../../interface/User";
import { useAppDispatch, useAppSelector } from "../../redux/Hook";
import { set_status } from "../../redux/user";



export const getAuthorizeHref = (): string => {
    const api_key = process.env.REACT_APP_API42_UID;
    const redirect_uri = process.env.REACT_APP_REDIRECT_URI;
    return `https://api.intra.42.fr/oauth/authorize?client_id=${api_key}&redirect_uri=${redirect_uri}&response_type=code`;
}

export function Log() {

    const dispatch = useAppDispatch();
    const [code, setCode] = useState<string>('');
    const [isValid, setIsValid] = useState<boolean | undefined>(undefined);
    const myStore = useAppSelector(state => state.user);
    const navigate = useNavigate();
    const fetchCodeForQr = async (e: any) => {
        e.preventDefault();
        await fetch(`${process.env.REACT_APP_BACK}user/2fa/check`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user: myStore.user,
                code: code,
            }),
        })
            .then(async response => {
                const data = await response.json();
                setIsValid(data.result);
                if (data.result === true)
                {
                    dispatch(set_status(UserStatus.ONLINE));
                    navigate("/Home");
                }
            })
            .catch()
    }
    return (
        <div>
            <div className='center form  white'>
                <div className='color_log'></div>
                <form>
                    <label >
                        Code:
                        <input type="text" value={code} onChange={e => setCode(e.target.value)} />
                    </label>
                    {
                        code &&
                        <button onClick={e => fetchCodeForQr(e)}>
                            <a>ok</a>
                        </button>
                    }
                    {
                        isValid === false &&
                        <a>code faux ou expirer retenter</a>
                    }
                </form>
            </div>
        </div>

    )
}