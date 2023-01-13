import * as React from "react";
import  Header  from '../Header/Header';
import { useState, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";


export default function Connection() {

        const [searchParams] = useSearchParams()

        useEffect(() => {
                const OauthCode = searchParams.get('code'); // Tu lui dit de recuperer le parametre "code" dans l'url
                console.log(OauthCode)
                if (OauthCode) {
                        const body = new FormData
                        body.append("grant_type", "authorization_code")
                        body.append("client_id", "u-s4t2ud-658eea99b7f8711a79cb566ab3962e5a8612e37784b6f5b93df3d2c781606160")
                        body.append("client_secret", "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")
                        body.append("code", OauthCode)
                        
                        fetch("redirect_uri=http://localhost:3000/", {
                          body,
                          headers: {
                            "Content-Type": "multipart/form-data"
                          },
                          method: "POST"
                        })
                        
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
