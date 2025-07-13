
import React, { useCallback, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import getTimeDistanceToNow from '../../utils/getTimeDistance'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { deleteVideo } from '../../store/dashboardSlice'
import VideoForm from './VideoForm'
import { EllipsisVertical, Pencil, Trash } from "lucide-react";
import useClickOutside from '../../utils/useclickOutside.js'


function VideoCard({ video }) {

    const dispatch = useDispatch()

    const timeDistance = getTimeDistanceToNow ? getTimeDistanceToNow(video?.createdAt) : 'Just Now';
    const { isAuthenticated } = useSelector((state) => state.auth)
    const [menuOpen, setMenuOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const menuRef = useRef()

    const closeMenu = useCallback(() => setMenuOpen(false), [])

    useClickOutside(menuRef, closeMenu);

    const handleDelete = async () => {
        setMenuOpen(false)
        if (!isAuthenticated) {
            console.log("Cannot delete Video")
        }
        try {
            const response = await axios.delete(`http://localhost:8000/videos/${video._id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                withCredentials: true,
            })
            if (response.data.success) {
                dispatch(deleteVideo(video._id))

            }
        } catch (error) {
            console.error("Error While deleteting video", error)
        }
    }

    const handleUpdate = () => {
        setMenuOpen(false)
        setEditOpen(true)
    }



    return (
        <div className="relative flex w-full overflow-visible rounded-lg bg-zinc-900 shadow">
            <Link to={`/watchpage/${video._id}`} className="flex-shrink-0">
                <div className="relative">
                    <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="h-20 w-36 object-cover rounded-l-lg"
                        loading="lazy"
                    />

                </div>
            </Link>

            <div className="flex flex-1 items-center justify-between p-3">
                <div className="flex-1 min-w-0">
                    <h3 className="line-clamp-2 text-sm font-semibold text-white mb-1">
                        {video.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span>{video.views || 0} views</span>
                        <span>•</span>
                        <span>{timeDistance}</span>
                    </div>
                </div>

                <div className="relative ml-3">
                    <button
                        onClick={() => setMenuOpen((e) => !e)}
                        className="rounded-full p-2 text-white/70 hover:bg-zinc-700 cursor-pointer transition-colors"
                    >
                        <EllipsisVertical size={16} />
                    </button>

                    {menuOpen && (
                        <div ref={menuRef} className="absolute right-0 top-full mt-1 z-[100] w-32 rounded-lg bg-zinc-800 py-1 shadow-xl border border-zinc-700">
                            <button

                                onClick={handleUpdate}
                                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-white hover:bg-zinc-700 transition-colors"
                            >
                                <Pencil size={14} /> Update
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-zinc-700 transition-colors"
                            >
                                <Trash size={14} /> Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <VideoForm
                isOpen={editOpen}
                onClose={() => setEditOpen(false)}
                video={video}
            />
        </div>
    )
}

export default VideoCard
