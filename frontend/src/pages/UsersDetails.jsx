import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/NavBarComponent';
import NavBarVerticalComponent from '../components/NavBarVerticalComponent';
import '../css/styles.css';

function UsersDetails(){
    const { userId } = useParams();
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    // Getting the list of users from the backend
    const [users, setUsers] = React.useState([]);
    const [errorMessage, setErrorMessage] = React.useState('');

    React.useEffect(() => {
        const token = localStorage.getItem('ticketing_token');
        if (!token) {
            setErrorMessage('Authentication token not found. Please login again.');
            navigate('/');
            return;
        }
        fetch(`${API_BASE_URL}/api/users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
        .then((res) => {
            if (!res.ok) {
                throw new Error('Failed to fetch users');
            }
            return res.json();
        })
        .then(data => setUsers(data.user))
        .catch((error) => {
            setErrorMessage(error.message);
        });

    }, []);
    return (
        <div className="dashboard-wrapper">
            <NavBarVerticalComponent />
            <div className="dashboard-container">
                <Navbar />
                <div className="dashboard-content">
                    <h2>User Details</h2>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <p><strong>Name:</strong> {users.name}</p>
                    <p><strong>Email:</strong> {users.email}</p>
                    <p><strong>Role:</strong> {users.role}</p>
                    <p><strong>Created At:</strong> {new Date(users.createdAt).toLocaleString()}</p>
                    <p><strong>Updated At:</strong> {new Date(users.updatedAt).toLocaleString()}</p>
                    <Link to="/users" className="back-link">Back to Users List</Link>
                </div>
            </div>
        </div>
    );
}

export default UsersDetails;