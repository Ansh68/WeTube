import {comment} from "../models/commentmodel.js";
import mongoose, { isValidObjectId } from "mongoose";
import AsyncHandler from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { video } from "../models/videomodel.js";


const getVideoComments = AsyncHandler(async (req, res) => {
    const {videoId} = req.params  // get videoId from params
    const {page = 1, limit = 10} = req.query

    if (!videoId || !isValidObjectId(videoId)) {    // check if videoId is valid
        throw new ApiError(400, "Invalid Video ID")    
    }

    const Video = await video.findById(videoId)  // check if video exists

    if (!Video) {
        throw new ApiError(404, "Video not found") 
    }

    const comments = await comment.aggregate([
        {
            $match: {   
                video: new mongoose.Types.ObjectId(videoId),    
                parent: null     
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $skip: (parseInt(page) - 1) * parseInt(limit)   // pagination
        },
        {
            $limit: parseInt(limit)   // limit the number of comments
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
                            username: 1,
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "parent",
                as: "replies",
                pipeline: [
                    {
                        $lookup:{
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullname: 1,
                                        avatar: 1,
                                        username: 1,
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        },
        {
            $addFields:{
                owner: {
                    $arrayElemAt: ["$owner", 0]
                },
                replies: {
                    $map: {
                        input: "$replies",
                        as: "reply",
                        in: {
                            _id: "$$reply._id",
                            content: "$$reply.content",
                            createdAt: "$$reply.createdAt",
                            owner: {
                                $arrayElemAt: ["$$reply.owner", 0]
                            },
                        }
                    }
                },
                repliesCount: {
                    $size: "$replies"
                },
                isReply: {
                    $cond: {
                        if: { $eq: ["$parent", null] },
                        then: false,
                        else: true
                    }
                },

            }
        },
        {
            $project:{
                content: 1,
                createdAt: 1,
                owner: 1,
                replies: 1,
                isReply: 1,
                repliesCount: 1,
                video: 1,
                parent: 1,
                
            }
        },
        
    ])

    

    const totalComments = await comment.countDocuments(    // count the total number of comments
        {
            video: videoId,
            parent: null
        }
    )

   

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                comments,
                totalComments,   
            },
            "Comments fetched successfully"
        )
    )

})


const addComment = AsyncHandler(async(req,res)=>{
    const {videoId} = req.params
    const {content , parent} = req.body

    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video ID")
    }

    const Video = await video.findById(videoId)

    if (!Video) {
        throw new ApiError(404, "Video not found")
    }

    if (!content?.trim()) {
        throw new ApiError(400, "Content is required")
    }

    const Comment = await comment.create({
        content,
        video: videoId,
        owner: req.user._id,
        parent: parent || null
    })

    await Comment.populate("owner", "username avatar" )

    if (!Comment) {
        throw new ApiError(500, "Failed to add comment")    
    }

    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            Comment,
            "Comment added successfully"
        )
    )
})


const updateComment = AsyncHandler(async(req,res)=>{
    const {commentId} = req.params
    const {content} = req.body

    if (!commentId || !isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid Comment ID")
    }

    const Comment = await comment.findById(commentId)

    if (!Comment) {
        throw new ApiError(404, "Comment not found")
    }

    if (Comment.owner?.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this comment")
    }

    if (!content?.trim) {
        throw new ApiError(400, "Content is required")
    }

    const updatedComment = await comment.findByIdAndUpdate(
        commentId,
        {
            $set: {
                content: content.trim()
            }
        },
        {new: true}
    )

    if (!updatedComment) {
        throw new ApiError(500, "Failed to update comment")     
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            updatedComment,
            "Comment updated successfully"
        )
    )
})


const deleteComment = AsyncHandler(async(req,res)=>{
    const {commentId}= req.params

    if (!commentId || !isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid Comment ID")  
    }

    const Comment = await comment.findById(commentId)

    if (!Comment) {
        throw new ApiError(404, "Comment not found")    
    }

    if (Comment.owner?.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this comment")
    }

    const deletedComment = await comment.findByIdAndDelete(commentId)

    if (!deletedComment) {
        throw new ApiError(500, "Failed to delete comment")    
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Comment deleted successfully"
        )
    )
})


export {getVideoComments, addComment, updateComment, deleteComment}