import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { IChannel } from "../interface/Channel";
import { IMessage } from "../interface/Message";
import { IUser } from "../interface/User";

interface StateTest {
    channels: IChannel[],
}

const initialChannel: StateTest = {
    channels: [],
}

export const channelSlice = createSlice({
    name: 'channel',
    initialState: initialChannel,
    reducers: {
        addChannel: (state, action) => { //{ payload }: PayloadAction<IChannel>) => {
            state.channels.push(...action.payload);

        },
    },
});

export const { addChannel } = channelSlice.actions
export default channelSlice.reducer
