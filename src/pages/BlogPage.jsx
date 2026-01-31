import React, { useState, useEffect } from 'react';
import { Calendar, User, ArrowRight, Tag, Plus, PenTool } from 'lucide-react';
import { api } from '../services/api';
import CreateBlogModal from '../components/Blog/CreateBlogModal';
import { Link } from 'react-router-dom';

const BlogPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const loadPosts = async () => {
        setLoading(true);
        try {
            const data = await api.getBlogs(true); // Only Approved
            setPosts(data);
        } catch (error) {
            console.error("Failed to load blogs", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPosts();
    }, []);

    return (
        <div className="py-20 px-6 max-w-7xl mx-auto min-h-screen relative">
            <div className="text-center mb-16">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl mb-4">Engineering Insights</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">Latest updates from the world of smart construction.</p>
            </div>

            {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-96 rounded-2xl bg-slate-200 dark:bg-eng-blue-900 animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <article key={post.id} className="glass-panel overflow-hidden rounded-2xl group cursor-pointer hover:-translate-y-1 transition-transform duration-300 flex flex-col h-full bg-white dark:bg-eng-blue-900 border-slate-200 dark:border-slate-800">
                            <div className="relative h-48 overflow-hidden">
                                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                                    {post.tags && post.tags.map(tag => (
                                        <span key={tag} className="px-2 py-1 bg-black/50 backdrop-blur-md text-white text-xs rounded-md font-medium flex items-center gap-1">
                                            <Tag size={10} /> {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center gap-4 text-xs text-slate-700 dark:text-slate-400 mb-4 font-semibold">
                                    <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                                    <span className="flex items-center gap-1"><User size={12} /> {post.author}</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-eng-blue-600 dark:group-hover:text-cyan-accent transition-colors line-clamp-2">
                                    {post.title}
                                </h3>
                                <p className="text-slate-800 dark:text-slate-400 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                                    {post.excerpt}
                                </p>
                                <Link to={`/blog/${post.id}`} className="inline-flex items-center text-sm font-semibold text-eng-blue-600 dark:text-cyan-accent hover:gap-2 transition-all">
                                    Read Article <ArrowRight size={16} className="ml-1" />
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {/* Floating Action Button */}
            <button
                onClick={() => setIsCreateModalOpen(true)}
                className="fixed bottom-8 left-8 z-40 w-14 h-14 rounded-full bg-eng-blue-600 hover:bg-eng-blue-500 text-white shadow-xl shadow-eng-blue-600/30 flex items-center justify-center transition-all hover:scale-110 active:scale-95 group"
                title="Write a Post"
            >
                <PenTool size={24} className="group-hover:rotate-12 transition-transform" />
            </button>

            <CreateBlogModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onPostCreated={loadPosts}
            />
        </div>
    );
};

export default BlogPage;
