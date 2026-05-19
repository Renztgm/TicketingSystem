import React, { useState } from 'react';
import '../css/styles.css';
import { Link } from 'react-router-dom';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login attempt:', { username, password });
        // Add your login logic here
    };

    return (
        <div className="login-page">
            <div className="logo">
                {/* <h1>Ticketing System</h1> */}
            </div>
            <div className="login-form">
                <h1 className='text-align-center'>Login</h1>
                <form  onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="Username" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
                    <Link to="/dashboard"><button type="submit">Login</button></Link>
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