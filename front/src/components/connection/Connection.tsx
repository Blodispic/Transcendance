import * as React from 'react';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch } from "../../redux/Hook";
import { oauth, setUser, set_status, change_avatar, setToken } from "../../redux/user";
import { useCookies } from "react-cookie";
import { UserStatus } from '../../interface/User';




export const getAuthorizeHref = (): string => {
    const api_key = process.env.REACT_APP_API42_UID;
    const redirect_uri = process.env.REACT_APP_REDIRECT_URI;
    return `https://api.intra.42.fr/oauth/authorize?client_id=${api_key}&redirect_uri=${redirect_uri}&response_type=code`;
}


export default function Connection() {

    const [searchParams] = useSearchParams()
    const [, setCookie] = useCookies(['Token']);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const oauthCode = searchParams.get('code'); // Tu lui dit de recuperer le parametre "code" dans l'url

        if (oauthCode) {
            const fetchcode = async () => {
                await fetch(`${process.env.REACT_APP_BACK}oauth/token`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ code: oauthCode }),
                })
                    .then(async response => {
                        const data = await response.json();
                        // check for error response
                        if (response.ok) {
                            dispatch(setUser(data.user));
                            dispatch(change_avatar(data.user.intra_avatar))
                            dispatch(oauth());
                            setCookie('Token', data.access_token, { path: '/' });
                            dispatch(setToken(data.access_token));
                            if (!data.user.username)
                                navigate("./sign")
                            else if (data.user.twoFaEnable === true)
                                navigate("./log")
                            else {
                                dispatch(set_status(UserStatus.ONLINE));
                                // socket.emit("UpdateSomeone", { idChange: myUser.user?.id, idChange2: 0 })
                                navigate("/Home");
                        }
                    }
                    })
                    .catch(error => {
                        console.error('There was an error!', error);
                    });
            }
            fetchcode();
        }
    }, [])

    return (
        <div className='container'>
                <div className='connection'>
                    <div className='button'>
                        <button className="button pulse pointer color_sign" >
                            <a href={getAuthorizeHref()}>
                                sign
                            </a>
                        </button>
                        <button className="button pulse pointer color_log" >
                            <a href={getAuthorizeHref()} >
                                log
                            </a>
                        </button>
                    </div>
                </div>

        </div>
    );
}
