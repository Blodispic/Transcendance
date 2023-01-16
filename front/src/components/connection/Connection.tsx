import * as React from "react";
import Header from '../Header/Header';
import { useState, useEffect } from 'react';
import { Form, useSearchParams } from "react-router-dom";
import '../../styles/connection.scss'
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import NameForm from "./form_name_avatar"




export const getAuthorizeHref = (): string => {
    const api_key = process.env.REACT_APP_API42_UID;
    const redirect_uri = process.env.REACT_APP_REDIRECT_URI;
    return `https://api.intra.42.fr/oauth/authorize?client_id=${api_key}&redirect_uri=${redirect_uri}&response_type=code`;
}


export default function Connection() {

    const [myVar, setMyvar] = useState(false)

    let buttonclick: boolean = false;
    let navigate = useNavigate();
    const [searchParams] = useSearchParams()


    function handleClick() {
        if (myVar == false)
            setMyvar(true);

    }

    useEffect(() => {
        const oauthCode = searchParams.get('code'); // Tu lui dit de recuperer le parametre "code" dans l'url

        if (oauthCode) {
            const fetchcode = async () => {
                await fetch('http://localhost:4000/oauth/token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ code: oauthCode }),
                })
            }
            fetchcode();
            //  navigate('/Home');
        }
    }, [])

    return (
        <div>
            {
                myVar == false &&
                <button className="button center pulse pointer" >
                    <a href={getAuthorizeHref()} onClick={handleClick}>
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
