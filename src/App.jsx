import { HashRouter as Router, Routes, Route } from "react-router-dom"
import LoginPage from "./pages/LoginPage.jsx"
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx"

function App() {

  return (
    <Router>
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Routes>
    </Router>
  )

}

export default App