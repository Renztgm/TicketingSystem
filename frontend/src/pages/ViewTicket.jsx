import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import '../css/styles.css';
import Navbar from '../components/NavBarComponent';
import NavBarVerticalComponent from '../components/NavBarVerticalComponent';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const TOKEN_KEY = 'ticketing_token';

function formatDate(value) {
	if (!value) {
		return '-';
	}

	return new Date(value).toLocaleString();
}

function ViewTicket() {
	const { ticketId } = useParams();
	const navigate = useNavigate();
	const [ticketInput, setTicketInput] = useState(ticketId || '');
	const [ticket, setTicket] = useState(null);
	const [errorMessage, setErrorMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		setTicketInput(ticketId || '');
	}, [ticketId]);

	const loadTicket = async (id) => {
		if (!id.trim()) {
			setErrorMessage('Enter a ticket ID to view.');
			setTicket(null);
			return;
		}

		try {
			setErrorMessage('');
			setIsLoading(true);

			const token = localStorage.getItem(TOKEN_KEY);

			if (!token) {
				setErrorMessage('Authentication token not found. Please login again.');
				navigate('/');
				return;
			}

			const response = await fetch(`${API_BASE_URL}/api/tickets/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to load ticket.');
			}

			setTicket(data.ticket);
		} catch (error) {
			setTicket(null);
			setErrorMessage(error.message || 'Could not load ticket details.');
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (ticketId) {
			loadTicket(ticketId);
		}
	}, [ticketId]);

	const statusStyles = useMemo(() => ({
		OPEN: { backgroundColor: '#e8f5e9', color: '#2e7d32' },
		IN_PROGRESS: { backgroundColor: '#fff8e1', color: '#ed6c02' },
		RESOLVED: { backgroundColor: '#e3f2fd', color: '#1565c0' },
		CLOSED: { backgroundColor: '#eceff1', color: '#455a64' },
	}), []);

	const renderTicketDetails = () => {
		if (!ticket) {
			return null;
		}

		return (
			<div className="dashboard-section">
				<div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', alignItems: 'start' }}>
					<div>
						<p style={{ margin: '0 0 8px 0', color: '#6b7280', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
							Ticket Details
						</p>
						<h2 style={{ margin: 0 }}>{ticket.title}</h2>
						<p style={{ margin: '8px 0 0 0', color: '#6b7280' }}>ID: {ticket.id}</p>
					</div>

					<div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
						<span style={{ ...statusStyles[ticket.status], padding: '8px 12px', borderRadius: '999px', fontWeight: 600, fontSize: '12px' }}>
							{ticket.status.replaceAll('_', ' ')}
						</span>
						<span style={{ backgroundColor: '#f3f4f6', color: '#374151', padding: '8px 12px', borderRadius: '999px', fontWeight: 600, fontSize: '12px' }}>
							{ticket.priority}
						</span>
						<span style={{ backgroundColor: '#f3f4f6', color: '#374151', padding: '8px 12px', borderRadius: '999px', fontWeight: 600, fontSize: '12px' }}>
							{ticket.category}
						</span>
					</div>
				</div>

				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '24px' }}>
					<div style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '10px', backgroundColor: '#fff' }}>
						<p style={{ margin: '0 0 6px 0', color: '#6b7280', fontSize: '13px' }}>Owner</p>
						<p style={{ margin: 0, fontWeight: 600 }}>{ticket.user?.name || ticket.user?.email || 'Unknown user'}</p>
						<p style={{ margin: '6px 0 0 0', color: '#6b7280', fontSize: '13px' }}>{ticket.user?.email || '-'}</p>
					</div>

					<div style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '10px', backgroundColor: '#fff' }}>
						<p style={{ margin: '0 0 6px 0', color: '#6b7280', fontSize: '13px' }}>Created</p>
						<p style={{ margin: 0, fontWeight: 600 }}>{formatDate(ticket.createdAt)}</p>
					</div>

					<div style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '10px', backgroundColor: '#fff' }}>
						<p style={{ margin: '0 0 6px 0', color: '#6b7280', fontSize: '13px' }}>Last Updated</p>
						<p style={{ margin: 0, fontWeight: 600 }}>{formatDate(ticket.updatedAt)}</p>
					</div>
				</div>

				<div style={{ marginTop: '24px', padding: '20px', border: '1px solid var(--border-color)', borderRadius: '10px', backgroundColor: '#fff' }}>
					<p style={{ margin: '0 0 12px 0', color: '#6b7280', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Description</p>
					<p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{ticket.description}</p>
				</div>
			</div>
		);
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
					<div className="dashboard-header">
						<h1>View Ticket</h1>
						<p>Search for a ticket by ID or open it directly from the route.</p>
					</div>

					<div className="dashboard-section">
						<form
							onSubmit={(e) => {
								e.preventDefault();
								loadTicket(ticketInput);
							}}
							style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'end' }}
						>
							<div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
								<label htmlFor="ticketId" style={{ fontWeight: 600 }}>Ticket ID</label>
								<input
									id="ticketId"
									type="text"
									value={ticketInput}
									onChange={(e) => setTicketInput(e.target.value)}
									placeholder="Paste a ticket ID"
									style={{
										padding: '10px 12px',
										borderRadius: '6px',
										border: '1px solid var(--border-color)',
										fontSize: '14px',
									}}
								/>
							</div>

							<button
								type="submit"
								disabled={isLoading}
								style={{
									padding: '10px 18px',
									border: 'none',
									borderRadius: '6px',
									backgroundColor: isLoading ? '#9ca3af' : 'var(--primary-color)',
									color: '#fff',
									fontWeight: 600,
									cursor: isLoading ? 'not-allowed' : 'pointer',
								}}
							>
								{isLoading ? 'Loading...' : 'View Ticket'}
							</button>

							<Link
								to="/dashboard"
								style={{
									padding: '10px 18px',
									borderRadius: '6px',
									backgroundColor: '#e5e7eb',
									color: '#111827',
									fontWeight: 600,
									textDecoration: 'none',
								}}
							>
								Back to Dashboard
							</Link>
						</form>

						{errorMessage && (
							<div style={{ marginTop: '20px', color: '#b91c1c', backgroundColor: '#fee2e2', border: '1px solid #fecaca', padding: '12px', borderRadius: '6px' }}>
								{errorMessage}
							</div>
						)}
					</div>

					{renderTicketDetails()}
				</div>
			</div>
		</div>
	);
}

export default ViewTicket;
