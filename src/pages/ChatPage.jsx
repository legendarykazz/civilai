import React, { useRef, useEffect, useState } from 'react';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { useN8nChat } from '../hooks/useN8nChat';

const ChatPage = () => {
    const { messages, isLoading, sendMessage } = useN8nChat();
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;
        sendMessage(inputValue);
        setInputValue('');
    };

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[var(--text-secondary)]">
                    Civil Engineering Assistant
                </h2>
                <p className="text-[var(--text-secondary)] mt-1">
                    Ask about structural design, AutoCAD, or site management.
                </p>
            </div>

            {/* Chat Container */}
            <div className="flex-1 overflow-hidden flex flex-col glass-panel shadow-2xl shadow-black/50 overflow-hidden">

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                            {/* Avatar */}
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user'
                                        ? 'bg-[var(--bg-tertiary)] border border-[var(--border-color)]'
                                        : 'bg-gradient-to-br from-[var(--primary)] to-purple-600 shadow-lg shadow-indigo-500/20'
                                    }`}
                            >
                                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} color="white" />}
                            </div>

                            {/* Bubble */}
                            <div
                                className={`max-w-[75%] p-4 rounded-2xl ${msg.role === 'user'
                                        ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-tr-sm border border-[var(--border-color)]'
                                        : 'bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-tl-sm border border-[var(--border-color)] shadow-sm'
                                    } ${msg.isError ? 'border-red-500/50 text-red-100 bg-red-900/10' : ''}`}
                            >
                                <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                                <div className="mt-2 text-[10px] opacity-40">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-purple-600 flex items-center justify-center flex-shrink-0 opacity-80">
                                <Bot size={20} color="white" />
                            </div>
                            <div className="bg-[var(--bg-secondary)] p-4 rounded-2xl rounded-tl-sm border border-[var(--border-color)] flex items-center gap-2">
                                <Loader2 size={16} className="animate-spin text-[var(--primary)]" />
                                <span className="text-sm text-[var(--text-secondary)]">Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]/50">
                    <form onSubmit={handleSend} className="relative flex gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask about your project..."
                            className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !inputValue.trim()}
                            className="btn btn-primary px-5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
