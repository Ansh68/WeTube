import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setUserChannel , toggleSubscription } from "../../store/channelSlice"
import axios from 'axios'
import { useParams, NavLink,  useNavigate, Outlet } from 'react-router-dom'

function Channel() {
  const dispatch = useDispatch()
  const { userchannel   } = useSelector(state => state.channel)
  const { isAuthenticated, data } = useSelector(state => state.auth)
  const Profile = userchannel
  const { username } = useParams();
  const [error, setError] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/users/c/${username}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
        })
        if (response.data.data) {
          const data = response.data.data;
          dispatch(setUserChannel({
            ...data,
            isSubscribed: data.issubscribed
          }))
        }

      } catch (error) {
        setError(error.response?.data?.message || "Something went wrong")
      }
    }
    fetchChannel()
  }, [username, dispatch])

  const handleToggleSubscription = async () => {
    try {
      const response = await axios.post(`http://localhost:8000/subscription/c/${Profile._id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          withCredentials: true,
        }
      })
      if (response.data.success) {
        dispatch(toggleSubscription({
          profileId: Profile._id,
          isSubscribed: !Profile.isSubscribed,
          subscribersCount: Profile.isSubscribed ? Profile.subscribersCount - 1 : Profile.subscribersCount + 1
        }))

      }
    } catch (error) {
      console.error("Subscription error:", error);
      setError(error.response?.data?.message || "Subscription failed");
    }
  }

  return Profile ? (
    <div className="min-h-screen bg-black text-white">
      {/* Cover Image */}
      <div className="w-full h-48 md:h-64 lg:h-80 overflow-hidden">
        <img
          src={Profile?.coverImage || "https://as1.ftcdn.net/jpg/13/51/20/86/1000_F_1351208653_gYCB48ZeUX5dAn2C2p01TilH1bDA27Mu.webp"}
          alt="Cover"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Channel Info Section */}
      <div className="px-4 md:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Profile Picture */}
          <div className="flex-shrink-0">
            <img
              src={Profile?.avatar}
              alt="Profile"
              className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full object-cover border-2 border-gray-700"
            />
          </div>

          {/* Channel Details */}
          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1">
                  {Profile?.fullname}
                </h1>
                <div className="flex flex-wrap items-center gap-2 text-gray-400 text-sm md:text-base">
                  <span>@{Profile?.username}</span>
                  <span>•</span>
                  <span>{Profile?.subscribersCount?.toLocaleString()} subscribers</span>
                  <span>•</span>
                  <span>{Profile?.videosCount} videos</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex-shrink-0">
                {isAuthenticated ? (
                  data.user._id === Profile._id ? (
                    <button
                      onClick={() => navigate("/settings")}
                      className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-full font-medium transition-colors duration-200 border border-gray-600"
                    >
                      Edit
                    </button>
                  ) : (
                    <button
                      onClick={handleToggleSubscription}
                      className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${Profile.isSubscribed
                          ? "bg-gray-800 text-white hover:bg-gray-700 border border-gray-600"
                          : "bg-red-600 hover:bg-red-700 text-white"
                        }`}
                    >
                      {Profile?.isSubscribed ? "Subscribed" : "Subscribe"}
                    </button>
                  )
                ) : (
                  <button
                    onClick={() => navigate("/login")}
                    className="px-6 py-2 rounded-full font-medium bg-red-600 hover:bg-red-700 text-white transition-colors duration-200"
                  >
                    Subscribe
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-8 border-b border-gray-800">
          <nav className="flex gap-8">
            <NavLink
              to="videos"
              className={({ isActive }) =>
                `pb-3 px-1 font-medium transition-colors duration-200 border-b-2 ${isActive
                  ? "border-white text-white"
                  : "border-transparent text-gray-400 hover:text-gray-300"
                }`
              }
            >
              Videos
            </NavLink>
            <NavLink
              to="playlists"
              className={({ isActive }) =>
                `pb-3 px-1 font-medium transition-colors duration-200 border-b-2 ${isActive
                  ? "border-white text-white"
                  : "border-transparent text-gray-400 hover:text-gray-300"
                }`
              }
            >
              Playlists
            </NavLink>
            <NavLink
              to="about"
              className={({ isActive }) =>
                `pb-3 px-1 font-medium transition-colors duration-200 border-b-2 ${isActive
                  ? "border-white text-white"
                  : "border-transparent text-gray-400 hover:text-gray-300"
                }`
              }
            >
              About
            </NavLink>
          </nav>
        </div>

        {/* Content Area */}
        <div className="mt-6">
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white text-lg">Loading...</div>
    </div>
  )
}

export default Channel