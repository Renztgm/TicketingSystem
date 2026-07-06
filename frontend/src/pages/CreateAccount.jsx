import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/styles.css';
import Navbar from '../components/NavBarComponent';
import NavBarVerticalComponent from '../components/NavBarVerticalComponent';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const TOKEN_KEY = 'ticketing_token';
const USER_KEY = 'ticketing_user';

function CreateAccount() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
		role: 'USER',
	});
	const [errorMessage, setErrorMessage] = useState('');
	const [successMessage, setSuccessMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isForbidden, setIsForbidden] = useState(false);

	React.useEffect(() => {
		const token = localStorage.getItem(TOKEN_KEY);

		if (!token) {
			navigate('/');
			return;
		}

		try {
			const currentUser = JSON.parse(localStorage.getItem(USER_KEY) || 'null');

			if (currentUser?.role !== 'ADMIN') {
				setIsForbidden(true);
			}
		} catch (error) {
			navigate('/');
		}
	}, [navigate]);

	const handleInputChange = (event) => {
		const { name, value } = event.target;

		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setErrorMessage('');
		setSuccessMessage('');
		setIsLoading(true);

		try {
			if (!formData.name.trim()) {
				throw new Error('Name is required.');
			}

			if (!formData.email.trim()) {
				throw new Error('Email is required.');
			}

			if (formData.password.length < 6) {
				throw new Error('Password must be at least 6 characters long.');
			}

			if (formData.password !== formData.confirmPassword) {
				throw new Error('Passwords do not match.');
			}

			const response = await fetch(`${API_BASE_URL}/api/admin/create-user`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY) || ''}`,
				},
				body: JSON.stringify({
					name: formData.name.trim(),
					email: formData.email.trim(),
					password: formData.password,
					role: formData.role,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to create account.');
			}


	if (isForbidden) {
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
							<h1>Access Forbidden</h1>
							<p>You do not have permission to create accounts.</p>
						</div>
					</div>
				</div>
			</div>
		);
	}
			setSuccessMessage(data.message || 'Account created successfully. You can now log in.');
			setFormData({
				name: '',
				email: '',
				password: '',
				confirmPassword: '',
				role: 'USER',
			});

			setTimeout(() => {
				navigate('/');
			}, 2000);
		} catch (error) {
			setErrorMessage(error.message || 'Could not create account. Please try again.');
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
						<h1>Create New Account</h1>

						{errorMessage && (
							<div style={{
								color: '#f44336',
								backgroundColor: '#ffebee',
								padding: '12px',
								borderRadius: '5px',
								marginBottom: '20px',
								border: '1px solid #ef5350',
							}}>
								{errorMessage}
							</div>
						)}

						{successMessage && (
							<div style={{
								color: '#4CAF50',
								backgroundColor: '#e8f5e9',
								padding: '12px',
								borderRadius: '5px',
								marginBottom: '20px',
								border: '1px solid #81c784',
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
								<label htmlFor="name" style={{
									marginBottom: '8px',
									fontWeight: '500',
									color: 'var(--text-color)',
								}}>
									Full Name <span style={{ color: '#f44336' }}>*</span>
								</label>
								<input
									type="text"
									id="name"
									name="name"
									placeholder="Enter your full name"
									value={formData.name}
									onChange={handleInputChange}
									required
									style={{
										padding: '10px',
										border: '1px solid var(--border-color)',
										borderRadius: '5px',
										fontSize: '14px',
										fontFamily: 'inherit',
									}}
								/>
							</div>

							<div className="form-group" style={{
								marginBottom: '20px',
								display: 'flex',
								flexDirection: 'column',
							}}>
								<label htmlFor="email" style={{
									marginBottom: '8px',
									fontWeight: '500',
									color: 'var(--text-color)',
								}}>
									Email <span style={{ color: '#f44336' }}>*</span>
								</label>
								<input
									type="email"
									id="email"
									name="email"
									placeholder="Enter your email"
									value={formData.email}
									onChange={handleInputChange}
									required
									style={{
										padding: '10px',
										border: '1px solid var(--border-color)',
										borderRadius: '5px',
										fontSize: '14px',
										fontFamily: 'inherit',
									}}
								/>
							</div>

							<div className="form-group" style={{
								marginBottom: '20px',
								display: 'flex',
								flexDirection: 'column',
							}}>
								<label htmlFor="password" style={{
									marginBottom: '8px',
									fontWeight: '500',
									color: 'var(--text-color)',
								}}>
									Password <span style={{ color: '#f44336' }}>*</span>
								</label>
								<input
									type="password"
									id="password"
									name="password"
									placeholder="Create a password"
									value={formData.password}
									onChange={handleInputChange}
									required
									style={{
										padding: '10px',
										border: '1px solid var(--border-color)',
										borderRadius: '5px',
										fontSize: '14px',
										fontFamily: 'inherit',
									}}
								/>
							</div>

							<div className="form-group" style={{
								marginBottom: '30px',
								display: 'flex',
								flexDirection: 'column',
							}}>
								<label htmlFor="confirmPassword" style={{
									marginBottom: '8px',
									fontWeight: '500',
									color: 'var(--text-color)',
								}}>
									Confirm Password <span style={{ color: '#f44336' }}>*</span>
								</label>
								<input
									type="password"
									id="confirmPassword"
									name="confirmPassword"
									placeholder="Confirm your password"
									value={formData.confirmPassword}
									onChange={handleInputChange}
									required
									style={{
										padding: '10px',
										border: '1px solid var(--border-color)',
										borderRadius: '5px',
										fontSize: '14px',
										fontFamily: 'inherit',
									}}
								/>
							</div>

							<div className="form-group" style={{
								marginBottom: '30px',
								display: 'flex',
								flexDirection: 'column',
							}}>
								<label htmlFor="role" style={{
									marginBottom: '8px',
									fontWeight: '500',
									color: 'var(--text-color)',
								}}>
									Role <span style={{ color: '#f44336' }}>*</span>
								</label>
								<select
									id="role"
									name="role"
									value={formData.role}
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
									<option value="USER">User</option>
									<option value="AGENT">Agent</option>
									<option value="ADMIN">Admin</option>
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
									{isLoading ? 'Creating...' : 'Create Account'}
								</button>
								<button
									type="button"
									onClick={() => navigate('/')}
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

export default CreateAccount;
