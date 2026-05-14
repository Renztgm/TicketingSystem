import React from "react";
import { Link } from "react-router-dom";

function NavBarComponent() {
    return (
        <nav className="navbar">
            <ul>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/profile">Profile</Link></li>
            </ul>
            <ul>
                <li><Link to="/">Logout</Link></li>
            </ul>
        </nav>
    );
}

export default NavBarComponent;