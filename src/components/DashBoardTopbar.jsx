import { Search, Bell, Settings, LogOut } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
// const API_BASE_URL = "http://localhost:8000"
const API_BASE_URL = "https://visualbrief.onrender.com"

export default function DashboardTopbar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem("vb_user") || "{}")

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("access_token")
      if (token) {
        await fetch(`${API_BASE_URL}/api/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        }).catch(err => console.warn("Backend logout failed:", err))
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem("access_token")
      localStorage.removeItem("vb_session")
      localStorage.removeItem("vb_user")
      localStorage.removeItem("user")
      setShowProfileMenu(false)
      navigate("/login")
    }
  }

  return (
    <div className="bg-gray-900 border-b border-gray-800 px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Search bar */}
        <div className="relative w-96">
          <Search size={18} className="absolute left-3 top-3 text-gray-500" />
          <input
            type="text"
            placeholder="Search briefs..."
            className="p-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 pl-10 w-full focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-6">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
              </div>
              <span className="text-sm font-medium text-gray-300">
                {user.name || user.email || "User"}
              </span>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg w-48 py-2 z-50">
                <button
                  onClick={() => {
                    setShowProfileMenu(false)
                    navigate("/settings")
                  }}
                  className="w-full px-4 py-2 flex items-center gap-2 text-gray-300 hover:bg-gray-700 transition-colors text-left"
                >
                  <Settings size={16} />
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 flex items-center gap-2 text-red-400 hover:bg-gray-700 transition-colors text-left"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}