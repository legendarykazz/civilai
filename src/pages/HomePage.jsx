import React, { useState, useEffect } from 'react';
import { ArrowRight, Bot, Cpu, Layers, MessageSquare, Globe, ShieldCheck, Sparkles, X, TrendingUp, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

const HomePage = () => {
    // Dynamic Content State
    const [content, setContent] = useState({
        home_hero_title: 'Engineering Intelligence for Smarter Structures',
        home_hero_subtitle: "The world's most advanced AI platform for civil structural analysis. Get real-time design guidance, automate workflows, and solve complex engineering challenges instantly.",
        home_rules_title: 'Core Engineering Rules & Design Guidelines',
        // Default Card Content (Fallbacks)
        card_1_title: 'General Rules',
        card_1_list: '• Safety factors over theoretical strength\n• Continuous load paths from roof to base\n• No reliance on single critical elements\n• Serviceability equals strength limits\n• Justify every stated assumption',
        card_2_title: 'Code Principles',
        card_2_list: '• Apply partial safety factors to materials\n• Separate dead vs imposed load cases\n• Check Buckling, Deflection, Capacity\n• Stability governs slender members\n• Connections match member reliability',
        card_3_title: 'Common Errors',
        card_3_list: '❌ Ignoring compression buckling\n❌ Under-designed connection details\n❌ Forgetting corrosion allowances\n❌ Incorrect column effective lengths\n❌ Mixing units (kN, N, mm)'
    });

    // Widgets State
    const [latestBlogs, setLatestBlogs] = useState([]);
    const [trendingQuestions, setTrendingQuestions] = useState([]);
    const [widgetsLoading, setWidgetsLoading] = useState(true);

    useEffect(() => {
        const loadContent = async () => {
            try {
                // Parallel fetching for speed
                const [cmsData, blogsData, questionsData] = await Promise.all([
                    api.getSiteContent(),
                    api.getBlogs(true, 3), // Get top 3
                    api.getQuestions(3)    // Get top 3
                ]);

                setContent(prev => ({ ...prev, ...cmsData }));
                setLatestBlogs(blogsData);
                setTrendingQuestions(questionsData);
            } catch (error) {
                console.error("Failed to load page content", error);
            } finally {
                setWidgetsLoading(false);
            }
        };
        loadContent();
    }, []);

    // Helper to render lists from CMS text (split by new lines)
    const renderList = (text) => {
        if (!text) return null;
        return text.split('\n').map((item, index) => (
            <li key={index}>{item}</li>
        ));
    };

    return (
        <div className="overflow-hidden">

            {/* Hero Section */}
            <div className="relative isolate min-h-[90vh] flex items-center">
                {/* Background Image / Gradient */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-eng-blue-900/90 dark:bg-eng-blue-950/90 mix-blend-multiply" />
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay grayscale" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-eng-blue-900 via-transparent to-transparent" />
                </div>

                {/* Glowing Orbs */}
                <div className="absolute top-0 right-0 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
                    <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-cyan-accent to-eng-blue-600 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }} />
                </div>

                <div className="mx-auto max-w-7xl px-6 lg:px-8 py-32 text-center">
                    <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-7xl mb-8 animate-in slide-in-from-bottom-5 fade-in duration-800 delay-100">
                        {content.home_hero_title}
                    </h1>

                    <p className="mx-auto max-w-2xl text-lg leading-8 text-slate-800 dark:text-slate-300 mb-12 animate-in slide-in-from-bottom-5 fade-in duration-1000 delay-200">
                        {content.home_hero_subtitle}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in slide-in-from-bottom-5 fade-in duration-1000 delay-300">
                        <Link
                            to="/calculator"
                            className="w-full sm:w-auto rounded-full bg-gradient-to-r from-cyan-500 to-eng-blue-600 hover:from-cyan-400 hover:to-eng-blue-500 text-white px-8 py-4 text-lg font-bold shadow-xl shadow-cyan-500/30 hover:shadow-cyan-accent/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                        >
                            <Bot size={24} />
                            Launch Civil Suite
                        </Link>
                        <button
                            onClick={() => document.querySelector('#chat-trigger')?.click()}
                            className="w-full sm:w-auto rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-slate-900 dark:text-white px-8 py-4 text-base font-semibold backdrop-blur-sm transition-all"
                        >
                            Ask AI Assistant
                        </button>
                    </div>
                </div>
            </div>

            {/* Community Pulse Section (Widgets) */}
            <div className="bg-white dark:bg-eng-blue-950 py-16 border-b border-slate-200 dark:border-slate-800">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-2">
                        <TrendingUp className="text-eng-blue-600 dark:text-cyan-accent" /> Community Pulse
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Latest Blogs Widget */}
                        <div className="glass-panel p-6 rounded-2xl bg-slate-50 dark:bg-eng-blue-900 border border-slate-200 dark:border-slate-800">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                    <BookOpen size={20} className="text-eng-blue-500" /> Latest Insights
                                </h3>
                                <Link to="/blog" className="text-sm text-eng-blue-600 hover:text-eng-blue-500 font-medium flex items-center gap-1">
                                    View All <ArrowRight size={14} />
                                </Link>
                            </div>

                            {widgetsLoading ? (
                                <div className="space-y-4 animate-pulse">
                                    {[1, 2, 3].map(i => <div key={i} className="h-16 bg-slate-200 dark:bg-eng-blue-800 rounded-lg"></div>)}
                                </div>
                            ) : latestBlogs.length > 0 ? (
                                <div className="space-y-4">
                                    {latestBlogs.map(blog => (
                                        <Link key={blog.id} to={`/blog/${blog.id}`} className="block group">
                                            <div className="flex gap-4 p-3 rounded-xl hover:bg-white dark:hover:bg-eng-blue-800 transition-colors">
                                                {blog.image && (
                                                    <img src={blog.image} alt="" className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                                                )}
                                                <div>
                                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-eng-blue-600 dark:group-hover:text-cyan-accent transition-colors line-clamp-1">{blog.title}</h4>
                                                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{blog.excerpt}</p>
                                                    <span className="text-xs text-slate-400 mt-1 block">{blog.date}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500 italic">No posts yet. Be the first to write one!</p>
                            )}
                        </div>

                        {/* Trending Questions Widget */}
                        <div className="glass-panel p-6 rounded-2xl bg-slate-50 dark:bg-eng-blue-900 border border-slate-200 dark:border-slate-800">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                    <MessageSquare size={20} className="text-green-500" /> Active Discussions
                                </h3>
                                <Link to="/forum" className="text-sm text-eng-blue-600 hover:text-eng-blue-500 font-medium flex items-center gap-1">
                                    Join Forum <ArrowRight size={14} />
                                </Link>
                            </div>

                            {widgetsLoading ? (
                                <div className="space-y-4 animate-pulse">
                                    {[1, 2, 3].map(i => <div key={i} className="h-12 bg-slate-200 dark:bg-eng-blue-800 rounded-lg"></div>)}
                                </div>
                            ) : trendingQuestions.length > 0 ? (
                                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                                    {trendingQuestions.map(q => (
                                        <Link key={q.id} to={`/forum/${q.id}`} className="block group py-3 first:pt-0 last:pb-0">
                                            <div className="flex justify-between items-start gap-4">
                                                <div>
                                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-eng-blue-600 dark:group-hover:text-cyan-accent transition-colors line-clamp-1">{q.title}</h4>
                                                    <div className="flex gap-2 mt-1">
                                                        {q.tags.slice(0, 2).map(tag => (
                                                            <span key={tag} className="text-[10px] bg-slate-200 dark:bg-eng-blue-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded">{tag}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-center min-w-[3rem]">
                                                    <span className="text-xs font-bold text-slate-900 dark:text-white">{q.answers ? q.answers.length : 0}</span>
                                                    <span className="text-[10px] text-slate-500">replies</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500 italic">No questions yet. Ask something!</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Core Engineering Rules & Design Guidance Section (Primary Features Only) */}
            <div className="py-24 sm:py-32 bg-slate-50 dark:bg-eng-blue-900">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:text-center mb-16">
                        <h2 className="text-base font-semibold leading-7 text-eng-blue-600 dark:text-cyan-accent uppercase tracking-wider">Expert Guidance</h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                            {content.home_rules_title}
                        </p>
                        <p className="mt-4 text-base text-slate-800 dark:text-slate-400">
                            Practical rules, common code principles, and frequent steel design mistakes every engineer should know.
                        </p>
                    </div>

                    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                            {/* General Engineering Rules */}
                            <div className="flex flex-col glass-panel p-8 rounded-3xl hover:bg-white dark:hover:bg-eng-blue-800 transition-colors group">
                                <dt className="flex items-center gap-x-3 text-base font-bold leading-7 text-slate-900 dark:text-white mb-4">
                                    <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-eng-blue-600/10 dark:bg-cyan-accent/10 text-eng-blue-600 dark:text-cyan-accent group-hover:scale-110 transition-transform font-bold">
                                        <ShieldCheck size={24} />
                                    </div>
                                    {content.card_1_title}
                                </dt>
                                <dd className="flex flex-auto flex-col text-sm leading-7 text-slate-800 dark:text-slate-400">
                                    <ul className="space-y-2">
                                        {renderList(content.card_1_list)}
                                    </ul>
                                </dd>
                            </div>

                            {/* BS-Style Code Principles */}
                            <div className="flex flex-col glass-panel p-8 rounded-3xl hover:bg-white dark:hover:bg-eng-blue-800 transition-colors group">
                                <dt className="flex items-center gap-x-3 text-base font-bold leading-7 text-slate-900 dark:text-white mb-4">
                                    <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-eng-blue-600/10 dark:bg-cyan-accent/10 text-eng-blue-600 dark:text-cyan-accent group-hover:scale-110 transition-transform">
                                        <Cpu size={24} />
                                    </div>
                                    {content.card_2_title}
                                </dt>
                                <dd className="flex flex-auto flex-col text-sm leading-7 text-slate-800 dark:text-slate-400">
                                    <ul className="space-y-2">
                                        {renderList(content.card_2_list)}
                                    </ul>
                                </dd>
                            </div>

                            {/* Common Steel Errors */}
                            <div className="flex flex-col glass-panel p-8 rounded-3xl border-red-200/50 dark:border-red-900/40 bg-red-50/20 dark:bg-red-900/10 hover:bg-white dark:hover:bg-red-900/20 transition-colors group">
                                <dt className="flex items-center gap-x-3 text-base font-bold leading-7 text-red-700 dark:text-red-400 mb-4">
                                    <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-red-600/10 text-red-600 group-hover:scale-110 transition-transform">
                                        <X size={24} />
                                    </div>
                                    {content.card_3_title}
                                </dt>
                                <dd className="flex flex-auto flex-col text-sm leading-7 text-slate-900 dark:text-slate-200 font-bold">
                                    <ul className="space-y-2">
                                        {renderList(content.card_3_list)}
                                    </ul>
                                </dd>
                            </div>
                        </dl>
                    </div>

                    <div className="mt-20 pt-10 border-t border-slate-200 dark:border-slate-800 text-center">
                        <div className="inline-flex items-center gap-2 bg-white/50 dark:bg-eng-blue-900 px-6 py-3 rounded-full border border-slate-200 dark:border-slate-700 text-sm mb-8">
                            <Bot size={18} className="text-eng-blue-600 dark:text-cyan-accent" />
                            <span className="text-slate-900 dark:text-slate-300 font-bold">AI Assistant Note:</span>
                            <span className="text-slate-800 dark:text-slate-400">Provides guidance—does not replace professional judgment or official codes.</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-500 italic">
                            Engineering is not about guessing — it is about disciplined assumptions, verified calculations, and safe judgment.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
