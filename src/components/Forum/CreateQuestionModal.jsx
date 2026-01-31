import React, { useState } from 'react';
import { X, HelpCircle, Tag, Image as ImageIcon, Loader2, User, Mail, Shield } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const CreateQuestionModal = ({ isOpen, onClose, onQuestionCreated }) => {
    const { user } = useAuth(); // Removed login since we handle identity manually now
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: '',
        image: '',
        name: '',
        email: ''
    });

    const [isAnonymous, setIsAnonymous] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const authorName = isAnonymous ? 'Anonymous Engineer' : (formData.name || 'Guest Engineer');
            const authorEmail = isAnonymous ? null : formData.email;

            const newQuestion = {
                ...formData,
                author: authorName,
                email: authorEmail,
                views: 0,
                votes: 0,
                answers: [],
                tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean) || ['General']
            };

            await api.createQuestion(newQuestion);
            onQuestionCreated();
            onClose();
        } catch (error) {
            console.error(error);
            alert('Failed to post question');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-eng-blue-900 rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">

                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Ask Community</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-eng-blue-800 rounded-full transition-colors">
                        <X size={24} className="text-slate-500 dark:text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    {/* Identity Section */}
                    <div className="bg-slate-50 dark:bg-eng-blue-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-4">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <Shield size={16} className="text-eng-blue-600" /> Identity
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Post Anonymously</span>
                                <input
                                    type="checkbox"
                                    checked={isAnonymous}
                                    onChange={(e) => setIsAnonymous(e.target.checked)}
                                    className="w-5 h-5 rounded text-eng-blue-600 focus:ring-eng-blue-500 border-gray-300"
                                />
                            </label>
                        </div>

                        {!isAnonymous && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-200">
                                <div className="space-y-1">
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input
                                            required={!isAnonymous}
                                            type="text"
                                            placeholder="Your Name"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-white dark:bg-eng-blue-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-eng-blue-600 outline-none text-slate-900 dark:text-white text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input
                                            required={!isAnonymous}
                                            type="email"
                                            placeholder="your@email.com"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-white dark:bg-eng-blue-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-eng-blue-600 outline-none text-slate-900 dark:text-white text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                        {isAnonymous && (
                            <p className="text-xs text-slate-500 italic">You will appear as "Anonymous Engineer".</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Question Title</label>
                        <div className="relative">
                            <HelpCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                required
                                type="text"
                                placeholder="E.g., How to calculate wind load on irregular shapes?"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-eng-blue-950 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-eng-blue-600 outline-none text-slate-900 dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Details</label>
                        <textarea
                            required
                            rows="5"
                            placeholder="Describe your problem in detail..."
                            value={formData.content}
                            onChange={e => setFormData({ ...formData, content: e.target.value })}
                            className="w-full p-4 rounded-xl bg-slate-50 dark:bg-eng-blue-950 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-eng-blue-600 outline-none text-slate-900 dark:text-white"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Image Upload */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Attachment (Optional)</label>
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
                                            <span className="text-sm">Upload Diagram</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tags</label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Steel, Wind, Design"
                                    value={formData.tags}
                                    onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-eng-blue-950 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-eng-blue-600 outline-none text-slate-900 dark:text-white"
                                />
                            </div>
                        </div>
                    </div>

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
                            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Post Question'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default CreateQuestionModal;
