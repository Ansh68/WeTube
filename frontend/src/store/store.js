import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./authSlice"
import videoReducer from "./videoSlice"
import channelReducer from "./channelSlice"
import dashboardReducer from "./dashboardSlice"

const store =  configureStore({
    reducer: {
        auth: authReducer,
        video : videoReducer,
        channel : channelReducer,
        dashboard: dashboardReducer,
    }
});

export default store;