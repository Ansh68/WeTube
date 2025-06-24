import mongoose, { isValidObjectId } from "mongoose"
import { subscription } from "../models/subscriptionmodel.js"
import { user } from "../models/usermodel.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";



const toggleSubscription = AsyncHandler(async (req, res) => {
    const { channelId } = req.params

    if (!channelId || !isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid Channel ID")
    }

    const channel = await user.findById(channelId)

    if (!channel) {
        throw new ApiError(404, "Channel not found")
    }

    const subscriptionExists = await subscription.findOne({
        subscriber: req.user._id,
        channel: channelId
    })

    let issubscribed = false
    let subscriptionId = null

    if (!subscriptionExists) {
        const subscribed = await subscription.create({
            subscriber: req.user._id,
            channel: channelId
        })
        if (!subscribed) {
            throw new ApiError(500, "Unable to subscribe to channel")
        }
        issubscribed = true
        subscriptionId = subscribed._id
    }
    else {
        const unsubscribed = await subscription.deleteOne({
            subscriber: req.user._id,
            channel: channelId
        })
        if (!unsubscribed) {
            throw new ApiError(500, "Unable to unsubscribe this channel")
        }
        issubscribed = false
        subscriptionId = subscriptionExists._id
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    issubscribed,
                    channelId,
                    ...(issubscribed ? { subscriptionId } : {})
                },
                "Subscription status changed successfully"
            )
        )
})

const userChannelSubscribers = AsyncHandler(async (req,res)=>{
    const {channelId}= req.params

    if (!channelId || !isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid Channel ID")
    }

    const channel = await user.findById(channelId)

    if (!channel) {
        throw new ApiError(404, "Channel not found")
    }

    const channelSubscribers = await subscription.aggregate([
        {
            $match: {
                channel : new mongoose.Types.ObjectId(channelId) // filter by channelId
            }
        },
        {
            $sort:{
                createdAt: -1  // sort by latest subscription
            }
        },
        {
            $lookup:{   // join with user collection
                from: "users", 
                localField: "subscriber",
                foreignField: "_id",
                as: "subscriberDetails",
                pipeline: [     
                    {
                        $project:{
                            fullname: 1,    
                            avatar: 1,
                            username: 1,
                            coverimage: 1,
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                subscribersCount:{
                    $size: "$subscriberDetails" // add subscribers count field  
                },
                subscriberDetails: {
                    $arrayElemAt: ["$subscriberDetails", 0] // get the first element of subscriberDetails array
                }  
            }
        },
        {
            $project:{
                subscriberDetails: 1, 
                subscribersCount: 1,
                subscribedat: "$createdAt" 
            }
        }   
    ])


    if (!channelSubscribers?.length) {
        return res.status(200).json(new ApiResponse(200, [], "No subscribers yet for this channel"));
    }
    

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            channelSubscribers,
            "Channel subscribers fetched successfully"
        )
    )

})

const getSubscribedChannels = AsyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if (!subscriberId || !isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid Subscriber ID")
    }

    const subscriber = await user.findById(subscriberId)

    if (!subscriber) {
        throw new ApiError(404, "Subscriber not found")
    }

    const subscribedChannels = await subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(subscriberId) // filter by subscriberId
            }
        },
        {
            $sort: {
                createdAt: -1  // sort by latest subscription
            }
        },
        {
            $lookup:{ // join with user collection
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "channelDetails",
                pipeline: [
                    {
                        $project:{
                            fullname: 1,
                            avatar: 1,
                            username: 1,
                            coverimage: 1,
                        }
                    }
                ]
            }
        },
        {
            $lookup: {  // join with subscription collection to get subscribers count
                from: "subscriptions",
                localField: "channel",
                foreignField: "channel",
                as: "subscribersCount",
                pipeline: [
                    {
                        $count: "count"
                    }
                ]
            }
        },
        {
            $addFields:{
                channelDetails: {
                    $ifNull : [
                        { $arrayElemAt: ["$channelDetails", 0 ]}, null
                    ] // get the first element of channelDetails array
                },
                subscribersCount:{
                    $ifNull : [
                        { $arrayElemAt: ["$subscribersCount.count", 0 ]}, null
                    ] // get the first element of subscribersCount array
                }
            }
        },
        {
            $project:{
                channelDetails: 1, 
                subscribersCount: 1,
            }
        }
    ])

    if (!subscribedChannels?.length) {
        throw new ApiError(404, "No channels subscribed by this user")     
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            subscribedChannels,
            "Subscribed channels fetched successfully"
        )
    )
})



export {  toggleSubscription , userChannelSubscribers, getSubscribedChannels }
