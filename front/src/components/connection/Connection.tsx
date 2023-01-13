import * as React from "react";
import Header from '../Header/Header';
import { useState, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";
import '../../styles/nav.scss'


export const getAuthorizeHref = (): string => {

        const api_key = process.env.REACT_APP_API42_UID;
	const redirect_uri = process.env.REACT_APP_REDIRECT_URI;
	return `https://api.intra.42.fr/oauth/authorize?client_id=${api_key}&redirect_uri=${redirect_uri}&response_type=code`;

}

export default function Connection() {

        const [searchParams] = useSearchParams()
        const [token, setToken] = useState(null);


        //BACKK!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        const api_key = process.env.REACT_APP_API42_UID;
        const private_key = process.env.REACT_APP_API42_SECRET;
        const redirect_uri = process.env.REACT_APP_REDIRECT_URI;
        //////////////////////////////////////////////

        useEffect(() => {

                const oauthCode = searchParams.get('code'); // Tu lui dit de recuperer le parametre "code" dans l'url
                if (oauthCode) {
                        
                        fetch('http://localhost:4000/Oauth/token', {
                                method: 'POST',
                                body: JSON.stringify({code: oauthCode}),
                            })
                        // .then(data => console.log(data))
                        // .catch(error => console.error(error))
                        // //BACKK!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                        // const fetchToken = async () => {
                        //         const response = await fetch('https://api.intra.42.fr/oauth/token', {
                        //                 method: 'POST',
                        //                 headers: {
                        //                         'Content-Type': 'application/json',
                        //                 },
                        //                 body: JSON.stringify({
                        //                         grant_type: "authorization_code",
                        //                         client_id: api_key,
                        //                         client_secret: private_key,
                        //                         code: oauthCode,
                        //                         redirect_uri: redirect_uri,
                        //                 }),
                        //         });
                        //         const data = await response.json();
                        //         setToken(data.access_token);
                        // }
                        // fetchToken();
                        // //////////////////////////////////////////////////
                
                
                }
        }, [])

        return (
                <button className="button">
                        <a href={getAuthorizeHref()}>
                                Connect with Intra
                        </a>
                </button>
        );

}
