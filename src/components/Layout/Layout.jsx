import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import FloatingChat from '../Chat/FloatingChat';
import { ThemeProvider } from '../../context/ThemeContext';

const Layout = () => {
    return (
        <ThemeProvider>
            <div className="min-h-screen font-sans transition-colors duration-300 selection:bg-cyan-accent selection:text-eng-blue-900">
                <Navbar />
                <main className="relative z-10">
                    <Outlet />
                </main>
                <FloatingChat />

                {/* Global Ambient Glow for Dark Mode */}
                <div className="fixed inset-0 pointer-events-none z-0 opacity-0 dark:opacity-100 transition-opacity duration-1000">
                    <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-sky-blue-600/20 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-accent/10 rounded-full blur-[150px]" />
                </div>
            </div>
        </ThemeProvider>
    );
};

export default Layout;
