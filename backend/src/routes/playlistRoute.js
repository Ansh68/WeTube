import { Router } from "express";
import { VerifyJWT } from "../middlewares/Auth.js";
import { addVideotoPlaylist, createPlaylist, deletePlaylist, getPlaylistById, removeVideofromPlaylist, updatePlaylist, UserPlaylists } from "../controllers/playlistcontroller.js";


const playlistRoute = Router()

playlistRoute.use(VerifyJWT)

playlistRoute.route("/").post(createPlaylist)

playlistRoute
.route("/:playlistId")
.get(getPlaylistById)
.patch(updatePlaylist)
.delete(deletePlaylist)


playlistRoute.route("/add/:videoId/:playlistId").patch(addVideotoPlaylist)
playlistRoute.route("/remove/:videoId/:playlistId").patch(removeVideofromPlaylist)

playlistRoute.route("/user/:userId").get(UserPlaylists)

export default playlistRoute