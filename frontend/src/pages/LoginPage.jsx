    import React, { useState } from 'react';
    import '../css/styles.css';
    import { Link, useNavigate } from 'react-router-dom';

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const TOKEN_KEY = 'ticketing_token';
    const USER_KEY = 'ticketing_user';

    function LoginPage() {
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [errorMessage, setErrorMessage] = useState('');

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
                localStorage.setItem(TOKEN_KEY, data.token);
                localStorage.setItem(USER_KEY, JSON.stringify(data.user));
                navigate('/dashboard'); 
            } else {
                // If wrong password, show the error from the backend
                setErrorMessage(data.error || 'Login failed');
            }
        } catch (err) {
            console.error('Connection error:', err);
            setErrorMessage('Could not connect to the backend server.');
        }
        };

        React.useEffect(() => {
            if (localStorage.getItem(TOKEN_KEY)) {
                navigate('/dashboard');
            }
        }, [navigate]);

        return (
            <div className="auth-page">
                <div className="auth-shell">
                    <section className="auth-copy">
                        <p className="auth-eyebrow">Ticketing System</p>
                        <h1>Sign in to your workspace</h1>
                        <p className="auth-description">
                            Minimal access for support teams that need one clean place to manage tickets.
                        </p>

                        <ul className="auth-feature-list">
                            <li>Open and track tickets in one dashboard</li>
                            <li>Review priority, status, and history fast</li>
                            <li>Export reports when you need them</li>
                        </ul>
                    </section>

                    <section className="auth-card">
                        <h2>Login</h2>

                        {errorMessage && <p className="auth-error">{errorMessage}</p>}

                        <form onSubmit={handleSubmit} className="auth-form">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="name@ticketingsystem.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            <div className="auth-links">
                                <Link to="/forgot-password">Forgot password?</Link>
                            </div>

                            <button type="submit" disabled={false}>
                                Login
                            </button>
                        </form>

                        <p className="auth-footnote">Use your assigned account to continue.</p>
                    </section>
                </div>

                <div className="auth-footer">
                    <p>© 2026 Ticketing System. Programmed by Kre-eyt. All rights reserved.</p>
                </div>
            </div>
        );
    }

    export default LoginPage;