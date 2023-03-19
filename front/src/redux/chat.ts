import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IChannel } from "../interface/Channel";
import { IMessage } from "../interface/Message";

interface StateTest {
    channels: IChannel[],
    messages: IMessage[],
}

const initialChat: StateTest = {
    channels: [],
    messages: [],
}

export const chatSlice = createSlice({
    name: 'chat',
    initialState: initialChat,
    reducers: {

        setChannels: (state, { payload }: PayloadAction<IChannel[]>) => {
            state.channels = payload;
            console.log("setChannels no.: ", state.channels.length);
        },

        addChannel: (state, { payload }: PayloadAction<IChannel>) => {
            if (state.channels && state.channels.find(obj => obj.id === payload.id) === undefined)
                state.channels = ([...state.channels, payload]);
            else
                state.channels = ([payload]);
            console.log(":: redux :: addChannel");
        },

        addMember: (state, action) => {
            const { id, user } = action.payload;
            const chan = state.channels.find(obj => obj.id === id);
            if (chan) {
                if (chan.users && chan.users.find(obj => obj.id === user.id) === undefined)
                    chan.users = ([...chan.users, user]);
                else
                    chan.users = ([user]);
            }
            console.log(":: redux :: addMember: ", chan?.users);
        },

        removeMember: (state, action) => {
            const { id, user } = action.payload;
            const chan = state.channels.find(obj => obj.id === id);
            if (chan) {
                if (chan.users && chan.users.find(obj => obj.id === user.id) !== undefined)
                    chan.users = chan?.users.filter(obj => obj.id !== user.id);
            }
            console.log(":: redux :: removeMember: ", chan?.users);
        },

        //  updateMember: (state, action) => {
        //     const { id } = action.payload;
        //     const chan = state.channels.find(obj => obj.id === id);
        //     if (chan) {
        //         const fetchMember = async() => {
        //             const response = await fetch(`${process.env.REACT_APP_BACK}channel`, {
        //                 method: 'GET',
        //             })
        //             const data = await response.json();
        //         }
        //     }
        //  },

        /**
         * 		const fetchJoined = async () => {
                    const response = await fetch(`${process.env.REACT_APP_BACK}channel/user/${currentUser.user?.id}`, {
                        method: 'GET',
                    })
                    const data = await response.json();
                    setChanList(data);
                    // console.log("---", reload,": fetchJoined ---");
                }
         * 
         */

        addAdmin: (state, action) => {
            const { id, user } = action.payload;
            const chan = state.channels.find(obj => obj.id === id);
            if (chan) {
                if (chan.admin && chan.admin.find(obj => obj.id === user.id) === undefined)
                    chan.admin = ([...chan.admin, user]);
                else
                    chan.admin = ([user]);
            }
            console.log(":: redux :: addAdmin");
        },

        banUser: (state, action) => {
            const { id, user } = action.payload;
            const chan = state.channels.find(obj => obj.id === id);
            if (chan) {
                if (chan.banned && chan.banned.find(obj => obj.id === user.id) === undefined)
                    chan.banned = ([...chan.banned, user]);
                else
                    chan.banned = ([user]);
            }
            console.log(":: redux :: banUser");
        },

        unBanUser: (state, action) => {
            const { id, user } = action.payload;
            const chan = state.channels.find(obj => obj.id === id);
            if (chan) {
                if (chan.banned && chan.banned.find(obj => obj.id === user.id) !== undefined)
                    chan.banned = chan?.banned.filter(obj => obj.id !== user.id);
            }
            console.log(":: redux :: unBanUser");
        },

        muteUser: (state, action) => {
            const { id, user } = action.payload;
            const chan = state.channels.find(obj => obj.id === id);
            if (chan) {
                if (chan.muted && chan.muted.find(obj => obj.id === user.id) === undefined)
                    chan.muted = ([...chan.muted, user]);
                else
                    chan.muted = ([user]);
            }
            console.log(":: redux :: muteUser");
        },

        unMuteUser: (state, action) => {
            const { id, user } = action.payload;
            const chan = state.channels.find(obj => obj.id === id);
            if (chan) {
                if (chan.muted && chan.muted.find(obj => obj.id === user.id) !== undefined)
                    chan.muted = chan?.muted.filter(obj => obj.id !== user.id);
            }
            console.log(":: redux :: unMuteUser");
        },

        setPass: (state, action) => {
            const { id, pass } = action.payload;
            const chan = state.channels.find(obj => obj.id === id);
            if (chan) {
                chan.password = pass;
                if (chan.chanType === 0) // 0 === public
                    chan.chanType = 2; // 2 === protected
            }
            console.log(":: redux :: setPass");
        },

        removePass: (state, action) => {
            const { id } = action.payload;
            const chan = state.channels.find(obj => obj.id === id);
            if (chan && chan.chanType === 2) {
                chan.password = "";
                chan.chanType = 0;
            }
            console.log(":: redux :: removePass");
        },
        addMessage: (state, { payload }: PayloadAction<IMessage>) => {
            const chan = state.channels.find(obj => obj.id === payload.chanid);
            if (chan) {
                if (chan.messages)
                    chan.messages = ([...chan.messages, payload]);
                else
                    chan.messages = ([payload]);
            }
        },
    },
});

export const { setChannels, addChannel, addMember, removeMember, addAdmin, banUser, muteUser, setPass, removePass, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
