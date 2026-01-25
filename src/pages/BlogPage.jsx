import React from 'react';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';

const BlogPage = () => {
    const posts = [
        {
            title: "The Future of Structural Health Monitoring",
            excerpt: "How AI and IoT sensors are revolutionizing how we maintain aging infrastructure.",
            date: "Jan 24, 2026",
            author: "Dr. A. Smith",
            tags: ["AI", "Structures"],
            image: "https://images.unsplash.com/photo-1581093588402-4857474d2f78?auto=format&fit=crop&q=80&w=800"
        },
        {
            title: "Optimizing Concrete Mixes with Machine Learning",
            excerpt: "Reducing carbon footprint while maintaining strength using predictive models.",
            date: "Jan 20, 2026",
            author: "Engr. J. Doe",
            tags: ["Materials", "Sustainability"],
            image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800"
        },
        {
            title: "Automated Rebar Detailing: A Case Study",
            excerpt: "Project review: Saving 400 hours on the Lagos High-Rise project.",
            date: "Jan 15, 2026",
            author: "Oiuwayemi AI",
            tags: ["Construction", "Case Study"],
            image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=800"
        }
    ];

    return (
        <div className="py-20 px-6 max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl mb-4">Engineering Insights</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">Latest updates from the world of smart construction.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post, index) => (
                    <article key={index} className="glass-panel overflow-hidden rounded-2xl group cursor-pointer hover:-translate-y-1 transition-transform duration-300 flex flex-col h-full bg-white dark:bg-eng-blue-900 border-slate-200 dark:border-slate-800">
                        <div className="relative h-48 overflow-hidden">
                            <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute top-4 left-4 flex gap-2">
                                {post.tags.map(tag => (
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
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-eng-blue-600 dark:group-hover:text-cyan-accent transition-colors">
                                {post.title}
                            </h3>
                            <p className="text-slate-800 dark:text-slate-400 text-sm leading-relaxed mb-6 flex-1">
                                {post.excerpt}
                            </p>
                            <a href="#" className="inline-flex items-center text-sm font-semibold text-eng-blue-600 dark:text-cyan-accent hover:gap-2 transition-all">
                                Read Article <ArrowRight size={16} className="ml-1" />
                            </a>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
};

export default BlogPage;
