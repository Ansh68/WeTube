import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    videos: [],
    stats: {
        totalVideos: 0,
        totalViews: 0,
        totalSubscribers: 0
    },
    loading: false,
}

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {
        setVideos: (state, action) => {
            state.videos = action.payload;
        },
        
        setStats: (state, action) => {
            state.stats = action.payload;

        },
        publishStatus: (state, action) => {
            state.videos = state.videos.map(video => {
                video._id === action.payload._id
                    ? { ...video, isPublished: action.payload.isPublished, }
                    : video;

            })
        },
        deleteVideo: (state, action) => {
            state.videos = state.videos.filter(video => video._id !== action.payload)
        },
        addvideoStats: (state, action) => {
            state.stats.totalVideos += 1 ;
            state.videos.unshift(action.payload)
        },
        updateVideos: (state, action) => {
            const indx = state.videos.findIndex(video => video._id == action.payload._id);
            if (indx !== -1) {
                state.videos[indx] = action.payload
            }
        }
    }
})

export const { setVideos, setStats, publishStatus, deleteVideo, addvideoStats ,updateVideos} = dashboardSlice.actions;
export default dashboardSlice.reducer;