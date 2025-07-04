import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Search from './Search';
import axios from 'axios';
import { logout } from '../../store/authSlice';
import { User, LogOut, Settings } from 'lucide-react';
import PopUp from '../Dashboard/PopUp';

function Navbar() {
  const user = useSelector((state) => state.auth.data.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const menuref = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuref.current && !menuref.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside)
  })

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8000/users/logout", {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        withCredentials: true
      });
      dispatch(logout());
      localStorage.removeItem("accessToken")
      navigate("/login")
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }





  return (
    <div className="sticky top-0 z-50 bg-black">
      <nav className="flex justify-between items-center p-4">
        {/* Logo placeholder or title */}
        <Link to="/" className="text-white font-bold text-xl">MyApp</Link>

        <Search />

        <div className='flex items-center gap-4'>

          <PopUp />
        </div>


        <div className="flex items-center gap-4" ref={menuref}>
          {!isAuthenticated ? (
            <>
              <Link to="/login">
                <button className="relative overflow-hidden group px-6 py-2.5 text-white font-medium rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg border border-[#2b2b2b]  bg-[#1c1c1c] active:scale-95 cursor-pointer">
                  <span className="relative z-10">Log in</span>

                </button>
              </Link>
              <Link to="/signup">
                <button className="relative overflow-hidden group px-6 py-2.5 text-white font-medium rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg border border-[#2b2b2b]  bg-[#3d3d3d] active:scale-95 cursor-pointer">
                  <span className="relative z-10">Sign up</span>

                </button>
              </Link>
            </>
          ) : (

            <img
              src={user.avatar || "/default-avatar.png"}
              onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
              onClick={() => setMenuOpen((prev) => !prev)}
              alt={user.username}
              className="object-cover h-10 w-10 rounded-full cursor-pointer"

            />

          )}
          {menuOpen && (
            <div className="absolute right-0 top-14 w-56 bg-[#212121] backdrop-blur-md rounded-xl shadow-2xl border border-[#282828] z-50 text-white overflow-hidden animate-in slide-in-from-top-2 duration-200">
              <div className="p-2">
                <Link
                  to={`/channel/${user?.username}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-[#404040] rounded-lg transition-all duration-200 group"
                >
                  <User className="w-4 h-4 text-gray-400  transition-colors duration-200" />
                  <span className="text-sm font-medium group-hover:text-white transition-colors duration-200">Profile</span>
                </Link>

                <button className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-[#404040] rounded-lg transition-all duration-200 group">
                  <Settings className="w-4 h-4 text-gray-400 group-hover:text-gray-300 transition-colors duration-200" />
                  <span className="text-sm font-medium group-hover:text-white transition-colors duration-200">Settings</span>
                </button>

                <div className="h-px bg-gray-700/50 my-2"></div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-red-500/10 rounded-lg transition-all duration-200 group"
                >
                  <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-400 transition-colors duration-200" />
                  <span className="text-sm font-medium text-gray-300 group-hover:text-red-400 transition-colors duration-200">Log Out</span>
                </button>
              </div>
            </div>
          )}



        </div>
      </nav>
    </div>
  );
}

export default Navbar;
