import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { loginFailed, loginSuccess, loginStart } from '../store/authSlice';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [isLoading, setisLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { register, handleSubmit, formState: { errors } } = useForm();

    const login = async (data) => {
        setisLoading(true);
        setError("");
        try {
            dispatch(loginStart());
            const response = await axios.post("http://localhost:8000/users/login", data,
                {
                    withCredentials: true,
                }
            );
            console.log("FULL RESPONSE:", response.data);

            if (response?.data?.data) {
                localStorage.setItem("accessToken", response.data.data.accessToken);

                dispatch(loginSuccess({
                    data: {
                        user: response.data.data.user,
                        statusCode: response.data.statuscode,
                        message: response.data.message,
                        success: response.data.success
                    },
                    success: response.data.success
                }));
                toast.success(response.data.message);
                navigate("/");
            }
        } catch (error) {
            let errMsg = "An error occurred";
            if (error.response?.status === 401) {
                errMsg = "Invalid password";
            } else if (error.response?.status === 500) {
                errMsg = "Server is not working";
            } else if (error.response?.status === 404) {
                errMsg = "User does not exist";
            }
            dispatch(loginFailed(errMsg));
            setError(errMsg);
        } finally {
            setisLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="bg-[#111111] border  rounded-lg p-8 space-y-6">
                    {/* Header */}
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-white mb-2">
                            Welcome Back
                        </h2>
                        <p className="text-gray-400">Sign in to your account</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-900/20 border border-red-800 rounded p-3">
                            <p className="text-red-400 text-sm text-center">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit(login)} className="space-y-4">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                                Email
                            </label>
                            <input
                                id='email'
                                type="email"
                                placeholder='Enter your email'
                                className="w-full px-3 py-2 bg-[#343434] border border-[#343434] rounded
                                           text-white 
                                            focus:border-white focus:ring-1 focus:ring-white"
                                {...register("email", {
                                    required: "Email is Required",
                                    pattern: {
                                        value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                        message: "Email address must be a valid address",
                                    }
                                })}
                            />
                            {errors.email && (
                                <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                placeholder='Enter your password'
                                className="w-full px-3 py-2 bg-[#343434] border border-[#343434] rounded
                                           text-white 
                                            focus:border-white focus:ring-1 focus:ring-white"
                                {...register("password", {
                                    required: "Password is Required",
                                })}
                            />
                            {errors.password && (
                                <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type='submit'
                            disabled={isLoading}
                            className="w-full bg-white text-black font-medium py-2 px-4 rounded
                                       hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black
                                       disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <div className="text-center pt-4 border-t border-gray-800">
                        <p className="text-gray-400 text-sm">
                            Don't have an account?{" "}
                            <Link to="/signup" className="text-white hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;