// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
    };

    const checkAuth = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const user = await api.validateToken(token);
                setUser(user);
            } catch {
                localStorage.removeItem('token');
            }
        }
    }, []);

    useEffect(() => { checkAuth(); }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};