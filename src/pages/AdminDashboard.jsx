import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Check, X, Edit, Layout, FileText, Lock, Save, Loader2 } from 'lucide-react';

const AdminDashboard = () => {
    // Auth State (Simple Passcode)
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passcode, setPasscode] = useState('');

    // Data State
    const [activeTab, setActiveTab] = useState('blogs');
    const [blogs, setBlogs] = useState([]);
    const [siteContent, setSiteContent] = useState({});
    const [loading, setLoading] = useState(false);

    // Initial Load
    useEffect(() => {
        if (isAuthenticated) {
            loadData();
        }
    }, [isAuthenticated, activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'blogs') {
                const data = await api.getBlogs(false); // Get all (including pending)
                setBlogs(data);
            } else {
                const content = await api.getSiteContent();
                setSiteContent(content);
            }
        } catch (error) {
            console.error('Failed to load admin data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        // Hardcoded secret for demo - simple but effective for "Day 2"
        if (passcode === 'admin123') {
            setIsAuthenticated(true);
        } else {
            alert('Incorrect Passcode');
        }
    };

    // --- Blog Actions ---
    const handleStatusChange = async (id, newStatus) => {
        // Optimistic update
        setBlogs(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));

        try {
            await api.updateBlogStatus(id, newStatus);
        } catch (error) {
            console.error('Failed to update status');
            // Revert would go here
        }
    };

    // --- Content Actions ---
    const handleContentUpdate = async (key, value) => {
        try {
            await api.updateSiteContent(key, value);
            alert('Content updated successfully!');
        } catch (error) {
            console.error('Failed to update content', error);
            alert('Failed to save');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-eng-blue-950 px-4">
                <div className="bg-white dark:bg-eng-blue-900 p-8 rounded-3xl shadow-xl max-w-sm w-full border border-slate-200 dark:border-slate-800">
                    <div className="flex justify-center mb-6 text-eng-blue-600 dark:text-cyan-accent">
                        <Lock size={48} />
                    </div>
                    <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-6">Admin Access</h2>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            placeholder="Enter Passcode (admin123)"
                            value={passcode}
                            onChange={(e) => setPasscode(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-eng-blue-800 border-transparent focus:ring-2 focus:ring-eng-blue-600 outline-none dark:text-white"
                        />
                        <button type="submit" className="w-full btn btn-primary py-3 rounded-xl bg-eng-blue-600 text-white font-semibold hover:bg-eng-blue-500 transition-colors">
                            Unlock Dashboard
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-eng-blue-950 pb-20">
            {/* Header */}
            <div className="bg-eng-blue-900 text-white py-12 px-6">
                <div className="max-w-7xl mx-auto flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                        <p className="text-eng-blue-200 mt-2">Manage content and moderate community</p>
                    </div>
                    <button onClick={() => setIsAuthenticated(false)} className="text-sm bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition-colors">
                        Logout
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-8">
                <div className="bg-white dark:bg-eng-blue-900 rounded-2xl shadow-xl min-h-[600px] border border-slate-200 dark:border-slate-800 flex overflow-hidden">

                    {/* Sidebar Tabs */}
                    <div className="w-64 bg-slate-50 dark:bg-eng-blue-950 border-r border-slate-200 dark:border-slate-800 p-4">
                        <div className="space-y-2">
                            <button
                                onClick={() => setActiveTab('blogs')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition-colors ${activeTab === 'blogs' ? 'bg-eng-blue-100 text-eng-blue-700 dark:bg-eng-blue-800 dark:text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-eng-blue-900'}`}
                            >
                                <FileText size={18} /> Blog Moderation
                            </button>
                            <button
                                onClick={() => setActiveTab('content')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition-colors ${activeTab === 'content' ? 'bg-eng-blue-100 text-eng-blue-700 dark:bg-eng-blue-800 dark:text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-eng-blue-900'}`}
                            >
                                <Layout size={18} /> Site Content
                            </button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-8">
                        {loading ? (
                            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-eng-blue-600" size={32} /></div>
                        ) : activeTab === 'blogs' ? (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Manage Blog Posts</h2>
                                {blogs.map(blog => (
                                    <div key={blog.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-eng-blue-950">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="font-semibold text-slate-900 dark:text-white">{blog.title}</h3>
                                                <span className={`px-2 py-0.5 text-xs rounded-md font-bold uppercase ${blog.status === 'approved' ? 'bg-green-100 text-green-700' : blog.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                    {blog.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-500">{blog.author} • {blog.date}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            {blog.status !== 'approved' && (
                                                <button onClick={() => handleStatusChange(blog.id, 'approved')} className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200" title="Approve">
                                                    <Check size={18} />
                                                </button>
                                            )}
                                            {blog.status !== 'rejected' && (
                                                <button onClick={() => handleStatusChange(blog.id, 'rejected')} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200" title="Reject">
                                                    <X size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-8 max-w-2xl">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Home Page Content</h2>

                                {/* Hero Title Editor */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Hero Main Title</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            defaultValue={siteContent.home_hero_title}
                                            onBlur={(e) => handleContentUpdate('home_hero_title', e.target.value)}
                                            className="flex-1 p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-eng-blue-800 text-slate-900 dark:text-white"
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500">Auto-saves on blur</p>
                                </div>

                                {/* Hero Subtitle Editor */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Hero Subtitle</label>
                                    <textarea
                                        rows="3"
                                        defaultValue={siteContent.home_hero_subtitle}
                                        onBlur={(e) => handleContentUpdate('home_hero_subtitle', e.target.value)}
                                        className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-eng-blue-800 text-slate-900 dark:text-white"
                                    />
                                    <p className="text-xs text-slate-500">Auto-saves on blur</p>
                                </div>

                                {/* Rules Title Editor */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Section Title (Rules)</label>
                                    <input
                                        type="text"
                                        defaultValue={siteContent.home_rules_title}
                                        onBlur={(e) => handleContentUpdate('home_rules_title', e.target.value)}
                                        className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-eng-blue-800 text-slate-900 dark:text-white"
                                    />
                                </div>

                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
