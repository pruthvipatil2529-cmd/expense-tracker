import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30 overflow-hidden">
            {/* Background patterns */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]"></div>
            </div>

            {/* Sidebar with mobile drawer state */}
            <Sidebar isMobileOpen={isSidebarOpen} setIsMobileOpen={setIsSidebarOpen} />

            <div className="flex-1 flex flex-col relative z-10 overflow-hidden h-screen bg-slate-950/20 backdrop-blur-[2px]">
                <Header onToggleSidebar={() => setIsSidebarOpen(true)} />
                <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
