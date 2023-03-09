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
        change_lose: (state, { payload }: PayloadAction<number>) => {
            state.user!.lose = payload;
        },
        change_win: (state, { payload }: PayloadAction<number>) => {
            state.user!.win = payload;
        },
        oauth: (state) => {
            state.isOauth = true;
        },
        set_status: (state, { payload }: PayloadAction<UserStatus>) => {

            state.user!.status = payload;
            if (payload === UserStatus.OFFLINE) 
            state.isLog = false;
            else 
            state.isLog = true;
            // socket.emit("UpdateSomeone", {idChange : state.user?.id})
            const response = fetch(`${process.env.REACT_APP_BACK}user/${state.user?.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                'Authorization': `Bearer ${myToken.token}`,

                },
                body: JSON.stringify( {status: payload }),
            })
            .then(response => { return response.json()} )
        },
        delete_user: (state) => {
            userSlice.caseReducers.set_status(state, { type: 'set_status', payload: UserStatus.OFFLINE })
            // set_status(UserStatus.OFFLINE);
            state.user = undefined;
            state.isLog = false;
            state.isOauth = false;
        },
        enableTwoFa: (state) => {
            if (state.user!.twoFaEnable == false)
            state.user!.twoFaEnable = true;
            else 
            state.user!.twoFaEnable = false;
        }
    },
})

export const { setUser, change_status, enableTwoFa, change_name, change_avatar, set_status, delete_user, oauth} = userSlice.actions
export default userSlice.reducer