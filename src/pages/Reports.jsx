import React, { useState, useEffect } from 'react';
import {
    FileText,
    Download,
    Clock,
    CheckCircle2,
    AlertCircle,
    FileSpreadsheet,
    File as FileIcon,
    Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL !== 'undefined' 
    ? import.meta.env.VITE_API_URL 
    : 'http://localhost:5000';

const Reports = () => {
    const { currentUser } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const fetchRequests = async () => {
        try {
            const resp = await fetch(`${API_URL}/api/reports?userId=${currentUser.id}`);
            const data = await resp.json();
            setRequests(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchRequests();
        const interval = setInterval(fetchRequests, 10000); // Poll for status changes
        return () => clearInterval(interval);
    }, [currentUser]);

    const requestReport = async (type) => {
        if (!startDate || !endDate) {
            alert("Please select both Start and End dates.");
            return;
        }
        setLoading(true);
        try {
            const resp = await fetch(`${API_URL}/api/reports/request`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    userId: currentUser.id, 
                    type,
                    startDate,
                    endDate
                })
            });
            if (resp.ok) {
                fetchRequests();
                // Reset dates after request
                setStartDate('');
                setEndDate('');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 md:space-y-12 max-w-7xl mx-auto pb-20">
            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[30px] md:rounded-[40px] p-6 md:p-10">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                    <div className="max-w-md">
                        <h1 className="text-3xl md:text-5xl font-black mb-3 tracking-tighter text-white">Reports Central</h1>
                        <p className="text-slate-400 font-medium text-sm md:text-base leading-relaxed">Select a custom time period to generate your comprehensive financial audit.</p>
                    </div>

                    <div className="w-full lg:w-auto bg-slate-950/60 p-4 md:p-8 rounded-[32px] md:rounded-[40px] border border-white/5 flex flex-col sm:flex-row gap-6 items-end shadow-2xl relative overflow-hidden group">
                        {/* Decorative background pulse */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/5 rounded-full blur-3xl group-hover:bg-blue-600/10 transition-all duration-700" />
                        
                        <div className="flex-1 sm:w-48 relative">
                            <label className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3 ml-1">
                                <Clock size={12} /> Start Date
                            </label>
                            <div className="relative group/input">
                                <input 
                                    type="date" 
                                    value={startDate}
                                    min="2000-01-01"
                                    max="2100-12-31"
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white transition-all hover:bg-white/[0.08] cursor-pointer"
                                />
                                <style dangerouslySetInnerHTML={{ __html: `
                                    input[type="date"]::-webkit-calendar-picker-indicator {
                                        filter: invert(1);
                                        opacity: 0.5;
                                        cursor: pointer;
                                    }
                                    input[type="date"]::-webkit-calendar-picker-indicator:hover {
                                        opacity: 1;
                                    }
                                `}} />
                            </div>
                        </div>

                        <div className="flex-1 sm:w-48 relative">
                            <label className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3 ml-1">
                                <Clock size={12} /> End Date
                            </label>
                            <div className="relative group/input">
                                <input 
                                    type="date" 
                                    value={endDate}
                                    min="2000-01-01"
                                    max="2100-12-31"
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white transition-all hover:bg-white/[0.08] cursor-pointer"
                                />
                            </div>
                        </div>

                        <button
                            onClick={() => requestReport('PDF')}
                            disabled={loading}
                            className="w-full sm:w-auto h-[54px] flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-10 rounded-2xl font-black transition-all text-sm shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 active:scale-95 group/btn"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Download size={20} className="group-hover/btn:-translate-y-0.5 transition-transform" />
                                    REQUEST PDF
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Requests Hub */}
            <section className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[30px] md:rounded-[40px] p-6 md:p-10">
                <div className="flex items-center gap-4 mb-8 md:mb-10">
                    <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl md:rounded-2xl">
                        <Clock size={20} className="md:w-6 md:h-6" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Statement Archive</h2>
                </div>

                <div className="grid grid-cols-1 gap-4 md:gap-6">
                    {requests.length === 0 ? (
                        <div className="text-center py-12 md:py-20 text-slate-500 flex flex-col items-center gap-4">
                            <FileText size={48} className="text-slate-700 opacity-50" />
                            <p className="font-bold italic text-lg text-slate-400">No statements found.</p>
                            <p className="text-xs text-slate-600 max-w-xs leading-relaxed">Generated statements will appear here for 30 days.</p>
                        </div>
                    ) : (
                        requests.map((req) => (
                            <div key={req.id} className="group bg-slate-950/40 border border-white/5 rounded-2xl md:rounded-3xl p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between transition-all hover:bg-slate-800/40 gap-4 border-l-4 border-l-blue-500/30">
                                <div className="flex items-center gap-4 md:gap-6 min-w-0">
                                    <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl shrink-0 ${req.type === 'PDF' ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-500/10 text-slate-500 gray-scale'}`}>
                                        <FileIcon size={20} className="md:w-6 md:h-6" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-1">
                                            <p className="text-base md:text-lg font-black text-white">{req.type} Statement</p>
                                            <span className={`px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-black uppercase border shrink-0 ${req.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                                req.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                                    'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                                }`}>
                                                {req.status}
                                            </span>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] md:text-xs text-slate-400 font-bold flex items-center gap-2">
                                                <Plus size={10} /> RANGE: {new Date(req.start_date).toLocaleDateString()} - {new Date(req.end_date).toLocaleDateString()}
                                            </p>
                                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                                                <Clock size={10} /> REQUESTED ON {new Date(req.requested_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                    {req.status === 'Approved' && req.type === 'PDF' ? (
                                        <a
                                            href={`${API_URL}/api/reports/export?reportId=${req.id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-black px-6 py-3 rounded-xl transition-all shadow-xl shadow-blue-500/20 w-full sm:w-auto text-xs active:scale-95"
                                        >
                                            <Download size={16} /> DOWNLOAD PDF
                                        </a>
                                    ) : req.status === 'Approved' && req.type !== 'PDF' ? (
                                        <div className="text-[10px] text-rose-500/60 font-black px-4 py-2 bg-rose-500/5 rounded-xl border border-rose-500/10">FORMAT RESTRICTED</div>
                                    ) : req.status === 'Pending' && (
                                        <p className="text-xs text-blue-400 italic font-black px-4 py-2 border border-blue-500/20 bg-blue-500/10 rounded-xl">Processing PDF...</p>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Educational Footer */}
            <div className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-2xl md:rounded-[30px] p-6 md:p-8 border border-blue-500/20 flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
                <div className="bg-blue-500 text-white p-3 rounded-xl md:rounded-2xl shrink-0">
                    <AlertCircle size={24} />
                </div>
                <div className="text-center md:text-left">
                    <h4 className="font-black text-blue-400 text-xs md:text-sm uppercase tracking-widest mb-1">Financial Expert Tip</h4>
                    <p className="text-[11px] md:text-xs text-slate-400 leading-relaxed max-w-2xl">
                        Verification typically completes in under 2 minutes. Check your <strong>notifications hub</strong> for instant approval alerts and one-tap download access.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Reports;
