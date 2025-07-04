import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import Cors from "cors";


const app = express();

app.use(Cors({
    "origin": process.env.CORS_ORIGIN,
    "credentials": true 
}));

app.use(express.json({limit: "40kb"}));
app.use(urlencoded({extended: true}));
app.use(express.static("public"));
app.use(cookieParser())

// routes

import userRoute from "./routes/userRoute.js";
import videoRoute from "./routes/videoRoute.js";
import subscriptionRoute from "./routes/subscriptionRoute.js";
import commentRoute from "./routes/commentRoute.js";
import playlistRoute from "./routes/playlistRoute.js";
import dashboardRoute from "./routes/dashboardRoute.js";

app.use("/users", userRoute);
app.use("/videos", videoRoute);
app.use("/subscription", subscriptionRoute);
app.use("/comments", commentRoute)
app.use("/playlist", playlistRoute)
app.use("/dashboard" , dashboardRoute)


export {app};