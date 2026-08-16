import React, { useEffect, useState } from 'react';
import '../css/styles.css';
import Navbar from '../components/NavBarComponent';
import VerticalNavbar from '../components/NavBarVerticalComponent';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const TOKEN_KEY = 'ticketing_token';

function ProfilePage() {
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
        return <div className="loading-spinner"><p>Loading profile...</p></div>;
    }

    return (
        <div className="dashboard-wrapper">
            <VerticalNavbar />
            <div className='dashboard-container'>
                <Navbar/>
                <div className="profile-content">
                    <h1>Profile</h1>
                    <p>Name: {profile.name || 'No name set'}</p>
                    <p>Email: {profile.email}</p>
                    <p>Role: {profile.role}</p>
                    <p>Joined: {new Date(profile.createdAt).toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;