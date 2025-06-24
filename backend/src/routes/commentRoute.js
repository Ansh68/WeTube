import { Router } from "express";
import { VerifyJWT } from "../middlewares/Auth.js";
import { addComment, deleteComment, getVideoComments, updateComment } from "../controllers/commentcontroller.js";



const commentRoute = Router()

commentRoute.use(VerifyJWT)

commentRoute.route("/:videoId").get(getVideoComments).post(addComment)
commentRoute.route("/c/:commentId").delete(deleteComment).patch(updateComment)


export default commentRoute;