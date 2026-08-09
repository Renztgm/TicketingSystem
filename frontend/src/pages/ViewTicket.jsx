import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

function OpenTickets() {
	const navigate = useNavigate();
	const [tickets, setTickets] = useState([]);
	const [statusFilter, setStatusFilter] = useState('OPEN');
	const [errorMessage, setErrorMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const statusStyles = useMemo(() => ({
		OPEN: { backgroundColor: '#e8f5e9', color: '#2e7d32' },
		IN_PROGRESS: { backgroundColor: '#fff8e1', color: '#ed6c02' },
		RESOLVED: { backgroundColor: '#e3f2fd', color: '#1565c0' },
		CLOSED: { backgroundColor: '#eceff1', color: '#455a64' },
	}), []);

	const loadTickets = async (status) => {
		try {
			setErrorMessage('');
			setIsLoading(true);

			const token = localStorage.getItem(TOKEN_KEY);

			if (!token) {
				setErrorMessage('Authentication token not found. Please login again.');
				navigate('/');
				return;
			}

			const query = status ? `?status=${encodeURIComponent(status)}` : '';
			const response = await fetch(`${API_BASE_URL}/api/tickets${query}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to load tickets.');
			}

			setTickets(data.tickets || []);
		} catch (error) {
			setTickets([]);
			setErrorMessage(error.message || 'Could not load tickets.');
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		loadTickets(statusFilter);
	}, [statusFilter]);

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
						<h1>Open Tickets</h1>
						<p>Browse tickets by status.</p>
					</div>

					<div className="dashboard-section">
						<div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '16px' }}>
							<label htmlFor="statusFilter" style={{ fontWeight: 600 }}>Status</label>
							<select
								id="statusFilter"
								value={statusFilter}
								onChange={(e) => setStatusFilter(e.target.value)}
								style={{
									padding: '8px 12px',
									borderRadius: '6px',
									border: '1px solid var(--border-color)',
									fontSize: '14px',
								}}
							>
								<option value="OPEN">Open</option>
								<option value="IN_PROGRESS">In Progress</option>
								<option value="RESOLVED">Resolved</option>
								<option value="CLOSED">Closed</option>
								<option value="">All</option>
							</select>
						</div>

						{errorMessage && (
							<div style={{ marginBottom: '16px', color: '#b91c1c', backgroundColor: '#fee2e2', border: '1px solid #fecaca', padding: '12px', borderRadius: '6px' }}>
								{errorMessage}
							</div>
						)}

						{isLoading ? (
							<p>Loading tickets...</p>
						) : tickets.length === 0 ? (
							<p style={{ color: '#6b7280' }}>No tickets found for this status.</p>
						) : (
							<div style={{ overflowX: 'auto' }}>
								<table style={{ width: '100%', borderCollapse: 'collapse' }}>
									<thead>
										<tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
											<th style={{ padding: '10px' }}>Ticket ID</th>
											<th style={{ padding: '10px' }}>Title</th>
											<th style={{ padding: '10px' }}>Status</th>
											<th style={{ padding: '10px' }}>Priority</th>
											<th style={{ padding: '10px' }}>Owner</th>
											<th style={{ padding: '10px' }}>Assigned Agent</th>
											<th style={{ padding: '10px' }}>Created</th>
										</tr>
									</thead>
									<tbody>
										{tickets.map((ticket) => (
											<tr key={ticket.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
												<td style={{ padding: '10px' }}>
													<Link to={`/tickets/${ticket.id}`}>{ticket.id}</Link>
												</td>
												<td style={{ padding: '10px' }}>{ticket.title}</td>
												<td style={{ padding: '10px' }}>
													<span style={{ ...statusStyles[ticket.status], padding: '6px 10px', borderRadius: '999px', fontWeight: 600, fontSize: '12px' }}>
														{ticket.status.replaceAll('_', ' ')}
													</span>
												</td>
												<td style={{ padding: '10px' }}>{ticket.priority}</td>
												<td style={{ padding: '10px' }}>{ticket.user?.name || ticket.user?.email || 'Unknown'}</td>
												<td style={{ padding: '10px' }}>{ticket.assignedAgent?.name || ticket.assignedAgent?.email || 'Unassigned'}</td>
												<td style={{ padding: '10px' }}>{formatDate(ticket.createdAt)}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default OpenTickets;