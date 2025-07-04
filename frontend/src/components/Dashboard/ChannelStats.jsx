import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { setStats } from '../../store/dashboardSlice'
import { useDispatch, useSelector } from 'react-redux'


function ChannelStats() {
    const { isAuthenticated, data } = useSelector((state) => state.auth)
    const stats = useSelector((state) => state.dashboard.stats)
    const user = data?.user;
    const dispatch = useDispatch();

    useEffect(() => {
        if (!isAuthenticated) {
            console.error("No Stats for you")
            return;
        }
        const getStats = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/dashboard/stats/${user?._id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                    withCredentials: true,
                })
                if (response.data.data) {
                    dispatch(setStats(response.data.data))
                    console.log("Stats fetched Successfully")
                }
            } catch (error) {
                console.error("Failed to get Stats", error)
            }
        }
        getStats();
    }, [isAuthenticated, user, dispatch])

    return (
        <div className="p-6 bg-zinc-950 min-h-[60vh] text-white">
            <h2 className="text-2xl font-bold mb-6">Channel Statistics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-zinc-900 p-4 rounded-lg shadow border border-zinc-800">
                    <h3 className="text-lg font-semibold text-gray-300">Total Videos</h3>
                    <p className="text-3xl font-bold text-pink-500 mt-2">
                        {stats?.totalVideos ?? 0}
                    </p>
                </div>
                <div className="bg-zinc-900 p-4 rounded-lg shadow border border-zinc-800">
                    <h3 className="text-lg font-semibold text-gray-300">Total Views</h3>
                    <p className="text-3xl font-bold text-blue-500 mt-2">
                        {stats?.totalViews ?? 0}
                    </p>
                </div>
                <div className="bg-zinc-900 p-4 rounded-lg shadow border border-zinc-800">
                    <h3 className="text-lg font-semibold text-gray-300">Subscribers</h3>
                    <p className="text-3xl font-bold text-green-500 mt-2">
                        {stats?.totalSubscribers ?? 0}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ChannelStats
