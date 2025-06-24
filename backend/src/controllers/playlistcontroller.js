import mongoose, { isValidObjectId } from "mongoose";
import AsyncHandler from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { playlist } from "../models/playlistmodel.js";
import { video } from "../models/videomodel.js";


const createPlaylist = AsyncHandler(async (req, res) => {
    const { name, description } = req.body

    if (!name?.trim()) {
        throw new ApiError(400, "Please provide a name for the playlist.")
    }


    if (!req.user?._id) {
        throw new ApiError(401, "Unauthorized request")
    }

    const Playlist = await playlist.create({
        name: name,
        description: description,
        owner: req.user._id,
        videos: []
    })

    if (!Playlist) {
        throw new ApiError(500, "Unable to Create Playlist")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, Playlist, "Playlist Created Successfully")
        )
})

const UserPlaylists = AsyncHandler(async (req, res) => {
    const { userId } = req.params

    if (!userId?.trim() || !isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid User Id")
    }

    const getPlaylist = await playlist.find({
        owner: userId
    }).populate("videos")

    if (!getPlaylist) {
        throw new ApiError(500, "Unable to fetch playlists");
    }

    if (getPlaylist.length === 0) {
        return res.status(404).json(new ApiResponse(404, [], "No playlists found for this user"))
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                getPlaylist,
                "Playlist Fetched Successfully"
            )
        )
})

const getPlaylistById = AsyncHandler(async (req, res) => {
    const { playlistId } = req.params

    if (!playlistId?.trim() || !isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid Id")
    }

    const Playlist = await playlist.findById(playlistId).populate("videos")

    if (!Playlist) {
        throw new ApiError(404, "Playlist Not Found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                Playlist,
                "Playlist Fetched Successfully"
            )
        )
})

const addVideotoPlaylist = AsyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    if (!playlistId?.trim() || !isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid Playlist Id")
    }
    if (!videoId?.trim() || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video Id")
    }

    const Playlist = await playlist.findById(playlistId)

    if (!Playlist) {
        throw new ApiError(404, "Playlist not Found")
    }

    if (Playlist.owner.toString() !== req.user?._id?.toString()) {
        throw new ApiError(403, "Unauthorized - You don't own this playlist")
    }


    const Video = await video.findById(videoId)

    if (!Video) {
        throw new ApiError(400, "Video Not Found")
    }



    const addtoPlaylist = await playlist.findByIdAndUpdate(
        playlistId,
        {
            $addToSet: {
                videos: videoId
            }
        },
        { new: true }
    )

    if (!addtoPlaylist) {
        throw new ApiError(400, "Unable to add Video")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                addtoPlaylist,
                "Video Added to Playlist Successfully"
            )
        )
})

const removeVideofromPlaylist = AsyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    if (!playlistId?.trim() || !isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid Playlist Id")
    }

    if (!videoId?.trim() || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video Id")
    }

    const Playlist = await playlist.findById(playlistId)

    if (!Playlist) {
        throw new ApiError(404, "Playlist not Found")
    }

    if (Playlist.owner.toString() !== req.user?._id?.toString()) {
        throw new ApiError(403, "Unauthorized - You don't own this playlist")
    }

    const Video = await video.findById(videoId)

    if (!Video) {
        throw new ApiError(400, "Video Not Found")
    }

    if (!Playlist.videos.includes(videoId)) {
        throw new ApiError(404, "Video not found in playlist")
    }

    // REMOVED METHOD USING FILTER
    // Playlist.videos = Playlist.videos.filter(
    //     (vid) => vid.toString() !== videoId 
    // );
    // await Playlist.save();
    

    // REMOVED METHOD USING PULL METHOD
    const Removed = await playlist.updateOne(
        {
            _id: playlistId,
            owner: req.user?._id
        },
        {
            $pull: {
                videos: videoId 
            }
        }
    )

    if (!Removed.modifiedCount === 0) {
        throw new ApiError(500, "Unable to Remove Video")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                Removed,
                "Video Removed Successfully"
            )
        )

})

const deletePlaylist = AsyncHandler(async(req,res)=>{
    const {playlistId} = req.params

    if (!playlistId?.trim() || !isValidObjectId(playlistId) ) {
        throw new ApiError(400, "Invalid Playlist Id")
    }
    
    const Playlist = await playlist.findById(playlistId)

    if (!Playlist) {
        throw new ApiError(404, "Playlist not Found")
    }

    if (Playlist.owner.toString() !== req.user?._id?.toString()) {
        throw new ApiError(403, "Unauthorized - You don't own this playlist")
    }

    const deleted = await playlist.findByIdAndDelete(playlistId)

    if (!deleted) {
        throw new ApiError(500, "Unable to Delete Playlist ")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Playlist Deleted Successfully"
        )
    )
})

const updatePlaylist = AsyncHandler(async(req,res)=>{
    const {playlistId} = req.params
    const {name , description} = req.body

    if (!playlistId?.trim() || !isValidObjectId(playlistId) ) {
        throw new ApiError(400, "Invalid Playlist Id")
    }

    if (!name?.trim()) {
        throw new ApiError(400, "Please provide a name for the playlist.")
    }


    const updated = await playlist.findOneAndUpdate(
        {
            _id: playlistId,
            owner: req.user._id
        },
        {
            $set:{
                name: name.trim(),
                description: description.trim() || ""
            }
        },
        {new: true}
    )

    if (!updated) {
        throw new ApiError(500, "Unable to Update Playlist")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            updated,
            "Playlist Updated Successfully"
        )
    )


})


export { createPlaylist, UserPlaylists, addVideotoPlaylist, getPlaylistById, removeVideofromPlaylist ,deletePlaylist, updatePlaylist}