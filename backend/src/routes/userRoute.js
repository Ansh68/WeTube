import { Router } from 'express';
import { changecurrentPassword, getUserDetails, loginUser, logoutUser, refreshAccessToken, registerUser, updateavatar, updatecoverimage, userChannelProfile, userWatchHistory } from '../controllers/usercontroller.js';
import { upload } from '../middlewares/multer.js';
import { VerifyJWT } from '../middlewares/Auth.js';

const userRoute = Router()

userRoute.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        },
        {
            name: "coverimage",
            maxCount: 1
        }
    ]),
    registerUser
)

userRoute.route("/login").post(loginUser)

userRoute.route("/logout").post(VerifyJWT,logoutUser)

userRoute.route("/refresh-token").post(refreshAccessToken)

userRoute.route("/change-password").post(VerifyJWT, changecurrentPassword)

userRoute.route("/current-user").get(VerifyJWT, getUserDetails )

userRoute.route("/update-avatar").patch(VerifyJWT, upload.single("avatar"), updateavatar)

userRoute.route("/update-image").patch(VerifyJWT, upload.single("coverimage"), updatecoverimage)

userRoute.route("/c/:username").get(VerifyJWT, userChannelProfile)

userRoute.route("/watch-history").get(VerifyJWT, userWatchHistory)

export default userRoute;