"use client"

import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, Upload, FolderOpen, Zap, Users, Settings, CreditCard, LogOut } from "lucide-react"
import { useState } from "react"

const menuItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Upload", href: "/upload", icon: Upload },
  { label: "Projects", href: "/dashboard", icon: FolderOpen },
  { label: "Templates", href: "/dashboard", icon: Zap },
  { label: "Team", href: "/settings", icon: Users },
]

const bottomMenuItems = [
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Billing", href: "/settings", icon: CreditCard },
]

export default function DashboardSidebar() {
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div
      className={`bg-gray-900 border-r border-gray-800 transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"}`}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
              VB
            </div>
            {!isCollapsed && <span className="font-bold text-indigo-400">VisualBrief</span>}
          </Link>
        </div>

        {/* Main menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.label
            return (
              <Link
                key={item.label}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-smooth ${
                  isActive ? "bg-indigo-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                }`}
                title={isCollapsed ? item.label : ""}
              >
                <Icon size={20} />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Bottom menu */}
        <div className="p-4 space-y-2 border-t border-gray-800">
          {bottomMenuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.label}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-smooth ${
                  isActive ? "bg-indigo-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                }`}
                title={isCollapsed ? item.label : ""}
              >
                <Icon size={20} />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            )
          })}

          {/* Logout */}
          <button
            onClick={() => {
              localStorage.removeItem("user")
              window.location.href = "/"
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-gray-200 transition-smooth"
          >
            <LogOut size={20} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>

        {/* Collapse button */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full p-2 hover:bg-gray-800 rounded-lg transition-smooth text-gray-400"
          >
            {isCollapsed ? "→" : "←"}
          </button>
        </div>
      </div>
    </div>
  )
}
