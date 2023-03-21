import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IChannel } from "../interface/Channel";
import { IMessage } from "../interface/Message";
import { IUser } from "../interface/User";

interface StateTest {
    channels: IChannel[],
    DMs: IMessage[],
}

const initialChat: StateTest = {
    channels: [],
    DMs: [],
}

export const chatSlice = createSlice({
    name: 'chat',
    initialState: initialChat,
    reducers: {

        setChannels: (state, { payload }: PayloadAction<IChannel[]>) => {
            state.channels = payload;
        },

        addChannel: (state, { payload }: PayloadAction<IChannel>) => {
            if (state.channels && state.channels.find(obj => obj.id === payload.id) === undefined)
                state.channels = ([...state.channels, payload]);
            else
                state.channels = ([payload]);
        },

        updateMember: (state, { payload }: PayloadAction<{id: number, chan: IChannel}>) => {
            let chan = state.channels.find(obj => obj.id === payload.id);
            if (chan) {
                chan.owner = payload.chan.owner;
                chan.users = payload.chan.users;
                chan.admin = payload.chan.admin;
                chan.banned = payload.chan.banned;
                chan.muted = payload.chan.muted;
            }
        },

        addMember: (state, { payload }: PayloadAction<{ id: number, user: IUser }>) => {
            const chan = state.channels.find(obj => obj.id === payload.id);
            if (chan) {
                if (chan.users !== undefined && chan.users.find(obj => obj.id === payload.user.id) === undefined)
                    chan.users = ([...chan.users, payload.user]);
                else
                    chan.users = ([payload.user]);
            }
        },

        removeMember: (state, { payload }: PayloadAction<{ id: number, user: IUser }>) => {
            const chan = state.channels.find(obj => obj.id === payload.id);
            if (chan) {
                if (chan.users && chan.users.find(obj => obj.id === payload.user.id) !== undefined)
                    chan.users = chan.users.filter(obj => obj.id !== payload.user.id);
            }
        },

        addAdmin: (state, { payload }: PayloadAction<{ id: number, user: IUser }>) => {
            const chan = state.channels.find(obj => obj.id === payload.id);
            if (chan) {
                if (chan.admin && chan.admin.find(obj => obj.id === payload.user.id) === undefined)
                    chan.admin = ([...chan.admin, payload.user]);
                else
                    chan.admin = ([payload.user]);
            }
        },

        banUser: (state, { payload }: PayloadAction<{ id: number, user: IUser }>) => {
            const chan = state.channels.find(obj => obj.id === payload.id);
            if (chan) {
                if (chan.banned && chan.banned.find(obj => obj.id === payload.user.id) === undefined)
                    chan.banned = ([...chan.banned, payload.user]);
                else
                    chan.banned = ([payload.user]);
            }
            console.log(":: redux :: banUser");
        },

        unBanUser: (state, { payload }: PayloadAction<{ id: number, user: IUser }>) => {
            const chan = state.channels.find(obj => obj.id === payload.id);
            if (chan) {
                if (chan.banned && chan.banned.find(obj => obj.id === payload.user.id) !== undefined)
                    chan.banned = chan?.banned.filter(obj => obj.id !== payload.user.id);
            }
            console.log(":: redux :: unBanUser");
        },

        muteUser: (state, { payload }: PayloadAction<{ id: number, user: IUser }>) => {
            const chan = state.channels.find(obj => obj.id === payload.id);
            if (chan) {
                if (chan.muted && chan.muted.find(obj => obj.id === payload.user.id) === undefined)
                    chan.muted = ([...chan.muted, payload.user]);
                else
                    chan.muted = ([payload.user]);
            }
            console.log(":: redux :: muteUser");
        },

        unMuteUser: (state, { payload }: PayloadAction<{ id: number, user: IUser }>) => {
            const chan = state.channels.find(obj => obj.id === payload.id);
            if (chan) {
                if (chan.muted && chan.muted.find(obj => obj.id === payload.user.id) !== undefined)
                    chan.muted = chan?.muted.filter(obj => obj.id !== payload.user.id);
            }
            console.log(":: redux :: unMuteUser");
        },

        setPass: (state, { payload }: PayloadAction<number>) => {
            const chan = state.channels.find(obj => obj.id === payload);
            if (chan) {
                chan.chanType = 2;
            }
        },

        removePass: (state, { payload }: PayloadAction<number>) => {
            const chan = state.channels.find(obj => obj.id === payload);
            if (chan && chan.chanType === 2) {
                chan.password = "";
                chan.chanType = 0;
            }
        },

        addMessage: (state, { payload }: PayloadAction<IMessage>) => {
            const chan = state.channels.find(obj => obj.id === payload.chanid);
            //      if (!chan)
            //           const chan = state.channels.find(obj => obj.id === undefined && obj.sender === payload.sender);
            if (chan) {
                if (chan.messages)
                    chan.messages = ([...chan.messages, payload]);
                else
                    chan.messages = ([payload]);
            }
            //// OR LIKE THIS
            // else{
            //     const DM = state.channels.find(obj => obj.id === undefined && obj.sender.id === payload.sender.id);
            //     if (DM) {
            //          if (DM.messages)
            //              DM.messages = ([...DM.messages, payload]);
            //          else
            //              DM.messages = ([payload]);
            //      }
            //} 

            //SO NO NEDD NEXT FUNCTION
        },

        addDM: (state, { payload }: PayloadAction<IMessage>) => {
            state.DMs = ([...state.DMs, payload]);
        },

    },
});

export const { setChannels, addChannel, updateMember, addMember, removeMember, addAdmin, banUser, muteUser, setPass, removePass, addMessage, addDM } = chatSlice.actions;
export default chatSlice.reducer;
