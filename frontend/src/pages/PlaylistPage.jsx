import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPlaylists, seterror, setloading } from '../store/playlistsSlice'
import { toast } from 'react-toastify'
import axios from 'axios'
import PlaylistCard from '../components/Playlist/PlaylistCard'


function PlaylistPage() {
    const dispatch = useDispatch();
    const { isAuthenticated, data } = useSelector((state) => state.auth);
    const user = data?.user
    const { playlists } = useSelector((state) => state.playlists);

    const fetchPlaylists = async () => {
        if (!isAuthenticated) {
            return toast.error("You must be logged in to view playlists");
        }
        setloading(true);
        try {
            const response = await axios.get(`http://localhost:8000/playlist/user/${user._id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                withCredentials: true,
            })
            if (response?.data?.data) {
                dispatch(setPlaylists(response.data.data));

            }
        } catch (error) {
            dispatch(seterror(error.response?.data?.message || "Unable to fetch playlists"));
            toast.error(error.response?.data?.message || "Unable to fetch playlists");
        } finally {
            setloading(false);
        }
    }

    useEffect(() => {
        fetchPlaylists();
    }, [isAuthenticated, user]);


    return (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
           <h1> YOUR PLAYLISTS </h1>
           {
                playlists.length > 0 ? (
                    playlists.map((playlist) => (
                        <PlaylistCard key={playlist._id} playlist={playlist} />
                    ))
                ) : (
                    <p>No playlists found</p>
                )
           }
        </div>
    )
}

export default PlaylistPage
