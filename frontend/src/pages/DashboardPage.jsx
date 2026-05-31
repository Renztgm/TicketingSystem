import React, { useState } from 'react';
import '../css/styles.css';
import { Link } from 'react-router-dom';
import Navbar from '../components/NavBarComponent';
import NavBarVerticalComponent from '../components/NavBarVerticalComponent';

function DashboardPage() {
    const [stats] = useState({
        openTickets: 12,
        resolvedTickets: 48,
        pendingTickets: 5,
        userCount: 24
    });

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
                        <p>Welcome back! Here's an overview of your ticketing system.</p>
                    </div>

                    <div className="dashboard-grid">
                        <div className="card success">
                            <div className="card-header">
                                <p className="card-title">Resolved Tickets</p>
                                <span className="card-icon">✓</span>
                            </div>
                            <div className="card-value">{stats.resolvedTickets}</div>
                            <p style={{fontSize: '12px', color: '#6b7280', margin: 0}}>This month</p>
                        </div>

                        <div className="card warning">
                            <div className="card-header">
                                <p className="card-title">Open Tickets</p>
                                <span className="card-icon">◉</span>
                            </div>
                            <div className="card-value">{stats.openTickets}</div>
                            <p style={{fontSize: '12px', color: '#6b7280', margin: 0}}>Awaiting action</p>
                        </div>

                        <div className="card danger">
                            <div className="card-header">
                                <p className="card-title">Pending Review</p>
                                <span className="card-icon">!</span>
                            </div>
                            <div className="card-value">{stats.pendingTickets}</div>
                            <p style={{fontSize: '12px', color: '#6b7280', margin: 0}}>Priority items</p>
                        </div>

                        <div className="card secondary">
                            <div className="card-header">
                                <p className="card-title">Active Users</p>
                                <span className="card-icon">👥</span>
                            </div>
                            <div className="card-value">{stats.userCount}</div>
                            <p style={{fontSize: '12px', color: '#6b7280', margin: 0}}>Online now</p>
                        </div>
                    </div>

                    <div className="dashboard-section">
                        <h2 className="section-title">Recent Activity</h2>
                        <div style={{paddingTop: '10px'}}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                paddingBottom: '12px',
                                borderBottom: '1px solid var(--border-color)'
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
                                }}>JD</div>
                                <div style={{flex: 1}}>
                                    <p style={{margin: '0 0 4px 0', fontWeight: '600'}}>Ticket #1234 resolved</p>
                                    <p style={{margin: 0, fontSize: '12px', color: '#6b7280'}}>2 hours ago by John Doe</p>
                                </div>
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                paddingTop: '12px',
                                paddingBottom: '12px',
                                borderBottom: '1px solid var(--border-color)'
                            }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: 'var(--secondary-color)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    marginRight: '12px',
                                    fontWeight: 'bold'
                                }}>SM</div>
                                <div style={{flex: 1}}>
                                    <p style={{margin: '0 0 4px 0', fontWeight: '600'}}>New ticket #1235 created</p>
                                    <p style={{margin: 0, fontSize: '12px', color: '#6b7280'}}>4 hours ago by Sarah Miller</p>
                                </div>
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                paddingTop: '12px'
                            }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: 'var(--success-color)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    marginRight: '12px',
                                    fontWeight: 'bold'
                                }}>AC</div>
                                <div style={{flex: 1}}>
                                    <p style={{margin: '0 0 4px 0', fontWeight: '600'}}>System maintenance completed</p>
                                    <p style={{margin: 0, fontSize: '12px', color: '#6b7280'}}>6 hours ago</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;