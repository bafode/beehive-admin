import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

// Create AuthContext
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        user: null
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                setAuth({ isAuthenticated: true, user });
            } catch (error) {
                console.error('Failed to parse user from localStorage', error);
                localStorage.removeItem('user');
            }
        }
    }, []);

    const login = async (data) => {
        try {
            const res = await axiosInstance.post('/auth/login', data);
            const user = res?.data?.user;
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', res?.data?.tokens?.access?.token);
            setAuth({ isAuthenticated: true, user });
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        } catch (error) {
            console.log({ error });
        }
    };

    const logout = async () => {
        try {
            await axiosInstance.post('/auth/logout');
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            setAuth({ isAuthenticated: false, user: null });
        } catch (error) {
            console.log({ error });
        }
    };

    return <AuthContext.Provider value={{ auth, login, logout }}>{children}</AuthContext.Provider>;
};

// Custom hook for using auth context
export const useAuth = () => {
    return useContext(AuthContext);
};
