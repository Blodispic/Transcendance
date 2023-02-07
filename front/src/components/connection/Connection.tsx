import { useState, useEffect } from 'react';
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import NameForm from "./form_name_avatar"
import { useAppDispatch, useAppSelector } from "../../redux/Hook";
import { log_unlog, setUser } from "../../redux/user";
import { useCookies } from "react-cookie";
import { IUser } from '../../interface/User';
import { page } from '../../interface/enum';
import { Two_fa } from './Two_fa';



export const getAuthorizeHref = (): string => {
    const api_key = process.env.REACT_APP_API42_UID;
    const redirect_uri = process.env.REACT_APP_REDIRECT_URI;
    return `https://api.intra.42.fr/oauth/authorize?client_id=${api_key}&redirect_uri=${redirect_uri}&response_type=code`;
}

export function Fetchcode(props: { code: string | null }) {

    const code = props;
    const dispatch = useAppDispatch();
    const [, setCookie] = useCookies(['Token']);
   
    const fetchcode = async () => {
        await fetch(`${process.env.REACT_APP_BACK}oauth/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code: code }),
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
                    // else if (myUser.user.double_auth)
                    setCookie('Token', data.access_token, { path: '/' });
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
            });

    }
    fetchcode();
    return (<div></div>)
}

export default function Connection() {

    const [pages, setpages] = useState<page>(page.PAGE_1)
    const [searchParams] = useSearchParams()
    const [, setCookie] = useCookies(['Token']);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const myUser = useAppSelector(state => state.user);

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
                            console.log("ici => ", myUser)
                            if (data.username === "")
                                setpages(page.PAGE_2);
                            else if (data.twoFaEnable == true)
                                setpages(page.PAGE_3);
                            else
                                dispatch(log_unlog());
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
            {
                pages == page.PAGE_1 &&
                <div className='connection'>
                    <div className='button'>
                        <button className="button pulse pointer color_sign" >
                            <a href={getAuthorizeHref()}>
                                sign
                            </a>
                        </button>
                        <button className="button pulse pointer color_log" >
                            <a  href={getAuthorizeHref()} >
                                log
                            </a>
                        </button>
                    </div>
                </div>
            }
            {
                pages == page.PAGE_2 &&
                <NameForm />
            }
            {
                pages == page.PAGE_3 &&
                <Two_fa />
            }
        </div>
    );
}
