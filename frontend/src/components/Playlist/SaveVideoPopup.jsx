import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createPortal } from 'react-dom';
import { setPlaylists, seterror, setloading, addVideoToPlaylist, removeVideoFromPlaylist } from '../../store/playlistsSlice';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import PlaylistForm from './PlaylistForm';

const modalRoot = document.getElementById("popup-models") || document.body;

function SaveVideoPopup({ isOpen, onClose, video }) {
    const { isAuthenticated, data } = useSelector((state) => state.auth);
    const user = data?.user
    const { playlists } = useSelector((state) => state.playlists);
    const [selected, setSelected] = useState([]);
    const [showForm, setShowForm] = useState(false)
    const videoId = video?._id || video;

    const dispatch = useDispatch();

    const getUserPlaylists = async () => {
        if (isOpen && isAuthenticated) {
            dispatch(setloading());
            try {
                const response = await axios.get(`http://localhost:8000/playlist/user/${user._id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                    withCredentials: true,
                })
                if (response?.data?.data) {
                    dispatch(setPlaylists(response.data.data));

                }
            } catch (error) {
                dispatch(seterror(error.response?.data?.message || "Unable to fetch playlists"));
                toast.error(error.response?.data?.message || "Unable to fetch playlists");
            }
        }
    }

    const handleaddVideo = async (playlistId) => {
        if (!isAuthenticated) {
            return toast.error("You must be logged in to add a video to a playlist");
        }
        dispatch(setloading());
        try {
            const response = await axios.post(`http://localhost:8000/playlist/${playlistId}/video/${videoId}`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                withCredentials: true,
            })
            if (response.data.data) {
                dispatch(addVideoToPlaylist({ playlistId, video: response.data.data }))
                toast.success("Video added to playlist successfully");
                onClose();
                setSelected((prev) => [...prev, playlistId])
            }
        } catch (error) {
            dispatch(seterror(error.response?.data?.message || "Unable to add video to playlist"));
            toast.error(error.response?.data?.message || "Unable to add video to playlist");
        }
    }

    const handledeleteVideo = async (playlistId) => {
        if (!isAuthenticated) {
            return toast.error("You must be logged in to remove a video from a playlist");
        }
        dispatch(setloading());
        try {
            const response = await axios.delete(` http://localhost:8000/playlist/${playlistId}/video/${videoId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                withCredentials: true,
            })
            if (response.data.success) {
                dispatch(removeVideoFromPlaylist({ playlistId, videoId }))
                toast.success("Video removed from playlist successfully");
                setSelected((prev) => prev.filter(id => id !== playlistId))
            }
        } catch (error) {
            dispatch(seterror(error.response?.data?.message || "Unable to remove video from playlist"));
            toast.error(error.response?.data?.message || "Unable to remove video from playlist");
        }
    }

    const handleCheckboxChange = (playlistId, checked) => {
        if (checked) {
            handleaddVideo(playlistId);

        }
        else {
            handledeleteVideo(playlistId);
        }
    }

    useEffect(() => {
        getUserPlaylists();
    }, [isOpen, isAuthenticated, user?._id, dispatch]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-gray-900 rounded-lg shadow-2xl border border-gray-700 w-full max-w-sm mx-4 animate-scale-in">
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <h2 className="text-white text-lg font-medium">Save Video to...</h2>
                    <button
                        onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-700 rounded"
                    >
                        <X size={20} />
                    </button>
                </div>
                {/* Content */}
                <div className="p-4 space-y-3">
                    <div>
                        {playlists.map((playlist) => (
                            <label
                                key={playlist._id}
                                className="flex items-center space-x-3 cursor-pointer group hover:bg-gray-800 p-2 rounded transition-colors"
                            >
                                <div className="relative">
                                    <input type="checkbox"
                                        checked={selected.includes(playlist._id)}
                                        onChange={(e) => handleCheckboxChange(playlist._id, e.target.checked)}
                                        className="sr-only"
                                    />
                                    <div className={`w-5 h-5 border-2 rounded ${selected.includes(playlist._id)
                                            ? 'bg-blue-600 border-blue-600'
                                            : 'border-gray-500 group-hover:border-gray-400'
                                        } transition-colors flex items-center justify-center`}>
                                        {selected.includes(playlist._id) && (
                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                                <span className="text-white text-sm flex-1">{playlist.title}</span>
                            </label>
                        ))}
                    </div>
                    {/* Hidden submit button */}
                    <button type="submit" className="hidden">Save</button>
                </div>
                {/* New Playlist Button */}
                <div className="px-4 pb-4">
                    <button
                        onClick={() => setShowForm(true)}
                        className="w-full flex items-center justify-center space-x-2 p-3 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors text-gray-300 hover:text-white"
                    >
                        <Plus size={20} />
                        {showForm && <PlaylistForm onClose={setShowForm(false)} />}
                    </button>
                </div>
            </div>
        </div>,
        modalRoot
    )
}

export default SaveVideoPopup