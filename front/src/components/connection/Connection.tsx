import * as React from "react";
import Header from '../Header/Header';
import { useState, useEffect } from 'react';
import { Form, useSearchParams } from "react-router-dom";
import '../../styles/connection.scss'
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import NameForm from "./form_name_avatar"
import { IUser } from "../../interface/User";
import { NULL } from "sass";
import { useAppDispatch, useAppSelector } from "../../redux/Hook";
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
    const myUser = useAppSelector(state => state.user);
    const [cookies, setCookie] = useCookies(['Token']);
    function handleClick() {
        if (myVar == false)
            setMyvar(true);

    }

    useEffect(() => {
        const oauthCode = searchParams.get('code'); // Tu lui dit de recuperer le parametre "code" dans l'url

        if (oauthCode) {
            const fetchcode = async () => {
                const response = await fetch(`${process.env.REACT_APP_BACK}/oauth/token`, {
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
                            setCookie('Token', data.access_token , { path: '/' });
                        }
                    })
                    .catch(error => {
                        console.error('There was an error!', error);
                    });
            }
            fetchcode();
            if (myVar == false)
                setMyvar(true);
        }
    }, [])

    return (
        <div>
            {
                myVar == false &&
                <button className="button center pulse pointer" >
                    <a href={getAuthorizeHref()}>
                        Connect with Intra
                    </a>
                </button>
            }
            {
                myVar == true &&
                <NameForm />
            }
        </div>
    );
}
