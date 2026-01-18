"use client"
import { Routes, Route } from "react-router-dom"
import { useTheme } from "./hooks/useTheme"
import LandingPage from "./pages/LandingPage"
import SignUp from "./pages/auth/SignUp"
import Login from "./pages/auth/Login"
import ForgotPassword from "./pages/auth/ForgotPassword"
import Dashboard from "./pages/dashboard/DashBoard"
import UploadPage from "./pages/dashboard/UploadPage"
import VisualBriefDetail from "./pages/dashboard/VisualBriefDetails"
import Settings from "./pages/dashboard/Settings"
import TermsPage from "./pages/legal/TermsPage"
import PrivacyPage from "./pages/legal/PrivacyPage"
import ContactPage from "./pages/ContactPage"
import ViewDemo from "./components/ViewDemo"
import Blog from "./components/Blog"
import BlogPost from "./components/BlogPost"
import Home from "./Home"
import AuthCallback from "./pages/auth/AuthCallback"
import ProtectedRoute from "./components/ProtectedRoute"

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
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/visual-brief/:id" element={<VisualBriefDetail />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/viewDemo" element={<ViewDemo />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/upload-home" element={<Home />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
      {/* </div> */}
    </div>
  );
}
