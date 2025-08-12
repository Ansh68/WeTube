import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ListVideo, Clock, User, Settings, Youtube, Menu } from 'lucide-react';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/', icon: <Home size={20} /> },
    { label: 'Subscriptions', path: '/subscriptions', icon: <Youtube size={20} /> },
    { label: 'Playlist', path: '/playlist', icon: <ListVideo size={20} /> },
    { label: 'History', path: '/history', icon: <Clock size={20} /> },
    { label: 'Dashboard', path: '/dashboard', icon: <User size={20} /> },
    { label: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className={`h-screen bg-black text-white p-4 transition-all duration-300 ${collapsed ? 'w-20' : 'w-60'} hidden sm:block`}>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mb-6 ml-3 mt-2 cursor-pointer focus:outline-none text-gray-300 hover:text-white"
      >
        <Menu />
      </button>

      <nav className="flex flex-col gap-4">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`flex ${collapsed ? 'flex-col items-center' : 'flex-row items-center'} gap-2  px-2 py-2 rounded hover:bg-[#1e1e1e] text-sm transition-all duration-200 ${location.pathname === item.path ? 'bg-[#1e1e1e]' : ''}`}
          >
            <div className="text-xl  ">{item.icon}</div>
            <span className={`${collapsed ? 'text-xs text-center' : ''}`}>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
