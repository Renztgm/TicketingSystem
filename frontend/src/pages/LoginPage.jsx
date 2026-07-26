import React, { useState } from 'react';
import '../css/styles.css';
import { Link, useNavigate } from 'react-router-dom';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');


    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        try {
                const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                    method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Login successful!', data);

                // Save the JWT and user info returned by the backend
                localStorage.setItem('ticketing_token', data.token);
                localStorage.setItem('ticketing_user', JSON.stringify(data.user));

                navigate('/dashboard');
            } else {
                // Backend sends { error: "Invalid email or password." }
                setErrorMessage(data.error || 'Login failed');
            }
        } catch (err) {
            console.error('Connection error:', err);
            setErrorMessage('Could not connect to the backend server.');
        }
    };

    return (
        <div className="login-page">
            <div className="logo">
                {/* <h1>Ticketing System</h1> */}
            </div>
            <div className="login-form">
                <h1 className='text-align-center'>Login</h1>

                {errorMessage && <p style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</p>}

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <p className='text-size-11'>Forgot your password? <Link to="/forgot-password">Click here</Link></p>
                    <button type="submit">Login</button>
                </form>
                <hr />
                <div>
                    <p className='text-size-10 text-align-center'>If you don't have account please contact the Administrator.</p>
                </div>
            </div>
            <div className="footer">
                <p className='text-size-10 text-align-center'>© 2026 Ticketing System. Programmed by Kre-eyt. All rights reserved.</p>
            </div>
        </div>
    );
}

export default LoginPage;