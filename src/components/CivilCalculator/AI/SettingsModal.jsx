import React, { useState, useEffect } from 'react';
import { useCivilAI } from '../context/CivilAIContext';

const SettingsModal = ({ onClose }) => {
    const { apiKey, setApiKey, model, setModel } = useCivilAI();
    const [inputKey, setInputKey] = useState(apiKey);
    const [selectedModel, setSelectedModel] = useState(model);

    // Ensure we start with a valid model if the current one is stale
    useEffect(() => {
        if (!['gemini-2.0-flash-001', 'gemini-2.5-flash', 'gemini-flash-latest'].includes(selectedModel)) {
            // Optional: Auto-select a valid one if current is broken? 
            // Let's just let the user pick.
        }
    }, []);

    const handleSave = () => {
        setApiKey(inputKey);
        setModel(selectedModel);
        onClose();
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(5px)'
        }}>
            <div style={{
                backgroundColor: 'var(--color-bg-secondary, #ffffff)',
                padding: '2rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--color-border, #e2e8f0)',
                width: '450px',
                maxWidth: '90%',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}>
                <h2 style={{ color: 'var(--color-text-primary, #1e293b)', marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 'bold' }}>AI Settings</h2>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', color: 'var(--color-text-secondary, #64748b)', marginBottom: '0.5rem' }}>
                        Google Gemini API Key
                    </label>
                    <input
                        type="password"
                        value={inputKey}
                        onChange={(e) => setInputKey(e.target.value)}
                        placeholder="AIzaSy..."
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '0.375rem',
                            border: '1px solid #cbd5e1',
                            backgroundColor: '#ffffff',
                            color: '#1e293b'
                        }}
                    />
                    <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>
                        Your key is stored locally in your browser.
                    </p>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', color: '#64748b', marginBottom: '0.5rem' }}>
                        AI Model
                    </label>
                    <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '0.375rem',
                            border: '1px solid #cbd5e1',
                            backgroundColor: '#ffffff',
                            color: '#1e293b'
                        }}
                    >
                        <option value="gemini-2.0-flash-001">Gemini 2.0 Flash (Recommended)</option>
                        <option value="gemini-2.5-flash">Gemini 2.5 Flash (Preview)</option>
                        <option value="gemini-flash-latest">Gemini Flash Latest</option>
                    </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: 'transparent',
                            color: '#64748b',
                            border: '1px solid #cbd5e1',
                            borderRadius: '0.375rem',
                            cursor: 'pointer'
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: 'var(--color-accent, #0ea5e9)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
