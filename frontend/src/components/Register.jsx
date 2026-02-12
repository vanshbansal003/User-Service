import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'CUSTOMER'
    });
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(formData);
            navigate('/login');
        } catch (err) {
            setError('Registration failed. Username or Email may already be in use.');
        }
    };

    return (
        <div className="auth-wrapper fade-in">
            <div className="auth-card glass">
                <h2>Join SafeGuard</h2>
                <p>Protected, Simple, Comprehensive Insurance</p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="role-selector-container">
                        <label>Join as</label>
                        <div className="role-toggle">
                            <button
                                type="button"
                                className={`role-option ${formData.role === 'CUSTOMER' ? 'active' : ''}`}
                                onClick={() => setFormData({ ...formData, role: 'CUSTOMER' })}
                            >
                                User
                            </button>
                            <button
                                type="button"
                                className={`role-option ${formData.role === 'ADMIN' ? 'active' : ''}`}
                                onClick={() => setFormData({ ...formData, role: 'ADMIN' })}
                            >
                                Admin
                            </button>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Username</label>
                        <input type="text" name="username" placeholder="Choose a username" value={formData.username} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" name="email" placeholder="example@email.com" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>Create Account</button>
                </form>

                <div className="auth-footer">
                    Already part of the shield? <Link to="/login">Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
