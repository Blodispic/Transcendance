import { useAppDispatch } from "../../redux/Hook";
import { enableTwoFa } from "../../redux/user";

export default function TwoFa() {

    const dispatch = useAppDispatch();
    return (
        <div className='center form  white'>
            <div className='color-log'>
                <button onClick={e => dispatch(enableTwoFa())}>set TwoFa to true</button>
            </div>
        </div>
    )
}