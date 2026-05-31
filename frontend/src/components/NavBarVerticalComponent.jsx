import React from "react";
import { Link } from "react-router-dom";

function NavBarVerticalComponent() {
    return (
        <nav className="navbarvertical">
            <ul>
                <li><Link to="#">Create Ticket</Link></li>
                <li><Link to="#">View Tickets</Link></li>
                <li><Link to="#">Generate Report</Link></li>
            </ul>
        </nav>
    );
}

export default NavBarVerticalComponent;