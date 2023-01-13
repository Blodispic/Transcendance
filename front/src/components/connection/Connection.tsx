import * as React from "react";
import Header from '../Header/Header';
import { useState, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";


export default function Connection() {

        const [searchParams] = useSearchParams()
        const [token, setToken] = useState(null);
        useEffect(() => {


                const OauthCode = searchParams.get('code'); // Tu lui dit de recuperer le parametre "code" dans l'url
                console.log(OauthCode)
                if (OauthCode) {
                        const fetchToken = async () => {
                                const response = await fetch('https://api.intra.42.fr/oauth/token', {
                                        method: 'POST',
                                        headers: {
                                                'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                                grant_type: "authorization_code",
                                                client_id: "u-s4t2ud-658eea99b7f8711a79cb566ab3962e5a8612e37784b6f5b93df3d2c781606160",
                                                client_secret: "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",
                                                code: OauthCode,
                                                redirect_uri: "http://localhost:3000/",
                                        }),
                                });
                                const data = await response.json();
                                console.log(data.access_token);
                                setToken(data.access_token);
                                // console.log(setToken);
                        }
                        fetchToken();
                }
        }, [])

        return (
                <button className="button">
                        <a href="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-658eea99b7f8711a79cb566ab3962e5a8612e37784b6f5b93df3d2c781606160&redirect_uri=http://localhost:3000/&response_type=code

">
                                Connect with intra
                        </a>
                </button>
        );

}
