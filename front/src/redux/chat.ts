import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IChannel } from "../interface/Channel";
import { IMessage } from "../interface/Message";
import { IUser } from "../interface/User";

interface StateTest {
    channels: IChannel[],
    chanMs: IMessage[],
    DMs: IMessage[],
}

const initialChat: StateTest = {
    channels: [],
    chanMs: [],
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

        removeChanMessage: (state, {payload}: PayloadAction<number>) => {
            if (state.channels && state.channels.find(obj => obj.id === payload) !== undefined){
                state.chanMs = state.chanMs.filter(obj => obj.chanid !== payload);
            }
        },

        joinChannel: (state, { payload }: PayloadAction<{id: number, chan: IChannel, user: IUser}>) => {
            let chan: IChannel | undefined = state.channels.find(obj => obj.id === payload.id);
            if (chan) {
                chan.owner = payload.chan.owner;
                chan.users = payload.chan.users;
                chan.admin = payload.chan.admin;
                chan.banned = payload.chan.banned;
                chan.muted = payload.chan.muted;
                if (chan?.users.find(obj => obj.id === payload.user.id) === undefined)
                    chan.users = ([...chan.users, payload.user])
            }
        },

        addMember: (state, { payload }: PayloadAction<{ id: number, user: IUser }>) => {
            const chan: IChannel | undefined = state.channels.find(obj => obj.id === payload.id);
            if (chan) {
                if (chan.users !== undefined && chan.users.find(obj => obj.id === payload.user.id) === undefined)
                    chan.users = ([...chan.users, payload.user]);
                else
                    chan.users = ([payload.user]);
            }
        },

        removeMember: (state, { payload }: PayloadAction<{ id: number, user: IUser }>) => {
            const chan: IChannel | undefined = state.channels.find(obj => obj.id === payload.id);
            if (chan) {
                if (chan.users && chan.users.find(obj => obj.id === payload.user.id) !== undefined)
                    chan.users = chan.users.filter(obj => obj.id !== payload.user.id);
                if (chan.admin && chan.admin.find(obj => obj.id === payload.user.id) !== undefined)
                    chan.admin = chan.admin.filter(obj => obj.id !== payload.user.id);
                if (chan.owner && chan.owner.id === payload.user.id)
                    chan.owner = undefined;
            }
        },

        addAdmin: (state, { payload }: PayloadAction<{ chanid: number, userid: number }>) => {
            const chan: IChannel | undefined = state.channels.find(obj => obj.id === payload.chanid);
            if (chan) {
                const user: IUser | undefined = chan.users.find(obj => obj.id === payload.userid);
                if (user) {
                    if (chan.admin && chan.admin.find(obj => obj.id === user.id) === undefined)
                    chan.admin = ([...chan.admin, user]);
                    else
                    chan.admin = ([user]);
                }
            }
        },

        banUser: (state, { payload }: PayloadAction<{ chanid: number, userid: number }>) => {
            const chan: IChannel | undefined = state.channels.find(obj => obj.id === payload.chanid);
            if (chan) {
                const user: IUser | undefined = chan.users.find(obj => obj.id === payload.userid);
                if (user) {
                    if (chan.banned && chan.banned.find(obj => obj.id === user.id) === undefined)
                        chan.banned = ([...chan.banned, user]);
                    else
                        chan.banned = ([user]);
                    chan.users = chan.users.filter(obj => obj.id !== user.id);
                }
            }
        },

        unBanUser: (state, { payload }: PayloadAction<{ chanid: number, userid: number }>) => {
            const chan: IChannel | undefined = state.channels.find(obj => obj.id === payload.chanid);
            if (chan) {
                const user: IUser | undefined = chan.users.find(obj => obj.id === payload.userid);
                if (user) {
                    if (chan.banned && chan.banned.find(obj => obj.id === user.id) !== undefined)
                    chan.banned = chan?.banned.filter(obj => obj.id !== user.id);
                }
            }
        },

        muteUser: (state, { payload }: PayloadAction<{ chanid: number, userid: number }>) => {
            const chan: IChannel | undefined = state.channels.find(obj => obj.id === payload.chanid);
            if (chan) {
                const user: IUser | undefined = chan.users.find(obj => obj.id === payload.userid);
                if (user) {
                    if (chan.muted && chan.muted.find(obj => obj.id === user?.id) === undefined)
                        chan.muted = ([...chan.muted, user]);
                    else
                        chan.muted = ([user]);
                }
            }
        },

        unMuteUser: (state, { payload }: PayloadAction<{ chanid: number, userid: number }>) => {
            const chan: IChannel | undefined = state.channels.find(obj => obj.id === payload.chanid);
            if (chan) {
                const user: IUser | undefined = chan.users.find(obj => obj.id === payload.userid);
                if (user) {
                    if (chan.muted && chan.muted.find(obj => obj.id === user.id) !== undefined)
                        chan.muted = chan?.muted.filter(obj => obj.id !== user.id);
                }
            }
        },

        setPass: (state, { payload }: PayloadAction<number>) => {
            const chan: IChannel | undefined = state.channels.find(obj => obj.id === payload);
            if (chan) {
                chan.chanType = 2;
            }
        },

        removePass: (state, { payload }: PayloadAction<number>) => {
            const chan: IChannel | undefined = state.channels.find(obj => obj.id === payload);
            if (chan && chan.chanType === 2) {
                chan.password = "";
                chan.chanType = 0;
            }
        },

        addMessage: (state, { payload }: PayloadAction<IMessage>) => {
            state.chanMs = ([...state.chanMs, payload]);
        },

        addDM: (state, { payload }: PayloadAction<IMessage>) => {
            state.DMs = ([...state.DMs, payload]);
        },

    },
});

export const { setChannels, addChannel, removeChanMessage, joinChannel, addMember, removeMember, addAdmin, banUser, muteUser, unBanUser, unMuteUser, setPass, removePass, addMessage, addDM } = chatSlice.actions;
export default chatSlice.reducer;
