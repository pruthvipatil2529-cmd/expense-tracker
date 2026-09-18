import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTransaction } from '../context/TransactionContext';
import {
    FaPlus, FaWallet, FaArrowUp, FaArrowDown,
    FaHistory, FaChartPie, FaSignOutAlt, FaTimes
} from 'react-icons/fa';
import CategoryChart from './CategoryChart';

const UserDashboard = () => {
    const { currentUser, logout } = useAuth();
    const {
        balance, income, expense, transactions,
        newTransaction, handleInputChange,
        handleAddTransaction, deleteTransaction,
        serverError, categories, fetchCategories // Added fetchCategories
    } = useTransaction();

    const [isModalOpen, setIsModalOpen] = useState(false);

    // Personalized greeting
    const username = currentUser?.email ? currentUser.email.split('@')[0] : 'User';

    // Formatting
    const formatINR = (amt) => new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    }).format(Math.abs(amt));

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans p-4 md:p-8">
            <div className="max-w-6xl mx-auto">

                {/* Header Section */}
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                            Hello, {username.charAt(0).toUpperCase() + username.slice(1)}!
                        </h1>
                        <p className="text-slate-400 mt-2">Track your daily life expenses with style.</p>
                    </div>
                    <button
                        onClick={logout}
                        className="bg-slate-800/50 hover:bg-red-500/20 text-red-400 p-3 rounded-full transition-all border border-slate-700/50"
                        title="Logout"
                    >
                        <FaSignOutAlt size={20} />
                    </button>
                </header>

                {/* Server Error Banner */}
                {serverError && (
                    <div className="bg-rose-500/20 border border-rose-500/50 text-rose-400 p-4 rounded-3xl mb-8 flex items-center gap-3">
                        <FaTimes className="text-xl" />
                        <div>
                            <p className="font-bold">Server is Offline</p>
                            <p className="text-sm">Unable to connect to the database. Showing cached/empty data.</p>
                        </div>
                    </div>
                )}

                {/* Top Grid: Balance & Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Main Balance Card */}
                    <div className="relative overflow-hidden group col-span-1 md:col-span-1 bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 shadow-2xl shadow-blue-500/20">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <FaWallet size={120} />
                        </div>
                        <h2 className="text-blue-100 font-semibold mb-2 flex items-center gap-2">
                            <FaWallet /> Total Balance
                        </h2>
                        <p className="text-5xl font-black mb-6">
                            {balance < 0 ? '-' : ''}{formatINR(balance)}
                        </p>
                        <button
                            onClick={() => {
                                fetchCategories();
                                setIsModalOpen(true);
                            }}
                            className="bg-white text-blue-700 font-bold py-3 px-6 rounded-2xl flex items-center gap-2 hover:bg-blue-50 transition-colors shadow-lg"
                        >
                            <FaPlus /> Quick Add
                        </button>
                    </div>

                    {/* Stats Group */}
                    <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Income Card */}
                        <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 flex items-center gap-6">
                            <div className="bg-emerald-500/20 p-4 rounded-2xl text-emerald-400">
                                <FaArrowUp size={28} />
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm font-medium">Income</p>
                                <p className="text-3xl font-bold text-emerald-400">{formatINR(income)}</p>
                            </div>
                        </div>

                        {/* Expense Card */}
                        <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 flex items-center gap-6">
                            <div className="bg-rose-500/20 p-4 rounded-2xl text-rose-400">
                                <FaArrowDown size={28} />
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm font-medium">Expenses</p>
                                <p className="text-3xl font-bold text-rose-400">{formatINR(expense)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content: Chart & History */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Transactions History */}
                    <div className="lg:col-span-2 bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-3xl p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <FaHistory className="text-blue-400" /> Recent Activity
                            </h2>
                        </div>

                        <div className="space-y-4">
                            {(!Array.isArray(transactions) || transactions.length === 0) ? (
                                <div className="text-center py-20 text-slate-500">
                                    <p className="text-xl mb-2">No data yet.</p>
                                    <p>Start by adding your first transaction!</p>
                                </div>
                            ) : (
                                transactions.slice(0, 8).map((tx) => (
                                    <div key={tx.id} className="group bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/30 rounded-2xl p-4 flex items-center justify-between transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-xl ${tx.type === 'Income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                                {tx.type === 'Income' ? <FaArrowUp /> : <FaArrowDown />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-100">{tx.description}</p>
                                                <div className="flex gap-2 text-xs text-slate-400 mt-1">
                                                    <span className="bg-slate-700/50 px-2 py-0.5 rounded uppercase tracking-wider">{tx.category}</span>
                                                    <span>{new Date(tx.date).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <p className={`text-lg font-bold ${tx.type === 'Income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                {tx.type === 'Income' ? '+' : '-'}{formatINR(tx.amount)}
                                            </p>
                                            {/* Optional: Delete button */}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Chart Section */}
                    <div className="lg:col-span-1 bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-3xl p-8">
                        <h2 className="text-2xl font-bold flex items-center gap-3 mb-8">
                            <FaChartPie className="text-purple-400" /> Spending
                        </h2>
                        <div className="h-64 flex items-center justify-center">
                            <CategoryChart transactions={transactions} />
                        </div>
                    </div>

                </div>

                {/* Footer Quote */}
                <footer className="mt-12 text-center text-slate-600 text-sm">
                    "Do not save what is left after spending, but spend what is left after saving." - Warren Buffett
                </footer>
            </div>

            {/* QUICK ADD MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                        >
                            <FaTimes size={24} />
                        </button>

                        <div className="p-8">
                            <h2 className="text-2xl font-bold mb-6">Add Transaction</h2>
                            <form onSubmit={(e) => { handleAddTransaction(e); setIsModalOpen(false); }}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Description</label>
                                        <input
                                            name="description"
                                            value={newTransaction.description}
                                            onChange={handleInputChange}
                                            className="w-full bg-slate-800 border-none rounded-2xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
                                            placeholder="Rent, Groceries, Salary..."
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Amount</label>
                                            <input
                                                name="amount"
                                                type="number"
                                                value={newTransaction.amount}
                                                onChange={handleInputChange}
                                                className="w-full bg-slate-800 border-none rounded-2xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
                                                placeholder="0.00"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Type</label>
                                            <select
                                                name="type"
                                                value={newTransaction.type}
                                                onChange={handleInputChange}
                                                className="w-full bg-slate-800 border-none rounded-2xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            >
                                                <option value="Expense">Expense</option>
                                                <option value="Income">Income</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Category</label>
                                        <select
                                            name="category"
                                            value={newTransaction.category}
                                            onChange={handleInputChange}
                                            className="w-full bg-slate-800 border-none rounded-2xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        >
                                            <option value="Other">Other</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.name}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl mt-4 shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        <FaPlus /> Save Transaction
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
