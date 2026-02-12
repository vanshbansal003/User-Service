import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('CUSTOMER');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const data = await login(username, password);
            // Normalized role check
            const userRoles = data.roles.map(r => r.toUpperCase());
            const hasRole = userRoles.includes(`ROLE_${role}`) || userRoles.includes(role);

            if (!hasRole) {
                setError(`Access Denied: You are not registered as an ${role}.`);
                return;
            }
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid username or password. Please try again.');
        }
    };

    return (
        <div className="auth-wrapper fade-in">
            <div className="auth-card glass">
                <h2>Welcome Back</h2>
                <p>Securely sign in to your SafeGuard account</p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="role-selector-container">
                        <label>Sign in as</label>
                        <div className="role-toggle">
                            <button
                                type="button"
                                className={`role-option ${role === 'CUSTOMER' ? 'active' : ''}`}
                                onClick={() => setRole('CUSTOMER')}
                            >
                                User
                            </button>
                            <button
                                type="button"
                                className={`role-option ${role === 'ADMIN' ? 'active' : ''}`}
                                onClick={() => setRole('ADMIN')}
                            >
                                Admin
                            </button>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Username</label>
                        <input type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>Sign In</button>
                </form>

                <div className="auth-footer">
                    Don't have an account? <Link to="/register">Create one</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
