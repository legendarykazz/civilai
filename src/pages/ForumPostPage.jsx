import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { ArrowLeft, MessageSquare, ThumbsUp, User, Clock, CheckCircle, Image as ImageIcon, X, Loader2, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ForumPostPage = () => {
    const { id } = useParams();
    const { user } = useAuth(); // No login needed, manual entry
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);

    // Answer State
    const [answerData, setAnswerData] = useState({
        content: '',
        name: '',
        email: ''
    });
    const [answerImage, setAnswerImage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);

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

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const url = await api.uploadImage(file);
            setAnswerImage(url);
        } catch (error) {
            console.error(error);
            alert("Image upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmitAnswer = async (e) => {
        e.preventDefault();
        if (!answerData.content.trim() || !answerData.name || !answerData.email) return;
        setSubmitting(true);

        try {
            const newAnswer = {
                content: answerData.content,
                image: answerImage,
                author: answerData.name,
                email: answerData.email,
                votes: 0
            };

            await api.addAnswer(id, newAnswer);
            setAnswerData({ content: '', name: '', email: '' });
            setAnswerImage('');
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

                        {/* Question Image Attachment */}
                        {question.image && (
                            <div className="mb-6">
                                <img src={question.image} alt="Attachment" className="rounded-xl max-h-96 object-contain border border-slate-200 dark:border-slate-800" />
                            </div>
                        )}

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
                                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap mb-4">
                                    {answer.content}
                                </p>
                                {answer.image && (
                                    <div className="mb-2">
                                        <img src={answer.image} alt="Answer attachment" className="rounded-lg max-h-64 object-contain border border-slate-200 dark:border-slate-700 bg-white dark:bg-black/20" />
                                    </div>
                                )}
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
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Your Professional Answer</h3>
                <form onSubmit={handleSubmitAnswer}>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    required
                                    type="text"
                                    placeholder="Your Full Name"
                                    value={answerData.name}
                                    onChange={e => setAnswerData({ ...answerData, name: e.target.value })}
                                    className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-eng-blue-950 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-eng-blue-600 outline-none text-slate-900 dark:text-white text-sm"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">Email (Visible only to admin)</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    required
                                    type="email"
                                    placeholder="work@example.com"
                                    value={answerData.email}
                                    onChange={e => setAnswerData({ ...answerData, email: e.target.value })}
                                    className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-eng-blue-950 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-eng-blue-600 outline-none text-slate-900 dark:text-white text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <textarea
                        value={answerData.content}
                        onChange={(e) => setAnswerData({ ...answerData, content: e.target.value })}
                        placeholder="Type your professional advice here..."
                        rows="4"
                        className="w-full p-4 rounded-xl bg-slate-50 dark:bg-eng-blue-950 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-eng-blue-600 outline-none text-slate-900 dark:text-white mb-4"
                    />

                    {/* Attachment Preview / Upload */}
                    <div className="mb-4">
                        {answerImage ? (
                            <div className="relative inline-block group">
                                <img src={answerImage} alt="Attachment preview" className="h-20 w-auto rounded-lg border border-slate-200 dark:border-slate-700" />
                                <button
                                    type="button"
                                    onClick={() => setAnswerImage('')}
                                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ) : (
                            <div className="relative inline-block">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    disabled={uploading}
                                />
                                <button type="button" className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${uploading ? 'bg-slate-100 text-slate-400' : 'bg-slate-100 dark:bg-eng-blue-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-eng-blue-700'}`}>
                                    {uploading ? <Loader2 className="animate-spin" size={16} /> : <ImageIcon size={16} />}
                                    {uploading ? 'Uploading...' : 'Attach Image'}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={submitting || !answerData.content.trim() || !answerData.name}
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
