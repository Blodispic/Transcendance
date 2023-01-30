import { useState, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";
import '../../styles/connection.scss'
import NameForm from "./form_name_avatar"
import { useAppDispatch } from "../../redux/Hook";
import { setUser } from "../../redux/user";
import { useCookies } from "react-cookie";



export const getAuthorizeHref = (): string => {
    const api_key = process.env.REACT_APP_API42_UID;
    const redirect_uri = process.env.REACT_APP_REDIRECT_URI;
    return `https://api.intra.42.fr/oauth/authorize?client_id=${api_key}&redirect_uri=${redirect_uri}&response_type=code`;
}


export default function Connection() {

    const [myVar, setMyvar] = useState(false)
    const [searchParams] = useSearchParams()
    const dispatch = useAppDispatch();
    const [, setCookie] = useCookies(['Token']);
    const redirect = process.env.REACT_APP_BACK;
    console.log("here", redirect);

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
                        if (!response.ok) {
                            // get error message from body or default to response statusText
                            const error = (data && data) || response.statusText;
                            return Promise.reject(error);
                        }
                        else {
                            dispatch(setUser(data));
                            setCookie('Token', data.access_token, { path: '/' });
                        }
                    })
                    .catch(error => {
                        console.error('There was an error!', error);
                    });
            }
            fetchcode();
            if (myVar === false)
                setMyvar(true);
        }
    }, [])

    return (
        <div className='container'>
            {
                myVar == false &&
                <div className='connection'>
                    <div className='button'>
                    <button className="button pulse pointer color_sign" >
                        <a href={getAuthorizeHref()}>
                            log
                        </a>
                    </button>
                    <button className="button pulse pointer color_log" >
                        <a href={getAuthorizeHref()}>
                            sign
                        </a>
                    </button>
                    </div>
                </div>
            }
            {
                myVar == true &&
                <NameForm />
            }
        </div>
    );
}
