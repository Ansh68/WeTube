import AsyncHandler from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { user } from "../models/usermodel.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateTokens = async (userid) => {
    try {
        const User = await user.findById(userid);
        const accessToken = User.generateAccessToken();
        const refreshToken = User.generateRefreshToken();

        User.refreshToken = refreshToken;
        await User.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens");

    }
}

const registerUser = AsyncHandler(async (req, res, next) => {

    // get user details form frontend
    const { fullname, username, email, password } = req.body;
    console.log("email", email);

    // validation
    if (!fullname || !username || !email || !password) {
        throw new ApiError(400, "All Fields are Required");
    }

    // check if user already exists
    const existedUser = await user.findOne({ email })

    if (existedUser) {
        throw new ApiError(409, "User with this email already exists");
    }

    // check for images and avatar
    const avatarPath = req.files?.avatar[0]?.path
    //const coverImagePath = req.files?.coverimage[0]?.path ;

    let coverImagePath;
    if (req.files && Array.isArray(req.files.coverimage) && req.files.coverimage.length > 0) {
        coverImagePath = req.files.coverimage[0].path;

    }

    if (!avatarPath) {
        throw new ApiError(400, "Avatar is Required");
    }

    // upload them in cloudinary - avatar
    const avatar = await uploadOnCloudinary(avatarPath);
    const coverImage = await uploadOnCloudinary(coverImagePath);

    if (!avatar) {
        throw new ApiError(500, "Failed to upload avatar");
    }

    // create user objects -entry in db
    const userCreate = await user.create({
        fullname,
        username,
        email,
        password,
        avatar: avatar.url,
        coverimage: coverImage?.url || ""
    })

    // check for user creation
    // remove password and refresh token field from response
    const UserRegister = await user.findById(userCreate._id).select("-password -refreshToken");

    if (!UserRegister) {
        throw new ApiError(500, "Something went wrong");
    }

    // send response
    return res.status(201).json(
        new ApiResponse(200, UserRegister, "User Registered Successfully")
    )
})

const loginUser = AsyncHandler(async (req, res) => {

    // get req data
    const { email, password } = req.body;

    // check for username or email choice
    if (!email) {
        throw new ApiError(400, "Email is Required");
    }

    // find the user
    const userfound = await user.findOne({ email });

    if (!userfound) {
        throw new ApiError(404, "User not found");
    }

    // if email is okay check for password
    const passwordCheck = await userfound.isPasswordCorrect(password);

    if (!passwordCheck) {
        throw new ApiError(401, "Password Invalid");
    }

    // generate access and refresh token
    const { accessToken, refreshToken } = await generateTokens(userfound._id);

    const LoggedInUser = await user.findById(userfound._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: false
    }

    // send cookies and response
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: LoggedInUser,
                    accessToken,
                    refreshToken
                },
                "User Logged In Successfully"
            )

        )

})

const logoutUser = AsyncHandler(async (req, res) => {
    await user.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, {}, "User Logged Out Successfully")
        )
})

const refreshAccessToken = AsyncHandler(async (req, res) => {
    const incomingrefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if (!incomingrefreshToken) {
        throw new ApiError(401, "Unauthorized Request")
    }

    const decodedRefreshToken = jwt.verify(incomingrefreshToken, process.env.REFRESH_TOKEN_SECRET)

    const User = await user.findById(decodedRefreshToken?._id)

    if (!User) {
        throw new ApiError(401, "Invalid Refresh Token")
    }

    if (incomingrefreshToken !== User?.refreshToken) {
        throw new ApiError(401, "Invalid Refresh Token")
    }

    const options = {
        httpOnly: true,
        secure: true
    }

    const { accessToken, newrefreshToken } = await generateTokens(User._id)

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newrefreshToken, options)
        .json(
            new ApiResponse(
                200,
                { accessToken, newrefreshToken },
                "Access Token Refreshed Successfully"
            )
        )

})

const changecurrentPassword = AsyncHandler(async (req, res) => {
    const { oldpassword, newpassword } = req.body

    const User = await user.findById(req.user?._id)
    const ispasscorrect = await User.isPasswordCorrect(oldpassword)

    if (!ispasscorrect) {
        throw new ApiError(400, "Invalid Password")
    }
    User.password = newpassword
    User.save({ validateBeforeSave: false })

    return res.status(200).json(
        new ApiResponse(200, {}, "Password Changed Successfully")
    )


})

const getUserDetails = AsyncHandler(async (req, res) => {
    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                req.user,
                "User Details Fetched Successfully"
            )
        )
})

const updateavatar = AsyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is Required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if (!avatar.url) {
        throw new ApiError(400, "Failed to upload avatar")
    }
    const User = await user.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        { new: true }
    ).select("-password")
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                User,
                "Avatar Updated Successfully"
            )
        )

})

const updatecoverimage = AsyncHandler(async (req, res) => {
    const coverimageLocalPath = req.file?.path
    if (!coverimageLocalPath) {
        throw new ApiError(400, "Cover Image is Required")
    }

    const coverimage = await uploadOnCloudinary(coverimageLocalPath)
    if (!coverimage.url) {
        throw new ApiError(400, "Failed to upload Cover Image")
    }
    const User = await user.findByIdAndUpdate(
        req.User?._id,
        {
            $set: {
                coverimage: coverimage.url
            }
        },
        { new: true }
    ).select("-password")
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                User,
                "CoverImage Updated Successfully"
            )
        )

})

const userChannelProfile = AsyncHandler(async (req, res) => {
    const { username } = req.params

    if (!username?.trim()) {
        throw new ApiError(400, "Username is Required")
    }

    const channel = await user.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: { $size: "$subscribers" },
                subscribedToCount: { $size: "$subscribedTo" },
                
            }
        },
        {
            $project: {
                username: 1,
                fullname: 1,
                avatar: 1,
                coverimage: 1,
                subscribersCount: 1,
                subscribedToCount: 1,
                issubscribed: 1,
                subscribers: 1,
            }
        }
    ])

    if (!channel?.length) {
        throw new ApiError(404, "Channel Not Found")
    }

    const channelData = channel[0];
    let issubscribed = false ;

    if (req.user._id){
        issubscribed = channelData.subscribers.some(
            (s) => s.subscriber?.toString() === req.user._id.toString()
        )
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    ...channelData,
                    issubscribed: issubscribed
                },
                "Channel Profile Fetched Successfully"
            )
        )


})

const userWatchHistory = AsyncHandler(async (req, res) => {
    const History = await user.aggregate([
        {
            $match: {
                _id : new mongoose.Types.ObjectId(req.user._id)
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchhistory",
                foreignField: "_id",
                as: "watchhistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        username: 1,
                                        fullname: 1,
                                        avatar: 1
                                    }
                                },

                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }

        }
    ])
    if (!History?.length) {
        new ApiError(404, "No Watch History Found")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            History[0].watchhistory,
            "Watch History Fetched Successfully"
        )
    )
})

export { registerUser, loginUser, logoutUser, refreshAccessToken, changecurrentPassword, getUserDetails, updateavatar, updatecoverimage, userChannelProfile, userWatchHistory };