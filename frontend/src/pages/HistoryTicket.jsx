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

function HistoryTicket() {
	const navigate = useNavigate();
	const [tickets, setTickets] = useState([]);
	const [errorMessage, setErrorMessage] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [searchText, setSearchText] = useState('');

	const statusStyles = useMemo(() => ({
		OPEN: { backgroundColor: '#e8f5e9', color: '#2e7d32' },
		IN_PROGRESS: { backgroundColor: '#fff8e1', color: '#ed6c02' },
		RESOLVED: { backgroundColor: '#e3f2fd', color: '#1565c0' },
		CLOSED: { backgroundColor: '#eceff1', color: '#455a64' },
	}), []);

	useEffect(() => {
		const loadHistory = async () => {
			try {
				setIsLoading(true);
				setErrorMessage('');

				const token = localStorage.getItem(TOKEN_KEY);

				if (!token) {
					navigate('/');
					return;
				}

				const response = await fetch(`${API_BASE_URL}/api/tickets/history`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || 'Failed to load ticket history.');
				}

				setTickets(data.tickets || []);
			} catch (error) {
				setErrorMessage(error.message || 'Could not load ticket history.');
			} finally {
				setIsLoading(false);
			}
		};

		loadHistory();
	}, [navigate]);

	const filteredTickets = tickets.filter((ticket) => {
		const query = searchText.trim().toLowerCase();

		if (!query) {
			return true;
		}

		return [ticket.id, ticket.title, ticket.category, ticket.priority, ticket.status]
			.some((value) => String(value || '').toLowerCase().includes(query));
	});

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
						<h1>Ticket History</h1>
						<p>Review the tickets you created and open any ticket for full details.</p>
					</div>

					<div className="dashboard-section">
						<div style={{ display: 'flex', gap: '12px', alignItems: 'end', flexWrap: 'wrap', marginBottom: '20px' }}>
							<div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
								<label htmlFor="searchTickets" style={{ fontWeight: 600 }}>Search tickets</label>
								<input
									id="searchTickets"
									type="text"
									value={searchText}
									onChange={(e) => setSearchText(e.target.value)}
									placeholder="Search by title, status, category, or ID"
									style={{
										padding: '10px 12px',
										borderRadius: '6px',
										border: '1px solid var(--border-color)',
										fontSize: '14px',
									}}
								/>
							</div>

							<Link
								to="/create-ticket"
								style={{
									padding: '10px 18px',
									borderRadius: '6px',
									backgroundColor: 'var(--primary-color)',
									color: '#fff',
									fontWeight: 600,
									textDecoration: 'none',
								}}
							>
								Create New Ticket
							</Link>
						</div>

						{isLoading && <p>Loading ticket history...</p>}

						{!isLoading && errorMessage && (
							<div style={{ color: '#b91c1c', backgroundColor: '#fee2e2', border: '1px solid #fecaca', padding: '12px', borderRadius: '6px' }}>
								{errorMessage}
							</div>
						)}

						{!isLoading && !errorMessage && filteredTickets.length === 0 && (
							<div style={{ padding: '18px', backgroundColor: '#f9fafb', border: '1px dashed var(--border-color)', borderRadius: '8px' }}>
								<p style={{ margin: 0, fontWeight: 600 }}>No tickets found.</p>
								<p style={{ margin: '6px 0 0 0', color: '#6b7280' }}>
									Create your first ticket or widen your search.
								</p>
							</div>
						)}

						{!isLoading && !errorMessage && filteredTickets.length > 0 && (
							<div style={{ overflowX: 'auto' }}>
								<table style={{ width: '100%', borderCollapse: 'collapse' }}>
									<thead>
										<tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>
											<th style={{ padding: '12px 10px' }}>Title</th>
											<th style={{ padding: '12px 10px' }}>Status</th>
											<th style={{ padding: '12px 10px' }}>Priority</th>
											<th style={{ padding: '12px 10px' }}>Category</th>
											<th style={{ padding: '12px 10px' }}>Created</th>
											<th style={{ padding: '12px 10px' }}>Updated</th>
											<th style={{ padding: '12px 10px' }}>Action</th>
										</tr>
									</thead>
									<tbody>
										{filteredTickets.map((ticket) => (
											<tr key={ticket.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
												<td style={{ padding: '12px 10px', fontWeight: 600 }}>{ticket.title}</td>
												<td style={{ padding: '12px 10px' }}>
													<span style={{ ...statusStyles[ticket.status], padding: '6px 10px', borderRadius: '999px', fontWeight: 600, fontSize: '12px' }}>
														{ticket.status.replaceAll('_', ' ')}
													</span>
												</td>
												<td style={{ padding: '12px 10px' }}>{ticket.priority}</td>
												<td style={{ padding: '12px 10px' }}>{ticket.category}</td>
												<td style={{ padding: '12px 10px' }}>{formatDate(ticket.createdAt)}</td>
												<td style={{ padding: '12px 10px' }}>{formatDate(ticket.updatedAt)}</td>
												<td style={{ padding: '12px 10px' }}>
													<Link
														to={`/view-ticket/${ticket.id}`}
														style={{
															color: 'var(--primary-color)',
															fontWeight: 600,
															textDecoration: 'none',
														}}
													>
														View
													</Link>
												</td>
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

export default HistoryTicket;
