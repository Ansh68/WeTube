import React, { useEffect, useState } from 'react';
import axios from 'axios';
import VideoCard from "../components/Video/VideoCard";
import { Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar/Navbar';
import { useSelector, useDispatch } from 'react-redux';
import { setVideos } from '../store/dashboardSlice';


function Home() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const videos = useSelector((state) => state.dashboard.videos);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        console.log("Sending token:", localStorage.getItem('accessToken'));

        const response = await axios.get(
          `http://localhost:8000/videos/getAllVideos?page=${page}&limit=10`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
            withCredentials: true,
          }
        );
        dispatch(setVideos(response.data.data));
        console.log("Full video fetch response:", response);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [page, dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bg-black min-h-screen pb-10">
        <div className="container mx-auto px-4 pt-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;