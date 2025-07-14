import React, { useState } from 'react';
import { Music, Plus } from "lucide-react";
import axios from 'axios';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addPlaylist, seterror, setloading, updatePlaylist } from '../../store/playlistsSlice';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const modalRoot = document.getElementById("popup-models") || document.body;

const PlaylistForm = ({ isOpen, onClose, playlist }) => {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const { isAuthenticated } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const { register, handleSubmit, reset, watch } = useForm({
        defaultValues: {
            title: playlist?.title || '',
            description: playlist?.description || ''
        }
    })

    const title = watch("title")
    const description = watch("description")

    const createPlaylist = async () => {
        if (!isAuthenticated) {
            return toast.error("You must be logged in to create a playlist");
        }
        setIsSubmitting(true);
        dispatch(setloading());
        try {
            const response = await axios.post("http://localhost:8000/playlist", {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                },
                withCredentials: true
            })
            if (response?.data?.data) {
                dispatch(addPlaylist(response.data.data))
                toast.success("Playlist created successfully");
            }
        } catch (error) {
            setIsSubmitting(false);
            dispatch(seterror(error.response?.data?.message || "Unable to create playlist"));
            toast.error(error.response?.data?.message || "Unable to create playlist");
        } finally {
            setIsSubmitting(false);
            reset();
        }
    }

    const handleUpdate = async (data) => {
        if (!isAuthenticated) {
            return toast.error("You must be logged in to update a playlist");
        }
        setIsSubmitting(true);
        dispatch(setloading());
        try {
            const response = await axios.patch(`http://localhost:8000/playlist/${playlist._id}`, data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                },
                withCredentials: true
            })
            if (response?.data?.data) {
                dispatch(updatePlaylist(response.data.data))
                toast.success("Playlist updated successfully");
                onClose();
            }
        } catch (error) {
            dispatch(seterror(error.response?.data?.message || "Unable to update playlist"));
            toast.error(error.response?.data?.message || "Unable to update playlist");
        } finally {
            setIsSubmitting(false);
            reset();
        }
    }

    const onSubmit = (data) => {
        if (playlist) {
            handleUpdate(data);
        }
        else {
            createPlaylist(data);
        }
    }

    useEffect(() => {
        console.log("PlaylistForm opened");
        if (playlist) {
            reset({
                title: playlist.title || '',
                description: playlist.description || ''
            });
        } else {
            reset({
                title: '',
                description: ''
            });
        }
    }, [playlist, reset]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">


            <div className="bg-[#212121] border border-[#3f3f3f] z-[60] shadow-2xl rounded-lg max-w-lg w-full mx-4">
                <div className="space-y-1 pb-6 p-6">
                    <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                        <div className="p-2 bg-[#ff0000] rounded-lg">
                            <Music className="h-6 w-6 text-white" />
                        </div>
                        Create Playlist
                    </h2>
                    <p className="text-[#aaaaaa] text-sm">
                        Create a new playlist to organize your favorite videos
                    </p>
                </div>

                <div className="p-6 pt-0">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="title" className="text-white font-medium text-sm">
                                Title *
                            </label>
                            <input
                                id='title'
                                {...register("title", {
                                    required: "Title is required",
                                })}
                                className="flex h-12 w-full rounded-md bg-[#121212] border border-[#3f3f3f] text-white placeholder:text-[#717171] 
                         focus:border-[#065fd4] focus:ring-1 focus:ring-[#065fd4] focus:outline-none
                         transition-all duration-200 px-3 py-2"
                                type="text"
                            />
                            <div className="text-right">
                                <span className="text-xs text-[#aaaaaa]">
                                    {title.length}/100
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="description" className="text-white font-medium text-sm">
                                Description
                            </label>
                            <textarea
                                id='description'
                                {...register("description")}
                                className="flex min-h-[100px] w-full rounded-md bg-[#121212] border border-[#3f3f3f] text-white placeholder:text-[#717171] 
                         focus:border-[#065fd4] focus:ring-1 focus:ring-[#065fd4] focus:outline-none
                         transition-all duration-200 px-3 py-2 resize-none"
                                maxLength={5000}
                            />
                            <div className="text-right">
                                <span className="text-xs text-[#aaaaaa]">
                                    {description.length}/5000
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                className="flex-1 h-10 rounded-md border border-[#3f3f3f] bg-transparent text-[#aaaaaa] 
                         hover:bg-[#3f3f3f] hover:text-white transition-all duration-200 px-4 py-2 text-sm font-medium"
                                onClick={() => {
                                    setIsSubmitting(false);
                                    reset();
                                    onClose();
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={isSubmitting || !title.trim()}
                                className="flex-1 h-10 rounded-md bg-[#065fd4] hover:bg-[#0956c7] text-white 
                         disabled:bg-[#3f3f3f] disabled:text-[#717171] 
                         transition-all duration-200 font-medium px-4 py-2 text-sm flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="h-4 w-4" />
                                        {playlist ? "Update Playlist" : "Create Playlist"}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>,
        modalRoot
    );
}

export default PlaylistForm;