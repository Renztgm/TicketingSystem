import React, { useState } from 'react';
import '../css/styles.css';
import { Link } from 'react-router-dom';


function ForgotPasswordPage() {
    return (
        <body>
            <div className="container form">
                <h1>Forgot Password</h1>
                <p>Please contact the administrator to reset your password.</p>
                <Link to="/">Back to Login</Link>
            </div>
        </body>
    )
}

export default ForgotPasswordPage