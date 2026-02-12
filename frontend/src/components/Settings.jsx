import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, Calendar, Save, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import './Settings.css';

const Settings = () => {
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        address: '',
        dateOfBirth: ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || '',
                phoneNumber: user.phoneNumber || '',
                address: user.address || '',
                dateOfBirth: user.dateOfBirth || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:8080/api/users/me', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            // Refresh page to sync context after a short delay
            setTimeout(() => window.location.reload(), 1500);
        } catch (error) {
            console.error("Error updating profile", error);
            setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
        } finally {
            setIsSaving(false);
        }
    };

    if (!user) return <div className="container mt-5">Loading settings...</div>;

    return (
        <div className="container fade-in">
            <header className="page-header">
                <h1><User size={32} /> Account Settings</h1>
                <p>Manage your personal information and security preferences</p>
            </header>

            <div className="settings-grid">
                <div className="dashboard-card glass profile-sidebar">
                    <div className="profile-avatar-large">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <h3>{user.username}</h3>
                    <p className="text-muted">{user.role}</p>
                    <div className="profile-meta">
                        <div className="meta-item">
                            <Mail size={16} /> <span>{user.email}</span>
                        </div>
                    </div>
                </div>

                <div className="dashboard-card glass profile-form-card">
                    <div className="card-title">
                        <h3>Personal Information</h3>
                    </div>

                    {message.text && (
                        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="settings-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label><User size={16} /> Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Enter your full name"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label><Phone size={16} /> Phone Number</label>
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    placeholder="+1 (555) 000-0000"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label><MapPin size={16} /> Address</label>
                            <input
                                type="text"
                                name="address"
                                placeholder="123 Ocean View Dr, Cyber City"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label><Calendar size={16} /> Date of Birth</label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary" disabled={isSaving}>
                                <Save size={18} style={{ marginRight: '8px' }} />
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Settings;
