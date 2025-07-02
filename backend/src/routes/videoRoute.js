import { Router } from 'express';
import { deleteVideo, getAllVideos, getVideobyId, publishVideo, updateVideo } from '../controllers/videocontroller.js';
import { upload } from '../middlewares/multer.js';
import { VerifyJWT } from '../middlewares/Auth.js';
import { get } from 'mongoose';


const videoRoute = Router()



videoRoute.get("/getAllVideos", VerifyJWT, getAllVideos);


videoRoute.route("/publish").post(VerifyJWT, upload.fields(
    [
        {
            name: "videoFile",
            maxCount: 1,
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    publishVideo

)

videoRoute.route("/:videoId")
    .get(VerifyJWT, getVideobyId)
    .patch(VerifyJWT, upload.fields(
        [
            {
                name: "thumbnail",
                maxCount: 1
            }
        ]
    ), updateVideo)
    .delete(VerifyJWT, deleteVideo)





export default videoRoute;