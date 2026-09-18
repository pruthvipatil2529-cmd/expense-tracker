import React, { useState, useEffect } from 'react';
import {
    Wallet,
    TrendingUp,
    TrendingDown,
    Plus,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    LayoutGrid
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTransaction } from '../context/TransactionContext';
import { motion } from 'framer-motion';
import AddTransactionModal from '../components/AddTransactionModal';

const Dashboard = () => {
    const navigate = useNavigate();
    const { balance, income, expense, transactions } = useTransaction();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [topCategories, setTopCategories] = useState([]);

    useEffect(() => {
        // Basic top-3 categories calculation from current transactions
        const expenses = transactions.filter(t => t.type === 'Expense');
        const catTotals = expenses.reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
            return acc;
        }, {});

        const sorted = Object.entries(catTotals)
            .map(([name, total]) => ({ name, total }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 3);

        setTopCategories(sorted);
    }, [transactions]);

    const formatCurrency = (amt) => new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    }).format(amt);

    return (
        <div className="space-y-10 max-w-7xl mx-auto">
            {/* Hero Section: Summary at a Glance */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Balance Card */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[30px] md:rounded-[40px] p-6 sm:p-10 shadow-2xl shadow-blue-500/20 group"
                >
                    <div className="absolute top-0 right-0 p-4 sm:p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                        <Wallet size={160} className="md:w-[200px] md:h-[200px]" />
                    </div>

                    <div className="relative z-10">
                        <p className="text-blue-100/80 font-bold uppercase tracking-widest text-[10px] md:text-xs mb-2 md:mb-4">Current Net Worth</p>
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 md:mb-10 tabular-nums tracking-tighter truncate">
                            {formatCurrency(balance)}
                        </h1>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:w-fit">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-white text-blue-700 font-black py-3.5 md:py-4 px-6 md:px-8 rounded-xl md:rounded-2xl flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl text-sm md:text-base"
                            >
                                <Plus size={20} />
                                ADD TRANSACTION
                            </button>
                            <button
                                onClick={() => navigate('/analytics')}
                                className="bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold py-3.5 md:py-4 px-6 md:px-8 rounded-xl md:rounded-2xl flex items-center justify-center gap-3 hover:bg-white/20 active:scale-[0.98] transition-all text-sm md:text-base cursor-pointer"
                            >
                                VIEW INSIGHTS
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[25px] md:rounded-[35px] p-6 md:p-8 flex items-center justify-between group"
                    >
                        <div>
                            <p className="text-slate-500 text-[10px] md:text-xs font-black uppercase tracking-widest mb-1 md:mb-2">Total Yield</p>
                            <p className="text-2xl md:text-3xl font-bold text-emerald-400 tabular-nums">{formatCurrency(income)}</p>
                        </div>
                        <div className="bg-emerald-500/10 p-3 md:p-4 rounded-xl md:rounded-2xl text-emerald-400 group-hover:scale-110 transition-transform">
                            <TrendingUp size={28} className="md:w-8 md:h-8" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[25px] md:rounded-[35px] p-6 md:p-8 flex items-center justify-between group"
                    >
                        <div>
                            <p className="text-slate-500 text-[10px] md:text-xs font-black uppercase tracking-widest mb-1 md:mb-2">Cash Outflow</p>
                            <p className="text-2xl md:text-3xl font-bold text-rose-400 tabular-nums">{formatCurrency(Math.abs(expense))}</p>
                        </div>
                        <div className="bg-rose-500/10 p-3 md:p-4 rounded-xl md:rounded-2xl text-rose-400 group-hover:scale-110 transition-transform">
                            <TrendingDown size={28} className="md:w-8 md:h-8" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Grid: Top Categories & Recent Activity */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Top Categories */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-slate-900/30 backdrop-blur-md border border-white/5 rounded-[40px] p-10"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-black flex items-center gap-4">
                            <LayoutGrid className="text-blue-400" />
                            TOP CATEGORIES
                        </h2>
                        <button className="text-slate-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">See All</button>
                    </div>

                    <div className="space-y-6">
                        {topCategories.length === 0 ? (
                            <p className="text-slate-600 italic">No data available for categories.</p>
                        ) : topCategories.map((cat, i) => (
                            <div key={cat.name} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-black text-slate-300 uppercase tracking-wider">{cat.name}</span>
                                    <span className="font-bold text-white">{formatCurrency(cat.total)}</span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(cat.total / Math.max(...topCategories.map(c => c.total))) * 100}%` }}
                                        transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                                        className={`h-full bg-gradient-to-r ${i === 0 ? 'from-blue-500 to-indigo-500' : i === 1 ? 'from-emerald-500 to-teal-500' : 'from-purple-500 to-pink-500'}`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-slate-900/30 backdrop-blur-md border border-white/5 rounded-[30px] md:rounded-[40px] p-6 md:p-10"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl md:text-2xl font-black flex items-center gap-4">
                            <Clock className="text-blue-400" />
                            RECENT ACTIVITY
                        </h2>
                        <button className="text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">History</button>
                    </div>

                    <div className="space-y-4">
                        {transactions.slice(0, 5).map((tx) => (
                            <div key={tx.id} className="group bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl p-4 flex items-center justify-between transition-all gap-4">
                                <div className="flex items-center gap-3 md:gap-4 min-w-0">
                                    <div className={`p-2.5 md:p-3 rounded-xl shrink-0 ${tx.type === 'Income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                        {tx.type === 'Income' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-black text-slate-100 text-xs md:text-sm truncate">{tx.description}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[9px] md:text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-slate-400 font-bold uppercase tracking-wider truncate">{tx.category}</span>
                                            <span className="text-[9px] md:text-[10px] text-slate-500 font-medium shrink-0">{new Date(tx.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                                        </div>
                                    </div>
                                </div>
                                <p className={`text-base md:text-lg font-black tabular-nums shrink-0 ${tx.type === 'Income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {tx.type === 'Income' ? '+' : '-'}{new Intl.NumberFormat('en-IN').format(Math.abs(tx.amount))}
                                </p>
                            </div>
                        ))}
                        {transactions.length === 0 && (
                            <p className="text-slate-600 italic text-center py-10">No recent activity.</p>
                        )}
                    </div>
                </motion.div>
            </section>

            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default Dashboard;
