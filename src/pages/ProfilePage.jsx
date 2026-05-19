import React, { useState } from 'react';
import '../css/styles.css';
import { Link } from 'react-router-dom';
import Navbar from '../components/NavBarComponent';

function ProfilePage() {
    return (
        <html>
            <head>
                <title>Ticketing System</title>
            </head>
            <body>
                <nav>
                    <Navbar />
                </nav>
                <div className='container-header'>
                    <h1>Profile</h1>
                    <p>This is your profile page.</p>
                </div>

            </body>
        </html>
    );
}

export default ProfilePage;