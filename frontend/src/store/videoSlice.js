import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    video : null,
    error: false,
    loading: false,
}

const videoSlice = createSlice({
    name: "video",
    initialState,
    reducers: {
        fetchStart: (state) =>{
            state.loading = true;
        },
        fetchSuccess: (state, action)=>{
            state.loading = false,
            state.video = action.payload
        },
        fetchFailed: (state)=>{
            state.loading = false,
            state.error = true
        },
        
    }
})

export const { fetchStart, fetchSuccess, fetchFailed } = videoSlice.actions;

export default videoSlice.reducer;