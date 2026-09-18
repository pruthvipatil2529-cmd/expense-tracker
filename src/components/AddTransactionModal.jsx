import React, { useState } from 'react';
import { X, Plus, DollarSign, Tag, FileText, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTransaction } from '../context/TransactionContext';

const AddTransactionModal = ({ isOpen, onClose }) => {
    const { handleInputChange, newTransaction, handleAddTransaction, categories, fetchCategories } = useTransaction();
    const [localLoading, setLocalLoading] = useState(false);

    React.useEffect(() => {
        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen]);

    const onSubmit = async (e) => {
        e.preventDefault();
        setLocalLoading(true);
        await handleAddTransaction(e);
        setLocalLoading(false);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-slate-900 border border-white/10 rounded-[40px] w-full max-w-lg shadow-2xl relative overflow-hidden z-20"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/5">
                            <h2 className="text-2xl font-black flex items-center gap-3">
                                <div className="p-2 bg-blue-500 rounded-xl text-white">
                                    <Plus size={24} />
                                </div>
                                New Transaction
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={onSubmit} className="p-8 space-y-6">
                            {/* Description */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Description</label>
                                <div className="relative">
                                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        name="description"
                                        value={newTransaction.description}
                                        onChange={handleInputChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600 font-medium"
                                        placeholder="E.g., Luxury Yacht, Stocks, Rent..."
                                        required
                                    />
                                </div>
                            </div>

                            {/* Amount & Type */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Amount (Max 10T)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input
                                            name="amount"
                                            type="number"
                                            max="10000000000000"
                                            value={newTransaction.amount}
                                            onChange={handleInputChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600 font-bold text-emerald-400"
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Type</label>
                                    <select
                                        name="type"
                                        value={newTransaction.type}
                                        onChange={handleInputChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-blue-400 appearance-none cursor-pointer"
                                    >
                                        <option value="Expense" className="bg-slate-900">Expense</option>
                                        <option value="Income" className="bg-slate-900">Income</option>
                                    </select>
                                </div>
                            </div>

                            {/* Category & Date */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Category</label>
                                    <div className="relative">
                                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <select
                                            name="category"
                                            value={newTransaction.category}
                                            onChange={handleInputChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium appearance-none cursor-pointer"
                                        >
                                            <option value="Other" className="bg-slate-900 text-white">Other</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.name} className="bg-slate-900 text-white">
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input
                                            name="date"
                                            type="date"
                                            value={newTransaction.date}
                                            onChange={handleInputChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <button
                                type="submit"
                                disabled={localLoading}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02] active:scale-[0.98] text-white font-black py-5 rounded-[20px] shadow-2xl shadow-blue-500/30 transition-all flex items-center justify-center gap-3 mt-4 disabled:opacity-50"
                            >
                                {localLoading ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <Plus size={20} />
                                        COMPLETE TRANSACTION
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AddTransactionModal;
