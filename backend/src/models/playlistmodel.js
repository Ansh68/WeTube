import mongoose from "mongoose";

const playlistSchema = new  mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description:{
        type: String,
        default: "No description",
    },
    videos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video",
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }

},{timestamps: true})

export const playlist = mongoose.model("Playlist", playlistSchema)