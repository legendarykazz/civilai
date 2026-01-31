import React, { useState, useEffect } from 'react';
import { MessageCircle, ThumbsUp, Eye, Search, Plus } from 'lucide-react';
import { api } from '../services/api';
import CreateQuestionModal from '../components/Forum/CreateQuestionModal';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ForumPage = () => {
    const { user } = useAuth();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const loadQuestions = async () => {
        setLoading(true);
        try {
            const data = await api.getQuestions();
            setQuestions(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadQuestions();
    }, []);

    const handleVote = async (e, id) => {
        e.preventDefault(); // Prevent navigation if clicking the button in the card
        e.stopPropagation();

        // Optimistic update
        setQuestions(prev => prev.map(q =>
            q.id === id ? { ...q, votes: q.votes + 1 } : q
        ));

        try {
            await api.voteQuestion(id, user?.id || 'anon');
        } catch (error) {
            console.error("Vote failed");
            // Revert on error if needed
        }
    };

    const filteredQuestions = questions.filter(q =>
        q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="py-12 px-6 max-w-5xl mx-auto min-h-screen">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-8 mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Community Q&A</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">Ask questions, get AI-assisted answers, and connect with peers.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn btn-primary bg-eng-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-eng-blue-500 shadow-lg shadow-eng-blue-600/20 flex items-center gap-2"
                >
                    <Plus size={20} /> Ask a Question
                </button>
            </div>

            {/* Search */}
            <div className="relative mb-10">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search for engineering topics..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-0 bg-white dark:bg-eng-blue-800 shadow-sm focus:ring-2 focus:ring-cyan-accent text-slate-900 dark:text-white"
                />
            </div>

            {/* Questions List */}
            <div className="space-y-4">
                {loading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-100 dark:bg-eng-blue-900 rounded-2xl animate-pulse" />)
                ) : (
                    filteredQuestions.map((q) => (
                        <Link to={`/forum/${q.id}`} key={q.id} className="block">
                            <div className="bg-white dark:bg-eng-blue-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-eng-blue-300 dark:hover:border-cyan-accent/30 transition-all cursor-pointer flex gap-6 items-start group">

                                {/* Stats */}
                                <div className="flex flex-col gap-2 text-center min-w-[60px] text-xs text-slate-500 dark:text-slate-400">
                                    <button
                                        onClick={(e) => handleVote(e, q.id)}
                                        className="p-1 rounded bg-slate-100 dark:bg-eng-blue-800 font-medium text-slate-900 dark:text-white hover:bg-eng-blue-100 dark:hover:bg-eng-blue-700 transition-colors"
                                    >
                                        <div className="flex flex-col items-center">
                                            <ThumbsUp size={14} className="mb-1" />
                                            {q.votes}
                                        </div>
                                    </button>
                                    <div className={`p-1 rounded border ${q.answers && q.answers.length > 0 ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400' : 'border-transparent'}`}>
                                        {q.answers ? q.answers.length : 0} <span className="block text-[10px] font-normal">ans</span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-eng-blue-600 dark:group-hover:text-cyan-accent transition-colors">
                                        {q.title}
                                    </h3>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {q.tags.map(tag => (
                                            <span key={tag} className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-eng-blue-800 text-xs font-bold text-eng-blue-600 dark:text-sky-300">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-400 font-medium">
                                        <span>asked by <span className="text-eng-blue-700 dark:text-sky-400 font-bold">{q.author}</span></span>
                                        <span>• {new Date(q.date).toLocaleDateString()}</span>
                                    </div>
                                </div>

                            </div>
                        </Link>
                    ))
                )}
                {!loading && filteredQuestions.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                        No questions found matching your search. Be the first to ask!
                    </div>
                )}
            </div>

            <CreateQuestionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onQuestionCreated={loadQuestions}
            />
        </div>
    );
};

export default ForumPage;
