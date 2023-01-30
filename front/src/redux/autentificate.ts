import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface autentificate {

    isLog: boolean,
    logOrSign: string | undefined,
}

const initialAuth: autentificate = {
   
    isLog: false,
    logOrSign: undefined,
}

export const authSlice = createSlice({
    name: 'user',
    initialState: initialAuth,
    reducers: {
      
        log_in: (state) => {
            state.isLog = true;
        },
        log_out: (state) => {
            state.isLog = false;
        },
        connection: (state, { payload }: PayloadAction<string>) =>  {
            console.log("bah alors");
            state.logOrSign = payload;
            console.log(payload);
            console.log(state.logOrSign);
            
        }

    },
})

export const { log_in, log_out, connection } = authSlice.actions
export default authSlice.reducer