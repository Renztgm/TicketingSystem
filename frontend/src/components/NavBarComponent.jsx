import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const TOKEN_KEY = 'ticketing_token';
const USER_KEY = 'ticketing_user';

function NavBarComponent() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        navigate('/');
    };

    return (
        <nav className="navbar">

            <ul>
                <li>
                    <b>Ticketing System</b>
                </li>
            </ul>
            <ul>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/profile">Profile</Link></li>
            </ul>
            <ul>
                <li><button className="btn btn-outline" onClick={handleLogout}>Logout</button></li>
            </ul>
        </nav>
    );
}

export default NavBarComponent;