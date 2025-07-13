import React from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate , useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { setCurrentPlaylist , setPlaylists , addVideoToPlaylist ,removeVideoFromPlaylist , deletePlaylist, seterror, setloading} from '../../store/playlistsSlice'



function PlaylistVideo() {
    const { playlistId, videoId } = useParams();
    const { isAuthenticated } = useSelector((state) => state.auth);
    const { currentPlaylist } = useSelector((state) => state.playlists);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const getPlaylist = async () => {
        if (!isAuthenticated){
            return toast.error("You must be logged in to view playlists");

        }
        dispatch(setloading());
        try {
            const response  = await axios.get(`http://localhost:8000/playlist/${playlistId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                withCredentials: true,
            })
            if (response?.data?.data){
                dispatch(setCurrentPlaylist(response.data.data))
                dispatch(setPlaylists([response.data.data]))   
                toast.success("Playlist fetched successfully");    
            }
        } catch (error) {
            dispatch(seterror(error.response?.data?.message || "Unable to fetch playlist"));
            toast.error(error.response?.data?.message || "Unable to fetch playlist");
        } 
    }

    const handledeletePlaylist = async () => {
        if(!isAuthenticated){
            return toast.error("You must be logged in to delete a playlist");
        }
        if (!currentPlaylist || currentPlaylist._id !== playlistId) {
            return toast.error("Playlist not found");
        }
        dispatch(setloading());
        try {
            const response = await axios.delete(`http://localhost:8000/playlist/${playlistId}` ,  {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                withCredentials: true,
            })
            if (response.data.success){
                dispatch(deletePlaylist(playlistId));
                toast.success("Playlist deleted successfully");
                navigate("/playlists");

            }
        } catch (error) {
            dispatch(seterror(error.response?.data?.message || "Unable to delete playlist"));
            toast.error(error.response?.data?.message || "Unable to delete playlist");
        }
    }

  return (
    <div>
      
    </div>
  )
}

export default PlaylistVideo
