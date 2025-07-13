import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { setStats } from '../../store/dashboardSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Play, Eye, Users, TrendingUp, BarChart3, Star } from 'lucide-react'

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

    const formatNumber = (num) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M'
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K'
        }
        return num?.toString() || '0'
    }

    const statsData = [
        {
            title: "Total Videos",
            value: stats?.totalVideos ?? 0,
            icon: Play,
            color: "from-slate-600 to-slate-700",
            bgColor: "bg-slate-800/20",
            borderColor: "border-slate-700/30",
            textColor: "text-slate-300"
        },
        {
            title: "Total Views",
            value: stats?.totalViews ?? 0,
            icon: Eye,
            color: "from-zinc-600 to-zinc-700",
            bgColor: "bg-zinc-800/20",
            borderColor: "border-zinc-700/30",
            textColor: "text-zinc-300"
        },
        {
            title: "Subscribers",
            value: stats?.totalSubscribers ?? 0,
            icon: Users,
            color: "from-gray-600 to-gray-700",
            bgColor: "bg-gray-800/20",
            borderColor: "border-gray-700/30",
            textColor: "text-gray-300"
        }
    ]

    return (
        <div className="p-8 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 min-h-[60vh] text-white relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/10 via-zinc-900/0 to-zinc-900/0"></div>
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-10 left-10 w-2 h-2 bg-white/3 rounded-full"></div>
                <div className="absolute top-20 right-20 w-1 h-1 bg-white/5 rounded-full"></div>
                <div className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-white/3 rounded-full"></div>
                <div className="absolute bottom-10 right-10 w-1 h-1 bg-white/5 rounded-full"></div>
            </div>
            
            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r text-white bg-clip-text  mb-2">
                            Channel Analytics
                        </h2>
                        <p className="text-gray-500 text-sm flex items-center gap-2">
                            <BarChart3 size={16} />
                            Real-time performance metrics
                        </p>
                    </div>
                    
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {statsData.map((stat, index) => (
                        <div 
                            key={index}
                            className={`group relative ${stat.bgColor} ${stat.borderColor} border backdrop-blur-sm rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-black/20`}
                        >
                            {/* Background gradient on hover */}
                            <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}></div>
                            
                            {/* Content */}
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 rounded-xl ${stat.bgColor} ${stat.borderColor} border`}>
                                        <stat.icon size={24} className={stat.textColor} />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Star size={12} className="text-gray-500 fill-gray-600" />
                                        <span className="text-xs text-gray-600">Featured</span>
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium text-white uppercase tracking-wide">
                                        {stat.title}
                                    </h3>
                                    <div className="flex items-baseline gap-2">
                                        <p className={`text-4xl font-bold ${stat.textColor} transition-all duration-300 group-hover:scale-110`}>
                                            {formatNumber(stat.value)}
                                        </p>
                                        {stat.value > 0 && (
                                            <span className="text-xs text-gray-500 bg-gray-700/20 px-2 py-1 rounded-full border border-gray-700/30">
                                                +12.5%
                                            </span>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Progress bar */}
                                
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary Card */}
                <div className="mt-8 bg-zinc-800/30 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-200 mb-1">Channel Performance</h3>
                            <p className="text-sm text-gray-500">Your content is performing well across all metrics</p>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
                                <TrendingUp size={16} />
                                <span>Growing</span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">Updated 2 minutes ago</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChannelStats