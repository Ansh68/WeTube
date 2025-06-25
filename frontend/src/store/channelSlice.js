import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userchannel: null,
    userVideos: [],
    userPlaylist: [],
    userHistory: [],
    userSubscribed: [],

}


const ChannelSlice = createSlice({
    name: "channel",
    initialState,
    reducers: {
        setUserChannel: (state, action) => {
            state.userchannel = action.payload;
        },
        setUserVideos: (state, action) => {
            state.userVideos = action.payload;
        },
        setUserPlaylist: (state, action) => {
            state.userPlaylist = action.payload;
        },
        setUserHistory: (state, action) => {
            
            const seen = new Set(state.userHistory.map(v => v._id));

            action.payload.forEach(v => {
                if (!seen.has(v._id)) {
                    state.userHistory.push(v);
                    seen.add(v._id);
                }
            });
        },
        setUserSubscribed: (state, action) => {
            state.userSubscribed = action.payload
        },
        toggleSubscription: (state, action) => {
            if (state.userchannel && state.userchannel._id === action.payload.profileId) {
                state.userchannel = {
                    ...state.userchannel,
                    isSubscribed: action.payload.isSubscribed,
                    subscribersCount: action.payload.subscribersCount
                };
            }
        }
    }
})

export const { setUserChannel, setUserVideos, setUserPlaylist, setUserHistory, setUserSubscribed, toggleSubscription } = ChannelSlice.actions;
export default ChannelSlice.reducer;