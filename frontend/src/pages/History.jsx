import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { setUserHistory } from '../store/channelSlice'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar'
import InfiniteScroll from 'react-infinite-scroll-component'
import VideoListCard from '../components/Video/VideoListCard'

function History() {
    const dispatch = useDispatch()
    const history = useSelector(state => state.channel.userHistory)
    const { isAuthenticated } = useSelector(state => state.auth)
    const [hasmore, setHasMore] = useState(true)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)

    useEffect(() => {
        const fetchHistory = async (page = 1, limit = 10) => {
            try {
                if (!isAuthenticated) {
                    return navigate("/login")
                }
                const response = await axios.get(`http://localhost:8000/users/watch-history?page=${page}&limit=${limit}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                    withCredentials: true,
                })

                if (response?.data?.data) {
                    dispatch(setUserHistory(response.data.data))
                }

                setLoading(false)
                if (response.data.data.length !== limit) {
                    setHasMore(false)
                }


            } catch (error) {
                console.error("Error fetching history:", error);
            }
        }
        fetchHistory(page);
    }, [isAuthenticated, navigate, dispatch, page])

    const fetchMoredata = () => {
        setPage((prevPage) => prevPage + 1)
    }

    return (
        <>
            <div className='bg-black min-h-screen text-gray-100'>
                <Navbar />
                {loading && (
                    <span>Loading...</span>
                )}
                {history.length > 0 && !loading && (
                    <InfiniteScroll
                        dataLength={history.length}
                        next={fetchMoredata}
                        hasMore={hasmore}
                    >
                        {history.map((video) => (
                            <div className='mb-4' key={video._id}>
                                <VideoListCard
                                    video={video}
                                    imgWidth="w-[20vw]"
                                    imgHeight="h-[11vw]"
                                />
                            </div>
                        ))}
                    </InfiniteScroll>
                )}
            </div>
        </>
    )
}

export default History
