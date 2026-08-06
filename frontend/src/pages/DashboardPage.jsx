import React, { useEffect, useState } from 'react';
import '../css/styles.css';
import Navbar from '../components/NavBarComponent';
import NavBarVerticalComponent from '../components/NavBarVerticalComponent';
import Admin from '../components/Admin';
import Agent from '../components/Agent';


const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const TOKEN_KEY = 'ticketing_token';
const USER_KEY = 'ticketing_user';

function DashboardPage() {
    const token = localStorage.getItem(TOKEN_KEY);
    const user = JSON.parse(localStorage.getItem(USER_KEY) || 'null');
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
        return <div className="loading-spinner"><p>{errorMessage}</p></div>;
    }

    if (!summary) {
        return <div className="loading-spinner"><p>Loading dashboard...</p></div>;
    }

    if (user?.role === 'ADMIN') {
        return (<Admin summary={summary} />);
    }

    if (user?.role === 'AGENT') {
        console.log("Rendering Agent component for user:", user);
        return (<Agent />);
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
                        <p>User</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;