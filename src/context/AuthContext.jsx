import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for saved user
        const savedUser = localStorage.getItem('civil_ai_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (username) => {
        // Simulate API call
        const mockUser = {
            id: Date.now().toString(),
            name: username || 'Engineer User',
            role: 'user',
            avatar: `https://ui-avatars.com/api/?name=${username}&background=0D8ABC&color=fff`
        };

        localStorage.setItem('civil_ai_user', JSON.stringify(mockUser));
        setUser(mockUser);
        return mockUser;
    };

    const logout = () => {
        localStorage.removeItem('civil_ai_user');
        setUser(null);
    };

    const value = {
        user,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
