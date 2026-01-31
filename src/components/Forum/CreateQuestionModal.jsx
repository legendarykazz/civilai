import React, { useState } from 'react';
import { X, HelpCircle, Tag, Type, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const CreateQuestionModal = ({ isOpen, onClose, onQuestionCreated }) => {
    const { user, login } = useAuth();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: ''
    });

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let currentUser = user;
            if (!currentUser) {
                currentUser = await login('Guest_Engineer');
            }

            const newQuestion = {
                ...formData,
                author: currentUser.name,
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
            <div className="bg-white dark:bg-eng-blue-900 rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-200 dark:border-slate-800">

                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Ask Community</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-eng-blue-800 rounded-full transition-colors">
                        <X size={24} className="text-slate-500 dark:text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">

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

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tags</label>
                        <div className="relative">
                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Steel, Wind, Design (comma separated)"
                                value={formData.tags}
                                onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-eng-blue-950 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-eng-blue-600 outline-none text-slate-900 dark:text-white"
                            />
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
