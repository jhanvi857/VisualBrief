import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import DashboardSidebar from "../../components/DashBoardSidebar"
import DashboardTopbar from "../../components/DashBoardTopbar"
import { Link } from "react-router-dom"
import { FileText, Download, Trash2, Eye } from "lucide-react"
import { apiLayer, getToken } from "../../lib/mockAPI"
import toast from "react-hot-toast"

export default function Dashboard() {
  const navigate = useNavigate()
  const [briefs, setBriefs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiLayer.getBriefs()
      .then((data) => {
        setBriefs(data)
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        console.error("Error fetching briefs:", error)
        if (error.message.includes("Authentication") || error.message.includes("Session expired")) {
          localStorage.removeItem("access_token");
          navigate("/login");
        }
      })
  }, [navigate])

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this visual brief?")) return;

    try {
      const userToken = await getToken();
      // const response = await fetch(`http://localhost:8000/api/briefs/${id}`, {
      const response = await fetch(`https://visualbrief.onrender.com/api/briefs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (!response.ok) throw new Error("Delete failed");

      setBriefs(briefs.filter((b) => b.id !== id));
      toast.success("Visual brief deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete visual brief");
    }
  };

  return (
    <div className="flex h-screen bg-gray-950">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardTopbar />
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold">Your Visual Briefs</h1>
                <p className="text-gray-400">Manage and access all your generated diagrams</p>
              </div>
              <Link to="/upload" className="btn-primary">
                Generate New Brief
              </Link>
            </div>

            {/* Briefs grid */}
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="w-12 h-12 bg-gray-700 rounded mb-4" />
                    <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-700 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : briefs.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {briefs.map((brief) => (
                  <div key={brief.id} className="card group">
                    <div className="flex items-start justify-between mb-4">
                      <FileText size={32} className="text-indigo-500" />
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-smooth">
                        <Link
                          to={`/visual-brief/${brief.id}`}
                          className="p-2 hover:bg-gray-800 rounded-lg transition-smooth"
                          title="View"
                        >
                          <Eye size={16} />
                        </Link>
                        <button className="p-2 hover:bg-gray-800 rounded-lg transition-smooth" title="Download">
                          <Download size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(brief.id)}
                          className="p-2 hover:bg-red-900/30 rounded-lg transition-smooth text-red-400"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <h3 className="font-bold mb-1 truncate">{brief.fileName}</h3>
                    <p className="text-sm text-gray-500 mb-3">
                      {brief.date.toLocaleDateString()} • {brief.style}
                    </p>
                    <div className="pt-3 border-t border-gray-800">
                      <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded">
                        {brief.style}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <FileText size={48} className="mx-auto text-gray-700 mb-4 opacity-50" />
                <h3 className="text-xl font-bold mb-2">No visual briefs yet</h3>
                <p className="text-gray-400 mb-6">Upload a file or provide text to generate your first diagram</p>
                <Link to="/upload" className="btn-primary">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
