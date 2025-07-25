import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ListVideo, Clock, User, Settings, Youtube, Menu } from 'lucide-react';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/', icon: <Home /> },
    { label: 'Subscriptions', path: '/subscriptions', icon: <Youtube /> },
    { label: 'Playlist', path: '/playlist', icon: <ListVideo /> },
    { label: 'History', path: '/history', icon: <Clock /> },
    { label: 'You', path: '/dashboard', icon: <User /> },
    { label: 'Settings', path: '/settings', icon: <Settings /> },
  ];

  return (
    <div className={`h-screen bg-gray-900 text-white p-4 transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'} hidden sm:block`}>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mb-6 focus:outline-none text-gray-300 hover:text-white"
      >
        <Menu />
      </button>

      <nav className="flex flex-col gap-4">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`flex items-center gap-4 px-2 py-2 rounded hover:bg-gray-800 ${location.pathname === item.path ? 'bg-gray-800' : ''}`}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
