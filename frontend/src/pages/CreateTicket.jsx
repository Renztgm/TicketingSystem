import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/styles.css';
import Navbar from '../components/NavBarComponent';
import NavBarVerticalComponent from '../components/NavBarVerticalComponent';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const TOKEN_KEY = 'ticketing_token';

function CreateTicket() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'MEDIUM',
        category: 'GENERAL',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        setIsLoading(true);

        try {
            const token = localStorage.getItem(TOKEN_KEY);

            if (!token) {
                setErrorMessage('Authentication token not found. Please login again.');
                navigate('/');
                return;
            }

            // Validate form data
            if (!formData.title.trim()) {
                setErrorMessage('Ticket title is required.');
                setIsLoading(false);
                return;
            }

            if (!formData.description.trim()) {
                setErrorMessage('Ticket description is required.');
                setIsLoading(false);
                return;
            }

            const response = await fetch(`${API_BASE_URL}/api/tickets/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create ticket');
            }

            setSuccessMessage('Ticket created successfully!');
            // Reset form
            setFormData({
                title: '',
                description: '',
                priority: 'MEDIUM',
                category: 'GENERAL',
            });

            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (error) {
            console.error('Error creating ticket:', error);
            setErrorMessage(error.message || 'Could not create ticket. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="dashboard-wrapper">
            <nav>
                <Navbar />
            </nav>
            <div className="dashboard-container">
                <div className="navbarvertical">
                    <NavBarVerticalComponent />
                </div>
                <div className="dashboard-content">
                    <div className="container">
                        <h1>Create New Ticket</h1>

                        {errorMessage && (
                            <div className="error-message" style={{ 
                                color: '#f44336', 
                                backgroundColor: '#ffebee',
                                padding: '12px',
                                borderRadius: '5px',
                                marginBottom: '20px',
                                border: '1px solid #ef5350'
                            }}>
                                {errorMessage}
                            </div>
                        )}

                        {successMessage && (
                            <div className="success-message" style={{ 
                                color: '#4CAF50', 
                                backgroundColor: '#e8f5e9',
                                padding: '12px',
                                borderRadius: '5px',
                                marginBottom: '20px',
                                border: '1px solid #81c784'
                            }}>
                                {successMessage}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="create-ticket-form" style={{
                            maxWidth: '600px',
                            margin: '0 auto',
                        }}>
                            <div className="form-group" style={{
                                marginBottom: '20px',
                                display: 'flex',
                                flexDirection: 'column',
                            }}>
                                <label htmlFor="title" style={{
                                    marginBottom: '8px',
                                    fontWeight: '500',
                                    color: 'var(--text-color)',
                                }}>
                                    Ticket Title <span style={{ color: '#f44336' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    placeholder="Enter ticket title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    maxLength="100"
                                    style={{
                                        padding: '10px',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '5px',
                                        fontSize: '14px',
                                        fontFamily: 'inherit',
                                    }}
                                />
                                <small style={{
                                    marginTop: '4px',
                                    color: '#666',
                                    fontSize: '12px',
                                }}>
                                    {formData.title.length}/100 characters
                                </small>
                            </div>

                            <div className="form-group" style={{
                                marginBottom: '20px',
                                display: 'flex',
                                flexDirection: 'column',
                            }}>
                                <label htmlFor="description" style={{
                                    marginBottom: '8px',
                                    fontWeight: '500',
                                    color: 'var(--text-color)',
                                }}>
                                    Description <span style={{ color: '#f44336' }}>*</span>
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    placeholder="Describe your issue in detail"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                    maxLength="2000"
                                    rows="6"
                                    style={{
                                        padding: '10px',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '5px',
                                        fontSize: '14px',
                                        fontFamily: 'inherit',
                                        resize: 'vertical',
                                    }}
                                />
                                <small style={{
                                    marginTop: '4px',
                                    color: '#666',
                                    fontSize: '12px',
                                }}>
                                    {formData.description.length}/2000 characters
                                </small>
                            </div>

                            <div className="form-group" style={{
                                marginBottom: '20px',
                                display: 'flex',
                                flexDirection: 'column',
                            }}>
                                <label htmlFor="priority" style={{
                                    marginBottom: '8px',
                                    fontWeight: '500',
                                    color: 'var(--text-color)',
                                }}>
                                    Priority
                                </label>
                                <select
                                    id="priority"
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleInputChange}
                                    style={{
                                        padding: '10px',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '5px',
                                        fontSize: '14px',
                                        fontFamily: 'inherit',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                    <option value="URGENT">Urgent</option>
                                </select>
                            </div>

                            <div className="form-group" style={{
                                marginBottom: '30px',
                                display: 'flex',
                                flexDirection: 'column',
                            }}>
                                <label htmlFor="category" style={{
                                    marginBottom: '8px',
                                    fontWeight: '500',
                                    color: 'var(--text-color)',
                                }}>
                                    Category
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    style={{
                                        padding: '10px',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '5px',
                                        fontSize: '14px',
                                        fontFamily: 'inherit',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <option value="GENERAL">General</option>
                                    <option value="BUG">Bug</option>
                                    <option value="FEATURE_REQUEST">Feature Request</option>
                                    <option value="ACCOUNT">Account Issue</option>
                                    <option value="BILLING">Billing</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>

                            <div style={{
                                display: 'flex',
                                gap: '10px',
                                justifyContent: 'center',
                            }}>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    style={{
                                        padding: '10px 30px',
                                        backgroundColor: isLoading ? '#ccc' : 'var(--primary-color)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: isLoading ? 'not-allowed' : 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    {isLoading ? 'Creating...' : 'Create Ticket'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate('/dashboard')}
                                    disabled={isLoading}
                                    style={{
                                        padding: '10px 30px',
                                        backgroundColor: '#e0e0e0',
                                        color: 'var(--text-color)',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: isLoading ? 'not-allowed' : 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateTicket;
