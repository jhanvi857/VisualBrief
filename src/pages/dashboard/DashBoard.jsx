import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import DashboardSidebar from "../../components/DashBoardSidebar"
import DashboardTopbar from "../../components/DashBoardTopbar"
import { Link } from "react-router-dom"
import { FileText, Download, Trash2, Eye } from "lucide-react"
import { apiLayer } from "../../lib/mockAPI" 

export default function Dashboard() {
  const navigate = useNavigate()
  const [summaries, setSummaries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiLayer.getSummaries()
      .then((data) => {
        setSummaries(data)
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        console.error("Error fetching summaries:", error)
        if (error.message.includes("Authentication") || error.message.includes("Session expired")) {
            // Optional: Clean up any remaining invalid session data
            localStorage.removeItem("access_token"); 
            navigate("/login");
        }
        
      })
  }, [navigate])

  const handleDelete = (id) => {
    setSummaries(summaries.filter((s) => s.id !== id))
  }

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
                <h1 className="text-3xl font-bold">Your Summaries</h1>
                <p className="text-gray-400">Manage and access all your PDF summaries</p>
              </div>
              <Link to="/upload" className="btn-primary">
                Upload New PDF
              </Link>
            </div>

            {/* Summaries grid */}
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
            ) : summaries.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {summaries.map((summary) => (
                  <div key={summary.id} className="card group">
                    <div className="flex items-start justify-between mb-4">
                      <FileText size={32} className="text-indigo-500" />
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-smooth">
                        <Link
                          to={`/summary/${summary.id}`}
                          className="p-2 hover:bg-gray-800 rounded-lg transition-smooth"
                          title="View"
                        >
                          <Eye size={16} />
                        </Link>
                        <button className="p-2 hover:bg-gray-800 rounded-lg transition-smooth" title="Download">
                          <Download size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(summary.id)}
                          className="p-2 hover:bg-red-900/30 rounded-lg transition-smooth text-red-400"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <h3 className="font-bold mb-1 truncate">{summary.fileName}</h3>
                    <p className="text-sm text-gray-500 mb-3">
                      {/* Date mapping handles the conversion to a Date object, 
                          so toLocaleDateString() works correctly here. */}
                      {summary.date.toLocaleDateString()} • {summary.summaryLength}
                    </p>
                    <div className="pt-3 border-t border-gray-800">
                      <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded">
                        {summary.style}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <FileText size={48} className="mx-auto text-gray-700 mb-4 opacity-50" />
                <h3 className="text-xl font-bold mb-2">No summaries yet</h3>
                <p className="text-gray-400 mb-6">Upload your first PDF to get started</p>
                <Link to="/upload" className="btn-primary">
                  Upload PDF
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}