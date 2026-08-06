import React from "react";
import Navbar from './NavBarComponent';
import NavBarVerticalComponent from './NavBarVerticalComponent';

function User() {
    return (
        <div className="dashboard-wrapper">
            <nav>
                <Navbar />
            </nav>
            <div className="dashboard-container">
                <NavBarVerticalComponent />
                <div className="dashboard-content">
                    <div className="dashboard-header">
                        <h1>Dashboard</h1>
                        <p>Agent</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default User;