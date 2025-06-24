import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Search from './Search';
import axios from 'axios';
import { logout } from '../../store/authSlice';

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

        <div className="flex items-center gap-4" ref = {menuref}>
          {!isAuthenticated ? (
            <>
              <Link to="/login">
                <button className="hover:bg-gray-800 mr-1 rounded transition-all duration-150 px-4 py-2">
                  Log In
                </button>
              </Link>
              <Link to="/signup">
                <button className="hover:bg-[#1e424b] mr-1 rounded bg-[#004D61] px-4 py-2 text-white transition-all duration-150">
                  Sign Up
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
            <div className="absolute right-0 top-12 mt-2 w-48 bg-[#212121] rounded-md shadow-lg border border-[#333] z-50 text-white">
              <Link to={`/channel/${user.username}`}
                
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 hover:bg-[#383838] text-sm"
              >
                Profile
              </Link>

              <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-[#383838] text-sm text-red-400">
                Log Out
              </button>
            </div>
          )}

        </div>
      </nav>
    </div>
  );
}

export default Navbar;
