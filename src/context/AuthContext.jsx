import React, { createContext, useContext, useState, useEffect } from 'react';
import { checkAdminByEmail } from '../services/adminService';

const AuthContext = createContext();

const STORAGE_KEY = 'divine_match_user';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user from local storage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem(STORAGE_KEY);
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user session", e);
            }
        }
        setLoading(false);
    }, []);

    const loginWithGoogle = async () => {
        // Mocking Google OAuth flow
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockGoogleUser = {
                    id: 'google-user-' + Date.now(),
                    email: 'blessed.soul@gmail.com',
                    name: 'Blessed Soul',
                    avatar: 'https://ui-avatars.com/api/?name=Blessed+Soul&background=9b6a38&color=fff',
                    provider: 'google',
                    role: 'admin' // Grandfathered role for testing
                };
                setUser(mockGoogleUser);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(mockGoogleUser));
                resolve(mockGoogleUser);
            }, 800);
        });
    };

    const loginWithEmail = async (email, password) => {
        if (!email || !password) {
            throw new Error('Invalid email or password');
        }

        try {
            // Check if this email exists in our Supabase admins table
            const adminRecord = await checkAdminByEmail(email);

            let authUser;

            if (adminRecord) {
                // This user is an admin or host
                authUser = {
                    id: adminRecord.id,
                    email: adminRecord.email,
                    name: adminRecord.name,
                    avatar: `https://ui-avatars.com/api/?name=${adminRecord.name.replace(' ', '+')}&background=9b6a38&color=fff`,
                    provider: 'email',
                    role: adminRecord.role // 'admin' or 'host'
                };
            } else if (email === 'admin@divinematch.com') {
                // Fallback in case the Supabase table isn't set up yet
                authUser = {
                    id: 'fallback-admin',
                    email,
                    name: 'Grand Admin',
                    avatar: `https://ui-avatars.com/api/?name=Grand+Admin&background=9b6a38&color=fff`,
                    provider: 'email',
                    role: 'admin'
                };
            } else {
                // Regular user
                authUser = {
                    id: 'email-user-' + Date.now(),
                    email,
                    name: email.split('@')[0],
                    avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=9b6a38&color=fff`,
                    provider: 'email',
                    role: 'user'
                };
            }

            setUser(authUser);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
            return authUser;

        } catch (error) {
            throw new Error('Authentication failed');
        }
    };

    const signupWithEmail = async (name, email, password) => {
        // Mocking Signup
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email && password && name) {
                    const mockUser = {
                        id: 'email-user-' + Date.now(),
                        email,
                        name,
                        avatar: `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=9b6a38&color=fff`,
                        provider: 'email'
                    };
                    setUser(mockUser);
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
                    resolve(mockUser);
                } else {
                    reject(new Error('Please fill all fields'));
                }
            }, 500);
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
    };

    const value = {
        user,
        loading,
        loginWithGoogle,
        loginWithEmail,
        signupWithEmail,
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
