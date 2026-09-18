import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    FaUsers, FaExchangeAlt, FaExclamationTriangle, FaSignOutAlt, FaChartLine,
    FaTrash, FaEdit, FaCheckCircle, FaTimesCircle, FaShoppingCart, FaUtensils,
    FaCar, FaHome, FaFilm, FaHeartbeat, FaGraduationCap, FaPlane, FaPlus,
    FaUserSlash, FaReceipt, FaTags, FaDatabase, FaBan, FaUnlock, FaBars, FaTimes
} from 'react-icons/fa';
import { MdDashboard, MdCategory } from 'react-icons/md';
import AdminCategories from './AdminCategories';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Initial state templates
const initialStats = {
    totalUsers: 0,
    totalVolume: 0,
    transactionsToday: 0,
    totalIncome: 0,
    totalExpense: 0,
    systemHealth: 'Loading...',
};

const AdminDashboard = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // --- REAL STATE ---
    const [users, setUsers] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [filterType, setFilterType] = useState('All');
    const [stats, setStats] = useState(initialStats);
    const [reports, setReports] = useState([]);
    const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());

    // --- FETCH LOGIC ---
    const fetchAdminData = async () => {
        if (!currentUser) return;

        try {
            const isUserAdmin = currentUser.role === 'admin';

            // Build query params
            const txUrl = isUserAdmin
                ? `${API_URL}/api/transactions`
                : `${API_URL}/api/transactions?userId=${currentUser.id}`;

            // Fetch stats, users, and transactions in parallel
            const [statsRes, usersRes, txRes, chartRes, reportsRes] = await Promise.all([
                fetch(`${API_URL}/api/admin/stats`),
                fetch(`${API_URL}/api/users`),
                fetch(txUrl),
                fetch(`${API_URL}/api/admin/chart-data`),
                fetch(`${API_URL}/api/reports`)
            ]);

            const statsData = await statsRes.json();
            const usersData = await usersRes.json();
            const txData = await txRes.json();
            const chartDataJson = await chartRes.json();
            const reportsData = await reportsRes.json();

            setStats(statsData);
            setUsers(Array.isArray(usersData) ? usersData : []);
            setTransactions(Array.isArray(txData) ? txData : []);
            setChartData(Array.isArray(chartDataJson) ? chartDataJson : []);
            setReports(Array.isArray(reportsData) ? reportsData : []);
            setLastUpdated(new Date().toLocaleTimeString());
        } catch (error) {
            console.error("Fetch Error:", error);
        }
    };

    const handleApproveReport = async (reportId) => {
        // Automatically generate a local download link instead of prompting the user
        const fileUrl = `${API_URL}/api/reports/export?reportId=${reportId}`;

        try {
            const resp = await fetch(`${API_URL}/api/reports/approve`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reportId, fileUrl })
            });
            if (resp.ok) {
                fetchAdminData();
                alert("Report Auto-Generated & Approved!");
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchAdminData(); // Initial load

        // Polling loop (every 5 seconds)
        const interval = setInterval(fetchAdminData, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    // --- INTERACTIVITY HANDLERS ---

    // Toggle User Block/Unblock Status
    const toggleUserStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'Active' ? 'Blocked' : 'Active'; // For UI logic
        const apiStatus = currentStatus === 'Active' ? 'blocked' : 'active';   // For API logic

        if (window.confirm(`Are you sure you want to ${newStatus} this user?`)) {
            try {
                // Call API
                const response = await fetch(`${API_URL}/api/users/status`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id, status: apiStatus })
                });

                if (response.ok) {
                    // Update Local State
                    setUsers(users.map(user =>
                        user.id === id ? { ...user, status: newStatus } : user
                    ));
                } else {
                    alert("Failed to update status on server.");
                }
            } catch (error) {
                console.error("Error updating status:", error);
                // Fallback for demo mode if server interaction fails locally
                setUsers(users.map(user =>
                    user.id === id ? { ...user, status: newStatus } : user
                ));
            }
        }
    };

    const handleDeleteUser = (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            setUsers(users.filter(user => user.id !== id));
        }
    };

    const handleDeleteTransaction = (id) => {
        if (window.confirm("Delete this transaction?")) {
            setTransactions(transactions.filter(tx => tx.id !== id));
        }
    }

    // Filter transactions
    const safeTransactions = Array.isArray(transactions) ? transactions : [];
    const filteredTransactions = safeTransactions.filter(tx => {
        if (filterType === 'All') return true;
        return tx.type === filterType;
    });


    // Render Content Based on Active Tab
    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <>
                        <header className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-800">Overview</h2>
                                <p className="text-xs text-blue-600 font-bold mt-1 uppercase tracking-widest flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    Live Sync Active • Last Update: {lastUpdated}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-sm text-gray-500">Welcome, DailyLife Admin</div>
                                <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">A</div>
                            </div>
                        </header>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <StatCard title="Total Users" value={stats.totalUsers} icon={<FaUsers />} color="bg-blue-500" />
                            <StatCard title="Total Profits (Inc)" value={`₹${Number(stats.totalIncome || 0).toLocaleString()}`} icon={<FaChartLine />} color="bg-emerald-500" />
                            <StatCard title="Total Expenses" value={`₹${Math.abs(Number(stats.totalExpense || 0)).toLocaleString()}`} icon={<FaShoppingCart />} color="bg-rose-500" />
                            <StatCard title="Transactions Today" value={stats.transactionsToday} icon={<FaExchangeAlt />} color="bg-purple-500" />
                        </div>

                        {/* Charts Area */}
                        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/20">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Expense Breakdown</h3>
                                <div className="h-64 flex flex-col justify-end gap-3 p-4">
                                    {Array.isArray(chartData) && chartData.length > 0 ? (
                                        <div className="flex items-end justify-around h-full gap-4">
                                            {chartData.map((d, i) => {
                                                const totalExp = Math.max(Math.abs(Number(stats.totalExpense)), 1);
                                                const barHeight = Math.min((Number(d.total) / totalExp) * 100, 100);
                                                return (
                                                    <div key={i} className="flex flex-col items-center gap-2 flex-1 h-full justify-end">
                                                        <div
                                                            className="w-full bg-blue-500 hover:bg-blue-400 rounded-t-lg transition-all duration-700 shadow-[0_-4px_10px_rgba(59,130,246,0.3)]"
                                                            style={{
                                                                height: `${barHeight}%`,
                                                                minHeight: '15px'
                                                            }}
                                                        ></div>
                                                        <span className="text-[10px] font-black text-gray-400 truncate w-full text-center uppercase tracking-tighter">{d.category}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-gray-400 border border-dashed border-gray-300 rounded-xl">
                                            <FaChartLine className="text-4xl mb-2 opacity-30" />
                                            <p>No expense data available</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/20">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
                                <div className="space-y-4">
                                    {Array.isArray(transactions) && transactions.length > 0 ? (
                                        transactions.slice(0, 4).map((tx) => (
                                            <div key={tx.id} className="flex items-center gap-3 p-3 hover:bg-white/50 rounded-lg transition-colors cursor-pointer">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${tx.type === 'Income' ? 'bg-green-500' : 'bg-red-500'}`}>
                                                    {tx.type === 'Income' ? '+' : '-'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-700">{tx.description}</p>
                                                    <p className="text-xs text-gray-500">{tx.date}</p>
                                                </div>
                                                <div className="ml-auto font-bold text-sm text-gray-700">
                                                    ₹{Math.abs(tx.amount).toLocaleString()}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-gray-400">
                                            <FaReceipt className="text-3xl mx-auto mb-2 opacity-30" />
                                            <p className="text-sm">No recent activity</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    </>
                );
            case 'users':
                return (
                    <div className="animate-fade-in-up">
                        <header className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold text-gray-800">User Management</h2>

                        </header>
                        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/20">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/50 border-b border-gray-200 text-gray-500 uppercase text-xs tracking-wider">
                                            <th className="p-4 font-semibold">User</th>
                                            <th className="p-4 font-semibold">Status</th>
                                            <th className="p-4 font-semibold">Joined</th>
                                            <th className="p-4 font-semibold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {Array.isArray(users) && users.length > 0 ? (
                                            users.map((user) => (
                                                <tr key={user.id} className="hover:bg-white/60 transition-colors">
                                                    <td className="p-4">
                                                        <div className="font-bold text-gray-800">{user.name}</div>
                                                        <div className="text-sm text-gray-500">{user.email}</div>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                            }`}>
                                                            {user.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-sm text-gray-600">{user.joined}</td>
                                                    <td className="p-4 text-right space-x-2 flex justify-end">
                                                        {/* Block/Unblock Button */}
                                                        {user.status === 'Active' ? (
                                                            <button
                                                                onClick={() => toggleUserStatus(user.id, 'Active')}
                                                                className="flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                                                                title="Block User"
                                                            >
                                                                <FaBan /> Block
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => toggleUserStatus(user.id, 'Blocked')}
                                                                className="flex items-center gap-1 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                                                                title="Unblock User"
                                                            >
                                                                <FaUnlock /> Unblock
                                                            </button>
                                                        )}

                                                        <button
                                                            onClick={() => handleDeleteUser(user.id)}
                                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete Permanently"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="p-12 text-center">
                                                    <div className="flex flex-col items-center justify-center text-gray-400">
                                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                            <FaUserSlash className="text-2xl" />
                                                        </div>
                                                        <h3 className="text-lg font-bold text-gray-600">No Users Found</h3>
                                                        <p className="text-sm">The user database is currently empty.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );
            case 'transactions':
                return (
                    <div className="animate-fade-in-up">
                        <header className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold text-gray-800">All Transactions</h2>
                            <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
                                {['All', 'Income', 'Expense'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setFilterType(type)}
                                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filterType === type
                                            ? 'bg-blue-100 text-blue-700 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </header>
                        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/20">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/50 border-b border-gray-200 text-gray-500 uppercase text-xs tracking-wider">
                                            <th className="p-4 font-semibold">Date</th>
                                            <th className="p-4 font-semibold">User</th>
                                            <th className="p-4 font-semibold">Category</th>
                                            <th className="p-4 font-semibold">Description</th>
                                            <th className="p-4 font-semibold">Amount</th>
                                            <th className="p-4 font-semibold">Status</th>
                                            <th className="p-4 font-semibold text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredTransactions.length > 0 ? (
                                            filteredTransactions.map((tx) => (
                                                <tr key={tx.id} className="hover:bg-white/60 transition-colors">
                                                    <td className="p-4 text-sm text-gray-600 whitespace-nowrap">{tx.date}</td>
                                                    <td className="p-4 font-medium text-gray-800">{tx.user}</td>
                                                    <td className="p-4">
                                                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                                            {tx.category || 'General'}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-gray-600">{tx.description}</td>
                                                    <td className={`p-4 font-bold ${tx.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>
                                                        {tx.type === 'Income' ? '+' : ''} ₹{Math.abs(tx.amount).toLocaleString()}
                                                    </td>
                                                    <td className="p-4">
                                                        <span className={`flex items-center gap-1 text-xs font-bold ${tx.status === 'Completed' ? 'text-green-600' : 'text-yellow-600'
                                                            }`}>
                                                            {tx.status === 'Completed' ? <FaCheckCircle /> : <FaExclamationTriangle />}
                                                            {tx.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <button
                                                            onClick={() => handleDeleteTransaction(tx.id)}
                                                            className="text-red-400 hover:text-red-600 transition-colors"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="p-12 text-center">
                                                    <div className="flex flex-col items-center justify-center text-gray-400">
                                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                            <FaReceipt className="text-2xl" />
                                                        </div>
                                                        <h3 className="text-lg font-bold text-gray-600">No Transactions</h3>
                                                        <p className="text-sm">No transactions match your criteria.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );
            case 'reports':
                return (
                    <div className="animate-fade-in-up">
                        <header className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold text-gray-800">Report Requests</h2>
                        </header>
                        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/20">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-200 text-gray-500 uppercase text-xs tracking-wider">
                                        <th className="p-4 font-semibold">User</th>
                                        <th className="p-4 font-semibold">Type</th>
                                        <th className="p-4 font-semibold">Requested At</th>
                                        <th className="p-4 font-semibold">Status</th>
                                        <th className="p-4 font-semibold text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {(Array.isArray(reports) ? reports : []).map((r) => (
                                        <tr key={r.id} className="hover:bg-white/60 transition-colors">
                                            <td className="p-4 font-bold text-gray-800">{r.user_email}</td>
                                            <td className="p-4 text-sm text-gray-600 font-bold">{r.type}</td>
                                            <td className="p-4 text-xs text-gray-500">{new Date(r.requested_at).toLocaleString()}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${r.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                                                    }`}>
                                                    {r.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                {r.status === 'Pending' && (
                                                    <button
                                                        onClick={() => handleApproveReport(r.id)}
                                                        className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 transition-all"
                                                    >
                                                        Approve
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'categories':
                return <AdminCategories />;
            default:
                return null;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans relative overflow-hidden">
            {/* Mobile Toggle Button (Visible only on small screens) */}
            <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden fixed top-6 right-6 z-30 p-3 bg-blue-600 text-white rounded-xl shadow-lg ring-4 ring-white"
            >
                <FaBars size={20} />
            </button>

            {/* Backdrop for Mobile Sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 bg-white/80 backdrop-blur-xl border-r border-gray-200 
                flex flex-col justify-between p-6 shadow-2xl transition-all duration-300 ease-out
                lg:translate-x-0 lg:static lg:z-20 lg:w-64 lg:shadow-xl
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div>
                    {/* DailyLife Branding */}
                    <div className="mb-8 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-blue-200">
                                D
                            </div>
                            <div>
                                <h1 className="text-xl font-black text-gray-900 leading-tight">DailyLife</h1>
                                <span className="text-[10px] text-blue-600 font-black uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-full">Admin Panel</span>
                            </div>
                        </div>
                        {/* Close button for mobile */}
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="lg:hidden p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <FaTimes size={20} />
                        </button>
                    </div>

                    <nav className="space-y-1.5">
                        <SidebarButton
                            active={activeTab === 'dashboard'}
                            onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }}
                            icon={<MdDashboard />}
                            label="Dashboard"
                        />
                        <SidebarButton
                            active={activeTab === 'users'}
                            onClick={() => { setActiveTab('users'); setIsSidebarOpen(false); }}
                            icon={<FaUsers />}
                            label="Users"
                        />
                        <SidebarButton
                            active={activeTab === 'transactions'}
                            onClick={() => { setActiveTab('transactions'); setIsSidebarOpen(false); }}
                            icon={<FaExchangeAlt />}
                            label="Transactions"
                        />
                        <SidebarButton
                            active={activeTab === 'reports'}
                            onClick={() => { setActiveTab('reports'); setIsSidebarOpen(false); }}
                            icon={<FaReceipt />}
                            label="Report Requests"
                        />
                        <SidebarButton
                            active={activeTab === 'categories'}
                            onClick={() => { setActiveTab('categories'); setIsSidebarOpen(false); }}
                            icon={<MdCategory />}
                            label="Categories"
                        />
                    </nav>
                </div>

                <div className="pt-6 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 text-red-500 hover:bg-red-50 p-4 rounded-2xl transition-all w-full font-bold text-sm"
                    >
                        <FaSignOutAlt className="text-lg" /> Logout Session
                    </button>
                    <div className="mt-6 text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest">
                        v1.0.2 DailyLife Build
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-4 lg:p-10 overflow-y-auto relative min-w-0">
                {/* Background Blobs */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob"></div>
                    <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob animation-delay-4000"></div>
                </div>

                <div className="max-w-7xl mx-auto">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

// Sub-components 
const SidebarButton = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-200 font-medium ${active
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
            : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
            }`}
    >
        <span className="text-xl">{icon}</span>
        {label}
    </button>
);

const StatCard = ({ title, value, icon, color, valueColor = "text-gray-800" }) => (
    <div className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/20 hover:transform hover:scale-105 transition-all duration-300 group">
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${color} text-white shadow-md group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
        </div>
        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</h3>
        <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
    </div>
);

// Fallback Icon for new categories
const FaCategoryDefault = FaShoppingCart;

export default AdminDashboard;
