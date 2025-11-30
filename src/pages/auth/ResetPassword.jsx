"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useNavigate, Link } from "react-router-dom"
import AuthLayout from "../../components/AuthLayout"
import { Lock, ArrowLeft } from "lucide-react"
import { supabase } from "../../lib/supabaseClient"
import toast from "react-hot-toast"

export default function ResetPassword() {
  const searchParams = useSearchParams()
  const navigate = useNavigate()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  
  const token = searchParams.get("access_token") 

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!password || !confirmPassword) {
      toast.error("Please enter all fields")
      return
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (!token) {
      toast.error("Invalid or missing reset token")
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase.auth.updateUser({
        access_token: token,
        password: password
      })

      if (error) throw error

      toast.success("Password reset successfully! Please login.")
      setSubmitted(true)
      setTimeout(() => navigate("/login"), 2000) 
    } catch (err) {
      console.error(err)
      toast.error(err.message || "Failed to reset password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title={submitted ? "Password Reset!" : "Set a New Password"}
      subtitle={
        submitted
          ? "Redirecting to login..."
          : "Enter a new password for your account"
      }
    >
      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">New Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-3 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-10"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Confirm Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-3 text-gray-500" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field pl-10"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-indigo-400 hover:text-indigo-300 transition-smooth"
          >
            <ArrowLeft size={18} />
            Back to login
          </Link>
        </form>
      ) : (
        <p className="text-center text-gray-400">Please wait, redirecting...</p>
      )}
    </AuthLayout>
  )
}