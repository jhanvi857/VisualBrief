import { useState } from "react";
import DashboardSidebar from "../../components/DashBoardSidebar";
import DashboardTopbar from "../../components/DashBoardTopbar";
import { Save, Trash2, Users, Lock, CreditCard } from "lucide-react";
import { motion } from "framer-motion"

const settingsTabs = [
  { id: "profile", label: "Profile", icon: Lock },
  { id: "team", label: "Team", icon: Users },
  { id: "billing", label: "Billing", icon: CreditCard },
]

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile")
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john@example.com",
    company: "Acme Corp",
  })

  return (
    <div className="flex h-screen bg-gray-950">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardTopbar />
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-bold mb-2">Settings</h1>
              <p className="text-gray-400">Manage your account and preferences</p>
            </motion.div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 border-b border-gray-800">
              {settingsTabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-smooth ${
                      activeTab === tab.id
                        ? "border-indigo-500 text-indigo-400"
                        : "border-transparent text-gray-400 hover:text-gray-300"
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                )
              })}
            </div>

            {/* Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <div className="card">
                    <h3 className="text-lg font-bold mb-6">Profile Information</h3>
                    <form className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Full Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="p-2 border border-white rounded-lg input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email Address</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="p-2 border border-white rounded-lg input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Company</label>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="p-2 border border-white rounded-lg input-field"
                        />
                      </div>
                      <button className="btn-primary flex items-center gap-2">
                        <Save size={18} />
                        Save Changes
                      </button>
                    </form>
                  </div>

                  <div className="card border-red-500/20">
                    <h3 className="text-lg font-bold mb-2 text-red-400">Danger Zone</h3>
                    <p className="text-gray-400 mb-4">Delete your account and all associated data</p>
                    <button className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-600/30 transition-smooth">
                      <Trash2 size={18} />
                      Delete Account
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "team" && (
                <div className="card">
                  <h3 className="text-lg font-bold mb-6">Team Members</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div>
                        <p className="font-medium">you@example.com</p>
                        <p className="text-sm text-gray-400">Owner</p>
                      </div>
                      <span className="text-xs bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded">Active</span>
                    </div>
                  </div>
                  <button className="btn-primary mt-6">Invite Team Member</button>
                </div>
              )}

              {activeTab === "billing" && (
                <div className="space-y-6">
                  <div className="card">
                    <h3 className="text-lg font-bold mb-4">Current Plan</h3>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-2xl font-bold">Pro Plan</p>
                        <p className="text-gray-400">$99/month • Auto-renews on Dec 15, 2025</p>
                      </div>
                      <button className="btn-outline">Change Plan</button>
                    </div>
                  </div>

                  <div className="card">
                    <h3 className="text-lg font-bold mb-4">Payment Method</h3>
                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg mb-4">
                      <div>
                        <p className="font-medium">Visa ending in 4242</p>
                        <p className="text-sm text-gray-400">Expires 12/2026</p>
                      </div>
                    </div>
                    <button className="btn-secondary">Update Payment Method</button>
                  </div>

                  <div className="card">
                    <h3 className="text-lg font-bold mb-4">Billing History</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between p-2 hover:bg-gray-800/50">
                        <span>Invoice #INV-001</span>
                        <span className="text-gray-400">Nov 15, 2024 • $99.00</span>
                      </div>
                      <div className="flex justify-between p-2 hover:bg-gray-800/50">
                        <span>Invoice #INV-002</span>
                        <span className="text-gray-400">Oct 15, 2024 • $99.00</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}
