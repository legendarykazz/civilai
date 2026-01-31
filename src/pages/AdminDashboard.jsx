import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Check, X, Edit, Layout, FileText, Lock, Save, Loader2, RotateCcw } from 'lucide-react';

const AdminDashboard = () => {
    // Auth State
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passcode, setPasscode] = useState('');

    // Data State
    const [activeTab, setActiveTab] = useState('blogs');
    const [blogs, setBlogs] = useState([]);

    // Content State (Local Buffer)
    const [siteContent, setSiteContent] = useState({});
    const [initialContent, setInitialContent] = useState({}); // To detect changes
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

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
                const data = await api.getBlogs(false);
                setBlogs(data);
            } else {
                const content = await api.getSiteContent();
                setSiteContent(content);
                setInitialContent(content);
                setIsDirty(false);
            }
        } catch (error) {
            console.error('Failed to load admin data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (passcode === 'admin123') {
            setIsAuthenticated(true);
        } else {
            alert('Incorrect Passcode');
        }
    };

    // --- Blog Actions ---
    const handleStatusChange = async (id, newStatus) => {
        setBlogs(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
        try {
            await api.updateBlogStatus(id, newStatus);
        } catch (error) {
            console.error('Failed to update status');
        }
    };

    // --- Content Actions (Local State) ---
    const handleContentChange = (key, value) => {
        setSiteContent(prev => ({
            ...prev,
            [key]: value
        }));
        setIsDirty(true);
    };

    // --- Save All Changes ---
    const handleSaveChanges = async () => {
        setSaving(true);
        try {
            // Save all changed keys
            const promises = Object.keys(siteContent).map(key => {
                if (siteContent[key] !== initialContent[key]) {
                    return api.updateSiteContent(key, siteContent[key]);
                }
                return Promise.resolve();
            });

            await Promise.all(promises);
            setInitialContent(siteContent); // Sync
            setIsDirty(false);
            alert('All changes saved successfully!');
        } catch (error) {
            console.error('Failed to save content', error);
            alert('Failed to save changes. Check console.');
        } finally {
            setSaving(false);
        }
    };

    // --- Revert Changes ---
    const handleDiscard = () => {
        if (window.confirm('Discard all unsaved changes?')) {
            setSiteContent(initialContent);
            setIsDirty(false);
        }
    }

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
                            placeholder="Enter Passcode"
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
            <div className="bg-eng-blue-900 text-white py-6 px-6 sticky top-0 z-50 shadow-lg">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {activeTab === 'content' && isDirty && (
                            <>
                                <button
                                    onClick={handleDiscard}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-200 hover:bg-red-500/30 transition-colors text-sm font-semibold"
                                >
                                    <RotateCcw size={16} /> Discard
                                </button>
                                <button
                                    onClick={handleSaveChanges}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-6 py-2 rounded-lg bg-cyan-accent text-eng-blue-900 hover:bg-white transition-colors font-bold shadow-lg"
                                >
                                    {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                    Save Changes
                                </button>
                            </>
                        )}
                        <button onClick={() => setIsAuthenticated(false)} className="text-sm text-white/70 hover:text-white transition-colors ml-4">
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-8">
                <div className="bg-white dark:bg-eng-blue-900 rounded-2xl shadow-xl min-h-[600px] border border-slate-200 dark:border-slate-800 flex overflow-hidden">

                    {/* Sidebar Tabs */}
                    <div className="w-64 bg-slate-50 dark:bg-eng-blue-950 border-r border-slate-200 dark:border-slate-800 p-4 shrink-0">
                        <div className="space-y-2 sticky top-4">
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
                    <div className="flex-1 p-8 overflow-y-auto max-h-[calc(100vh-140px)]">
                        {loading ? (
                            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-eng-blue-600" size={32} /></div>
                        ) : activeTab === 'blogs' ? (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Manage Blog Posts</h2>
                                {blogs.length === 0 && <p className="text-slate-500 italic">No blogs found.</p>}
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
                            <div className="space-y-8 max-w-3xl pb-20">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Home Page Editor</h2>
                                    {isDirty && <span className="text-orange-500 text-sm font-semibold animate-pulse">● Unsaved Changes</span>}
                                </div>

                                {/* Hero Title Editor */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Hero Main Title</label>
                                    <input
                                        type="text"
                                        value={siteContent.home_hero_title || ''}
                                        onChange={(e) => handleContentChange('home_hero_title', e.target.value)}
                                        className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-eng-blue-800 text-slate-900 dark:text-white"
                                    />
                                </div>

                                {/* Hero Subtitle Editor */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Hero Subtitle</label>
                                    <textarea
                                        rows="3"
                                        value={siteContent.home_hero_subtitle || ''}
                                        onChange={(e) => handleContentChange('home_hero_subtitle', e.target.value)}
                                        className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-eng-blue-800 text-slate-900 dark:text-white"
                                    />
                                </div>

                                {/* Rules Title Editor */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Section Title (Rules)</label>
                                    <input
                                        type="text"
                                        value={siteContent.home_rules_title || ''}
                                        onChange={(e) => handleContentChange('home_rules_title', e.target.value)}
                                        className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-eng-blue-800 text-slate-900 dark:text-white"
                                    />
                                </div>

                                <div className="border-t border-slate-200 dark:border-slate-800 my-6"></div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Guidance Cards</h3>
                                <p className="text-sm text-slate-500 mb-4">Edit the lists below. Use a new line for each bullet point.</p>

                                {/* Card 1 */}
                                <div className="p-4 bg-slate-50 dark:bg-eng-blue-950 rounded-xl space-y-4 border border-slate-200 dark:border-slate-800">
                                    <input
                                        type="text"
                                        value={siteContent.card_1_title || 'General Rules'}
                                        onChange={(e) => handleContentChange('card_1_title', e.target.value)}
                                        className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 font-bold bg-white dark:bg-eng-blue-900 text-slate-900 dark:text-white"
                                        placeholder="Card 1 Title"
                                    />
                                    <textarea
                                        rows="5"
                                        value={siteContent.card_1_list || ''}
                                        onChange={(e) => handleContentChange('card_1_list', e.target.value)}
                                        className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-eng-blue-900 text-slate-900 dark:text-white text-sm font-mono"
                                        placeholder="List items (one per line)"
                                    />
                                </div>

                                {/* Card 2 */}
                                <div className="p-4 bg-slate-50 dark:bg-eng-blue-950 rounded-xl space-y-4 border border-slate-200 dark:border-slate-800">
                                    <input
                                        type="text"
                                        value={siteContent.card_2_title || 'Code Principles'}
                                        onChange={(e) => handleContentChange('card_2_title', e.target.value)}
                                        className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 font-bold bg-white dark:bg-eng-blue-900 text-slate-900 dark:text-white"
                                        placeholder="Card 2 Title"
                                    />
                                    <textarea
                                        rows="5"
                                        value={siteContent.card_2_list || ''}
                                        onChange={(e) => handleContentChange('card_2_list', e.target.value)}
                                        className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-eng-blue-900 text-slate-900 dark:text-white text-sm font-mono"
                                        placeholder="List items (one per line)"
                                    />
                                </div>

                                {/* Card 3 */}
                                <div className="p-4 bg-slate-50 dark:bg-eng-blue-950 rounded-xl space-y-4 border border-slate-200 dark:border-slate-800">
                                    <input
                                        type="text"
                                        value={siteContent.card_3_title || 'Common Errors'}
                                        onChange={(e) => handleContentChange('card_3_title', e.target.value)}
                                        className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 font-bold bg-white dark:bg-eng-blue-900 text-slate-900 dark:text-white"
                                        placeholder="Card 3 Title"
                                    />
                                    <textarea
                                        rows="5"
                                        value={siteContent.card_3_list || ''}
                                        onChange={(e) => handleContentChange('card_3_list', e.target.value)}
                                        className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-eng-blue-900 text-slate-900 dark:text-white text-sm font-mono"
                                        placeholder="List items (one per line)"
                                    />
                                </div>
                                <div className="h-12"></div> {/* Spacer */}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
