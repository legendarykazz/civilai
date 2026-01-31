import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { ArrowLeft, MessageSquare, ThumbsUp, User, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ForumPostPage = () => {
    const { id } = useParams();
    const { user, login } = useAuth();
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [answerText, setAnswerText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const loadQuestion = async () => {
        try {
            const data = await api.getQuestionById(id);
            setQuestion(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadQuestion();
    }, [id]);

    const handleVote = async () => {
        if (!question) return;
        setQuestion(prev => ({ ...prev, votes: prev.votes + 1 }));
        await api.voteQuestion(id, user?.id || 'anon');
    };

    const handleSubmitAnswer = async (e) => {
        e.preventDefault();
        if (!answerText.trim()) return;
        setSubmitting(true);

        try {
            let currentUser = user;
            if (!currentUser) {
                currentUser = await login('Guest_Engineer');
            }

            const newAnswer = {
                content: answerText,
                author: currentUser.name,
                votes: 0
            };

            await api.addAnswer(id, newAnswer);
            setAnswerText('');
            loadQuestion(); // Refresh
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-20 text-center">Loading discussion...</div>;
    if (!question) return <div className="p-20 text-center">Question not found.</div>;

    return (
        <div className="py-12 px-6 max-w-5xl mx-auto min-h-screen">
            <Link to="/forum" className="inline-flex items-center gap-2 text-slate-500 hover:text-eng-blue-600 mb-8 transition-colors">
                <ArrowLeft size={20} /> Back to Community
            </Link>

            {/* Question Header */}
            <div className="bg-white dark:bg-eng-blue-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 mb-8 shadow-sm">
                <div className="flex gap-6">
                    <div className="flex flex-col items-center gap-2">
                        <button
                            onClick={handleVote}
                            className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-eng-blue-800 flex items-center justify-center text-slate-600 dark:text-cyan-accent hover:bg-eng-blue-100 hover:scale-110 transition-all"
                        >
                            <ThumbsUp size={20} />
                        </button>
                        <span className="font-bold text-lg text-slate-900 dark:text-white">{question.votes}</span>
                    </div>

                    <div className="flex-1">
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                            {question.title}
                        </h1>
                        <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 mb-6 whitespace-pre-wrap">
                            {question.content}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 border-t border-slate-100 dark:border-white/5 pt-6">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-cyan-accent/20 flex items-center justify-center text-cyan-accent font-bold text-xs">
                                    {question.author.charAt(0)}
                                </div>
                                <span className="font-medium text-slate-900 dark:text-slate-200">{question.author}</span>
                            </div>
                            <span>•</span>
                            <span className="flex items-center gap-1"><Clock size={16} /> {new Date(question.date).toLocaleDateString()}</span>
                            <div className="flex-1 text-right">
                                {question.tags.map(tag => (
                                    <span key={tag} className="ml-2 inline-block px-2 py-1 bg-slate-100 dark:bg-eng-blue-800 text-xs rounded-md text-slate-600 dark:text-slate-400">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Answers Section */}
            <div className="mb-12">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <MessageSquare className="text-eng-blue-600" /> {question.answers?.length || 0} Answers
                </h3>

                <div className="space-y-6">
                    {question.answers && question.answers.map((answer) => (
                        <div key={answer.id} className="bg-slate-50 dark:bg-eng-blue-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-white dark:bg-eng-blue-800 flex items-center justify-center text-slate-400 shadow-sm flex-shrink-0">
                                <User size={20} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-bold text-slate-900 dark:text-white text-sm">{answer.author}</span>
                                    <span className="text-xs text-slate-500">{new Date(answer.date).toLocaleDateString()}</span>
                                </div>
                                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                                    {answer.content}
                                </p>
                            </div>
                        </div>
                    ))}
                    {(!question.answers || question.answers.length === 0) && (
                        <div className="text-center py-8 text-slate-500 italic">No answers yet. be the first to help!</div>
                    )}
                </div>
            </div>

            {/* Post Answer */}
            <div className="bg-white dark:bg-eng-blue-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-eng-blue-900/5">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Your Answer</h3>
                <form onSubmit={handleSubmitAnswer}>
                    <textarea
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                        placeholder="Type your professional advice here..."
                        rows="4"
                        className="w-full p-4 rounded-xl bg-slate-50 dark:bg-eng-blue-950 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-eng-blue-600 outline-none text-slate-900 dark:text-white mb-4"
                    />
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={submitting || !answerText.trim()}
                            className="bg-eng-blue-600 hover:bg-eng-blue-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-eng-blue-600/30 disabled:opacity-50 transition-all hover:-translate-y-1"
                        >
                            {submitting ? 'Posting...' : 'Post Answer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForumPostPage;
