import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Align_left from '../assets/align-left.png';
import Avartar_profile from '../assets/user1.png';
import Dropdown from '../assets/dropdown.png';

const TOKEN_KEY = 'ticketing_token';
const USER_KEY = 'ticketing_user';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function NavBarComponent() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const handleLogout = () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        navigate('/');
    };

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const token = localStorage.getItem(TOKEN_KEY);
                const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Failed to load profile.');
                setProfile(data.user);
            } catch (error) {
                setErrorMessage(error.message);
            }
        };
        loadProfile();
    }, []);

    // close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="navbar">
            <ul>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={Align_left} style={{ width: '20px', height: '20px' }} alt="burger" className="burgerButton" />
                    <p>Welcome!</p>
                </div>
            </ul>

            <ul style={{ padding: '0px', margin: '0px', position: 'relative' }} ref={menuRef}>
                <div
                    onClick={() => setMenuOpen((prev) => !prev)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        backgroundColor: '#e4e6eb', margin: '0px', borderRadius: '100px',
                        padding: '2px', cursor: 'pointer'
                    }}
                >
                    <div style={{ position: 'relative', width: '40px', height: '40px' }}>
                        <img
                            src={profile?.avatar || Avartar_profile}
                            alt="Avatar"
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                display: 'block'
                            }}
                        />
                        <img
                            src={Dropdown}
                            alt="Dropdown"
                            style={{
                                position: 'absolute',
                                bottom: '-2px',
                                right: '-2px',
                                width: '12px',
                                height: '12px',
                                backgroundColor: '#e4e6eb',
                                borderRadius: '50%',
                                padding: '2px',
                                border: '1.5px solid #ffffff',
                                transform: menuOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
                                transition: 'transform 0.15s ease'
                            }}
                        />
                    </div>
                </div>

                {menuOpen && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '50px',
                            right: '0',
                            width: '280px',
                            backgroundColor: '#ffffff',
                            borderRadius: '12px',
                            boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
                            padding: '8px',
                            color: '#050505',
                            zIndex: 1000,
                        }}
                    >
                        {/* Profile section */}
                        <Link
                            to="/profile"
                            style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                padding: '10px 8px', borderRadius: '8px', textDecoration: 'none',
                                color: '#000'
                            }}
                            className="dropdown-item"
                        >
                            <img
                                src={profile?.avatar || Avartar_profile}
                                alt="Avatar"
                                style={{ width: '36px', height: '36px', borderRadius: '50%' }}
                            />
                            <span style={{ fontWeight: 600, fontSize: '15px' }}>{profile?.name || 'User'}</span>
                        </Link>

                        <hr style={{ border: 'none', borderTop: '1px solid #e4e6eb', margin: '8px 0' }} />

                        {/* Menu items */}
                        <DropdownItem icon="⚙️" label="Settings & privacy" hasArrow onClick={() => navigate('/settings')} />
                        <DropdownItem icon="❓" label="Help & support" hasArrow onClick={() => navigate('/help')} />
                        <DropdownItem icon="🌙" label="Display & accessibility" hasArrow onClick={() => navigate('/display')} />

                        <hr style={{ border: 'none', borderTop: '1px solid #e4e6eb', margin: '8px 0' }} />

                        <DropdownItem icon="🚪" label="Log out" onClick={handleLogout} />
                    </div>
                )}
            </ul>
        </nav>
    );
}

function DropdownItem({ icon, label, hasArrow, onClick }) {
    return (
        <div
            onClick={onClick}
            style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 8px', borderRadius: '8px', cursor: 'pointer'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e4e6eb')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span
                    style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        backgroundColor: '#e4e6eb', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', fontSize: '16px'
                    }}
                >
                    {icon}
                </span>
                <span style={{ fontSize: '15px', fontWeight: 500 }}>{label}</span>
            </div>
            {hasArrow && <span style={{ color: '#e4e6eb' }}>›</span>}
        </div>
    );
}

export default NavBarComponent;