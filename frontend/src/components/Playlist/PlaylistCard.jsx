import React, { useState , useRef , useCallback } from 'react'
import { useSelector, useDispatch  } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { deletePlaylist, seterror, setloading } from '../../store/playlistsSlice'
import axios from 'axios'
import { MoreVertical, Trash2, Pencil, Play } from 'lucide-react';
import PlaylistForm from './PlaylistForm'
import useClickOutside from '../../utils/useclickOutside.js'

function PlaylistCard({ playlist, video }) {
    const [showMenu, setShowMenu] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const { isAuthenticated } = useSelector((state) => state.auth);
    const menuRef = useRef();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const playlistId = playlist._id

    const closeMenu = useCallback(() => setShowMenu(false), []);

    useClickOutside(menuRef, closeMenu);

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
                navigate("/playlist");
            }
        } catch (error) {
            dispatch(seterror(error.response?.data?.message || "Unable to delete playlist"));
            toast.error(error.response?.data?.message || "Unable to delete playlist");
        }
    }

    return (
        <>
            <div className="p-4">
                <div 
                    className="playlist-card w-80 bg-[#1717177b] rounded-xl overflow-hidden border border-gray-800 hover:border-[#1717177b] transition-all duration-300 cursor-pointer group"
                    onClick={() => navigate(`/playlist/${playlistId}`)}
                >
                    {/* Thumbnail Section */}
                    <div className="relative">
                        <img 
                            src={playlist?.videos?.[0]?.thumbnail || "/placeholder.jpg"} 
                            className="w-full h-44 object-cover transition-transform duration-300 group-hover:scale-105" 
                            alt={playlist.name}
                        />
                        
                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                                <Play size={20} className="text-white fill-white" />
                            </div>
                        </div>

                        {/* Three Dots Menu */}
                        <div className="absolute top-3 right-3">
                            <button
                                className="bg-black/50 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setShowMenu(!showMenu)
                                }}>
                                <MoreVertical size={16} className="text-white" />
                            </button>
                            
                            {/* Dropdown Menu */}
                            {showMenu && (
                                <div ref={menuRef} className="absolute right-0 mt-2 w-36 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl overflow-hidden z-10">
                                    <button 
                                        className="w-full text-left cursor-pointer px-4 py-3 text-sm  hover:bg-zinc-700 text-white flex items-center gap-3 transition-colors duration-200"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEditOpen(true);
                                            setShowMenu(false);
                                        }}
                                    >
                                        <Pencil size={14} /> Edit
                                    </button>
                                    <button
                                        className="w-full text-left px-4 py-3 cursor-pointer text-sm text-red-400 hover:bg-zinc-700  flex items-center gap-3 transition-colors duration-200"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeletePlaylist();
                                        }}
                                    >
                                        <Trash2 size={14} /> Delete
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Video Count Badge */}
                        <div className="absolute bottom-3 right-3">
                            <span className="bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md">
                                {playlist.videos?.length || 0} videos
                            </span>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-4">
                        <h2 className="text-lg font-medium text-white mb-1 line-clamp-2 group-hover:text-gray-200 transition-colors duration-300">
                            {playlist.name}
                        </h2>
                        <p className="text-sm text-gray-400">
                            Playlist
                        </p>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
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