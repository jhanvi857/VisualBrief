"use client"

import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import DashboardSidebar from "../../components/DashboardSidebar"
import DashboardTopbar from "../../components/DashboardTopbar"
import { Download, RefreshCw, Edit2, Share2, ArrowLeft, FileText } from "lucide-react"
import { motion } from "framer-motion"
import { mockApiLayer } from "../../lib/mockApi"

export default function SummaryDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    mockApiLayer.getSummary(id).then((data) => {
      setSummary(data)
      setLoading(false)
    })
  }, [id])

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-950">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardTopbar />
          <main className="flex-1 p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Loading summary...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="flex h-screen bg-gray-950">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardTopbar />
          <main className="flex-1 p-8 flex items-center justify-center">
            <div className="text-center">
              <FileText size={48} className="mx-auto text-gray-700 mb-4 opacity-50" />
              <p className="text-gray-400">Summary not found</p>
            </div>
          </main>
        </div>
      </div>
    )
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
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-between mb-8"
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-smooth"
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h1 className="text-3xl font-bold">{summary.title || summary.fileName}</h1>
                  <p className="text-gray-400">{summary.date.toLocaleDateString()}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button className="btn-secondary p-2" title="Share">
                  <Share2 size={20} />
                </button>
                <button className="btn-secondary p-2" title="Edit">
                  <Edit2 size={20} />
                </button>
                <button className="btn-secondary p-2" title="Regenerate">
                  <RefreshCw size={20} />
                </button>
                <button className="btn-primary p-2" title="Download">
                  <Download size={20} />
                </button>
              </div>
            </motion.div>

            {/* Summary content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              {/* Summary stats */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="card">
                  <p className="text-gray-400 text-sm mb-1">File</p>
                  <p className="font-bold truncate">{summary.fileName}</p>
                </div>
                <div className="card">
                  <p className="text-gray-400 text-sm mb-1">Summary Type</p>
                  <p className="font-bold capitalize">{summary.style.replace("-", " ")}</p>
                </div>
                <div className="card">
                  <p className="text-gray-400 text-sm mb-1">Read Time</p>
                  <p className="font-bold">{summary.summaryLength}</p>
                </div>
              </div>

              {/* Key bullets */}
              <div className="card">
                <h2 className="text-xl font-bold mb-4">Key Points</h2>
                <ul className="space-y-3">
                  {summary.summary.bullets.map((bullet, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                      className="flex gap-3"
                    >
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 shrink-0" />
                      <span className="text-gray-300">{bullet}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Key quotes */}
              {summary.summary.keyQuotes.length > 0 && (
                <div className="card">
                  <h2 className="text-xl font-bold mb-4">Key Quotes</h2>
                  <div className="space-y-4">
                    {summary.summary.keyQuotes.map((quote, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: idx * 0.1 }}
                        className="pl-4 border-l-4 border-indigo-500"
                      >
                        <p className="italic text-gray-300">{quote}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Export options */}
              <div className="card">
                <h3 className="font-bold mb-4">Export Options</h3>
                <div className="flex flex-wrap gap-3">
                  <button className="btn-outline">Export as PDF</button>
                  <button className="btn-outline">Export as Markdown</button>
                  <button className="btn-outline">Export as PNG</button>
                  <button className="btn-outline">Copy to Clipboard</button>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}
