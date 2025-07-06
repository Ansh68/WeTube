import AsyncHandler from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { user } from "../models/usermodel.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { video } from "../models/videomodel.js";
import mongoose, { set, isValidObjectId } from "mongoose";

// Include is valid object id for video controller

const getAllVideos = AsyncHandler(async (req, res) => {

    const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query


    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;

    const matchQuery = {
        ispublished: true
    };

    if (query) {
        matchQuery.$or = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } }
        ];
    }

    if (typeof userId === "string" && userId.trim() && mongoose.Types.ObjectId.isValid(userId)) {
        matchQuery.owner = new mongoose.Types.ObjectId(userId);
    } else if (userId !== undefined && userId !== null && userId !== "" && userId !== "undefined") {
        throw new ApiError(400, "Invalid userId");
    }


    const Videos = await video.aggregate([
        {
            $match: matchQuery

        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            fullname: 1,
                            avatar: 1,
                            username: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: {
                    $arrayElemAt: ["$owner", 0]
                }
            }
        },
        {
            $sort: {
                [sortBy]: sortType === "asc" ? 1 : -1
            }
        },
        {
            $skip: (pageNumber - 1) * limitNumber

        },
        {
            $limit: (limitNumber)
        },

        {
            $project: {
                title: 1,
                description: 1,
                videoFile: 1,
                thumbnail: 1,
                duration: 1,
                views: 1,
                createdAt: 1,
                owner: 1,
                ispublished: 1
            }
        }
    ])
    if (!Videos?.length) {
        throw new ApiError(404, "No videos found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, Videos, "Videos fetched successfully"
            ))

})

const publishVideo = AsyncHandler(async (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        throw new ApiError(400, "Please provide all the fields");
    }

    const User = await user.findById(req.user?._id).select("-password -refreshToken -watchhistory")

    if (!User) {
        throw new ApiError(400, "User not found");

    }

    const videoLocalPath = req.files?.videoFile[0]?.path

    if (!videoLocalPath) {
        throw new ApiError(400, "Please provide video file");
    }

    const videofile = await uploadOnCloudinary(videoLocalPath)

    const thumbnailLocalPath = req.files?.thumbnail[0]?.path

    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Please provide thumbnail file");
    }
    const thumbnailfile = await uploadOnCloudinary(thumbnailLocalPath)

    if (!videofile || !thumbnailfile) {
        throw new ApiError(400, "Please provide video and thumbnail file");
    }

    const Video = await video.create({
        videoFile: videofile?.secure_url,
        thumbnail: thumbnailfile?.secure_url,
        title: title,
        description: description,
        duration: videofile?.duration,
        owner: req.user?._id,
        ispublished: true
    })

    if (!Video) {
        throw new ApiError(400, "Unable to publish video");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, Video, "Video published successfully"))

})

const getVideobyId = AsyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!videoId) {
        throw new ApiError(400, "Invalid video id");
    }

    const Video = await video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId),
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $lookup: {
                            from: "subscriptions",
                            localField: "_id",
                            foreignField: "channel",
                            as: "subscribers"
                        }
                    },
                    {
                        $addFields: {
                            subscribersCount: {
                                $size: "$subscribers"
                            },
                            isSubscribed: {
                                $cond: {
                                    if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                                    then: true,
                                    else: false
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            fullname: 1,
                            avatar: 1,
                            subscribersCount: 1,
                            isSubscribed: 1,
                            username: 1,
                        }
                    }
                ]
            }
        },
        {
            $project: {
                title: 1,
                description: 1,
                videoFile: 1,
                thumbnail: 1,
                duration: 1,
                views: 1,
                createdAt: 1,
                owner: {
                    $arrayElemAt: ["$owner", 0]
                }
            }
        }
    ])

    if (!Video?.length) {
        throw new ApiError(404, "Video not found");
    }

    await video.updateOne(
        { _id: videoId },
        { $inc: { views: 1 } }
    )

    await user.updateOne(
        { _id: req.user?._id },
        { $addToSet: { watchhistory: Video[0]._id } }
    )

    return res
        .status(200)
        .json(new ApiResponse(200, Video[0], "Video fetched successfully"))
})

const updateVideo = AsyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id");
    }

    const { title, description } = req.body

    if (!title || !description) {
        throw new ApiError(400, "Please provide all the fields");
    }

    const Video = await video.findById(videoId)

    if (!Video) {
        throw new ApiError(400, "Video not found");
    }

    if (req.user?._id.toString() !== Video.owner.toString()) {
        throw new ApiError(403, "You are not authorized to update this video");
    }

    let thumbnailfile = null
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path
    if (thumbnailLocalPath) {
        thumbnailfile = await uploadOnCloudinary(thumbnailLocalPath)

        if (!thumbnailfile) {
            throw new ApiError(400, "Unable to upload thumbnail file");

        }

        Video.thumbnail = thumbnailfile?.secure_url
        
    }

    const updated = await video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                title: title,
                description: description,
                thumbnail: thumbnailfile?.secure_url || Video.thumbnail
            }
        },
        {
            new: true
        }
    )

    if (!updated) {
        throw new ApiError(400, "Unable to update video");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, updated, "Video updated successfully")

        )

})

const deleteVideo = AsyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!videoId) {
        throw new ApiError(400, "Invalid video id");
    }

    const Video = await video.findById(videoId)

    if (!Video) {
        throw new ApiError(400, "Video not found");
    }

    if (req.user?._id.toString() !== Video.owner.toString()) {
        throw new ApiError(403, "You are not authorized to update this video");
    }

    const deleted = await video.findByIdAndDelete(videoId)

    if (!deleted) {
        throw new ApiError(400, "Unable to delete video");
    }

    await user.updateOne(
        { _id: req.user?._id },
        { $pull: { watchhistory: videoId } }
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Video deleted successfully")
        )
})


export { publishVideo, getVideobyId, updateVideo, deleteVideo, getAllVideos }