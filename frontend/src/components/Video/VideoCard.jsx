import React, { useState, useEffect, useRef } from 'react';
import formatDuration from "../../utils/formatDuration.js";
import getTimeDistanceToNow from "../../utils/getTimeDistance.js";
import { useNavigate, Link } from 'react-router-dom';
import SaveVideoPopup from '../Playlist/SaveVideoPopup.jsx';
import { MoreVertical } from 'lucide-react';

function VideoCard({ video, name = true }) {
  const navigate = useNavigate();
  const formattedDuration = formatDuration(parseInt(video?.duration));
  const timeDistance = getTimeDistanceToNow(video?.createdAt);

  const [showMenu, setShowMenu] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const menuRef = useRef();

  const handleChannelClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/channel/${video?.owner?.username}`);
  };

  const toggleMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu((prev) => !prev);
  };

  const handleSaveClick = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    setShowPopup(true);
  };

  const handleReport = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    alert("Reported.");
  };

  const handleShare = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    navigator.clipboard.writeText(`${window.location.origin}/watchpage/${video?._id}`);
    alert("Video link copied to clipboard!");
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="group relative overflow-visible rounded-xl transition-all duration-300">
      {/* Thumbnail */}
      <Link to={`/watchpage/${video?._id}`}>
        <div className="relative aspect-video w-full overflow-hidden rounded-xl">
          <img
            className="w-full h-full object-cover transition-all group-hover:rounded-none"
            src={video?.thumbnail}
            alt={video?.title}
            loading="lazy"
          />
          <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 text-xs font-medium rounded text-white">
            {formattedDuration}
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="flex mt-3 px-1">
        {/* Avatar */}
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

        {/* Title + Dropdown */}
        <div className="ml-3 flex-1 overflow-visible relative">
          <div className="flex justify-between items-start">
            {/* Title */}
            <Link to={`/watchpage/${video?._id}`} className="flex-1 min-w-0">
              <h2
                className="text-white font-medium text-sm line-clamp-2 leading-tight pr-6"
                title={video?.title}
              >
                {video?.title}
              </h2>
            </Link>

            {/* Three Dots */}
            <div className="relative z-30 " ref={menuRef}>
              <button
                onClick={toggleMenu}
                className="text-gray-400 cursor-pointer hover:text-white p-1 rounded-full hover:bg-gray-800 transition"
              >
                <MoreVertical size={18} />
              </button>

              {showMenu && (
                <div className=" absolute right-0 mt-2 w-44 bg-zinc-800 border border-gray-700 rounded shadow z-50">
                  <button
                    className="w-full text-left px-4 py-2 text-sm cursor-pointer text-white hover:bg-gray-700"
                    onClick={handleSaveClick}
                  >
                    Save to playlist
                  </button>
                  <button
                    className="w-full cursor-pointer text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                    onClick={handleShare}
                  >
                    Share
                  </button>
                  <button
                    className="w-full cursor-pointer text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                    onClick={handleReport}
                  >
                    Report
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Channel + Meta */}
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

      {/* Save Popup */}
      {showPopup && (
        <SaveVideoPopup
          isOpen={showPopup}
          onClose={() => setShowPopup(false)}
          video={video}
        />
      )}
    </div>
  );
}

export default VideoCard;
