import * as React from "react";
import Header from '../Header/Header';
import { useState, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";
import '../../styles/nav.scss'
import { Link } from 'react-router-dom';
import  { useNavigate } from "react-router-dom";





export const getAuthorizeHref = (): string => {

        const api_key = process.env.REACT_APP_API42_UID;
	const redirect_uri = process.env.REACT_APP_REDIRECT_URI;
	return `https://api.intra.42.fr/oauth/authorize?client_id=${api_key}&redirect_uri=${redirect_uri}&response_type=code`;

}

export default function Connection() {

        let navigate = useNavigate();

        const [searchParams] = useSearchParams()


        // //BACKK!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // const api_key = process.env.REACT_APP_API42_UID;
        // const private_key = process.env.REACT_APP_API42_SECRET;
        // const redirect_uri = process.env.REACT_APP_REDIRECT_URI;
        // //////////////////////////////////////////////

        useEffect(() => {

               
                const oauthCode = searchParams.get('code'); // Tu lui dit de recuperer le parametre "code" dans l'url
                if (oauthCode) {
                        navigate('/Home');

             
            
                    //BACKK!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!   
                        // const getInfos = async (token: string) => {
                        //         const response = await fetch('https://api.intra.42.fr/v2/me', {
                        //                 method: 'GET',
                        //                 headers: {
                        //                         'Authorization': `Bearer ${token}`,
                        //                 },
                        //         });
                        //         const data = await response.json();
                        //         console.log(data);
                        // }

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

                        //         await getInfos(data.access_token);
                        // }
                        // fetchToken();
                        ////////////////////////////////////
                        // <Link to="/Home">Home</link>
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
