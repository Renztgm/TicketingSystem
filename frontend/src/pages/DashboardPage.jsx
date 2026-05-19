import React, { useState } from 'react';
import '../css/styles.css';
import { Link } from 'react-router-dom';
import Navbar from '../components/NavBarComponent';
import NavBarVerticalComponent from '../components/NavBarVerticalComponent';

function DashboardPage() {
    return (
        <html>
            <head>
                <title>Ticketing System</title>
            </head>
            <body>
                <nav>
                    <Navbar />
                </nav>
                <div className="dashboard-container">
                    <NavBarVerticalComponent />
                    <div className="dashboard-content">
                        <h1>Dashboard</h1>
                        <p>Welcome to the Dashboard!</p>
                    </div>
                </div>
            </body>
        </html>
    );
}

export default DashboardPage;