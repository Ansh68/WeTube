import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { deletePlaylist, seterror, setloading } from '../../store/playlistsSlice'
import axios from 'axios'
import { MoreVertical, Trash2, Pencil } from 'lucide-react';
import PlaylistForm from './PlaylistForm'

function PlaylistCard({ playlist, video }) {
    const [showMenu, setShowMenu] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const { isAuthenticated } = useSelector((state) => state.auth);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const playlistId = playlist._id

    const handleDeletePlaylist = async () => {
        if (!isAuthenticated) {
            return toast.error("You must be logged in to delete a playlist");
        }
        dispatch(setloading());
        try {
            const response = await axios.delete(`http://localhost:8000/playlist/${playlistId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                withCredentials: true,
            })
            if (response.data.success) {
                dispatch(deletePlaylist(playlistId));
                toast.success("Playlist deleted successfully");
                navigate("/playlists");
            }
        } catch (error) {
            dispatch(seterror(error.response?.data?.message || "Unable to delete playlist"));
            toast.error(error.response?.data?.message || "Unable to delete playlist");
        }
    }

    if (!window.confirm("Are you sure you want to delete this playlist?")) {
        return;
    }

    return (
        <>
            <div className="bg-background p-8 flex items-center justify-center"
                onClick={() => navigate(`/playlist/${playlistId}`)}
            >
                <div className="playlist-card w-80 relative">
                    {/* thumbnail section */}
                    <div>
                        <img src={video?.thumbnail || "/placeholder.jpg"} className="w-full h-40 object-cover rounded-lg" />
                    </div>
                    <div className="space-y-4">
                        {/* title section */}
                        <h2 className="text-lg font-semibold text-white">{playlist.title}</h2>
                        <p className="text-sm text-gray-400">{playlist.videos?.length || 0} videos</p>

                        {/* three dots */}
                        <div className="absolute top-3 right-3">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setShowMenu(!showMenu)
                                }}>
                                <MoreVertical size={18} className="text-gray-400 hover:text-white" />
                            </button>
                            {showMenu && (
                                <div className="absolute right-0 mt-2 w-32 bg-gray-900 border border-gray-700 rounded shadow z-10">
                                    <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-700 flex items-center gap-2"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEditOpen(true);
                                            setShowMenu(false);
                                        }}
                                    >
                                        <Pencil size={16} /> Edit
                                    </button>
                                    <button
                                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-700 flex items-center gap-2 text-red-500"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeletePlaylist();
                                        }}
                                    >
                                        <Trash2 size={16} /> Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* edit modal */}
            {editOpen && (
                <PlaylistForm
                    isOpen={editOpen}
                    onClose={() => setEditOpen(false)}
                    playlist={playlist}
                    
                />
            )}
        </>
    )
}

export default PlaylistCard
