import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { setVideos } from '../../store/dashboardSlice'
import { useDispatch, useSelector } from 'react-redux'



function ChannelContents() {
    const dispatch = useDispatch()
    const { isAuthenticated } = useSelector((state) => state.auth)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!isAuthenticated) {
            console.log("Login to See Videos")
        }
        const channelVideos = async () => {
            try {
                const response = await axios.get("http://localhost:8000/dashboard/channelvideos", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                    withCredentials: true,
                })
                if (response?.data?.data) {
                    dispatch(setVideos(response.data.data))
                    setLoading(false)
                }
            } catch (error) {
                console.error("Error getting videos" , error)
            }  
        }
        channelVideos();
    },[dispatch , isAuthenticated])



    return (
        <div>
            
        </div>
    )
}

export default ChannelContents
