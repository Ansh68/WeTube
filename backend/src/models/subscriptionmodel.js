import mongoose  from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    subscriber: {
        type: mongoose.Schema.Types.ObjectId, //user who are subscribing
        ref: "User"
    },
    channel:{
        type: mongoose.Schema.Types.ObjectId, // user who is being subscribed to
        ref: "User"
    }
}, {timestamps: true})


export const subscription= mongoose.model("Subscription", subscriptionSchema)