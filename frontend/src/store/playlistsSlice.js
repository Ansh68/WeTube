import { createSlice, current } from "@reduxjs/toolkit";
import { act } from "react";

const initialState = {
    playlists: [],
    currentPlaylist: null,
    loading: false,
    error: null,
}

const playlistsSlice = createSlice({
    name: "playlists",
    initialState,
    reducers: {
        setPlaylists: (state, action) => {
            state.playlists = action.payload;

        },
        setCurrentPlaylist: (state, action) => {
            state.currentPlaylist = action.payload;
        },
        addPlaylist: (state, action) => {
            state.playlists.push(action.payload)
        },
        updatePlaylist: (state, action) => {
            state.playlists = state.playlists.map(playlist =>
                playlist._id === action.payload._id ? action.payload : playlist
            )
        },
        deletePlaylist: (state, action) => {
            state.playlists = state.playlists.filter(playlist => playlist._id !== action.payload)
        },
        addVideoToPlaylist: (state, action) => {
            const { playlistId, video } = action.payload;
            const playlist = state.playlists.find(pl => pl._id === playlistId)
            if (playlist && !playlist.videos.some(v => v._id === video._id)) {
                playlist.videos.push(video);
            }
        },
        removeVideoFromPlaylist: (state, action) => {
            const { playlistId, videoId } = action.payload;
            const playlist = state.playlists.find(pl => pl._id === playlistId)
            if (playlist) {
                playlist.videos = playlist.videos.filter(v => v._id !== videoId);
            }
        },
        setloading: (state) => {
            state.loading = true;
            state.error = null;
        },
        seterror: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    }
})

export const { setPlaylists, setCurrentPlaylist, addPlaylist, updatePlaylist, deletePlaylist, adddVideoToPlaylist, removeVideoFromPlaylist, setloading, seterror
} = playlistsSlice.actions;


export default playlistsSlice.reducer;