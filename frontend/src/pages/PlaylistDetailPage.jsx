import React, { useEffect } from 'react'
import { useDispatch ,useSelector } from 'react-redux'
import { setCurrentPlaylist, seterror, setloading } from '../store/playlistsSlice'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import VideoListCard from '../components/Video/VideoListCard'


function PlaylistDetailPage() {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const { currentPlaylist } = useSelector((state) => state.playlists);
    const dispatch = useDispatch();
    const { playlistId } = useParams();

    const fetchPlaylist = async () => {
        if (!isAuthenticated) {
            return toast.error("You must be logged in to view playlists");
        }
        dispatch(setloading());
        try {
            const response = await axios.get(`http://localhost:8000/playlist/${playlistId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                withCredentials: true,
            })
            if (response?.data?.data) {
                dispatch(setCurrentPlaylist(response.data.data))
            }
        } catch (error) {
            dispatch(seterror(error.response?.data?.message || "Unable to fetch playlist"));
            toast.error(error.response?.data?.message || "Unable to fetch playlist");
        }
    }

    useEffect(() => {
        fetchPlaylist();
    }, [isAuthenticated, playlistId]);

    return (
        <div className="p-4 text-white">
            <h2 className="text-2xl font-bold mb-4">{currentPlaylist?.title || "loading..."} </h2>
            <div className="space-y-3">
                {currentPlaylist.videos && currentPlaylist.videos.length > 0 ? (
                    currentPlaylist.videos.map((video) => (
                        <VideoListCard key={video._id} video={video} />
                    ))
                ) : (
                    <p className="text-gray-400">No videos in this playlist</p>
                )}
            </div>
        </div>
    )
}

export default PlaylistDetailPage
