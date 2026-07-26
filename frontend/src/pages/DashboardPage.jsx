import React, { useEffect, useState } from 'react';
import '../css/styles.css';
import Navbar from '../components/NavBarComponent';
import NavBarVerticalComponent from '../components/NavBarVerticalComponent';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const TOKEN_KEY = 'ticketing_token';

function DashboardPage() {
    const [summary, setSummary] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const loadSummary = async () => {
            try {
                const token = localStorage.getItem(TOKEN_KEY);

                const response = await fetch(`${API_BASE_URL}/api/dashboard/summary`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to load dashboard data.');
                }

                setSummary(data);
            } catch (error) {
                setErrorMessage(error.message);
            }
        };

        loadSummary();
    }, []);

    if (errorMessage) {
        return <div className="dashboard-wrapper"><p>{errorMessage}</p></div>;
    }

    if (!summary) {
        return <div className="dashboard-wrapper"><p>Loading dashboard...</p></div>;
    }

    return (
        <div className="dashboard-wrapper">
            <nav>
                <Navbar />
            </nav>
            <div className="dashboard-container">
                <NavBarVerticalComponent />
                <div className="dashboard-content">
                    <div className="dashboard-header">
                        <h1>Dashboard</h1>
                        <p>Welcome back! Here's a live overview from the backend.</p>
                    </div>

                    <div className="dashboard-grid">
                        <div className="card success">
                            <div className="card-header">
                                <p className="card-title">Total Users</p>
                                <span className="card-icon">👤</span>
                            </div>
                            <div className="card-value">{summary.summary.totalUsers}</div>
                            <p style={{fontSize: '12px', color: '#6b7280', margin: 0}}>From the database</p>
                        </div>

                        <div className="card warning">
                            <div className="card-header">
                                <p className="card-title">Admins</p>
                                <span className="card-icon">★</span>
                            </div>
                            <div className="card-value">{summary.summary.roleCounts.ADMIN}</div>
                            <p style={{fontSize: '12px', color: '#6b7280', margin: 0}}>Backend-authenticated users</p>
                        </div>

                        <div className="card danger">
                            <div className="card-header">
                                <p className="card-title">Agents</p>
                                <span className="card-icon">⌁</span>
                            </div>
                            <div className="card-value">{summary.summary.roleCounts.AGENT}</div>
                            <p style={{fontSize: '12px', color: '#6b7280', margin: 0}}>Backend-authenticated users</p>
                        </div>

                        <div className="card secondary">
                            <div className="card-header">
                                <p className="card-title">Users</p>
                                <span className="card-icon">▣</span>
                            </div>
                            <div className="card-value">{summary.summary.roleCounts.USER}</div>
                            <p style={{fontSize: '12px', color: '#6b7280', margin: 0}}>Backend-authenticated users</p>
                        </div>
                    </div>

                    <div className="dashboard-section">
                        <h2 className="section-title">Recent Users</h2>
                        <div style={{paddingTop: '10px'}}>
                            {summary.recentUsers.map((user) => (
                                <div key={user.id} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    paddingBottom: '12px',
                                    borderBottom: '1px solid var(--border-color)',
                                    marginBottom: '12px'
                                }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: 'var(--primary-color)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        marginRight: '12px',
                                        fontWeight: 'bold'
                                    }}>{(user.name || user.email).slice(0, 2).toUpperCase()}</div>
                                    <div style={{flex: 1}}>
                                        <p style={{margin: '0 0 4px 0', fontWeight: '600'}}>{user.name || user.email}</p>
                                        <p style={{margin: 0, fontSize: '12px', color: '#6b7280'}}>{user.email} · {user.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;