import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const STORAGE_KEY = 'divine_match_user';
const TOKEN_KEY = 'divine_match_token';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user and token from local storage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem(STORAGE_KEY);
        const storedToken = localStorage.getItem(TOKEN_KEY);

        if (storedUser && storedToken) {
            try {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
                // Optionally set axios default header here if making authenticated requests
                axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            } catch (e) {
                console.error("Failed to parse user session", e);
                localStorage.removeItem(STORAGE_KEY);
                localStorage.removeItem(TOKEN_KEY);
            }
        }
        setLoading(false);
    }, []);

    const loginWithGoogle = async (credential) => {
        try {
            const response = await axios.post(`${API_URL}/auth/google`, {
                credential
            });

            const { token, user } = response.data;

            setUser(user);
            setToken(token);

            localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
            localStorage.setItem(TOKEN_KEY, token);

            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            return user;
        } catch (error) {
            console.error('Login failed', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Authentication failed');
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(TOKEN_KEY);
        delete axios.defaults.headers.common['Authorization'];
    };

    const signupWithEmail = async (name, email, password, role) => {
        try {
            const response = await axios.post(`${API_URL}/auth/register`, {
                name, email, password, role
            });
            const { token, user } = response.data;
            setUser(user);
            setToken(token);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
            localStorage.setItem(TOKEN_KEY, token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            return user;
        } catch (error) {
            console.error('Signup failed', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
    };

    const loginWithEmail = async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                email, password
            });
            const { token, user } = response.data;
            setUser(user);
            setToken(token);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
            localStorage.setItem(TOKEN_KEY, token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            return user;
        } catch (error) {
            console.error('Login failed', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Authentication failed');
        }
    };

    const value = {
        user,
        token,
        loading,
        loginWithGoogle,
        signupWithEmail,
        loginWithEmail,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
