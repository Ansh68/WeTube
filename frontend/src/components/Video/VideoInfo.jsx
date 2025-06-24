import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import axios from 'axios';
import { fetchSuccess } from '../../store/videoSlice';
import { toast } from 'react-toastify';
import getTimeDistanceToNow from "../../utils/getTimeDistance.js";
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';

function VideoInfo() {
  const { video } = useSelector((state) => state.video);
  const dispatch = useDispatch();
  const { isAuthenticated, data: { user } = {} } = useSelector((state) => state.auth);
  const [showDescription, setShowDescription] = useState(false);
  const timeDistance = getTimeDistanceToNow(video?.createdAt);

  const handleDescription = () => {
    setShowDescription(!showDescription);
  };

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      toast.error("Please Login to Subscribe");
    } else {
      try {
        const response = await axios.post(
          `http://localhost:8000/subscription/c/${video.owner._id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            withCredentials: true,
          }
        );
        if (response.data.success) {

          dispatch(fetchSuccess({
            ...video,
            owner: {
              ...video.owner,
              isSubscribed: !video.owner.isSubscribed,
              subscribersCount: video.owner.isSubscribed ? video.owner.subscribersCount + 1 : video.owner.subscribersCount - 1,
            }
          }))

        }


      } catch (error) {
        if (error.response?.status === 403) {
          toast.error("Can't Subscribe to your own channel");
        } else {
          toast.error(error.response?.data?.message || "Something went wrong");
        }
      }
    }
  };

  return (
    <div className="bg-black text-white">
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-bold mb-2">{video?.title}</h1>
          <p className="text-gray-400">{`${video.views} views • ${timeDistance}`}</p>
        </div>

        <div className="flex items-center justify-between py-4 border-t border-b border-gray-800">
          <div className="flex items-center space-x-4">
            <Link to={`/channel/${video?.owner?.username}`} className="flex items-center space-x-3">
              <img
                src={video?.owner?.avatar}
                alt={video?.owner?.fullname}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{video?.owner?.fullname}</p>
                <p className="text-sm text-gray-400">{video?.owner?.subscribersCount} subscribers</p>
              </div>
            </Link>
          </div>

          <button
            onClick={handleSubscribe}
            className={`px-4 py-2 rounded-full font-medium ${video?.owner?.isSubscribed
              ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
              : "bg-red-600 hover:bg-red-700"
              }`}
          >
            {video?.owner?.isSubscribed ? "Subscribed" : "Subscribe"}
          </button>
        </div>

        <div className="bg-gray-900 rounded-xl p-4">
          <p className="text-sm text-gray-300">
            {showDescription ? video?.description : `${video?.description?.slice(0, 100)}...`}
            <button
              onClick={handleDescription}
              className="ml-2 text-blue-500 hover:text-blue-400 flex items-center"
            >
              {showDescription ? (
                <>Show Less <ChevronUp className="w-4 h-4 ml-1" /></>
              ) : (
                <>Show More <ChevronDown className="w-4 h-4 ml-1" /></>
              )}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default VideoInfo;