import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/styles.css';
import Navbar from '../components/NavBarComponent';
import NavBarVerticalComponent from '../components/NavBarVerticalComponent';

const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000' 
  : `http://${window.location.hostname}:5000`;
const TOKEN_KEY = 'ticketing_token';

function GenerateReport() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleExportReport = async () => {
        try {
            setErrorMessage('');
            setSuccessMessage('');
            setIsLoading(true);

            const token = localStorage.getItem(TOKEN_KEY);
            if (!token) {
                setErrorMessage('Authentication token not found. Please login again.');
                navigate('/');
                return;
            }

            const response = await fetch(`${API_BASE_URL}/api/reports/export`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Access denied. You do not have permission to export reports.');
            }

            // 1. Convert response to a raw file blob
            const blob = await response.blob();
            
            // 2. Create a temporary local URL for the file
            const downloadUrl = window.URL.createObjectURL(blob);
            
            // 3. Create a hidden link, click it, and destroy it
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = 'tickets_report.csv'; 
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            // 4. Clean up the URL from browser memory
            window.URL.revokeObjectURL(downloadUrl);

            setSuccessMessage('Report downloaded successfully!');

        } catch (error) {
            setErrorMessage(error.message || 'Could not download the report.');
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
                    <div className="dashboard-header">
                        <h1>Generate Reports</h1>
                        <p>Export system data and ticket metrics for analysis.</p>
                    </div>

                    <div className="dashboard-section" style={{ maxWidth: '600px' }}>
                        <h2 style={{ marginTop: 0 }}>Full System Export</h2>
                        <p style={{ color: '#6b7280', marginBottom: '24px', lineHeight: 1.6 }}>
                            Download a complete CSV spreadsheet containing all tickets, their current statuses, priority levels, categories, and owner information.
                        </p>

                        {errorMessage && (
                            <div style={{ marginBottom: '20px', color: '#b91c1c', backgroundColor: '#fee2e2', border: '1px solid #fecaca', padding: '12px', borderRadius: '6px' }}>
                                {errorMessage}
                            </div>
                        )}

                        {successMessage && (
                            <div style={{ marginBottom: '20px', color: '#065f46', backgroundColor: '#d1fae5', border: '1px solid #a7f3d0', padding: '12px', borderRadius: '6px' }}>
                                {successMessage}
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={handleExportReport}
                            disabled={isLoading}
                            style={{
                                padding: '12px 24px',
                                border: 'none',
                                borderRadius: '6px',
                                backgroundColor: isLoading ? '#9ca3af' : '#10b981',
                                color: '#fff',
                                fontWeight: 600,
                                fontSize: '16px',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}
                        >
                            {isLoading ? 'Generating File...' : '⬇ Download CSV Report'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GenerateReport;