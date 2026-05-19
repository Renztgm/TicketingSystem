import React from 'react'
import { HashRouter as Router, Routes, Route } from "react-router-dom"
import LoginPage from "./pages/LoginPage.jsx"
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx"
import DashboardPage from "./pages/DashboardPage.jsx"
import ProfilePage from "./pages/ProfilePage.jsx"

function App() {

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