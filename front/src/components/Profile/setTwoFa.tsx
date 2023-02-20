import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/Hook";
import { enableTwoFa } from "../../redux/user";

export default function TwoFa() {

    const dispatch = useAppDispatch();
    const [qrcode, setQrcode] = useState<string | undefined>(undefined);
    const [code, setCode] = useState<string>('');
    const [isValid, setIsValid] = useState<boolean | undefined>(undefined);
    const myStore = useAppSelector(state => state.user);

    const fetchCodeForQr = async (e: any) => {
        e.preventDefault();
        await fetch(`${process.env.REACT_APP_BACK}user/2fa/check`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user: myStore.user,
                code: code,
            }),
        })
            .then(async response => {
                const data = await response.json();
                setIsValid(data.result);
                if (data.result === true) {
                    dispatch(enableTwoFa());
                    fetch(`${process.env.REACT_APP_BACK}user/${myStore.user?.id}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ twoFaEnable: true }),
                    })
                }
            })
            .catch()
    }

    useEffect(() => {
        const fetch_qrcode = async () => {
            await fetch(`${process.env.REACT_APP_BACK}user/2fa/qrcode`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user: myStore.user }),
            })
                .then(async response => {
                    const data = await response.json();
                    setQrcode(data.qrCode);
                })
                .catch()
        }
        fetch_qrcode();
    }, [])

    return (
        <>
            {
                isValid !== true &&
                <div className='form-qrcode center'>
                    <div className=''>
                        <div>
                            <div className=''>
                                <img className='' src={qrcode} />
                            </div>
                            <label >
                                Code:
                                <input type="text" value={code} onChange={e => setCode(e.target.value)} />
                            </label>
                            {
                                code &&
                                <button onClick={e => fetchCodeForQr(e)}>
                                    <a>ok</a>
                                </button>
                            }
                            {
                                isValid === false &&
                                <a>code faux ou expirer retenter</a>
                            }
                        </div>
                    </div>
                </div>
            }
        </>
    )
}