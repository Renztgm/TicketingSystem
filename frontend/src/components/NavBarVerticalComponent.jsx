import React from "react";
import { Link } from "react-router-dom";

const USER_KEY = 'ticketing_user';

function getCurrentRole() {
    try {
        const user = JSON.parse(localStorage.getItem(USER_KEY) || 'null');
        return user?.role || '';
    } catch (error) {
        return '';
    }
}

function NavBarVerticalComponent() {
    const role = getCurrentRole();

    const linkSets = {
        USER: [
            { to: '/create-ticket', label: 'Create Ticket' },
            { to: '/view-history', label: 'History Tickets' },
        ],
        AGENT: [
            { to: '/create-ticket', label: 'Create Ticket' },
            { to: '/view-ticket', label: 'View Tickets' },
            { to: '/view-history', label: 'History Tickets' },
        ],
        ADMIN: [
            { to: '/create-ticket', label: 'Create Ticket' },
            { to: '/view-ticket', label: 'View Tickets' },
            { to: '/view-history', label: 'History Tickets' },
            { to: '/create-account', label: 'Create Account' },
            { to: '/generate-report', label: 'Generate Report' },
        ],
    };

    const links = linkSets[role] || [];

    return (
        <nav className="navbarvertical">
            <ul>
                {links.map((link) => (
                    <li key={link.to + link.label}>
                        <Link to={link.to}>{link.label}</Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default NavBarVerticalComponent;