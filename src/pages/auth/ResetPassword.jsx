import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import AuthLayout from "../../components/AuthLayout"
import { Lock, ArrowLeft } from "lucide-react"
import { supabase } from "../../lib/supabaseClient"
import toast from "react-hot-toast"

export default function ResetPassword() {
  const navigate = useNavigate()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        toast.success("You can now reset your password")
      }
    })
  }, [])

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

    try {
      setLoading(true)
      const { error } = await supabase.auth.updateUser({
        password
      })

      if (error) throw error

      toast.success("Password reset successfully!")
      setTimeout(() => navigate("/login"), 2000)

    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Set New Password"
      subtitle="Create a new password for your account"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">New Password</label>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-3 text-gray-500" />
            <input
              type="password"
              className="input-field pl-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-3 text-gray-500" />
            <input
              type="password"
              className="input-field pl-10"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        <Link
          to="/login"
          className="flex items-center justify-center gap-2 text-indigo-400"
        >
          <ArrowLeft size={18} />
          Back to login
        </Link>
      </form>
    </AuthLayout>
  )
}