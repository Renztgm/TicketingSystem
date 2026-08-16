import React from "react";
import { NavLink } from "react-router-dom";

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
            { to: '/dashboard', label: 'Dashboard' },
            { to: '/create-ticket', label: 'Create Ticket' },
            { to: '/view-history', label: 'History Tickets' },
            { to: '/chats', label: 'Chat' },

        ],
        AGENT: [
            { to: '/dashboard', label: 'Dashboard' },
            { to: '/view-history', label: 'History Tickets' },
            { to: '/chats', label: 'Chat' },
        ],
        ADMIN: [
            { to: '/dashboard', label: 'Dashboard' },
            { to: '/chats', label: 'Chat' },
            { to: '/view-ticket', label: 'Tickets' },
            { to: '/view-history', label: 'History' },
            { to: '/create-account', label: 'Create Account' },
            { to: '/generate-report', label: 'Generate Report' },
            { to: '/#', label: 'Password Reset' },
        ],
    };

    const links = linkSets[role] || [];

    return (
        <nav className="navbarvertical">
            <div className="navbarvertical-header">
                <p>Ticketing System</p>
            </div>
            <ul className="navbarvertical-links">
                {links.map((link) => (
                    <li key={link.to + link.label}>
                        <NavLink
                            to={link.to}
                            className={({ isActive }) => (isActive ? 'active' : '')}
                        >
                            {link.label}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default NavBarVerticalComponent;