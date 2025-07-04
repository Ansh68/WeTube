import AsyncHandler from "../utils/AsyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import mongoose, { isValidObjectId } from "mongoose";
import { video } from "../models/videomodel.js";
import { subscription } from "../models/subscriptionmodel.js";


const getChannelStats = AsyncHandler(async (req, res) => {
    const { userId } = req.params

    if (!userId || !isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid User ID")

    }

    const videoStats = await video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
       
        {
            $group: {
                _id: null,
                totalVideos: { $sum: 1 },
                totalViews: { $sum: "$views" }
            }
        }
    ])

    const subscribersStats = await subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $group: {
                _id: null,
                totalSubscribers: { $sum: 1 }
            }
        }
    ])

    if (!videoStats && !subscribersStats) {
        throw new ApiError(500, "Unable to fetch Channel Stats")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {
            totalVideos: videoStats[0]?.totalVideos || 0,
            totalViews: videoStats[0]?.totalViews || 0,
            totalSubscribers: subscribersStats[0]?.totalSubscribers || 0
        }, "Channel Stats fetched successfully"))
})

const getChannelVideos = AsyncHandler(async (req, res) => {
    const { userId } = req.params

    if (!userId || isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid User ID")
    }

    const Videos = await video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup:{
                from: "comments",
                localField: "_id",
                foreignField: "video",
                as: "comments"
            }
        },
        {
            $addFields: {
                commentsCount: {
                    $size: "$comments"
                }
            }
        },
        {
            $project: {
                _id:1,
                videoFile:1,
                ispublished:1,
                thumbnail:1,
                commentsCount:1,
                createdAt:1,
                title:1,
                description:1,
                views:1
            }
        }
    ])

    if(!Videos.length   ){
        throw new ApiError(500, "no video found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200 , Videos, "Videos Fetched Successfully"))
})


export {getChannelStats , getChannelVideos}