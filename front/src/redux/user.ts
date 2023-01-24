import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IUser, UserStatus } from '../interface/User';

interface StateTest {
    user: IUser | undefined,
    loading: boolean,
}

const initialUser: StateTest = {
    user: undefined,
    loading: true,
}

export const userSlice = createSlice({
    name: 'user',
    initialState: initialUser,
    reducers: {
        setUser: (state, {payload}: PayloadAction<IUser>) => {
            state.user = payload;
        },  
         change_name: (state, {payload}: PayloadAction<string>) => {
            state.user!.username = payload;
        },
        change_status: (state, {payload}: PayloadAction<UserStatus>) => {
           state.user!.status = payload;
        },
        change_avatar (state, {payload}: PayloadAction<string>) {
            state.user!.avatar = payload;
        },
    },
})

export const {setUser, change_status, change_name, change_avatar} = userSlice.actions
export default userSlice.reducer