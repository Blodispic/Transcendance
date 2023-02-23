import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IChannel } from "../interface/Channel";
import { IMessage } from "../interface/Message";

interface StateTest {
    channel: IChannel | undefined,
    messages: IMessage[],
}

const initialChannel: StateTest = {
    channel: undefined,
    messages: []
}

export const channelSlice = createSlice({
    name: 'channel',
    initialState: initialChannel,
    reducers: {
        addMessages: (state, { payload }: PayloadAction<IMessage>) => {
            state.messages.push(payload)
        },
        // 
    }
})