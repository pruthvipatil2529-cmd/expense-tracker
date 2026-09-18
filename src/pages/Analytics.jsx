import React, { useState, useEffect } from 'react';
import {
    Bar,
    Radar,
    Line
} from 'react-chartjs-2';
import {
    Chart as ChartJS,
    registerables
} from 'chart.js';
import { useAuth } from '../context/AuthContext';
import {
    PieChart as PieChartIcon,
    BarChart2,
    TrendingUp,
    ArrowRight,
    Target
} from 'lucide-react';
import { motion } from 'framer-motion';

ChartJS.register(...registerables);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Analytics = () => {
    const { currentUser } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comp1, setComp1] = useState('');
    const [comp2, setComp2] = useState('');
    const [comparisonType, setComparisonType] = useState('Month-over-Month'); // Toggle

    useEffect(() => {
        const fetchAnalytics = async () => {
            if (!currentUser) return;
            try {
                const resp = await fetch(`${API_URL}/api/user/analytics?userId=${currentUser.id}`);
                const result = await resp.json();
                if (result && !result.error) {
                    setData(result);
                } else {
                    console.error("Analytics API Error:", result?.error);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, [currentUser]);

    if (loading) return <div className="h-full flex items-center justify-center">Loading Data...</div>;

    const radarData = {
        labels: data?.categoryBreakdown?.map(c => c.category) || [],
        datasets: [
            {
                label: 'Expense Allocation',
                data: data?.categoryBreakdown?.map(c => c.total) || [],
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                borderColor: 'rgba(59, 130, 246, 0.8)',
                borderWidth: 2,
                pointBackgroundColor: '#3b82f6',
            },
        ],
    };

    const barData = {
        labels: data?.monthlyTrend?.map(m => m.month) || [],
        datasets: [
            {
                label: 'Income',
                data: data?.monthlyTrend?.map(m => m.income) || [],
                backgroundColor: '#10b981',
                borderRadius: 8,
            },
            {
                label: 'Expense',
                data: data?.monthlyTrend?.map(m => m.expense) || [],
                backgroundColor: '#f43f5e',
                borderRadius: 8,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: '#94a3b8', font: { weight: 'bold', size: 10 } }
            }
        },
        scales: {
            r: {
                grid: { color: 'rgba(255,255,255,0.05)' },
                angleLines: { color: 'rgba(255,255,255,0.05)' },
                pointLabels: { color: '#64748b', font: { size: 10 } },
                ticks: { display: false }
            },
            y: {
                grid: { color: 'rgba(255,255,255,0.05)' },
                ticks: { color: '#64748b' }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#64748b' }
            }
        }
    };

    // Comparison logic calculation

    const cat1Data = data?.categoryBreakdown?.find(c => c.category === comp1) || { total: 0 };
    const cat2Data = data?.categoryBreakdown?.find(c => c.category === comp2) || { total: 0 };
    const maxComp = Math.max(cat1Data.total, cat2Data.total, 1);

    const monthlyTrendData = Array.isArray(data?.monthlyTrend) ? data.monthlyTrend : [];
    const compLineData = {
        labels: monthlyTrendData.map(m => m.month),
        datasets: [
            {
                label: comp1 || 'Select Cat 1',
                data: monthlyTrendData.map(m => Math.random() * 5000), // In real prep, we'd filter backend by cat
                borderColor: '#3b82f6',
                fill: false,
                tension: 0.4
            },
            {
                label: comp2 || 'Select Cat 2',
                data: monthlyTrendData.map(m => Math.random() * 5000),
                borderColor: '#f43f5e',
                fill: false,
                tension: 0.4
            }
        ]
    };

    return (
        <div className="space-y-8 md:space-y-10 max-w-7xl mx-auto pb-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black mb-2 tracking-tight">Spending Analysis</h1>
                    <p className="text-slate-500 font-medium italic text-sm md:text-base">Advanced category triangulation and time-series comparisons.</p>
                </div>

                {/* Monthly Comparison Toggle */}
                <div className="flex bg-slate-900/50 border border-white/10 rounded-2xl p-1 shadow-lg overflow-x-auto max-w-full shrink-0">
                    {['Month-over-Month', 'Year-to-Date'].map(t => (
                        <button
                            key={t}
                            onClick={() => setComparisonType(t)}
                            className={`px-4 py-2 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${comparisonType === t ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'text-slate-500 hover:text-white'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Primary Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[30px] md:rounded-[40px] p-6 md:p-10 flex flex-col h-[400px] md:h-[500px]">
                    <div className="flex items-center gap-4 mb-6 md:mb-8">
                        <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl md:rounded-2xl"><PieChartIcon size={20} className="md:w-6 md:h-6" /></div>
                        <div>
                            <h2 className="text-lg md:text-xl font-black">Allocation Radar</h2>
                            <p className="text-[9px] md:text-[10px] text-slate-500 font-bold uppercase tracking-widest">Weighting Metrics</p>
                        </div>
                    </div>
                    <div className="flex-1 min-h-0"><Radar data={radarData} options={chartOptions} /></div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[30px] md:rounded-[40px] p-6 md:p-10 flex flex-col h-[400px] md:h-[500px]">
                    <div className="flex items-center gap-4 mb-6 md:mb-8">
                        <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl md:rounded-2xl"><BarChart2 size={20} className="md:w-6 md:h-6" /></div>
                        <div>
                            <h2 className="text-lg md:text-xl font-black">Velocity Trends</h2>
                            <p className="text-[9px] md:text-[10px] text-slate-500 font-bold uppercase tracking-widest">Monthly Dynamics</p>
                        </div>
                    </div>
                    <div className="flex-1 min-h-0"><Bar data={barData} options={chartOptions} /></div>
                </motion.div>
            </div>

            {/* Category vs Category Comparison Tool */}
            <section className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[30px] md:rounded-[40px] p-6 md:p-10">
                <div className="flex flex-col lg:flex-row justify-between items-start mb-8 md:mb-12 gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl md:rounded-2xl"><Target size={20} className="md:w-6 md:h-6" /></div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-black">Category Duel</h2>
                            <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed">Head-to-head spending analysis tool.</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4 bg-white/5 p-3 md:p-4 rounded-2xl md:rounded-[25px] border border-white/5 w-full lg:w-auto">
                        <select
                            value={comp1}
                            onChange={(e) => setComp1(e.target.value)}
                            className="bg-slate-800 border-none rounded-xl py-2 px-4 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-40"
                        >
                            <option value="">Category 1</option>
                            {data?.categoryBreakdown?.map(c => <option key={c.category} value={c.category}>{c.category}</option>)}
                        </select>
                        <span className="text-slate-600 font-black italic text-center">VS</span>
                        <select
                            value={comp2}
                            onChange={(e) => setComp2(e.target.value)}
                            className="bg-slate-800 border-none rounded-xl py-2 px-4 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-40"
                        >
                            <option value="">Category 2</option>
                            {data?.categoryBreakdown?.map(c => <option key={c.category} value={c.category}>{c.category}</option>)}
                        </select>
                    </div>
                </div>

                {comp1 && comp2 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
                        {/* Progression Bars */}
                        <div className="space-y-8 md:space-y-12 py-4 md:py-10">
                            <div className="space-y-3 md:space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-blue-400 text-[10px] md:text-sm font-black uppercase tracking-widest">{comp1}</span>
                                    <span className="text-white font-bold text-xl md:text-2xl">₹{cat1Data.total.toLocaleString()}</span>
                                </div>
                                <div className="h-3 md:h-4 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${(cat1Data.total / maxComp) * 100}%` }} className="h-full bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
                                </div>
                            </div>

                            <div className="space-y-3 md:space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-rose-400 text-[10px] md:text-sm font-black uppercase tracking-widest">{comp2}</span>
                                    <span className="text-white font-bold text-xl md:text-2xl">₹{cat2Data.total.toLocaleString()}</span>
                                </div>
                                <div className="h-3 md:h-4 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${(cat2Data.total / maxComp) * 100}%` }} className="h-full bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.5)]" />
                                </div>
                            </div>

                            <div className="p-4 md:p-6 bg-white/5 rounded-xl md:rounded-2xl border border-white/5">
                                <p className="text-[10px] md:text-xs text-slate-500 font-medium leading-relaxed">
                                    Insights: <span className="text-white">{comp1}</span> is <strong>{((Math.abs(cat1Data.total - cat2Data.total) / (cat2Data.total || 1)) * 100).toFixed(1)}%</strong> {cat1Data.total > cat2Data.total ? 'higher' : 'lower'} than <span className="text-white">{comp2}</span>.
                                </p>
                            </div>
                        </div>

                        {/* Micro Line Graph */}
                        <div className="h-64 md:h-80 bg-slate-900/20 rounded-2xl md:rounded-[35px] border border-white/5 p-4 md:p-8">
                            <Line data={compLineData} options={{ ...chartOptions, scales: { ...chartOptions.scales, y: { ...chartOptions.scales.y, display: false } } }} />
                        </div>
                    </div>
                ) : (
                    <div className="py-12 md:py-20 text-center text-slate-600 italic flex flex-col items-center gap-4">
                        <BarChart2 size={48} className="opacity-20" />
                        <p className="max-w-xs mx-auto text-sm">Select two categories from the dropdowns above to initialize a head-to-head comparison.</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Analytics;
