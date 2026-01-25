import { useState } from 'react';

const WEBHOOK_URL = '/api/chat';

export const useN8nChat = () => {
    // Initial welcome message
    const [messages, setMessages] = useState([
        {
            id: 'welcome',
            role: 'assistant',
            content: 'Hi there! 👋\nMy name is Oluwayemi. How can I help you today regarding Civil Engineering works?',
            timestamp: new Date().toISOString()
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const sendMessage = async (text) => {
        if (!text.trim()) return;

        const userMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: text,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        setError(null);

        try {
            // Sending chatInput and sessionId as verified via direct testing
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chatInput: text,
                    sessionId: 'user-' + (localStorage.getItem('chat_session_id') || 'default')
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server error response:', errorText);
                throw new Error(`Server returned ${response.status}: ${errorText || response.statusText}`);
            }

            const data = await response.json();

            // n8n LangChain agent typically returns { output: "response text" }
            // Adjust based on actual payload if different (sometimes it's a list)
            const aiContent = data.output || data.text || JSON.stringify(data);

            const aiMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: aiContent,
                timestamp: new Date().toISOString()
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (err) {
            console.error('Chat Error:', err);
            setError('Failed to send message. Please try again.');

            // Optional: Add error message to chat
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'system',
                content: `Error: ${err.message}. Please check if the n8n workflow is active or if there is a network issue.`,
                timestamp: new Date().toISOString(),
                isError: true
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return { messages, isLoading, error, sendMessage };
};
