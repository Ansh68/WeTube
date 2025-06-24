import { createSlice } from "@reduxjs/toolkit";

const loadState = () => {
    try {
        const serializedState = localStorage.getItem("authState");
        if (serializedState === null) {
            return {
                data: {
                    user: null,
                    statusCode: null,
                    message: null,
                    success: null
                },
                isLoading: false,
                error: null,
                isAuthenticated: false,
            };
        }
        return JSON.parse(serializedState);
    } catch (error) {
        return {
            data: {
                user: null,
                statusCode: null,
                message: null,
                success: false
            },
            isLoading: false,
            error: null,
            isAuthenticated: false
        };
    }
};

const initialState = loadState();

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginStart: (state) => {
            state.isLoading = true;
            state.error = null
            localStorage.setItem("authState", JSON.stringify(state))
        },
        loginSuccess: (state, action) => {
            state.isLoading = false;
            state.data.user = action.payload.data.user
            state.isAuthenticated = action.payload.success
            localStorage.setItem("authState", JSON.stringify(state))
        },
        loginFailed: (state , action) => {
            state.isLoading = false;
            state.error = action.payload
            state.isAuthenticated = false
            localStorage.setItem("authState", JSON.stringify(state))
        },
        logout: (state) => {
            state.data = {
                user: null,
                statusCode: null,
                message: null,
                success: false
            }
            state.isAuthenticated = false;
            state.error = null
            localStorage.removeItem("authState")
        },
        updateUser: (state , action) =>{
            state.data.user = action.payload
            localStorage.setItem("authState", JSON.stringify(state))
        }
    }
})

export const {loginStart , loginFailed , loginSuccess , updateUser , logout} = authSlice.actions;

export default authSlice.reducer;