import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    GraduationCap, ShoppingBag, Utensils, Plane, Film, HeartPulse,
    MoreHorizontal, Plus, Search, Tag, TrendingUp
} from 'lucide-react';

const iconMap = {
    GraduationCap: GraduationCap,
    ShoppingBag: ShoppingBag,
    Utensils: Utensils,
    Plane: Plane,
    Film: Film,
    HeartPulse: HeartPulse,
    TrendingUp: TrendingUp,
    Default: Tag
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal & Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCat, setNewCat] = useState({ name: '', icon: 'ShoppingBag', color: '#3b82f6' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/categories`);
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAddCategory = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetch(`${API_URL}/api/categories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCat)
            });

            if (response.ok) {
                await fetchCategories();
                setIsModalOpen(false);
                setNewCat({ name: '', icon: 'ShoppingBag', color: '#3b82f6' });
            } else {
                const data = await response.json();
                alert(data.error || "Failed to add category");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Connection error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Category Library</h2>
                    <p className="text-gray-500">Manage spending categories and their visual themes</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            className="w-full pl-10 pr-4 py-2 bg-white/50 backdrop-blur-md border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Modal Overlay */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/20"
                        >
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">Create New Category</h3>

                            <form onSubmit={handleAddCategory} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-2">Category Name</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Travel, Gym, etc."
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        value={newCat.name}
                                        onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-2">Select Icon</label>
                                    <div className="grid grid-cols-5 gap-3">
                                        {Object.keys(iconMap).map(iconName => {
                                            const Icon = iconMap[iconName];
                                            return (
                                                <button
                                                    key={iconName}
                                                    type="button"
                                                    onClick={() => setNewCat({ ...newCat, icon: iconName })}
                                                    className={`p-3 rounded-xl flex items-center justify-center transition-all ${newCat.icon === iconName ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                                                >
                                                    <Icon className="w-5 h-5" />
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-2">Theme Color</label>
                                    <div className="flex gap-3">
                                        {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'].map(color => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => setNewCat({ ...newCat, color })}
                                                className={`w-10 h-10 rounded-full transition-all ${newCat.color === color ? 'ring-4 ring-offset-2 ring-blue-500 scale-110' : ''}`}
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Creating...' : 'Add Category'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-48 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl animate-pulse"></div>
                    ))}
                </div>
            ) : (
                <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    <AnimatePresence>
                        {filteredCategories.map((cat) => {
                            const IconComponent = iconMap[cat.icon] || iconMap.Default;
                            return (
                                <motion.div
                                    key={cat.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    whileHover={{
                                        scale: 1.05,
                                        boxShadow: `0 0 20px ${cat.color}33`,
                                        borderColor: cat.color
                                    }}
                                    className="relative group bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl overflow-hidden cursor-pointer"
                                >
                                    {/* Abstract background shape for flair */}
                                    <div
                                        className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"
                                        style={{ backgroundColor: cat.color }}
                                    ></div>

                                    <div className="relative z-10">
                                        <div
                                            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:animate-pulse transition-all"
                                            style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                                        >
                                            <IconComponent className="w-7 h-7" />
                                        </div>

                                        <h3 className="text-xl font-bold text-gray-800 mb-1">{cat.name}</h3>
                                        <div className="flex justify-between items-center text-sm text-gray-500 font-medium">
                                            <span>Active Category</span>
                                            <button className="text-gray-400 hover:text-gray-600 p-1">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Neon Glow Bottom Bar */}
                                    <div
                                        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-100 transition-opacity w-full"
                                        style={{ color: cat.color }}
                                    ></div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </motion.div>
            )}

            {!loading && filteredCategories.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <Tag className="w-16 h-16 mb-4 opacity-20" />
                    <h3 className="text-xl font-bold">No Categories Found</h3>
                    <p>Try searching for something else or add a new one.</p>
                </div>
            )}
        </div>
    );
};

export default AdminCategories;
