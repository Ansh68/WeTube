import React from 'react';
import formatDuration from "../../utils/formatDuration.js";
import getTimeDistanceToNow from "../../utils/getTimeDistance.js";
import { useNavigate, Link } from 'react-router-dom';

function VideoCard({ video, name = true }) {
  const navigate = useNavigate();
  const formattedDuration = formatDuration(parseInt(video?.duration));
  const timeDistance = getTimeDistanceToNow(video?.createdAt);

  const handleChannelClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/channel/${video?.owner?.username}`);
  };

  return (
    <div className="group">
      <Link to={`/watchpage/${video?._id}`} className="block">
        <div className="rounded-xl overflow-hidden transition-all duration-300">
          {/* Thumbnail container */}
          <div className="relative aspect-video w-full">
            <img 
              className="w-full h-full object-cover rounded-xl transition-all group-hover:rounded-none"
              src={video?.thumbnail}
              alt={video?.title}
              loading="lazy"
            />
            {/* Duration badge */}
            <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 text-xs font-medium rounded text-white">
              {formattedDuration}
            </div>
          </div>

          {/* Video info */}
          <div className="flex mt-3 px-1">
            {/* Channel avatar */}
            <div 
              onClick={handleChannelClick}
              className="mt-0.5 flex-shrink-0 cursor-pointer"
            >
              <img
                className="w-9 h-9 rounded-full object-cover"
                src={video?.owner?.avatar}
                alt={video?.owner?.fullName}
                loading="lazy"
              />
            </div>

            {/* Title and metadata */}
            <div className="ml-3 flex-1 overflow-hidden">
              <h2 
                className="text-white font-medium text-sm line-clamp-2 leading-tight mb-1"
                title={video?.title}
              >
                {video?.title}
              </h2>
              
              {name && (
                <h3 
                  className="text-gray-400 text-xs hover:text-white cursor-pointer"
                  onClick={handleChannelClick}
                >
                  {video?.owner?.fullName}
                </h3>
              )}
              
              <p className="text-gray-400 text-xs mt-0.5">
                {`${video?.views} views • ${timeDistance}`}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default VideoCard;