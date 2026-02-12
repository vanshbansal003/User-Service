import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Wallet, Activity, CreditCard, TrendingUp } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.role === 'ADMIN') {
            const fetchAdminStats = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get('http://localhost:8080/api/admin/stats', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setStats(response.data);
                } catch (error) {
                    console.error("Error fetching admin stats", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchAdminStats();
        } else {
            setLoading(false);
        }
    }, [user]);

    const isAdmin = user?.role === 'ADMIN';

    const chartData = isAdmin && stats ? [
        { name: 'Revenue', amount: stats.totalRevenue || 0 },
        { name: 'Payouts', amount: stats.totalPayouts || 0 },
    ] : [
        { name: 'Prev', premium: (user?.monthlyPremium || 280) * 0.8, claims: 0 },
        { name: 'Curr', premium: user?.monthlyPremium || 280, claims: user?.totalClaimsAmount || 0 },
    ];

    const pieData = isAdmin && stats ? [
        { name: 'Total Revenue', value: stats.totalRevenue || 1 },
        { name: 'Total Payouts', value: stats.totalPayouts || 0 },
    ] : [
        { name: 'Active Policies', value: user?.policies?.length || 0 },
        { name: 'Pending Claims', value: user?.claims?.length || 0 },
    ];

    const COLORS = ['#00f2fe', '#ef4444'];

    if (loading) return <div className="container mt-5 text-center">Loading summary...</div>;
    if (!user) return <div className="container mt-5">Please log in.</div>;

    return (
        <div className="dashboard-wrapper fade-in">
            {isAdmin && (
                <div className="dashboard-card glass mb-4 admin-banner" style={{ border: '1px solid var(--primary)', background: 'linear-gradient(90deg, rgba(0, 242, 254, 0.1), transparent)' }}>
                    <div className="card-title">
                        <h3>🛡️ Administrator Command Center</h3>
                    </div>
                    <p>Global system overview: Managing {stats?.totalUsers || 0} users across {stats?.activePolicies || 0} active policies.</p>
                </div>
            )}

            <header className="dashboard-header">
                <h1>{isAdmin ? 'System Analytics' : 'Financial Overview'}</h1>
                <p className="text-muted">{isAdmin ? 'Global revenue and payout monitoring' : 'Analyze your insurance portfolio and expenditure'}</p>
            </header>

            <div className="dashboard-grid">
                <div className="dashboard-card glass full-width">
                    <div className="card-title">
                        <h3><Wallet size={20} /> {isAdmin ? 'Global Financial Summary' : 'Personal Insurance Summary'}</h3>
                    </div>
                    <div className="premium-summary">
                        {isAdmin ? (
                            <>
                                <div className="summary-item">
                                    <div className="summary-label">Total Revenue</div>
                                    <div className="summary-value">${stats?.totalRevenue?.toLocaleString() || 0}</div>
                                </div>
                                <div className="summary-item">
                                    <div className="summary-label">Total Payouts</div>
                                    <div className="summary-value">${stats?.totalPayouts?.toLocaleString() || 0}</div>
                                </div>
                                <div className="summary-item">
                                    <div className="summary-label">Total Users</div>
                                    <div className="summary-value">{stats?.totalUsers || 0}</div>
                                </div>
                                <div className="summary-item">
                                    <div className="summary-label">Gross Margin</div>
                                    <div className="summary-value" style={{ color: '#4ade80' }}>
                                        ${((stats?.totalRevenue || 0) - (stats?.totalPayouts || 0)).toLocaleString()}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="summary-item">
                                    <div className="summary-label">Monthly Premium</div>
                                    <div className="summary-value">${user.monthlyPremium || 0}</div>
                                </div>
                                <div className="summary-item">
                                    <div className="summary-label">Total Claims Count</div>
                                    <div className="summary-value">{user.claims?.length || 0}</div>
                                </div>
                                <div className="summary-item">
                                    <div className="summary-label">Active Policies</div>
                                    <div className="summary-value">{user.policies?.length || 0}</div>
                                </div>
                                <div className="summary-item">
                                    <div className="summary-label">Claim Payouts</div>
                                    <div className="summary-value">${user.totalClaimsAmount || 0}</div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="dashboard-card glass" style={{ gridColumn: 'span 2' }}>
                    <div className="card-title">
                        <h3><TrendingUp size={20} /> {isAdmin ? 'Revenue vs Payouts' : 'Premium vs Claims Analysis'}</h3>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                                    itemStyle={{ color: '#00f2fe' }}
                                />
                                {isAdmin ? (
                                    <Bar dataKey="amount" fill="#4facfe" radius={[4, 4, 0, 0]} name="Value ($)" />
                                ) : (
                                    <>
                                        <Bar dataKey="premium" fill="#4facfe" radius={[4, 4, 0, 0]} name="Premium ($)" />
                                        <Bar dataKey="claims" fill="#ef4444" radius={[4, 4, 0, 0]} name="Claims ($)" />
                                    </>
                                )}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="dashboard-card glass">
                    <div className="card-title">
                        <h3><Activity size={20} /> {isAdmin ? 'System Balanced Scorecard' : 'Portfolio Status'}</h3>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '10px' }}>
                        {pieData.map((entry, index) => (
                            <div key={index} style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                                <span style={{ color: COLORS[index], marginRight: '4px' }}>●</span> {entry.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
