import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { BarChart2, ListVideo } from "lucide-react";


const tabs = [
    { to: "/dashboard/stats", label: "Stats", Icon: BarChart2 },
    { to: "/dashboard/content", label: "Content", Icon: ListVideo },
];

export default function Dashboard() {
    return (
        <div className="flex min-h-screen bg-black text-white">
            
            <aside className="w-60 shrink-0 border-r border-zinc-800 bg-zinc-900 p-6">
                <h1 className="mb-8 text-xl font-semibold tracking-wide">Dashboard</h1>
                <nav className="space-y-1">
                    {tabs.map(({ to, label, Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm transition-colors ${isActive ? "bg-[#aaa9a933] text-white shadow-lg" : "text-gray-300 hover:bg-zinc-800"
                                }`
                            }
                        >
                            <Icon size={16} /> {label}
                        </NavLink>
                    ))}
                </nav>
            </aside>

            
            <main className="flex-1 overflow-y-auto p-6">
                <Outlet /> 
            </main>
        </div>
    );
}
