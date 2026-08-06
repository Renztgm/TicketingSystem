import React, { useEffect, useState } from 'react';
import Navbar from '../components/NavBarComponent';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const TOKEN_KEY = 'ticketing_token';

function ChatsPage() {
    const [profile, setProfile] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const token = localStorage.getItem(TOKEN_KEY);

                const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to load profile.');
                }

                setProfile(data.user);
            } catch (error) {
                setErrorMessage(error.message);
            }
        };

        loadProfile();
    }, []);

    if (errorMessage) {
        return <div className="loading-spinner"><p>{errorMessage}</p></div>;
    }

    if (!profile) {
        return <div className="loading-spinner"><p>Loading Chats...</p></div>;
    }

    return (
        <div className="dashboard-wrapper">
            <nav>
                <Navbar />
            </nav>
            <div className="chats-wrapper">
                <h1>Chats Page</h1>
                <p>This is the Chats page.</p>
            </div>
        </div>
    );
}

export default ChatsPage;