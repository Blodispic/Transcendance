import { useEffect, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/Hook";
import { log_unlog } from "../../redux/user";
import { Fetchcode } from "./Connection";



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
                    dispatch(log_unlog());
            })
            .catch()
    }
    return (
        <div>
            <div className='center form  white'>
                <div className='color-log'></div>
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