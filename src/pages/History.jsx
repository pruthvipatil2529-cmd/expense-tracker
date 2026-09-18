import React, { useState } from 'react';
import { useTransaction } from '../context/TransactionContext';
import {
    Search,
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    Trash2,
    Calendar,
    MoreVertical,
    Download
} from 'lucide-react';
import { motion } from 'framer-motion';

const History = () => {
    const { transactions, deleteTransaction } = useTransaction();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    const filtered = transactions.filter(t => {
        const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = activeFilter === 'All' || t.type === activeFilter;
        return matchesSearch && matchesFilter;
    });

    const formatCurrency = (amt) => new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    }).format(amt);

    return (
        <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto">
            {/* Header & Controls */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black mb-2 tracking-tight text-white">Financial Records</h1>
                    <p className="text-slate-500 font-medium italic text-sm md:text-base">A detailed audit log of all your fiscal activities.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 md:gap-4">
                    {/* Search */}
                    <div className="relative group flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Filter activities..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 w-full focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600 text-sm"
                        />
                    </div>

                    {/* Filter Toggle */}
                    <div className="flex bg-slate-900/50 border border-white/10 rounded-xl p-1 shrink-0 overflow-x-auto max-w-full">
                        {['All', 'Income', 'Expense'].map(f => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={`px-3 md:px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeFilter === f ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all shrink-0">
                        <Download size={20} />
                    </button>
                </div>
            </div>

            {/* Transaction List (Desktop Table / Mobile Cards) */}
            <div className="bg-slate-900/30 backdrop-blur-md border border-white/5 rounded-2xl md:rounded-[40px] overflow-hidden shadow-2xl">
                {/* Desktop View */}
                <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/5">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Transaction</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Category</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Date</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Amount</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-8 py-20 text-center text-slate-600 italic">
                                        No matching records found.
                                    </td>
                                </tr>
                            ) : filtered.map((tx, i) => (
                                <motion.tr
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    key={tx.id}
                                    className="group hover:bg-white/[0.02] transition-colors"
                                >
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2.5 rounded-xl ${tx.type === 'Income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                                {tx.type === 'Income' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-slate-100 group-hover:text-white truncate">{tx.description}</p>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{tx.type}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="bg-slate-800/50 border border-white/5 px-3 py-1 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-wider">
                                            {tx.category}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2 text-slate-400 font-medium text-sm whitespace-nowrap">
                                            <Calendar size={14} className="text-slate-600" />
                                            {new Date(tx.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                                            Settled
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right font-black tabular-nums whitespace-nowrap">
                                        <span className={tx.type === 'Income' ? 'text-emerald-400' : 'text-rose-400'}>
                                            {tx.type === 'Income' ? '+' : '-'}{formatCurrency(Math.abs(tx.amount))}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => deleteTransaction(tx.id)}
                                                className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                            <button className="p-2 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                                                <MoreVertical size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View (Cards) */}
                <div className="lg:hidden divide-y divide-white/5">
                    {filtered.length === 0 ? (
                        <div className="p-10 text-center text-slate-600 italic">No matching records.</div>
                    ) : (
                        filtered.map((tx, i) => (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                key={tx.id}
                                className="p-4 active:bg-white/[0.02]"
                            >
                                <div className="flex items-center justify-between gap-4 mb-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className={`p-2.5 rounded-xl shrink-0 ${tx.type === 'Income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                            {tx.type === 'Income' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-slate-100 text-sm truncate">{tx.description}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="bg-white/5 border border-white/5 px-1.5 py-0.5 rounded text-[9px] font-black text-slate-500 uppercase tracking-wider">{tx.category}</span>
                                                <span className="text-[9px] text-slate-600 font-medium">{new Date(tx.date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteTransaction(tx.id)}
                                        className="p-2 text-slate-600 active:text-rose-500 active:bg-rose-500/10 rounded-lg shrink-0"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between pl-12">
                                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 bg-white/5 px-2 py-0.5 rounded-full">
                                        <div className="w-1 h-1 bg-blue-500 rounded-full" />
                                        Settled
                                    </span>
                                    <p className={`text-base font-black tabular-nums shrink-0 ${tx.type === 'Income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {tx.type === 'Income' ? '+' : '-'}{formatCurrency(Math.abs(tx.amount))}
                                    </p>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default History;
