import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, LayoutDashboard, Calendar, Settings, Bot } from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { icon: Home, label: 'Home', path: '/' },
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Calendar, label: 'Calendar', path: '/calendar' },
    ];

    return (
        <div className="w-64 h-screen border-r border-[var(--border-color)] bg-[var(--bg-secondary)] flex flex-col fixed left-0 top-0 z-20">
            {/* Logo Area */}
            <div className="p-6 flex items-center gap-3 border-b border-[var(--border-color)]">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[var(--primary)] to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <Bot size={24} color="white" />
                </div>
                <div>
                    <h1 className="font-bold text-lg tracking-tight">AI Workflow</h1>
                    <p className="text-xs text-[var(--text-secondary)]">n8n Connected</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 flex flex-col gap-2 mt-4">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                                ? 'bg-[var(--primary)] text-white shadow-lg shadow-indigo-500/25'
                                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-white'
                            }`
                        }
                    >
                        <item.icon size={20} />
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Footer / User */}
            <div className="p-4 border-t border-[var(--border-color)]">
                <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors text-left text-[var(--text-secondary)] hover:text-white">
                    <Settings size={20} />
                    <span className="font-medium">Settings</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
