import { useState } from "react"
import { Link } from "react-router-dom"
import AuthLayout from "../../components/AuthLayout"
import { Mail, ArrowLeft } from "lucide-react"
import { supabase } from "../../lib/supabaseClient"
import toast from "react-hot-toast"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) {
      toast.error("Please enter your email")
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) throw error

      setSubmitted(true)
      toast.success(`Reset email sent to ${email}`)
    } catch (err) {
      // Handle rate limiting specifically
      const isRateLimit = err.code === 429 || err.status === 429 || err.message?.toLowerCase().includes('rate limit');

      if (isRateLimit) {
        // Suppress console error for expected rate limits, just show toast
        console.warn("Rate limit hit, waiting for cooldown.")
        toast.error("Too many requests. Please wait 60 seconds before trying again.")
      } else {
        // Log genuine errors
        console.error("Reset password error:", err)
        toast.error(err.message || "Failed to send reset email")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title={submitted ? "Check Your Email" : "Reset Password"}
      subtitle={
        submitted
          ? `We've sent instructions to ${email}`
          : "Enter your email to receive reset instructions"
      }
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
                className="border border-white p-2 rounded-lg input-field pl-10"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
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