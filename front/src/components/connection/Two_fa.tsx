import { useEffect, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { useAppSelector } from "../../redux/Hook";
import { Fetchcode } from "./Connection";



export const getAuthorizeHref = (): string => {
    const api_key = process.env.REACT_APP_API42_UID;
    const redirect_uri = process.env.REACT_APP_REDIRECT_URI;
    return `https://api.intra.42.fr/oauth/authorize?client_id=${api_key}&redirect_uri=${redirect_uri}&response_type=code`;
}

export function Two_fa() {

    const [code, setCode] = useState<string | undefined>(undefined);
    return (
        <div>
            <div className='center form  white'>
                <div className='color-log'></div>
                <form>
                    <label >
                        Code:
                        <input type="text" name="user" value={code} onChange={e => setCode(e.target.value)} />
                    </label>
                </form>
            </div>
        </div>

    )
}