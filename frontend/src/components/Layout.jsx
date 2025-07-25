import React from 'react';
import Sidebar from "../components/SideBar";
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className="flex bg-black text-white">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-4">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
