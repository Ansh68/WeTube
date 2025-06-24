import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./authSlice"
import videoReducer from "./videoSlice"
import channelReducer from "./channelSlice"

const store =  configureStore({
    reducer: {
        auth: authReducer,
        video : videoReducer,
        channel : channelReducer
    }
});

export default store;