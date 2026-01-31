import React, { useState } from 'react';
import { X, Image as ImageIcon, Tag, Type, AlignLeft, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const CreateBlogModal = ({ isOpen, onClose, onPostCreated }) => {
    const { user, login } = useAuth();
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        image: '',
        tags: ''
    });

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Ensure we have a user (Auto-login for demo if needed)
            let currentUser = user;
            if (!currentUser) {
                currentUser = await login('Guest_Engineer');
            }

            const newPost = {
                ...formData,
                author: currentUser.name,
                tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean) || ['General'],
                // Fallback image if empty
                image: formData.image || 'https://images.unsplash.com/photo-1481277542470-605612bd2d61?auto=format&fit=crop&q=80&w=800'
            };

            await api.createBlog(newPost);
            onPostCreated();
            onClose();
        } catch (error) {
            console.error(error);
            alert('Failed to post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-eng-blue-900 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Write Insight</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-eng-blue-800 rounded-full transition-colors">
                        <X size={24} className="text-slate-500 dark:text-slate-400" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Title</label>
                        <div className="relative">
                            <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                required
                                type="text"
                                placeholder="E.g., Advances in Seismic Retrofitting"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-eng-blue-950 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-eng-blue-600 outline-none text-slate-900 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Excerpt */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Short Summary</label>
                        <textarea
                            required
                            rows="2"
                            placeholder="Brief overview to display on the card..."
                            value={formData.excerpt}
                            onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-eng-blue-950 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-eng-blue-600 outline-none text-slate-900 dark:text-white"
                        />
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Content</label>
                        <div className="relative">
                            <AlignLeft className="absolute left-3 top-3 text-slate-400" size={18} />
                            <textarea
                                required
                                rows="6"
                                placeholder="Share your engineering knowledge..."
                                value={formData.content}
                                onChange={e => setFormData({ ...formData, content: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-eng-blue-950 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-eng-blue-600 outline-none text-slate-900 dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Image Upload */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Cover Image</label>
                            <div className="relative group">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files[0];
                                        if (!file) return;
                                        setLoading(true);
                                        try {
                                            const url = await api.uploadImage(file);
                                            setFormData(prev => ({ ...prev, image: url }));
                                        } catch (err) {
                                            console.error("Upload failed", err);
                                            alert("Failed to upload image");
                                        } finally {
                                            setLoading(false);
                                        }
                                    }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className={`w-full p-3 rounded-xl border-2 border-dashed transition-all flex items-center justify-center gap-2 overflow-hidden bg-slate-50 dark:bg-eng-blue-950 ${formData.image ? 'border-eng-blue-500 bg-eng-blue-50/10' : 'border-slate-300 dark:border-slate-700 hover:border-eng-blue-400'}`}>
                                    {formData.image ? (
                                        <div className="relative w-full h-10 flex items-center gap-3">
                                            <img src={formData.image} alt="Preview" className="h-10 w-10 object-cover rounded-lg" />
                                            <span className="text-xs text-green-600 font-bold truncate flex-1">Image Uploaded</span>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setFormData(prev => ({ ...prev, image: '' }));
                                                }}
                                                className="z-20 p-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <ImageIcon size={18} />
                                            <span className="text-sm">Click to Upload Image</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tags (comma separated)</label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Concrete, AI, Design"
                                    value={formData.tags}
                                    onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-eng-blue-950 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-eng-blue-600 outline-none text-slate-900 dark:text-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer / Submit */}
                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-2.5 rounded-xl bg-eng-blue-600 hover:bg-eng-blue-500 text-white font-semibold shadow-lg shadow-eng-blue-600/20 disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Publish Article'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default CreateBlogModal;
