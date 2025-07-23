import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { setUserVideos } from '../../store/channelSlice'
import { useSelector } from 'react-redux'
import InfiniteScroll from 'react-infinite-scroll-component'
import VideoCard from '../Video/VideoCard'



function ChannelVideos() {
  const dispatch = useDispatch()
  const { userchannel } = useSelector((state) => state.channel)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const { userVideos } = useSelector((state) => state.channel)
  const [loading, setLoading] = useState(false)

  const limit = 10;

  const fetchVideos = async (pageNumber = 1) => {
    setLoading(true)
    try {
      const response = await axios.get(`http://localhost:8000/videos/c/${userchannel._id}?page=${pageNumber}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        withCredentials: true,
      })


      const newVideos = response.data.data
      if (newVideos.length < limit) {
        setHasMore(false)
      }

      if (pageNumber === 1) {
        dispatch(setUserVideos(newVideos))
      } else {
        const updated = [...userVideos, ...newVideos].filter(
          (video, index, self) =>
            index === self.findIndex(v => v._id === video._id)
        )
        dispatch(setUserVideos(updated))
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {

    if (userchannel?._id) {
      dispatch(setUserVideos([]));
      setPage(1);
      setHasMore(true);
      fetchVideos(1);
    }
  }, [userchannel?._id]);

  useEffect(() => {
    if (userchannel?._id && page !== 1) {
      fetchVideos(page);
    }
  }, [page]);

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  }

  return (
    <div className="p-4">
      {userVideos.length === 0 && !loading ? (
        <div className="text-center text-muted-foreground mt-10">
          No videos found for this channel.
        </div>
      ) : (
        <InfiniteScroll
          dataLength={userVideos.length}
          next={handleLoadMore}
          hasMore={hasMore}
          loader={<div className="text-center py-4">Loading...</div>}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {userVideos.map(video => (
              <VideoCard key={video._id} video={video} name={false} />
            ))}
          </div>
        </InfiniteScroll>
      )}
    </div>
  )
}

export default ChannelVideos