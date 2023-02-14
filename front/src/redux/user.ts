import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IUser, UserStatus } from '../interface/User';
import { socket } from "../App";

interface StateTest {
    user: IUser | undefined,
    isLog: boolean,
    isOauth: boolean,
}

const initialUser: StateTest = {
    user: undefined,
    isOauth: false,
    isLog: false,
}

export const userSlice = createSlice({
    name: 'user',
    initialState: initialUser,
    reducers: {
        setUser: (state, { payload }: PayloadAction<IUser>) => {
            state.user = payload;   
            state.user.twoFaEnable = false;
        },
        change_name: (state, { payload }: PayloadAction<string>) => {
            state.user!.username = payload;
        },
        change_status: (state, { payload }: PayloadAction<UserStatus>) => {
            state.user!.status = payload;
        },
        change_avatar: (state, { payload }: PayloadAction<string>) => {
            state.user!.avatar = payload;
        },
        oauth: (state) => {
            state.isOauth = true;
        },
        set_status: (state, { payload }: PayloadAction<UserStatus>) => {

            console.log("change le status normalement",state.user,  payload)
            state.user!.status = payload;
            if (payload === UserStatus.OFFLINE) 
            state.isLog = false;
            else 
            state.isLog = true;
            // socket.emit("status", payload)
            const response = fetch(`${process.env.REACT_APP_BACK}user/${state.user?.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify( {status: payload }),
            })
            .then(response => { return response.json()} )
            .then(data => ( console.log(data) ))
        },
        delete_user: (state) => {
            state.user = undefined;
            state.isLog = false;
            state.isOauth = false;
        },
        enableTwoFa: (state) => {
            state.user!.twoFaEnable = true;
        }
    },
})

export const { setUser, change_status, enableTwoFa, change_name, change_avatar, set_status, delete_user, oauth} = userSlice.actions
export default userSlice.reducer