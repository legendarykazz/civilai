import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, User, Bot, Loader2, Sparkles, ChevronDown } from 'lucide-react';
import { useN8nChat } from '../../hooks/useN8nChat';

const FloatingChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { messages, isLoading, sendMessage } = useN8nChat();
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;
        sendMessage(inputValue);
        setInputValue('');
    };

    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">

            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-[380px] max-w-[90vw] h-[600px] max-h-[80vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300 rounded-3xl glass-panel shadow-2xl shadow-cyan-accent/10 border-white/20 dark:border-white/10">

                    {/* Header */}
                    <div className="relative p-5 border-b border-white/10 bg-gradient-to-r from-eng-blue-800 to-eng-blue-900 dark:from-eng-blue-950 dark:to-eng-blue-900">
                        <div className="absolute inset-0 bg-grid-white/[0.05]" />
                        <div className="relative z-10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-cyan-accent/20 flex items-center justify-center border border-cyan-accent/30 text-cyan-accent shadow-[0_0_15px_rgba(0,229,255,0.3)]">
                                        <Bot size={20} />
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-eng-blue-900 animate-pulse" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-base">Engineering AI</h3>
                                    <p className="text-xs text-cyan-accent/80 font-medium">Online • Intelligent Model</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white/60 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                            >
                                <ChevronDown size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-white/50 dark:bg-eng-blue-900/50 backdrop-blur-sm scroll-smooth">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                            >
                                {msg.role !== 'user' && (
                                    <div className="w-8 h-8 rounded-full bg-eng-blue-100 dark:bg-eng-blue-800 flex items-center justify-center flex-shrink-0 text-eng-blue-600 dark:text-cyan-accent border border-eng-blue-200 dark:border-white/10">
                                        <Bot size={14} />
                                    </div>
                                )}

                                <div
                                    className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                            ? 'bg-eng-blue-600 text-white rounded-br-sm shadow-lg shadow-eng-blue-600/20'
                                            : 'bg-white dark:bg-eng-blue-800 text-slate-700 dark:text-slate-200 rounded-bl-sm border border-slate-100 dark:border-white/5 shadow-sm'
                                        }`}
                                >
                                    <div className="whitespace-pre-wrap">{msg.content}</div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex items-center gap-3 ml-11">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-cyan-accent rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    <div className="w-2 h-2 bg-cyan-accent rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <div className="w-2 h-2 bg-cyan-accent rounded-full animate-bounce" />
                                </div>
                                <span className="text-xs text-slate-400 font-medium animate-pulse">Computing...</span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-eng-blue-900">
                        <form onSubmit={handleSend} className="relative flex items-center gap-2">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Ask about structural design..."
                                    className="w-full bg-slate-100 dark:bg-eng-blue-950 border-0 rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-accent/50 text-slate-900 dark:text-white placeholder-slate-500"
                                />
                                <Sparkles size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-accent opacity-50" />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading || !inputValue.trim()}
                                className="p-3 bg-eng-blue-600 hover:bg-eng-blue-500 text-white rounded-xl transition-all shadow-lg shadow-eng-blue-600/20 disabled:opacity-50 disabled:shadow-none"
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Float Button */}
            {!isOpen && (
                <button
                    id="chat-trigger"
                    onClick={() => setIsOpen(true)}
                    className="group flex items-center justify-center gap-3 px-6 h-14 rounded-full bg-eng-blue-600 hover:bg-eng-blue-500 text-white shadow-lg shadow-eng-blue-600/30 hover:scale-105 transition-all duration-300 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <Bot size={24} />
                    <span className="font-semibold pr-1">AI Assistant</span>
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-accent opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-accent"></span>
                    </span>
                </button>
            )}
        </div>
    );
};

export default FloatingChat;
