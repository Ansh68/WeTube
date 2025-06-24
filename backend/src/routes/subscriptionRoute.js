import { Router } from 'express';
import { VerifyJWT } from '../middlewares/Auth.js';
import { getSubscribedChannels, toggleSubscription, userChannelSubscribers } from '../controllers/subscriptioncontroller.js';


const subscriptionRoute = Router()

subscriptionRoute.use(VerifyJWT)

subscriptionRoute
.route("/c/:channelId")
.post(toggleSubscription)

subscriptionRoute.route("/u/:subscriberId").get(getSubscribedChannels)

subscriptionRoute.route("/c/:channelId").get(userChannelSubscribers)

export default subscriptionRoute