import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FileText, PlusCircle, History } from 'lucide-react';
import './Claims.css';
import axios from 'axios';

const Claims = () => {
    const { user } = useContext(AuthContext);
    const [allProfiles, setAllProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFiling, setIsFiling] = useState(false);
    const [claimData, setClaimData] = useState({
        type: '',
        amount: '',
        date: '',
        description: ''
    });

    useEffect(() => {
        if (user?.role === 'ADMIN') {
            const fetchAllClaims = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get('http://localhost:8080/api/admin/all-profiles', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setAllProfiles(response.data);
                } catch (error) {
                    console.error("Error fetching claims", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchAllClaims();
        } else {
            setLoading(false);
        }
    }, [user]);

    const isAdmin = user?.role === 'ADMIN';

    const handleAction = async (username, claimId, amount, action) => {
        try {
            const token = localStorage.getItem('token');
            const endpoint = action === 'approve' ? 'approve' : 'reject';
            await axios.post(`http://localhost:8080/api/admin/claims/${username}/${endpoint}`, { amount }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            window.location.reload();
        } catch (error) {
            console.error("Error processing claim", error);
            alert("Error processing claim: " + (error.response?.data?.message || error.message));
        }
    };

    if (loading && isAdmin) return <div className="container mt-5 text-center">Loading Claims Hub...</div>;
    if (!user) return <div className="container mt-5">Loading Claims Center...</div>;

    const realClaims = user.claims?.map((claimNum, index) => ({
        id: claimNum,
        policyId: user.policies?.[0] || 'N/A',
        type: index % 2 === 0 ? 'Medical' : 'Accident',
        status: 'Processing',
        amount: (Math.random() * 1000).toFixed(2),
        date: new Date().toISOString().split('T')[0]
    })) || [];

    const handleChange = (e) => {
        setClaimData({ ...claimData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const newClaimId = `CLM-${Math.floor(Math.random() * 10000)}`;
            const updatedClaims = [...(user.claims || []), newClaimId];
            const updatedTotalClaims = (user.totalClaimsAmount || 0) + parseFloat(claimData.amount || 0);

            await axios.put('http://localhost:8080/api/users/me', {
                claims: updatedClaims,
                totalClaimsAmount: updatedTotalClaims
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setIsFiling(false);
            window.location.reload();
        } catch (error) {
            console.error("Error filing claim", error);
            alert("Failed to submit claim. Please try again.");
        }
    };

    return (
        <div className="container fade-in">
            <header className="page-header sticky-header">
                <div>
                    <h1><FileText size={32} /> {isAdmin ? 'Claims Approval Hub' : 'Claims Center'}</h1>
                    <p>{isAdmin ? 'Review and process insurance claims from all users' : 'Track your claims status and file new applications'}</p>
                </div>
                {!isFiling && !isAdmin && (
                    <button className="btn btn-primary" onClick={() => setIsFiling(true)}>
                        <PlusCircle size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> File New Claim
                    </button>
                )}
            </header>

            {isAdmin ? (
                <div className="dashboard-card glass full-width">
                    <div className="card-title">
                        <h3>📥 Pending Claims Queue</h3>
                    </div>
                    <div className="claims-table-wrapper mt-3">
                        <table className="claims-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Claim ID</th>
                                    <th>Estimated Amount</th>
                                    <th>Type</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allProfiles.flatMap(profile =>
                                    (profile.claims || []).map(claim => (
                                        <tr key={claim}>
                                            <td>{profile.username}</td>
                                            <td>{claim}</td>
                                            <td>$850.00</td>
                                            <td>Medical</td>
                                            <td style={{ display: 'flex', gap: '10px' }}>
                                                <button className="btn btn-primary btn-sm" onClick={() => handleAction(profile.username, claim, 850.0, 'approve')}>Approve</button>
                                                <button className="btn btn-logout btn-sm" onClick={() => handleAction(profile.username, claim, 0, 'reject')}>Reject</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                                {allProfiles.every(p => !p.claims || p.claims.length === 0) && (
                                    <tr><td colSpan="5" className="text-center p-4">No pending claims in the system.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                !isFiling ? (
                    <div className="claims-content">
                        <div className="dashboard-card glass">
                            <div className="card-title">
                                <h3><History size={20} /> Claim History</h3>
                            </div>
                            <div className="claims-table-wrapper">
                                {realClaims.length > 0 ? (
                                    <table className="claims-table">
                                        <thead>
                                            <tr>
                                                <th>Claim Number</th>
                                                <th>Date</th>
                                                <th>Type</th>
                                                <th>Amount</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {realClaims.map(claim => (
                                                <tr key={claim.id}>
                                                    <td>{claim.id}</td>
                                                    <td>{claim.date}</td>
                                                    <td>{claim.type}</td>
                                                    <td>${claim.amount}</td>
                                                    <td>
                                                        <span className={`status-badge ${claim.status.toLowerCase()}`}>
                                                            {claim.status}
                                                        </span>
                                                    </td>
                                                    <td><button className="btn btn-logout btn-sm">Track</button></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="text-center p-5">
                                        <p className="text-muted">No claims history found. You are safe and sound!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="dashboard-card glass max-width-600 m-auto">
                        <div className="card-title">
                            <h3>📄 New Claim Application</h3>
                        </div>
                        <form className="claim-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Select Policy</label>
                                <select className="glass-input">
                                    {user.policies?.map(p => <option key={p}>{p}</option>)}
                                    {(!user.policies || user.policies.length === 0) && <option>No active policies found</option>}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Claim Type</label>
                                <input type="text" name="type" placeholder="e.g. Hospitalization, Theft" value={claimData.type} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Estimated Amount ($)</label>
                                <input type="number" name="amount" placeholder="Enter amount" value={claimData.amount} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Date of Event</label>
                                <input type="date" name="date" value={claimData.date} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea name="description" placeholder="Describe the event in detail..." rows="4" value={claimData.description} onChange={handleChange}></textarea>
                            </div>
                            <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Submit Claim</button>
                                <button type="button" className="btn btn-logout" style={{ flex: 1 }} onClick={() => setIsFiling(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                )
            )}
        </div>
    );
};

export default Claims;
