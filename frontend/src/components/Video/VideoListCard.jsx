import React from 'react'
import getTimeDistanceToNow from "../../utils/getTimeDistance"
import formatDuration from "../../utils/formatDuration"
import { Link, useNavigate } from 'react-router-dom'

function VideoListCard({
    imgWidth = "w-[25vw]",
    imgHeight = "h-[14vw]",
    mainDivWidth = "w-full",
    titleWidth = "w-[65%]",
    titleFont = "font-semibold",
    titleSize = "text-[1.2rem]",
    showVideoDescription = true,
    descriptionWidth = "w-[40vw]",
    paddingY = "py-2",
    marginLeft = "ml-10",
    marginLeft2 = "ml-4",
    avatarWidth = "w-9",
    avatarHeight = "h-9",
    textFont = "",
    video,
}) {
    const formattedDuration = formatDuration ? formatDuration(parseInt(video?.duration)) : '0:00';
    const timeDistance = getTimeDistanceToNow ? getTimeDistanceToNow(video?.createdAt) : '1 day ago';
    const navigate = useNavigate();

    const handleChannelClick = (e) => {
        e.preventDefault();
        navigate(`/channel/${video?.owner?.username}`);
    };

    return (
        <div className={`${mainDivWidth} group cursor-pointer`}>
            <Link to={`/watchpage/${video?._id}`}>
                <div className={`${paddingY} relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/30 via-black/50 to-gray-900/30 backdrop-blur-sm border border-gray-800/40 hover:border-gray-700/60 transition-all duration-300 ease-out hover:bg-gradient-to-br hover:from-gray-800/40 hover:via-black/60 hover:to-gray-800/40`}>
                    
                    <div className={`text-white ${marginLeft} flex gap-5 relative z-10`}>
                        <div className="relative flex-shrink-0 group/thumbnail">
                            {/* Thumbnail container */}
                            <div className="relative overflow-hidden rounded-xl">
                                <img
                                    className={`${imgWidth} ${imgHeight} object-cover transition-all duration-300 group-hover/thumbnail:scale-105 group-hover/thumbnail:brightness-110`}
                                    src={video?.thumbnail}
                                    alt={video?.title}
                                />
                                
                                {/* Duration badge */}
                                <div className="absolute bottom-2 right-2 z-20">
                                    <span className={`${textFont} bg-black/85 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-xs font-semibold border border-gray-700/50 shadow-lg`}>
                                        {formattedDuration}
                                    </span>
                                </div>
                                
                                {/* Subtle overlay on hover */}
                                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover/thumbnail:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                            </div>
                        </div>
                        
                        <div className={`${marginLeft2} flex-1 space-y-3`}>
                            {/* Title */}
                            <h1
                                title={video?.title}
                                className={`${titleFont} ${titleWidth} ${titleSize} line-clamp-2 group-hover:text-gray-100 transition-colors duration-200 text-gray-200 leading-snug`}
                            >
                                {video?.title}
                            </h1>
                            
                            {/* Channel info with avatar BEFORE views */}
                            <div className="flex items-center gap-3">
                                <div onClick={handleChannelClick} className="cursor-pointer flex items-center gap-2.5 group/channel hover:bg-gray-800/30 rounded-lg px-2 py-1.5 -ml-2 transition-all duration-200">
                                    <img
                                        className={`${avatarWidth} ${avatarHeight} rounded-full object-cover ring-1 ring-gray-600/40 group-hover/channel:ring-gray-500/60 transition-all duration-200`}
                                        src={`${video?.owner?.avatar}`}
                                        alt={video?.owner?.fullName}
                                    />
                                    <p className="text-gray-300 group-hover/channel:text-gray-200 transition-colors duration-200 text-sm font-medium">
                                        {video?.owner?.fullName}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Views and time */}
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-gray-400 font-medium">{video?.views} views</span>
                                <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                                <span className="text-gray-400">{timeDistance}</span>
                            </div>
                            
                            {/* Description */}
                            {showVideoDescription && (
                                <div className="pt-1">
                                    <p
                                        className={`${descriptionWidth} text-gray-400 text-sm leading-relaxed line-clamp-2 group-hover:text-gray-300 transition-colors duration-200`}
                                    >
                                        {video?.description}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default VideoListCard;