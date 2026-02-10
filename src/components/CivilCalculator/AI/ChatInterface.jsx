import React, { useState, useRef, useEffect } from 'react';
import { useCivilAI } from '../context/CivilAIContext';
import ReactMarkdown from 'react-markdown';
import { generatePDFReport } from '../utils/pdfGenerator';

const ChatInterface = ({ contextData }) => {
    const { messages, sendMessage, isLoading, isChatOpen, setIsChatOpen, apiKey } = useCivilAI();
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isChatOpen]);

    const handleSend = () => {
        if (!input.trim()) return;
        sendMessage(input, contextData);
        setInput('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!isChatOpen) {
        return (
            <button
                onClick={() => setIsChatOpen(true)}
                style={{
                    position: 'fixed',
                    bottom: '2rem',
                    right: '2rem',
                    backgroundColor: 'var(--color-accent, #0ea5e9)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '60px',
                    height: '60px',
                    fontSize: '1.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    cursor: 'pointer',
                    zIndex: 900,
                    transition: 'transform 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                🤖
            </button>
        );
    }

    return (
        <div style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            width: '380px',
            height: '600px',
            maxHeight: 'calc(100vh - 4rem)',
            backgroundColor: 'var(--color-bg-secondary, #ffffff)',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            border: '1px solid var(--color-border, #e2e8f0)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 900,
            overflow: 'hidden'
        }}>
            {/* Header */}
            <div style={{
                padding: '1rem',
                borderBottom: '1px solid var(--color-border, #e2e8f0)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'rgba(15, 23, 42, 0.95)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>🤖</span>
                    <h3 style={{ margin: 0, fontSize: '1rem', color: '#f8fafc' }}>Engineering Co-pilot</h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                        onClick={() => generatePDFReport(messages, contextData)}
                        style={{
                            background: 'none',
                            border: '1px solid #475569',
                            borderRadius: '0.25rem',
                            color: '#94a3b8',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            padding: '0.2rem 0.5rem'
                        }}
                        title="Download PDF Report"
                    >
                        📄 Export
                    </button>
                    <button
                        onClick={() => setIsChatOpen(false)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#94a3b8',
                            fontSize: '1.2rem',
                            cursor: 'pointer'
                        }}
                    >
                        ×
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div style={{
                flex: 1,
                padding: '1rem',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                backgroundColor: 'var(--color-bg-primary, #f8fafc)'
            }}>
                {messages.filter(m => m.role !== 'system').map((msg, idx) => (
                    <div
                        key={idx}
                        style={{
                            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                            backgroundColor: msg.role === 'user' ? 'var(--color-accent, #0ea5e9)' : 'white',
                            color: msg.role === 'user' ? 'white' : '#1e293b',
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            maxWidth: '85%',
                            fontSize: '0.9rem',
                            border: msg.role === 'assistant' ? '1px solid #e2e8f0' : 'none',
                            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                        }}
                    >
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                ))}

                {isLoading && (
                    <div style={{ alignSelf: 'flex-start', color: '#64748b', fontSize: '0.8rem', paddingLeft: '0.5rem' }}>
                        Thinking...
                    </div>
                )}

                {!apiKey && messages.length <= 1 && (
                    <div style={{
                        alignSelf: 'center',
                        padding: '1rem',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid #ef4444',
                        borderRadius: '0.5rem',
                        fontSize: '0.9rem',
                        color: '#1e293b',
                        textAlign: 'center'
                    }}>
                        ⚠️ API Key Missing. Please set it in Settings.
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{
                padding: '1rem',
                borderTop: '1px solid var(--color-border, #e2e8f0)',
                backgroundColor: 'var(--color-bg-secondary, #ffffff)'
            }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask about your calculation..."
                        style={{
                            flex: 1,
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            border: '1px solid #cbd5e1',
                            backgroundColor: '#ffffff',
                            color: '#1e293b',
                            outline: 'none'
                        }}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        style={{
                            padding: '0.75rem',
                            backgroundColor: 'var(--color-accent, #0ea5e9)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: (isLoading || !input.trim()) ? 'not-allowed' : 'pointer',
                            opacity: (isLoading || !input.trim()) ? 0.7 : 1
                        }}
                    >
                        ➤
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;
