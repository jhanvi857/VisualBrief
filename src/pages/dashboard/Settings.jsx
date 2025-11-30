import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardSidebar from "../../components/DashBoardSidebar";
import DashboardTopbar from "../../components/DashBoardTopbar";
import { Save, Trash2, Users, Lock, CreditCard, Loader } from "lucide-react";
import { motion } from "framer-motion";

// const API_BASE_URL = "http://localhost:8000/api";
const API_BASE_URL = "https://visualbrief.onrender.com/api";

const settingsTabs = [
  { id: "profile", label: "Profile", icon: Lock },
  { id: "team", label: "Team", icon: Users },
  { id: "billing", label: "Billing", icon: CreditCard },
];

export default function Settings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("access_token");
      
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/user/profile`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 401) {
          localStorage.removeItem("access_token");
          navigate("/login");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const userData = await response.json();
        console.log("📥 Fetched user data:", userData);
        
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          company: userData.company || "",
        });

      } catch (error) {
        console.error("Error fetching user profile:", error);
        setMessage({ type: "error", text: "Failed to load profile data" });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedUser = await response.json();
      localStorage.setItem("vb_user", JSON.stringify(updatedUser));
      
      setMessage({ type: "success", text: "Profile updated successfully!" });
      
      setTimeout(() => setMessage(null), 3000);

    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: "error", text: "Failed to update profile" });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(`${API_BASE_URL}/user/account`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete account");
      }
      localStorage.clear();
      navigate("/");

    } catch (error) {
      console.error("Error deleting account:", error);
      setMessage({ type: "error", text: "Failed to delete account" });
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-950">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardTopbar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Loader className="w-8 h-8 animate-spin text-indigo-500 mx-auto mb-4" />
              <p className="text-gray-400">Loading settings...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

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
              <h1 className="text-3xl font-bold mb-2 text-white">Settings</h1>
              <p className="text-gray-400">Manage your account and preferences</p>
            </motion.div>

            {/* Success/Error Message */}
            {message && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  message.type === "success"
                    ? "bg-green-500/10 border border-green-500/30 text-green-400"
                    : "bg-red-500/10 border border-red-500/30 text-red-400"
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 mb-8 border-b border-gray-800">
              {settingsTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? "border-indigo-500 text-indigo-400"
                        : "border-transparent text-gray-400 hover:text-gray-300"
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
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
                  <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                    <h3 className="text-lg font-bold mb-6 text-white">Profile Information</h3>
                    <form onSubmit={handleSaveProfile} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">
                          Company (Optional)
                        </label>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) =>
                            setFormData({ ...formData, company: e.target.value })
                          }
                          className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={saving}
                        className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {saving ? (
                          <>
                            <Loader size={18} className="animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={18} />
                            Save Changes
                          </>
                        )}
                      </button>
                    </form>
                  </div>

                  <div className="bg-gray-900 p-6 rounded-xl border border-red-500/20">
                    <h3 className="text-lg font-bold mb-2 text-red-400">Danger Zone</h3>
                    <p className="text-gray-400 mb-4">
                      Delete your account and all associated data permanently
                    </p>
                    <button
                      onClick={handleDeleteAccount}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-600/30 transition-colors"
                    >
                      <Trash2 size={18} />
                      Delete Account
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "team" && (
                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                  <h3 className="text-lg font-bold mb-6 text-white">Team Members</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div>
                        <p className="font-medium text-white">{formData.email}</p>
                        <p className="text-sm text-gray-400">Owner</p>
                      </div>
                      <span className="text-xs bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded">
                        Active
                      </span>
                    </div>
                  </div>
                  <button className="btn-primary mt-6">Invite Team Member</button>
                </div>
              )}

              {activeTab === "billing" && (
                <div className="space-y-6">
                  <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                    <h3 className="text-lg font-bold mb-4 text-white">Current Plan</h3>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-2xl font-bold text-white">Free Plan</p>
                        <p className="text-gray-400">
                          5 summaries per month • Upgrade for unlimited
                        </p>
                      </div>
                      <button className="btn-primary">Upgrade Plan</button>
                    </div>
                  </div>

                  <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                    <h3 className="text-lg font-bold mb-4 text-white">Payment Method</h3>
                    <p className="text-gray-400 mb-4">
                      No payment method on file. Add one to upgrade your plan.
                    </p>
                    <button className="btn-secondary">Add Payment Method</button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}