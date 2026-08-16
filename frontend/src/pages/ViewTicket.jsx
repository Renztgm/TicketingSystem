import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/styles.css';
import Navbar from '../components/NavBarComponent';
import NavBarVerticalComponent from '../components/NavBarVerticalComponent';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const TOKEN_KEY = 'ticketing_token';
const USER_KEY = 'ticketing_user';

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
	const [priorityFilter, setPriorityFilter] = useState('');
	const [technicianFilter, setTechnicianFilter] = useState('');
	const [searchTerm, setSearchTerm] = useState('');
	const [assignedToMeOnly, setAssignedToMeOnly] = useState(true);
	const [errorMessage, setErrorMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const currentUser = JSON.parse(localStorage.getItem(USER_KEY) || 'null');

	const statusStyles = useMemo(() => ({
		OPEN: { backgroundColor: '#e8f5e9', color: '#2e7d32' },
		IN_PROGRESS: { backgroundColor: '#fff8e1', color: '#ed6c02' },
		RESOLVED: { backgroundColor: '#e3f2fd', color: '#1565c0' },
		CLOSED: { backgroundColor: '#eceff1', color: '#455a64' },
	}), []);

	const priorityStyles = useMemo(() => ({
		HIGH: { backgroundColor: '#fee2e2', color: '#b91c1c' },
		MEDIUM: { backgroundColor: '#fef3c7', color: '#92400e' },
		LOW: { backgroundColor: '#e0f2fe', color: '#0369a1' },
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

	// Build the technician dropdown from whichever agents currently show up
	// as assignees across the loaded tickets, so the list only ever offers
	// people who actually have tickets under the current status filter.
	const technicianOptions = useMemo(() => {
		const seen = new Map();

		tickets.forEach((ticket) => {
			if (ticket.assignedAgent) {
				seen.set(ticket.assignedAgent.id, ticket.assignedAgent.name || ticket.assignedAgent.email);
			}
		});

		return Array.from(seen, ([id, label]) => ({ id, label })).sort((a, b) => a.label.localeCompare(b.label));
	}, [tickets]);

	// Combine every active filter: status is applied server-side already,
	// "Me only" / technician / priority / search are all applied client-side
	// against whatever the server returned for the selected status.
	const visibleTickets = useMemo(() => {
		const term = searchTerm.trim().toLowerCase();

		return tickets.filter((ticket) => {
			if (assignedToMeOnly && currentUser && ticket.assignedAgent?.id !== currentUser.id) {
				return false;
			}

			if (priorityFilter && ticket.priority !== priorityFilter) {
				return false;
			}

			if (technicianFilter && ticket.assignedAgent?.id !== technicianFilter) {
				return false;
			}

			if (term) {
				const haystack = `${ticket.id} ${ticket.title} ${ticket.user?.name || ''} ${ticket.user?.email || ''}`.toLowerCase();
				if (!haystack.includes(term)) {
					return false;
				}
			}

			return true;
		});
	}, [tickets, assignedToMeOnly, currentUser, priorityFilter, technicianFilter, searchTerm]);

	const selectStyle = {
		padding: '8px 12px',
		borderRadius: '6px',
		border: '1px solid var(--border-color)',
		fontSize: '14px',
	};

	return (
		<div className="dashboard-wrapper">
			<nav className="dashboard-nav">
				<NavBarVerticalComponent />
			</nav>
			<div className="dashboard-container">
				<Navbar />
				<div className="dashboard-content">

					<div className="dashboard-section">
						<div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '16px' }}>
							<input
								id="searchInput"
								type="text"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								placeholder="Search ID, subject, or user..."
								style={{
									padding: '8px 12px',
									borderRadius: '6px',
									border: '1px solid var(--border-color)',
									fontSize: '14px',
									minWidth: '220px',
									flex: '1 1 220px',
								}}
							/>

							<select
								id="statusFilter"
								value={statusFilter}
								onChange={(e) => setStatusFilter(e.target.value)}
								style={selectStyle}
							>
								<option value="OPEN">Status: Open</option>
								<option value="IN_PROGRESS">Status: In Progress</option>
								<option value="RESOLVED">Status: Resolved</option>
								<option value="CLOSED">Status: Closed</option>
								<option value="">Status: All</option>
							</select>

							<select
								id="priorityFilter"
								value={priorityFilter}
								onChange={(e) => setPriorityFilter(e.target.value)}
								style={selectStyle}
							>
								<option value="">Priority: All</option>
								<option value="HIGH">Priority: High</option>
								<option value="MEDIUM">Priority: Medium</option>
								<option value="LOW">Priority: Low</option>
							</select>

							<select
								id="technicianFilter"
								value={technicianFilter}
								onChange={(e) => setTechnicianFilter(e.target.value)}
								style={selectStyle}
							>
								<option value="">Technician: All</option>
								{technicianOptions.map((tech) => (
									<option key={tech.id} value={tech.id}>
										Technician: {tech.label}
									</option>
								))}
							</select>

							<label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, cursor: 'pointer' }}>
								<input
									type="checkbox"
									checked={assignedToMeOnly}
									onChange={(e) => setAssignedToMeOnly(e.target.checked)}
								/>
								Me only
							</label>

							<Link to='/create-ticket' className="btn btn-primary" style={{ marginLeft: 'auto' }}>Create Ticket</Link>
						</div>

						{errorMessage && (
							<div style={{ marginBottom: '16px', color: '#b91c1c', backgroundColor: '#fee2e2', border: '1px solid #fecaca', padding: '12px', borderRadius: '6px' }}>
								{errorMessage}
							</div>
						)}

						{isLoading ? (
							<p>Loading tickets...</p>
						) : visibleTickets.length === 0 ? (
							<p style={{ color: '#6b7280' }}>No tickets match the current filters.</p>
						) : (
							<div style={{ overflowX: 'auto' }}>
								<table style={{ width: '100%', borderCollapse: 'collapse' }}>
									<thead>
										<tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
											<th style={{ padding: '10px' }}>ID</th>
											<th style={{ padding: '10px' }}>Subject</th>
											<th style={{ padding: '10px' }}>User</th>
											<th style={{ padding: '10px' }}>Priority</th>
											<th style={{ padding: '10px' }}>Technician</th>
											<th style={{ padding: '10px' }}>Status</th>
										</tr>
									</thead>
									<tbody>
										{visibleTickets.map((ticket) => {
											const isMine = currentUser && ticket.assignedAgent?.id === currentUser.id;

											return (
												<tr
													key={ticket.id}
													style={{
														borderBottom: '1px solid var(--border-color)',
														backgroundColor: isMine ? '#f0fdf4' : 'transparent',
													}}
												>
													<td style={{ padding: '10px' }}>
														<Link to={`/tickets/${ticket.id}`} style={{ textDecoration: 'none' }}>#{ticket.id}</Link>
													</td>
													<td style={{ padding: '10px' }}>{ticket.title}</td>
													<td style={{ padding: '10px' }}>{ticket.user?.name || ticket.user?.email || 'Unknown'}</td>
													<td style={{ padding: '10px' }}>
														<span style={{ ...priorityStyles[ticket.priority], padding: '6px 10px', borderRadius: '999px', fontWeight: 600, fontSize: '12px' }}>
															{ticket.priority}
														</span>
													</td>
													<td style={{ padding: '10px' }}>
														{ticket.assignedAgent?.name || ticket.assignedAgent?.email || 'Unassigned'}
														{isMine && (
															<span style={{ marginLeft: '8px', fontSize: '11px', fontWeight: 600, color: '#2e7d32', backgroundColor: '#e8f5e9', padding: '2px 8px', borderRadius: '999px' }}>
																You
															</span>
														)}
													</td>
													<td style={{ padding: '10px' }}>
														<span style={{ ...statusStyles[ticket.status], padding: '6px 10px', borderRadius: '999px', fontWeight: 600, fontSize: '12px' }}>
															{ticket.status.replaceAll('_', ' ')}
														</span>
													</td>
												</tr>
											);
										})}
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