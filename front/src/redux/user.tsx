import { createSlice } from '@reduxjs/toolkit'
import { useReducer } from 'react'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        username: '',
        status: false,
        avatar: '',
    },
    reducers: {

        // change_name: (state, action) => {
        //     state.username = action;
        // },
        change_status: (state) => {
            if (state.status == true)
                state.status = false;
            else
                state.status = true;
        },
        // change_avatar (state, action) {
        //     state.status = action;
        // },
    }
})

export const {change_status} = userSlice.actions
export default userSlice.reducer