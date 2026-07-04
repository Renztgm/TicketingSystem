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
            <div className="login-page">
                <div className="logo">
                    {/* <h1>Ticketing System</h1> */}
                </div>
                <div className="login-form">
                    <h1 className='text-align-center'>Login</h1>

                    {/* Display errors if they exist */} {errorMessage && <p style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</p>}

                    <form  onSubmit={handleSubmit}>
                        <input 
                            type="text" 
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
                        <p className='text-size-10 text-align-center'>If you don't have account please contact the Administrator. </p> 
                    </div>
                </div>
                <div className="footer">
                    <p className='text-size-10 text-align-center'>© 2023 Ticketing System. All rights reserved.</p>
                </div>
            </div>
        );
    }

    export default LoginPage;