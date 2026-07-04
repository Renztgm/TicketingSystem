import React, { useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom"
import LoginPage from "./pages/LoginPage.jsx"
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx"
import DashboardPage from "./pages/DashboardPage.jsx"
import ProfilePage from "./pages/ProfilePage.jsx"

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const TOKEN_KEY = 'ticketing_token';

function ProtectedRoute() {
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

function App() {
  const [backendMessage, setBackendMessage] = useState('Checking connection...');

  // useEffect runs once when the component loads
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/status`)
      .then((response) => response.json())
      .then((data) => {
        setBackendMessage(data.message);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setBackendMessage("Failed to connect to backend.");
      });
  }, []);

  return (
    <Router>
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        </Routes>
    </Router>
  )

}

export default App