import React from "react";
import { Link, useNavigate } from 'react-router-dom';
import NavBarVerticalComponent from "../components/NavBarVerticalComponent";
import Navbar from "../components/NavBarComponent";
import '../css/styles.css';

function Users() {
    // const navigate = useNavigate();
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
        fetch(`${API_BASE_URL}/api/users`, {
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
        .then(data => setUsers(data.users))
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
                <div style={{ overflowX: 'auto' }}>
                    
					<table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '10px 5px' }}>Name</th>
                                <th style={{ padding: '10px 5px' }}>Role</th>
                                <th style={{ padding: '10px 5px' }}>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td style={{ padding: '10px 5px' }}>
                                        <Link to={`/users/${user.id}`} style={{ textDecoration: 'none', cursor: 'pointer' }}>{user.name}</Link>
                                    </td>
                                    <td style={{ padding: '10px 5px',}}>{user.role}</td>
                                    <td style={{ padding: '10px 5px' }}>{user.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                </div>
            </div>
        </div>
    </div>);
}

export default Users;