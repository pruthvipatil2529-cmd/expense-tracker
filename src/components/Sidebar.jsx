import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    History,
    BarChart3,
    FileText,
    LogOut,
    Settings,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={22} />, path: '/' },
        { name: 'History', icon: <History size={22} />, path: '/history' },
        { name: 'Analytics', icon: <BarChart3 size={22} />, path: '/analytics' },
        { name: 'Reports', icon: <FileText size={22} />, path: '/reports' },
    ];

    return (
        <>
            {/* Overlay/Backdrop (Visible on all screens when open) */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileOpen(false)}
                        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100]"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Aside (Drawer for everyone) */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.aside
                        initial={{ x: -400 }}
                        animate={{ x: 0 }}
                        exit={{ x: -400 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 left-0 z-[101] w-72 md:w-80 bg-slate-900 shadow-2xl shadow-black/50 border-r border-white/10 flex flex-col"
                    >
                        {/* Brand */}
                        <div className="p-6 h-24 flex items-center justify-between border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white shadow-xl shadow-blue-500/30">MT</div>
                                <span className="text-2xl font-black tracking-tighter text-white">
                                    Money Tracker
                                </span>
                            </div>
                            <button
                                onClick={() => setIsMobileOpen(false)}
                                className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                            >
                                <ChevronLeft size={28} />
                            </button>
                        </div>

                        {/* Nav Items */}
                        <nav className="flex-1 mt-6 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                            {menuItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileOpen(false)}
                                    className={({ isActive }) => `
                                        flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group
                                        ${isActive
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-bold'
                                            : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'
                                        }
                                    `}
                                >
                                    <span className="transition-transform group-hover:scale-110">
                                        {item.icon}
                                    </span>
                                    <span className="text-base tracking-wide">{item.name}</span>
                                </NavLink>
                            ))}
                        </nav>

                        {/* Bottom Actions */}
                        <div className="p-6 border-t border-white/5 space-y-2">
                            <button className="w-full flex items-center gap-4 px-5 py-4 text-slate-500 hover:bg-white/5 hover:text-slate-200 rounded-2xl transition-all group">
                                <Settings size={22} className="group-hover:rotate-45 transition-transform" />
                                <span className="text-sm">Settings</span>
                            </button>
                            <button
                                onClick={() => {
                                    logout();
                                    setIsMobileOpen(false);
                                }}
                                className="w-full flex items-center gap-4 px-5 py-4 text-rose-500/80 hover:bg-rose-500/10 hover:text-rose-400 rounded-2xl transition-all group"
                            >
                                <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
                                <span className="text-sm font-semibold">Logout</span>
                            </button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;
