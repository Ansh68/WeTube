import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { setVideos } from '../../store/dashboardSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Loader2 } from "lucide-react";
import VideoCard from './VideoCard';


function ChannelContents() {
    const dispatch = useDispatch()
    const { isAuthenticated, data } = useSelector((state) => state.auth)
    const [loading, setLoading] = useState(true)
    const user = data.user
    const videos = useSelector((state) => state.dashboard.videos)

    useEffect(() => {
        if (!isAuthenticated) {
            console.log("Login to See Videos")
            setLoading(false)
            return
        }
        const channelVideos = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/dashboard/channelvideos/${user._id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                    withCredentials: true,
                })
                if (response?.data?.data) {
                    dispatch(setVideos(response.data.data))

                }
            } catch (error) {
                console.error("Error getting videos", error)
            } finally {
                setLoading(false)
            }
        }
        channelVideos();
    }, [dispatch, isAuthenticated])

    if (loading) {
        return (
            <div className="flex h-40 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-pink-500" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <p className="text-gray-400">Login to see your videos.</p>;
    }

    if (!videos.length) {
        return <p className="text-gray-400">You have no videos yet.</p>;
    }


    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {videos.map((v) => (
                <VideoCard key={v._id} video={v} />
            ))}
        </div>
    )
}

export default ChannelContents
