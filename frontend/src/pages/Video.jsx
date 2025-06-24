import React, { useState, useEffect } from 'react';
import VideoInfo from "../components/Video/VideoInfo";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSuccess } from '../store/videoSlice';
import VideoPlayer from '../components/Video/VideoPlayer';
import Comments from '../components/Comment/Comments';
import { Loader2 } from 'lucide-react';

function Video() {
  const [loading, setloading] = useState(true);
  const [Videos, setVideos] = useState([]);
  const [error, setError] = useState(false);
  const { videoId } = useParams();
  const dispatch = useDispatch();
  const { video } = useSelector((state) => state.video);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/videos/${videoId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            withCredentials: true,
          }
        );
        if (response.data.data) {
          dispatch(fetchSuccess(response.data.data));
        }
      } catch (error) {
        setError(true);
        console.log(error);
      } finally {
        setloading(false);
      }
    };
    fetchVideo();
  }, [videoId, dispatch]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/videos/getAllVideos?sortBy=views&limit=8`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
            withCredentials: true,
          }
        );
        setVideos(response.data.data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setloading(false);
      }
    };
    fetchVideos();
  }, [videoId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white">
        <p className="text-xl">Error loading video.</p>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white">
        <p className="text-xl">Video not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <VideoPlayer key={video._id} videoFile={video.videoFile} />
        </div>
        <div className="mb-6">
          <VideoInfo video={video} />
        </div>
        <div>
          <Comments video={video} />
        </div>
      </div>
    </div>
  );
}

export default Video;