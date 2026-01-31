import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { ArrowLeft, Calendar, User, Tag, Loader2 } from 'lucide-react';

const BlogPostPage = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPost = async () => {
            try {
                const data = await api.getBlogById(id);
                setPost(data);
            } catch (error) {
                console.error("Failed to load post", error);
            } finally {
                setLoading(false);
            }
        };
        loadPost();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-eng-blue-600" size={40} />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <h2 className="text-2xl font-bold dark:text-white">Post not found</h2>
                <Link to="/blog" className="text-eng-blue-600 hover:underline">Back to Blog</Link>
            </div>
        );
    }

    return (
        <article className="pb-20 bg-white dark:bg-eng-blue-950 min-h-screen">
            {/* Hero Image */}
            <div className="w-full h-[400px] relative">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-eng-blue-950/90 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-6 sm:p-12 max-w-7xl mx-auto">
                    <Link to="/blog" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
                        <ArrowLeft size={20} /> Back to Insights
                    </Link>
                    <div className="flex gap-2 mb-4">
                        {post.tags && post.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-cyan-accent/20 text-cyan-accent text-sm rounded-full font-semibold backdrop-blur-md">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight max-w-4xl">
                        {post.title}
                    </h1>
                    <div className="flex items-center gap-6 text-white/80 text-sm sm:text-base font-medium">
                        <span className="flex items-center gap-2"><User size={18} /> {post.author}</span>
                        <span className="flex items-center gap-2"><Calendar size={18} /> {post.date}</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {post.content}
                </div>
            </div>
        </article>
    );
};

export default BlogPostPage;
