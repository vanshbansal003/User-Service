import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('http://localhost:8080/api/users/me', {
                headers: { Authorization: `Bearer ${token}` }
            }).then(response => {
                setUser(response.data);
            }).catch(() => {
                localStorage.removeItem('token');
                setUser(null);
            }).finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (username, password) => {
        const response = await axios.post('http://localhost:8080/api/auth/login', { username, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            // Re-fetch user details to insure complete profile
            const profileResponse = await axios.get('http://localhost:8080/api/users/me', {
                headers: { Authorization: `Bearer ${response.data.token}` }
            });
            setUser(profileResponse.data);
        }
        return response.data;
    };

    const register = async (userData) => {
        return await axios.post('http://localhost:8080/api/auth/register', userData);
    };
    
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
