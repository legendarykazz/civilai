import React from 'react';
import { MessageCircle, ThumbsUp, Eye, Search } from 'lucide-react';

const ForumPage = () => {
    const questions = [
        {
            title: "What is the best way to model pile foundation elasticity in ProtaStructure?",
            author: "CivilEng_99",
            answers: 12,
            views: 340,
            tags: ["ProtaStructure", "Geotech"],
            votes: 45
        },
        {
            title: "AI suggestions for optimization of steel truss weight?",
            author: "Struct_Master",
            answers: 5,
            views: 120,
            tags: ["AI", "Steel", "Optimization"],
            votes: 28
        },
        {
            title: "Interpreting soil test report for high water table areas",
            author: "SiteManager_Lagos",
            answers: 23,
            views: 890,
            tags: ["Soil", "Construction"],
            votes: 15
        }
    ];

    return (
        <div className="py-12 px-6 max-w-5xl mx-auto min-h-screen">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-8 mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Community Q&A</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">Ask questions, get AI-assisted answers, and connect with peers.</p>
                </div>
                <button className="btn btn-primary bg-eng-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-eng-blue-500 shadow-lg shadow-eng-blue-600/20">
                    Ask a Question
                </button>
            </div>

            {/* Search */}
            <div className="relative mb-10">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search for engineering topics..."
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-0 bg-white dark:bg-eng-blue-800 shadow-sm focus:ring-2 focus:ring-cyan-accent text-slate-900 dark:text-white"
                />
            </div>

            {/* Questions List */}
            <div className="space-y-4">
                {questions.map((q, i) => (
                    <div key={i} className="bg-white dark:bg-eng-blue-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-eng-blue-300 dark:hover:border-cyan-accent/30 transition-all cursor-pointer flex gap-6 items-start">

                        {/* Stats */}
                        <div className="flex flex-col gap-2 text-center min-w-[60px] text-xs text-slate-500 dark:text-slate-400">
                            <div className="p-1 rounded bg-slate-100 dark:bg-eng-blue-800 font-medium text-slate-900 dark:text-white">
                                {q.votes} <span className="block text-[10px] font-normal">votes</span>
                            </div>
                            <div className={`p-1 rounded border ${q.answers > 0 ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400' : 'border-transparent'}`}>
                                {q.answers} <span className="block text-[10px] font-normal">answers</span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 hover:text-eng-blue-600 dark:hover:text-cyan-accent">{q.title}</h3>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {q.tags.map(tag => (
                                    <span key={tag} className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-eng-blue-800 text-xs font-bold text-eng-blue-600 dark:text-sky-300">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-400 font-medium">
                                <span>asked by <span className="text-eng-blue-700 dark:text-sky-400 font-bold">{q.author}</span></span>
                                <span>• 2 hours ago</span>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default ForumPage;
