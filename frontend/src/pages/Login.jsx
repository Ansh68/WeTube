import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { loginFailed, loginSuccess, loginStart } from '../store/authSlice'
import { toast } from 'react-toastify'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'


function Login() {
    const [isLoading, setisLoading] = useState(false)
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { register, handleSubmit, formState: { errors } } = useForm();

    const login = async (data) => {
        setisLoading(true)
        setError("")
        try {
            dispatch(loginStart())
            const response = await axios.post("http://localhost:8000/users/login", data  ,
                {
                    withCredentials: true,
                }
            )
            console.log("FULL RESPONSE:", response.data);

            if (response?.data?.data) {
                localStorage.setItem("accessToken", response.data.data.accessToken)

                dispatch(loginSuccess({
                    data: {
                        user: response.data.data.user,
                        statusCode: response.data.statuscode,
                        message: response.data.message,
                        success: response.data.success
                    },
                    success: response.data.success
                })
                )
                toast.success(response.data.message)
                navigate("/")
                
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
            setError(errMsg)
        } finally {
            setisLoading(false)
        }
    }

    return (
        <div>
            <div>
                <h2>Log In to Your acccount</h2>
                {error && <p className="text-red-600 text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit(login)}>
                    <div>
                        <label htmlFor="email">Email Address</label>
                        <input
                            id='email'
                            type="email"
                            placeholder='Enter Your Email'
                            required
                            {...register("email", {
                                required: "Email is Required",
                                pattern: {
                                    value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                    message: "Email address must be a valid address",
                                }

                            })}
                        />
                        {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            placeholder='Enter Your Password'
                            required
                            {...register("password", {
                                required: "Password is Required",
                            })}
                        />
                        {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
                    </div>

                    <button
                        type='submit'
                        disabled={isLoading}
                    >
                        {isLoading ? "Loading..." : "Log In"}

                    </button>
                </form>
                <p >
                    Don't have an account?{" "}
                    <Link to="/signup">
                        Sign up now
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Login
