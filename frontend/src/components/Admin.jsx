import React from "react";
import Navbar from './NavBarComponent';
import NavBarVerticalComponent from './NavBarVerticalComponent';


function Admin({summary}) {
    return (
        <div className="dashboard-wrapper">
            <NavBarVerticalComponent />
            <div className="dashboard-container">
                <Navbar />
                <div className="dashboard-content">
                    <div className="dashboard-grid">
                        <div className="card">
                            <div className="card-header">
                                <p className="card-title">Total Tickets</p>
                                {/* <span className="card-icon"></span> */}
                            </div>
                            <div className="card-value">{summary.summary.totalTickets}</div>
                            {console.log('Summary data:', summary)}
                            <p style={{fontSize: '12px', color: '#6b7280', margin: 0}}>From the database</p>
                        </div>

                        <div className="card">
                            <div className="card-header">
                                <p className="card-title">Open Tickets</p>
                                {/* <span className="card-icon">★</span>    */}
                            </div>
                            <div className="card-value">{summary.summary.statusCounts.OPEN}</div>
                            <p style={{fontSize: '12px', color: '#6b7280', margin: 0}}>Backend-authenticated users</p>
                        </div>

                        <div className="card">
                            <div className="card-header">
                                <p className="card-title">Pending</p>
                                {/* <span className="card-icon">⌁</span> */}
                            </div>
                            <div className="card-value">{summary.summary.statusCounts.PENDING || 0}</div>
                            <p style={{fontSize: '12px', color: '#6b7280', margin: 0}}>Backend-authenticated users</p>
                        </div>

                        <div className="card">
                            <div className="card-header">
                                <p className="card-title">In Progress</p>
                                {/* <span className="card-icon">▣</span> */}
                            </div>
                            <div className="card-value">{summary.summary.statusCounts.IN_PROGRESS || 0}</div>
                            <p style={{fontSize: '12px', color: '#6b7280', margin: 0}}>Backend-authenticated users</p>
                        </div>
                        <div className="card">
                            <div className="card-header">
                                <p className="card-title">Resolved Tickets</p>
                                {/* <span className="card-icon">▣</span> */}
                            </div>
                            <div className="card-value">{summary.summary.statusCounts.RESOLVED || 0}</div>
                            <p style={{fontSize: '12px', color: '#6b7280', margin: 0}}>Backend-authenticated users</p>
                        </div>
                        <div className="card">
                            <div className="card-header">
                                <p className="card-title">Unassigned Tickets</p>
                                {/* <span className="card-icon">▣</span> */}
                            </div>
                            <div className="card-value">{summary.summary.unassignedTicketsCount || 0}</div>
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

export default Admin;
