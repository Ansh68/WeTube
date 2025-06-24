import React from 'react';

const VideoPlayer = ({ videoFile }) => {
  if (!videoFile) {
    return <div className="text-red-500">Video file not available.</div>;
  }

   return (
        <video controls autoPlay className='rounded-xl w-full max-h-[70vh]'>
            <source src ={videoFile} type="video/mp4"/>
            Your browser does not support the video tag.
        </video>
    )
};

export default VideoPlayer;
