import React from 'react';
import { NavLink } from 'react-router-dom';
import { Bot, Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const { isDarkMode, toggleTheme } = useTheme();

    const navLinkClass = ({ isActive }) =>
        `text-sm font-bold transition-colors ${isActive
            ? 'text-cyan-accent active-glow'
            : 'text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`;

    return (
        <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-eng-blue-900/80 backdrop-blur-md sticky top-0 z-40 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">

                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-eng-blue-600 to-eng-blue-900 dark:from-sky-blue-500 dark:to-cyan-accent flex items-center justify-center text-white shadow-lg">
                            <Bot size={24} />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">CivilAI</span>
                            <span className="text-[10px] uppercase tracking-widest text-cyan-accent font-semibold">Intelligence</span>
                        </div>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        <NavLink to="/" className={navLinkClass}>Home</NavLink>
                        <NavLink to="/blog" className={navLinkClass}>Blog</NavLink>
                        <NavLink to="/forum" className={navLinkClass}>Forum</NavLink>

                        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>

                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-cyan-accent"
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-cyan-accent"
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button onClick={() => setIsOpen(!isOpen)} className="text-slate-500 dark:text-slate-300">
                            {isOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white dark:bg-eng-blue-900 border-b border-slate-200 dark:border-slate-800 p-4 space-y-4">
                    <NavLink to="/" className="block py-2 text-slate-700 dark:text-slate-200">Home</NavLink>
                    <NavLink to="/blog" className="block py-2 text-slate-700 dark:text-slate-200">Blog</NavLink>
                    <NavLink to="/forum" className="block py-2 text-slate-700 dark:text-slate-200">Forum</NavLink>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
