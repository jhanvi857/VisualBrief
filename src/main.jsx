import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter as Router } from "react-router-dom"
import App from "./App"
import "./App.css"
import { Toaster } from "react-hot-toast"
import { AuthProvider } from "./pages/auth/AuthContext"
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
    <Router>
      <App />
      <Toaster position="top-center" />
    </Router>
    </AuthProvider>
  </React.StrictMode>,
)
