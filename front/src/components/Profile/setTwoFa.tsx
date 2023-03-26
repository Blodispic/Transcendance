import * as React from 'react';
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/Hook";
import { enableTwoFa } from "../../redux/user";

export default function TwoFa() {

    const dispatch = useAppDispatch();
    const [qrcode, setQrcode] = useState<string | undefined>(undefined);
    const [code, setCode] = useState<string>('');
    const [isValid, setIsValid] = useState<boolean | undefined>(undefined);
    const myStore = useAppSelector(state => state.user);
    const myToken = useAppSelector(state => state.user.myToken);

    const disable2fa = async (e: any) => {
        e.preventDefault();
        await fetch(`${process.env.REACT_APP_BACK}user`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${myToken}`,
            },
            body: JSON.stringify({
                twoFaEnable: false,
            }),
        })
        .then ( async response => {
            if (response.ok) {
                dispatch(enableTwoFa());
                fetch_qrcode();
                setIsValid(false);
            }
        } )
    }

    const fetchCodeForQr = async (e: any) => {
        e.preventDefault();
        await fetch(`${process.env.REACT_APP_BACK}user/2fa/check`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${myToken}`,
            },
            body: JSON.stringify({
                code: code,
            }),
        })
            .then(async response => {
                if (response.ok) {
                    const data = await response.json();
                    setIsValid(data.result);
                    if (data.result === true) {
                        dispatch(enableTwoFa());
                        fetch(`${process.env.REACT_APP_BACK}user/${myStore.user?.id}`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${myToken}`,
                            },
                            body: JSON.stringify({ twoFaEnable: true }),
                        })
                    }
                }
            })
            .catch()
    }

    const fetch_qrcode = async () => {
        await fetch(`${process.env.REACT_APP_BACK}user/2fa/qrcode`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${myToken}`,
            },
        })
            .then(async response => {
                if (response.ok) {
                    const data = await response.json();
                    setQrcode(data.qrCode);
                }
            })
            .catch()
    }
    useEffect(() => {
        if (myStore.user?.twoFaEnable === false )
        fetch_qrcode();
    }, [])

    return (
        <div className="container">
            {
                isValid !== true && myStore.user?.twoFaEnable === false  && 
                <div className='form-qrcode'>
                    <div className=''>
                        <div>
                            <div className=''>
                                <img className='' src={qrcode} alt='' />
                            </div>
                            <label >
                                Code:
                                <input type="text" value={code} onChange={e => setCode(e.target.value)} />
                            </label>
                            {
                                code &&
                                <button onClick={e => fetchCodeForQr(e)}>
                                    <div>ok</div>
                                </button>
                            }
                            {
                                isValid === false &&
                                <div>code faux ou expirer retenter</div>
                            }
                        </div>
                    </div>
                </div>
            }
            {
                myStore.user?.twoFaEnable === true && 
                <div className="center2" >
                    <button onClick={(e) => {disable2fa(e)}}>
                        <div>Disable 2fa</div>
                    </button>
                </div>
            }
        </div>
    )
}