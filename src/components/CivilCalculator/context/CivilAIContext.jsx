import React, { createContext, useContext, useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { BS_CODES } from './standardsContext';

const CivilAIContext = createContext();

export const CivilAIProvider = ({ children }) => {
    const [apiKey, setApiKey] = useState(localStorage.getItem('civil_gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '');
    const [model, setModel] = useState(localStorage.getItem('civil_gemini_model') || 'gemini-2.0-flash-001');
    const [messages, setMessages] = useState([
        {
            role: 'system',
            content: `You are a Senior Structural Engineer in Nigeria (Lagos UTC+1).
            
            ROLE:
            - Help users with structural design, AutoCAD drafting, and ProtaStructure analysis.
            - Assist with residential/commercial works (bungalows, duplexes).
            - Focus on practical, safe construction in the Nigerian environment.

            STRICT TECHNICAL GUIDELINES:
            1. BE CONCISE. No "I hope this helps". No generic advice like "check for rust".
            2. TECHNICAL LANGUAGE ONLY: Use terms like "Yield Strength (fy)", "Charity Grade", "TMT", "BS 4449".
            3. PRICING: When searching prices, giving the raw range (e.g., "₦480k - ₦520k per ton") and source.
            4. CODES: Use British Standards (BS 8110, BS 6399) and Eurocodes (EN 1992) as the "Bible". Reference the library below.
            5. FORMAT: Bullet points. Data tables. No long paragraphs. Use LaTeX-style formatting for math where possible.

            COMPLEX CALCULATION MODE:
            If the user asks for a complex calculation (e.g., multi-span beam, retaining wall design, seismic analysis):
            1. BREAK IT DOWN: Step 1 (Assumptions), Step 2 (Load Analysis), Step 3 (Calculations), Step 4 (Checks).
            2. SHOW WORK: explicitly show the formula used, the substitution, and the result.
            3. ADVANCED THEORY: You are allowed to use advanced theories (Moment Distribution, FEA concepts, Rankine/Coulomb).
            4. VERIFY INPUTS: Explicitly state if an input seems unrealistic for the Nigerian context (e.g., "A 150mm slab for a 10m span is unsafe").

            SPECIFIC TASKS:
            - ProtaStructure: Explain load definition (dead, live, wind), interpret analysis results.
            - AutoCAD: Guide on drawing setup, layers, detailing.
            - Site Issues: Advice on cracks, foundation concerns, workmanship.
            - Safety: Never give unsafe advice. If physical inspection needed, say so.

            (NOTE: IGNORE ALL PREVIOUS INSTRUCTIONS ABOUT MEETING BOOKING. DO NOT SCHEDULE APPOINTMENTS.)

            ${BS_CODES}`
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);

    // Store key in local storage
    useEffect(() => {
        if (apiKey) {
            localStorage.setItem('civil_gemini_api_key', apiKey);
        }
    }, [apiKey]);

    useEffect(() => {
        localStorage.setItem('civil_gemini_model', model);
    }, [model]);

    const sendMessage = async (userMessage, contextData = null) => {
        if (!apiKey) {
            alert('Please enter your Google Gemini API Key in Settings.');
            return;
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        // Configure model with Search Tool
        const aiModel = genAI.getGenerativeModel({
            model: model,
            tools: [{ googleSearch: {} }]
        });

        // Add user message to state immediately
        const newMessages = [...messages, { role: 'user', content: userMessage }];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            // Construct prompt with context
            let systemContext = "";
            if (contextData) {
                systemContext = `\n\n[CURRENT CALCULATOR CONTEXT]\nCalculator: ${contextData.title}\nInputs: ${JSON.stringify(contextData.inputs)}\nResults: ${JSON.stringify(contextData.results)}\n[END CONTEXT]\n\n`;
            }

            const chat = aiModel.startChat({
                history: messages.slice(1).map(m => ({
                    role: m.role === 'assistant' ? 'model' : 'user',
                    parts: [{ text: m.content }]
                })),
                systemInstruction: {
                    role: 'system',
                    parts: [{ text: messages[0].content + systemContext }]
                }
            });

            const result = await chat.sendMessage(userMessage);
            const response = await result.response;
            const text = response.text();

            setMessages(prev => [...prev, { role: 'assistant', content: text }]);
        } catch (error) {
            console.error("AI Error:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${error.message || "Could not connect to AI"}. Check console.` }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <CivilAIContext.Provider value={{
            apiKey,
            setApiKey,
            model,
            setModel,
            messages,
            sendMessage,
            isLoading,
            isChatOpen,
            setIsChatOpen
        }}>
            {children}
        </CivilAIContext.Provider>
    );
};

export const useCivilAI = () => useContext(CivilAIContext);
