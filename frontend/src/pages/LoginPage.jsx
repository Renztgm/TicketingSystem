import React, { useState } from 'react';
import '../css/styles.css';
import { Link, useNavigate } from 'react-router-dom';

<<<<<<< HEAD
function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
=======
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const TOKEN_KEY = 'ticketing_token';
    const USER_KEY = 'ticketing_user';

    function LoginPage() {
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [errorMessage, setErrorMessage] = useState('');
>>>>>>> 1e7f8b1f0d65b466688208e89e469c3d0bdeacd3

    const navigate = useNavigate();

<<<<<<< HEAD
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
=======
        const handleSubmit = async (e) => {
            e.preventDefault();
            setErrorMessage('');
            try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
>>>>>>> 1e7f8b1f0d65b466688208e89e469c3d0bdeacd3
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
<<<<<<< HEAD
                console.log('Login successful!', data);

                // Save the JWT and user info returned by the backend
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                navigate('/dashboard');
=======
                localStorage.setItem(TOKEN_KEY, data.token);
                localStorage.setItem(USER_KEY, JSON.stringify(data.user));
                navigate('/dashboard'); 
>>>>>>> 1e7f8b1f0d65b466688208e89e469c3d0bdeacd3
            } else {
                // Backend sends { error: "Invalid email or password." }
                setErrorMessage(data.error || 'Login failed');
            }
        } catch (err) {
            console.error('Connection error:', err);
            setErrorMessage('Could not connect to the backend server.');
        }
    };

<<<<<<< HEAD
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
=======
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
>>>>>>> 1e7f8b1f0d65b466688208e89e469c3d0bdeacd3
                </div>
            </div>
            <div className="footer">
                <p className='text-size-10 text-align-center'>© 2026 Ticketing System. All rights reserved.</p>
            </div>
        </div>
    );
}

export default LoginPage;