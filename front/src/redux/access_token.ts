import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IUser, UserStatus } from '../interface/User';
import { socket } from "../App";

interface initialState {
    token: string,
}

const initialToken: initialState = {
    token: '',
}

export const tokenSlice = createSlice({
    name: 'access_token',
    initialState: initialToken,
    reducers: {
        setToken: (state, { payload }: PayloadAction<string>) => {
            state.token = payload;
        },
    },
})

export const { setToken } = tokenSlice.actions
export default tokenSlice.reducer