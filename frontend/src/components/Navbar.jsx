import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">🛡️ SafeGuard</div>
            <div className="navbar-links">
                {user ? (
                    <>
                        <Link to="/dashboard">Overview</Link>
                        <Link to="/policies">Policies</Link>
                        <Link to="/claims">Claims Center</Link>
                        <Link to="/settings">Settings</Link>
                        <div className="dropdown">
                            <div className="user-initials">
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                            <span className="nav-link dropdown-toggle">{user.username}</span>
                            <div className="dropdown-menu glass">
                                <button onClick={handleLogout} className="dropdown-item logout-btn">Logout</button>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register" className="btn btn-primary">Get Started</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
