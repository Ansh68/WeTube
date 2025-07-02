import React, { useEffect, useState, } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { addvideoStats } from '../../store/dashboardSlice';
import { IoClose } from "react-icons/io5";
import { BsUpload } from "react-icons/bs";

// eorros uploading ke time kuch process nahi arha 
// refresh karne ke baad video dhikri frontpage pe
//  pubload ke baad automatic band nahi hora popup

const modalRoot = document.getElementById("popup-models") || document.body;


function VideoForm({ isOpen, onClose, video = null }) {

  const { isAuthenticated } = useSelector((state) => state.auth)
   const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: video?.title ?? "",
      description: video?.description ?? "",
    }
  });
  const dispatch = useDispatch();


  const publishVideo = async (data) => {
    if (!isAuthenticated) {
      return alert("You have to be Logged in to Publish a Video")
    }
    const formdata = new FormData();
    for (const key in data) {
      formdata.append(key, data[key])
    }
    formdata.append("videoFile", data.videoFile[0])
    if (data.thumbnail) formdata.append("thumbnail", data.thumbnail[0]);
    try {

      const response = await axios.post("http://localhost:8000/videos/publish", formdata, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        withCredentials: true,
      })
      if (response?.data?.data) {


        dispatch(addvideoStats(response?.data?.data))
        reset();
        alert("Video Published Successfully")
      }

    } catch (error) {
      console.error("Error publishing video:", error);
      alert("Failed to publish video. Please try again.");
    }
  }

  const updateVideo = async (data) => {
    if (!isAuthenticated) {
      return alert("You have to be Logged in to Update a Video")
    }
    const formdata = new FormData();
    for (const key in data) {
      formdata.append(key, data[key])
    }
    if (data.thumbnail) formdata.append("thumbnail", data.thumbnail[0]);
    try {

      const response = await axios.patch(`http://localhost:8000/videos/${video?._id}`, formdata, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        withCredentials: true,
      })

      if (response?.data?.data) {
        alert("Video Updated Successfully")
        reset();
      }

    } catch (error) {
      console.error("Error updating video:", error);
      alert("Failed to update video. Please try again.");
    }
  }


  const onSubmit = (data) => {
    if (video) {
      updateVideo(data);
    } else {
      publishVideo(data);
    }
  }

  if (!isOpen) return null;

  return createPortal(
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60'>
      <form onSubmit={handleSubmit(onSubmit)}
        className="w-[90%] max-w-xl rounded border border-gray-700 bg-zinc-950 p-4 text-gray-200"
      >
        <div className="mb-3 flex items-center justify-between border-b border-gray-700 pb-2">
          <h2 className="text-lg font-semibold">
            {video ? "Update " : "Publish"} Video
          </h2>
          <button type="button" onClick={onClose} title="Close">
            <IoClose className="h-6 w-6 hover:text-red-500" />
          </button>
        </div>

        {!video && (
          <>
            <label className="mb-1 block font-medium">Video File *</label>
            <div className="mb-2 flex items-center gap-3 rounded border-2 border-dotted border-gray-600 p-4">
              <BsUpload className="h-7 w-7 text-pink-500" />
              <input
                type="file"
                {...register("videoFile", {
                  required: "Required",
                  validate: (file) =>
                    file?.[0]?.type === "video/mp4" ||
                    "Only .mp4 files allowed",
                })}
              />
            </div>
            {errors.videoFile && (
              <p className="mb-2 text-sm text-red-500">
                {errors.videoFile.message}
              </p>
            )}
          </>
        )}

        <label className="mb-1 block font-medium">
          Thumbnail {video ? "(optional)" : "*"}
        </label>
        <input
          className="mb-2 w-full cursor-pointer border border-gray-700 p-1 file:mr-3 file:border-none file:bg-gray-800"
          type="file"
          {...register("thumbnail", {
            required: !video && "Required",
            validate: (file) => {
              if (video && !file?.length) return true;
              const ok = ["image/png", "image/jpeg", "image/jpg"].includes(
                file?.[0]?.type
              );
              return ok || "PNG/JPG only";
            },
          })}
        />
        {errors.thumbnail && (
          <p className="mb-2 text-sm text-red-500">
            {errors.thumbnail.message}
          </p>
        )}

        {/* title */}
        <label className="mb-1 block font-medium">Title *</label>
        <input
          className="mb-2 w-full border border-gray-700 bg-transparent px-2 py-1 outline-none focus:border-blue-500"
          {...register("title", { required: "Required" })}
        />
        {errors.title && (
          <p className="mb-2 text-sm text-red-500">{errors.title.message}</p>
        )}

        {/* description */}
        <label className="mb-1 block font-medium">Description</label>
        <textarea
          className="mb-4 h-24 w-full resize-none border border-gray-700 bg-transparent px-2 py-1 outline-none focus:border-blue-500"
          {...register("description")}
        />

        {/* buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => {
              reset();
              onClose();
            }}
            className="flex-1 border border-gray-600 px-4 py-2 hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={Object.keys(errors).length > 0}
            className="flex-1 border border-gray-600 bg-pink-600 px-4 py-2 font-semibold hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {video ? "Update" : "Publish"}
          </button>
        </div>
      </form>
    </div>,
    modalRoot
  )
}

export default VideoForm
