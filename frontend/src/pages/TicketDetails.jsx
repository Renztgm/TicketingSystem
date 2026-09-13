import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import '../css/styles.css';
import Navbar from '../components/NavBarComponent';
import NavBarVerticalComponent from '../components/NavBarVerticalComponent';
import Back_Button from '../assets/back_button_png.png';
import { useNotification } from '../context/NotificationContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const TOKEN_KEY = 'ticketing_token';
const USER_KEY = 'ticketing_user';

function formatDate(value) {
	if (!value) {
		return '-';
	}

	return new Date(value).toLocaleString();
}

function TicketDetails() {
	const { showNotification } = useNotification();
	const { ticketId } = useParams();
	const navigate = useNavigate();
	const [ticket, setTicket] = useState(null);
	const [agents, setAgents] = useState([]);
	const [selectedAgentId, setSelectedAgentId] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [successMessage, setSuccessMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isAssigning, setIsAssigning] = useState(false);
	const currentUser = JSON.parse(localStorage.getItem(USER_KEY) || 'null');
	const isAdmin = currentUser?.role === 'ADMIN';
	const isAgent = currentUser?.role === 'AGENT';

	const [selectedStatus, setSelectedStatus] = useState('');
	const [isUpdatingStatus, setIsUpdatingStatus] = useState(false); 
	

	const loadTicket = async (id) => {
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
			setSelectedAgentId(data.ticket?.assignedAgent?.id || data.ticket?.assignedTo || '');
			setSelectedStatus(data.ticket?.status || '');
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

	useEffect(() => {
		if (!isAdmin) {
			return;
		}

		const loadAgents = async () => {
			try {
				const token = localStorage.getItem(TOKEN_KEY);

				const response = await fetch(`${API_BASE_URL}/api/admin/agents`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || 'Failed to load agents.');
				}

				setAgents(data.agents || []);
			} catch (error) {
				setErrorMessage(error.message || 'Could not load agents.');
			}
		};

		loadAgents();
	}, [isAdmin]);

	const handleAssignAgent = async (event) => {
		event.preventDefault();

		if (!ticket) {
			setErrorMessage('Load a ticket before assigning an agent.');
			return;
		}

		if (!selectedAgentId) {
			// setErrorMessage('Select an agent first.');
			showNotification({ type: 'error', message: 'Select an agent first.' });
			return;
		}

		if (ticket.assignedAgent?.id === selectedAgentId) {
			showNotification({ type: 'error', message: 'This agent is already assigned to this ticket.' });
			return;
		}

		try {
			setIsAssigning(true);
			setErrorMessage('');
			setSuccessMessage('');

			const token = localStorage.getItem(TOKEN_KEY);

			const response = await fetch(`${API_BASE_URL}/api/tickets/${ticket.id}/assign`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ agentId: selectedAgentId }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to assign agent.');
			}

			setTicket(data.ticket);
			// setSuccessMessage('Agent assigned successfully.');
			showNotification({ type: 'success', message: 'Agent assigned successfully.' });
		} catch (error) {
			// setErrorMessage(error.message || 'Could not assign agent.');
		} finally {
			setIsAssigning(false);
		}
	};

	const handleUpdateStatus = async (event) => {
		event.preventDefault();

		if (!ticket) {
			showNotification({ type: 'error', message: 'Load a ticket before updating status.' });
			return;
		}

		if (!selectedStatus) {
			showNotification({ type: 'error', message: 'Select a status first.' });
			return;
		}

		if (selectedStatus === ticket.status) {
			showNotification({ type: 'error', message: 'Ticket already has this status.' });
			return;
		}

		try {
			setIsUpdatingStatus(true);

			const token = localStorage.getItem(TOKEN_KEY);

			const response = await fetch(`${API_BASE_URL}/api/tickets/${ticket.id}/status`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ status: selectedStatus }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to update status.');
			}

			setTicket(data.ticket);
			setSelectedStatus(data.ticket?.status || selectedStatus);
			showNotification({ type: 'success', message: 'Ticket status updated successfully.' });
		} catch (error) {
			showNotification({ type: 'error', message: error.message || 'Could not update status.' });
		} finally {
			setIsUpdatingStatus(false);
		}
	};

	const statusStyles = useMemo(() => ({
		OPEN: { backgroundColor: '#e8f5e9', color: '#2e7d32' },
		IN_PROGRESS: { backgroundColor: '#fff8e1', color: '#ed6c02' },
		RESOLVED: { backgroundColor: '#e3f2fd', color: '#1565c0' },
		CLOSED: { backgroundColor: '#eceff1', color: '#455a64' },
	}), []);

	

	return (
		<div className="dashboard-wrapper">
				<NavBarVerticalComponent />
			<div className="dashboard-container">
				<Navbar />
				<div className="dashboard-content">
					<div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
						{/* <div>
							<h1>Ticket Details</h1>
							<p>Full details for this ticket.</p>
						</div> */}
                        
					</div>

					{isLoading && <p>Loading ticket...</p>}

					{errorMessage && (
						<div style={{ marginTop: '12px', color: '#b91c1c', backgroundColor: '#fee2e2', border: '1px solid #fecaca', padding: '12px', borderRadius: '6px' }}>
							{errorMessage}
						</div>
					)}

					{successMessage && (
						<div style={{ marginTop: '12px', color: '#166534', backgroundColor: '#dcfce7', border: '1px solid #bbf7d0', padding: '12px', borderRadius: '6px' }}>
							{successMessage}
						</div>
					)}

					{ticket && (
						<div className="dashboard-section">
							<div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', alignItems: 'start' }}>
								<div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div 
                                            onClick={() => navigate(-1)}
                                            style={{
                                                padding: '5px 10px',
                                                borderRadius: '6px',
                                                width: 'fit-content',
												cursor: 'pointer',
                                            }}
                                        >
                                            <img src={Back_Button} alt="Back" style={{ width: '30px', height: '30px' }} />
                                        </div >
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>    
                                            <h2 style={{ margin: 0 }}>{ticket.title}</h2>
                                            <p style={{ margin: '0', color: '#6b7280' }}>ID: {ticket.id}</p>
                                        </div>
                                    </div>
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

							<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '16px', marginTop: '24px' }}>
								<div style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '10px', backgroundColor: '#fff' }}>
									<p style={{ margin: '0 0 6px 0', color: '#6b7280', fontSize: '13px' }}>Owner</p>
									<p style={{ margin: 0, fontWeight: 600 }}>{ticket.user?.name || ticket.user?.email || 'Unknown user'}</p>
									<p style={{ margin: '6px 0 0 0', color: '#6b7280', fontSize: '13px' }}>{ticket.user?.email || '-'}</p>
								</div>

								<div style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '10px', backgroundColor: '#fff' }}>
									<p style={{ margin: '0 0 6px 0', color: '#6b7280', fontSize: '13px' }}>Assigned Agent</p>
									<p style={{ margin: 0, fontWeight: 600 }}>{ticket.assignedAgent?.name || ticket.assignedAgent?.email || 'Unassigned'}</p>
									<p style={{ margin: '6px 0 0 0', color: '#6b7280', fontSize: '13px' }}>{ticket.assignedAgent?.email || '-'}</p>
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
							
							<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '16px', marginTop: '24px' }}>
								<div style={{ marginTop: '24px', padding: '20px', border: '1px solid var(--border-color)', borderRadius: '10px', backgroundColor: '#fff' }}>
									<p style={{ margin: '0 0 12px 0', color: '#6b7280', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Conversation</p>
									<Link to={`/chats/${ticket.id}`} style={{textDecoration: 'none'}}>
										View Conversation
									</Link>
								</div>
								<div style={{ marginTop: '24px', padding: '20px', border: '1px solid var(--border-color)', borderRadius: '10px', backgroundColor: '#fff' }}>
									<p style={{ margin: '0 0 12px 0', color: '#6b7280', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Activity Logs</p>
									<Link to={`#`} disabled={true} style={{ color: '#9ca3af', cursor: 'not-allowed', textDecoration: 'none' }}>
										Activity Logs
									</Link>
								</div>
								{isAdmin && (
									<div style={{ marginTop: '24px', padding: '20px', border: '1px solid var(--border-color)', borderRadius: '10px', backgroundColor: '#fff' }}>
										<p style={{ margin: '0 0 12px 0', color: '#6b7280', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Assign Agent</p>
										<form onSubmit={handleAssignAgent} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'end' }}>
											<div style={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
												<label htmlFor="agentId" style={{ fontWeight: 600 }}>Select Agent</label>
												<select
													id="agentId"
													value={selectedAgentId}
													onChange={(e) => setSelectedAgentId(e.target.value)}
													style={{
														padding: '10px 12px',
														borderRadius: '6px',
														border: '1px solid var(--border-color)',
														fontSize: '14px',
													}}
												>
													<option value="">Choose an agent</option>
													{agents.map((agent) => (
														<option key={agent.id} value={agent.id}>
															{agent.name || agent.email}
														</option>
													))}
												</select>
											</div>

											<button
												type="submit"
												disabled={isAssigning}
												style={{
													padding: '10px 18px',
													border: 'none',
													borderRadius: '6px',
													backgroundColor: isAssigning ? '#9ca3af' : 'var(--primary-color)',
													color: '#fff',
													fontWeight: 600,
													cursor: isAssigning ? 'not-allowed' : 'pointer',
												}}
											>
												{isAssigning ? 'Assigning...' : 'Assign Agent'}
											</button>
										</form>
									</div>
								)}
								{((currentUser.id === ticket.assignedAgent?.id) || isAdmin) && (
									<div style={{ marginTop: '24px', padding: '20px', border: '1px solid var(--border-color)', borderRadius: '10px', backgroundColor: '#fff' }}>
										<p style={{ margin: '0 0 12px 0', color: '#6b7280', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actions</p>
										<form onSubmit={handleUpdateStatus} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'end' }}>
											<div style={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
												<label htmlFor="statusSelect" style={{ fontWeight: 600 }}>Select Status</label>
												<select
													id="statusSelect"
													value={selectedStatus}
													onChange={(e) => setSelectedStatus(e.target.value)}
													style={{
														padding: '10px 12px',
														borderRadius: '6px',
														border: '1px solid var(--border-color)',
														fontSize: '14px',
													}}
												>
													<option value="OPEN">Status: OPEN</option>
													<option value="PENDING">Status: PENDING</option>
													<option value="IN_PROGRESS">Status: IN PROGRESS</option>
													<option value="RESOLVED">Status: RESOLVED</option>
												</select>
											</div>

											<button
												type="submit"
												disabled={isUpdatingStatus}
												style={{
													padding: '10px 18px',
													border: 'none',
													borderRadius: '6px',
													backgroundColor: isUpdatingStatus ? '#9ca3af' : 'var(--primary-color)',
													color: '#fff',
													fontWeight: 600,
													cursor: isUpdatingStatus ? 'not-allowed' : 'pointer',
												}}
											>
												{isUpdatingStatus ? 'Modifying...' : 'Submit'}
											</button>
										</form>
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default TicketDetails;