import React, {useState} from 'react'
import VideoForm from './VideoForm';

function PopUp() {
    const [showUploader, setShowUploader] = useState(false);

    return (
        <>
            <button
                onClick={() => setShowUploader(true)}
                className="px-4 py-2 bg-pink-600 text-white rounded"
            >
                Upload Video
            </button>

            {/* Render the modal only when needed */}
            <VideoForm
                isOpen={showUploader}
                onClose={() => setShowUploader(false)}
            />
        </>
    )
}

export default PopUp
