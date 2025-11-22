"use client"
import { Routes, Route } from "react-router-dom"
import { useTheme } from "./hooks/useTheme"
import LandingPage from "./pages/LandingPage"
import SignUp from "./pages/auth/SignUp"
import Login from "./pages/auth/Login"
import ForgotPassword from "./pages/auth/ForgotPassword"
import Dashboard from "./pages/dashboard/DashBoard"
import UploadPage from "./pages/dashboard/UploadPage"
import SummaryDetail from "./pages/dashboard/SummaryDetails"
import Settings from "./pages/dashboard/Settings"
import TermsPage from "./pages/legal/TermsPage"
import PrivacyPage from "./pages/legal/PrivacyPage"
import ContactPage from "./pages/ContactPage"
import ViewDemo from "./components/ViewDemo"
import Navbar from "./components/Navbar"

export default function App() {
  const { theme } = useTheme();

  return (
    <div data-theme={theme}>
      {/* <Navbar/> */}
      {/* <div className="page-container page-fade"> */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/summary/:id" element={<SummaryDetail />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/viewDemo" element={<ViewDemo />} />
        </Routes>
      {/* </div> */}
    </div>
  );
}
