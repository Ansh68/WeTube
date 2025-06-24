import AsyncHandler from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import jwt from 'jsonwebtoken';
import { user } from '../models/usermodel.js';

export const VerifyJWT = AsyncHandler(async (req, res, next) => {

    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
        if (!token) {
            throw new ApiError(401, "Unauthorized Access")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const User= await user.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!User) {
            throw new ApiError(401, "Unauthorized Access Token")   
        }
    
        req.user = User
    
        next()
    } catch (error) {
        throw new ApiError(401, "Invalid Access Token")
    }

})