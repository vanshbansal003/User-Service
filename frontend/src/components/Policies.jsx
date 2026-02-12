import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Shield, CheckCircle, Clock, PlusCircle, Edit2, Trash2, X } from 'lucide-react';
import axios from 'axios';
import './Policies.css';

const Policies = () => {
    const { user } = useContext(AuthContext);
    const [allProfiles, setAllProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newPolicy, setNewPolicy] = useState({
        username: '',
        policyNumber: '',
        premiumCharge: 75.0
    });

    const fetchAllProfiles = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/api/admin/all-profiles', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAllProfiles(response.data);
        } catch (error) {
            console.error("Error fetching all profiles", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.role === 'ADMIN') {
            fetchAllProfiles();
        } else {
            setLoading(false);
        }
    }, [user]);

    const isAdmin = user?.role === 'ADMIN';

    const handleApply = async () => {
        try {
            const token = localStorage.getItem('token');
            const newPolicyId = `POL-${Math.floor(1000 + Math.random() * 9000)}`;
            const updatedPolicies = [...(user.policies || []), newPolicyId];
            const updatedPremium = (user.monthlyPremium || 0) + 75.0;

            await axios.put('http://localhost:8080/api/users/me', {
                policies: updatedPolicies,
                monthlyPremium: updatedPremium
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            window.location.reload();
        } catch (error) {
            console.error("Error applying for policy", error);
        }
    };

    const handleAddPolicy = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:8080/api/admin/policies/${newPolicy.username}`, {
                policyNumber: newPolicy.policyNumber,
                premiumCharge: newPolicy.premiumCharge
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsAdding(false);
            fetchAllProfiles();
        } catch (error) {
            console.error("Error adding policy", error);
            alert("Failed to add policy. Check if user exists.");
        }
    };

    const handleUpdate = async (username, oldId) => {
        const newId = prompt("Enter new Policy ID:", oldId);
        if (!newId || newId === oldId) return;

        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:8080/api/admin/policies/${username}/${oldId}`, {
                newPolicyId: newId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchAllProfiles();
        } catch (error) {
            console.error("Error updating policy", error);
        }
    };

    const handleDelete = async (username, policyId) => {
        if (!window.confirm(`Are you sure you want to delete policy ${policyId} for ${username}?`)) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8080/api/admin/policies/${username}/${policyId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchAllProfiles();
        } catch (error) {
            console.error("Error deleting policy", error);
        }
    };

    const activePolicies = !isAdmin ? (user?.policies?.map((policyNum, index) => ({
        id: policyNum,
        type: index % 2 === 0 ? 'Comprehensive Plan' : 'Standard Coverage',
        status: 'Active',
        premium: user.monthlyPremium ? (user.monthlyPremium / (user.policies.length || 1)).toFixed(2) : 0,
        coverage: 'Market Value',
        nextPayment: '2026-03-01'
    })) || []) : [];

    if (loading && isAdmin) return <div className="container mt-5 text-center">Initializing policy module...</div>;
    if (!user) return <div className="container mt-5">Please sign in to view policies.</div>;

    return (
        <div className="container fade-in">
            <header className="page-header">
                <h1><Shield size={32} /> {isAdmin ? 'Master Policy Manager' : 'My Policies'}</h1>
                <p>{isAdmin ? 'Global oversight of all active insurance plans and user mappings' : 'Manage and track your active insurance coverage'}</p>
            </header>

            {isAdmin ? (
                <div className="dashboard-card glass full-width">
                    <div className="card-title">
                        <h3>📋 Global Policy Inventory</h3>
                        <button className="btn btn-primary btn-sm" onClick={() => setIsAdding(true)}>
                            <PlusCircle size={16} style={{ marginRight: '5px' }} /> Add New Policy
                        </button>
                    </div>

                    {isAdding && (
                        <div className="add-policy-overlay glass" style={{ padding: '20px', borderRadius: '15px', marginBottom: '20px', border: '1px solid var(--primary)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                <h4>Assign New Policy</h4>
                                <X size={20} style={{ cursor: 'pointer' }} onClick={() => setIsAdding(false)} />
                            </div>
                            <form onSubmit={handleAddPolicy} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                                <select
                                    className="glass-input"
                                    style={{ flex: 1, minWidth: '150px' }}
                                    value={newPolicy.username}
                                    onChange={(e) => setNewPolicy({ ...newPolicy, username: e.target.value })}
                                    required
                                >
                                    <option value="">Select User</option>
                                    {allProfiles.map(p => <option key={p.username} value={p.username}>{p.username}</option>)}
                                </select>
                                <input
                                    type="text"
                                    className="glass-input"
                                    placeholder="Policy Number (e.g. POL-1234)"
                                    style={{ flex: 2, minWidth: '200px' }}
                                    value={newPolicy.policyNumber}
                                    onChange={(e) => setNewPolicy({ ...newPolicy, policyNumber: e.target.value })}
                                    required
                                />
                                <input
                                    type="number"
                                    className="glass-input"
                                    placeholder="Premium ($)"
                                    style={{ flex: 1, minWidth: '100px' }}
                                    value={newPolicy.premiumCharge}
                                    onChange={(e) => setNewPolicy({ ...newPolicy, premiumCharge: parseFloat(e.target.value) })}
                                    required
                                />
                                <button type="submit" className="btn btn-primary">Add Policy</button>
                            </form>
                        </div>
                    )}

                    <div className="claims-table-wrapper mt-3">
                        <table className="claims-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Policy Number</th>
                                    <th>Type</th>
                                    <th>Premium</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allProfiles.flatMap(profile =>
                                    (profile.policies || []).map(pol => (
                                        <tr key={pol}>
                                            <td>{profile.username}</td>
                                            <td>{pol}</td>
                                            <td>Standard Coverage</td>
                                            <td>${(profile.monthlyPremium / (profile.policies.length || 1)).toFixed(2)}</td>
                                            <td style={{ display: 'flex', gap: '10px' }}>
                                                <button className="btn btn-primary btn-sm" onClick={() => handleUpdate(profile.username, pol)}>
                                                    <Edit2 size={14} />
                                                </button>
                                                <button className="btn btn-logout btn-sm" onClick={() => handleDelete(profile.username, pol)}>
                                                    <Trash2 size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                                {allProfiles.every(p => !p.policies || p.policies.length === 0) && (
                                    <tr><td colSpan="5" className="text-center p-4">No active policies found in system.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <>
                    <div className="dashboard-grid">
                        {activePolicies.length > 0 ? activePolicies.map((policy) => (
                            <div key={policy.id} className="dashboard-card glass policy-card">
                                <div className="policy-header">
                                    <span className={`status-badge ${policy.status.toLowerCase()}`}>
                                        {policy.status === 'Active' ? <CheckCircle size={14} /> : <Clock size={14} />} {policy.status}
                                    </span>
                                    <h3>{policy.type}</h3>
                                    <p className="policy-id">Number: {policy.id}</p>
                                </div>
                                <div className="policy-details">
                                    <div className="detail-row">
                                        <span>Estimated Premium</span>
                                        <span className="value">${policy.premium}/mo</span>
                                    </div>
                                    <div className="detail-row">
                                        <span>Total Coverage</span>
                                        <span className="value">{policy.coverage}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span>Next Payment</span>
                                        <span className="value">{policy.nextPayment}</span>
                                    </div>
                                </div>
                                <button className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }}>View Policy Document</button>
                            </div>
                        )) : (
                            <div className="dashboard-card glass full-width text-center" style={{ padding: '60px' }}>
                                <Shield size={64} style={{ color: 'var(--primary)', marginBottom: '20px', opacity: 0.5 }} />
                                <h3>No Active Policies</h3>
                                <p className="text-muted">You haven't added any insurance policies to your shield yet.</p>
                                <button className="btn btn-primary mt-3" onClick={handleApply}>Apply Now</button>
                            </div>
                        )}
                    </div>

                    <div className="dashboard-card glass mt-4 text-center">
                        <h3>Need more protection?</h3>
                        <p className="text-muted">Explore our custom insurance plans tailored for your peace of mind.</p>
                        <button className="btn btn-primary mt-3" onClick={handleApply}>Add Additional Policy</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Policies;
