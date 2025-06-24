import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { loginSuccess } from "../store/authSlice";
import { useForm } from "react-hook-form";


export default function SignUp() {
    const [isLoading, setisLoading] = useState(false)
    const [Error, setError] = useState("")
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            fullName: "",
            username: "",
            email: "",
            password: "",
            avatar: "",
            coverImage: ""
        }
    })

    const onSubmit = async (data) => {
        setisLoading(true);
        setError("");

        // create form data to handle file uploads
        try {
            const formdata = new FormData()

            formdata.append("fullname", data.fullName)
            formdata.append("username", data.username)
            formdata.append("email", data.email)
            formdata.append("password", data.password)
            formdata.append("avatar", data.avatar[0])
            if (data.coverImage?.[0]) {
                formdata.append("coverimage", data.coverImage[0])
            }

            // Register User
            for (let [key, value] of formdata.entries()) {
                console.log(`${key}:`, value);
            }

            const Response = await axios.post("http://localhost:8000/users/register", formdata , {
                
            })

            let loginResponse;

            console.log("Trying login with:");
            console.log("Email:", data.email);
            console.log("Password:", data.password);

            if (Response.data) {
                loginResponse = await axios.post("http://localhost:8000/users/login", {
                    email: data.email,
                    password: data.password,
                })
            }

            if (loginResponse.data) {
                dispatch(loginSuccess(loginResponse.data.data))
                toast.success("Account Created and Logged in Succesully")

                navigate("/")
            }
        } catch (error) {
            console.log("Full error response:", error.response);

            if (error.response?.status === 409) {
                setError("User with this username or email already exists");
                toast.error("User with this username or email already exists");
            } else {
                setError("An unexpected error occurred. Please try again.");
                toast.error("An unexpected error occurred. Please try again.");
            }
        } finally {
            setisLoading(false);
        }

    }

    return (
        <div>
            <div>
                <h2>Create An Account</h2>
                <p>Enter Your Information</p>
                <form onSubmit={handleSubmit(onSubmit)} >
                    {Error && <div>{Error}</div>}
                    {/* FULL NAME FIELD  */}
                    <div>
                        <label htmlFor="fullName">Full Name</label>
                        <input type="text"
                            id="fullName"
                            {...register("fullName", { required: "Full Name is Required" })}
                            className={`w-full border px-3 py-2 rounded ${errors.fullName ? "border-red-500" : "border-gray-300"}`}
                        />
                        {errors.fullName && <p>{errors.fullName.message}</p>}
                    </div>
                    {/* USERNAME FIELD */}
                    <div>
                        <label htmlFor="username">Username</label>
                        <input type="text"
                            id="username"
                            {...register("username", {
                                required: "Username is Required",
                                pattern: {
                                    value: /^[a-zA-Z0-9_]+$/,
                                    message: "Only letters, numbers and underscores allowed",
                                }
                            })}
                            className={`w-full border px-3 py-2 rounded ${errors.username ? "border-red-500" : "border-gray-300"}`}
                        />
                        {errors.username && <p>{errors.username.message}</p>}
                    </div>
                    {/*  EMAIL FIELD */}
                    <div>
                        <label htmlFor="email">Email</label>
                        <input type="email"
                            id="email"
                            {...register("email", {
                                required: "Email is Required",
                                pattern: {
                                    value: /\S+@\S+\.\S+/,
                                    message: "Invalid email format",
                                }
                            })}
                            className={`w-full border px-3 py-2 rounded ${errors.email ? "border-red-500" : "border-gray-300"}`}
                        />
                        {errors.email && <p>{errors.email.message}</p>}
                    </div>
                    {/* PASSWORD FIELD */}
                    <div>
                        <label htmlFor="password">Password</label>
                        <input type="password"
                            id="password"
                            {...register("password", {
                                required: "Password is Required",
                                minLength: {
                                    value: 8,
                                    message: "Password Must be 8 characters"
                                }
                            })}
                            className={`w-full border px-3 py-2 rounded ${errors.password ? "border-red-500" : "border-gray-300"}`}
                        />
                        {errors.password && <p>{errors.password.message}</p>}
                    </div>
                    {/* AVATAR FIELD */}
                    <div>
                        <label htmlFor="avatar">Avatar</label>
                        <input type="file"
                            id="avatar"
                            {...register("avatar", { required: "Avatar is Required" })}
                            className={`w-full border px-3 py-2 rounded ${errors.avatar ? "border-red-500" : "border-gray-300"}`}
                        />
                        {errors.avatar && <p>{errors.avatar.message}</p>}
                    </div>
                    {/* COVERIMAGE FIELD */}
                    <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="coverImage">Cover Image (Optional)</label>
                        <input type="file" id="coverImage" {...register("coverImage")} className="w-full border px-3 py-2 rounded border-gray-300" />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                        {isLoading ? " Processing..." : "Register"}
                    </button>
                </form>
            </div>
        </div>

    )
}
