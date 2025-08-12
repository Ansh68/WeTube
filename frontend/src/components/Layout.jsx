import React from 'react';
import Sidebar from "../components/SideBar";
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar/Navbar';

const Layout = () => {
    return (
        <div className="flex h-screen overflow-hidden bg-black text-white">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-auto">
                <Navbar />
                <main className="flex-1 overflow-y-auto p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
