"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import AuthLayout from "../../components/AuthLayout"
import { Mail, ArrowLeft } from "lucide-react"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
    }
  }

  return (
    <AuthLayout
      title={submitted ? "Check Your Email" : "Reset Password"}
      subtitle={submitted ? `We've sent instructions to ${email}` : "Enter your email to receive reset instructions"}
    >
      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-3 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full">
            Send Reset Link
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
        <div className="space-y-6 text-center">
          <p className="text-gray-400">
            Click the link in your email to reset your password. If you don't see the email, check your spam folder.
          </p>

          <button
            onClick={() => setSubmitted(false)}
            className="text-indigo-400 hover:text-indigo-300 transition-smooth"
          >
            Try another email
          </button>

          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-gray-400 hover:text-indigo-400 transition-smooth"
          >
            <ArrowLeft size={18} />
            Back to login
          </Link>
        </div>
      )}
    </AuthLayout>
  )
}
