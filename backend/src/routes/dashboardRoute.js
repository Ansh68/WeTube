import { Router } from "express";
import { VerifyJWT } from "../middlewares/Auth.js";
import { getChannelStats , getChannelVideos } from "../controllers/dashboardcontroller.js";


const dashboardRoute = Router()
dashboardRoute.use(VerifyJWT)

dashboardRoute.route("/stats/:userId").get(getChannelStats)
dashboardRoute.route("/channelvideos").get(getChannelVideos)

export default dashboardRoute;