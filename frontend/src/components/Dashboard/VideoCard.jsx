import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import formatDuration from '../../utils/formatDuration'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { deleteVideo } from '../../store/dashboardSlice'
import VideoForm from './VideoForm'
import { EllipsisVertical, Pencil, Trash } from "lucide-react";


function VideoCard({ video }) {
    const dispatch = useDispatch()
    const { isAuthenticated } = useSelector((state) => state.auth)
    const [menuOpen, setMenuOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)


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
        <div className="relative w-full overflow-hidden rounded-lg bg-zinc-900 shadow">
            <Link to={`/watchpage/${video._id}`}>
                <img src={video.thumbnail}
                    alt={video.title}
                    className="h-40 w-full object-cover"
                    loading="lazy"
                />
            </Link>
            <div className="p-3">
                <h3 className="line-clamp-2 text-sm font-semibold text-white">
                    {video.title}
                </h3>
                <p className="mt-1 text-xs text-gray-400">{video.views} views</p>
            </div>
            <button onClick={() => setMenuOpen((e) => !e)} className="absolute right-2 top-2 rounded-full p-1 text-white/70 hover:bg-black/40">
                <EllipsisVertical size={18} />
            </button>

            {menuOpen && (
                <div className="absolute right-2 top-9 z-20 w-32 rounded-lg bg-zinc-800 py-1 shadow-lg">
                    <button
                        onClick={handleUpdate}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-zinc-700"
                    >
                        <Pencil size={14} /> Update
                    </button>
                    <button
                        onClick={handleDelete}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-zinc-700"
                    >
                        <Trash size={14} /> Delete
                    </button>
                </div>
            )}
            <VideoForm
                isOpen={editOpen}
                onClose={() => setEditOpen(false)}
                video={video}
            />
        </div>
    )
}

export default VideoCard
