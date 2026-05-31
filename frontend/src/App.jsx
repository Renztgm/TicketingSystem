import React, { useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route } from "react-router-dom"
import LoginPage from "./pages/LoginPage.jsx"
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx"
import DashboardPage from "./pages/DashboardPage.jsx"
import ProfilePage from "./pages/ProfilePage.jsx"

function App() {
  const [backendMessage, setBackendMessage] = useState('Checking connection...');

  // useEffect runs once when the component loads
  useEffect(() => {
    fetch('http://localhost:5000/api/status')
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
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
        </Routes>
    </Router>
  )

}

export default App