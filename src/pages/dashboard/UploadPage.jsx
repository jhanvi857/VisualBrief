"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import DashboardSidebar from "../../components/DashBoardSidebar"
import DashboardTopbar from "../../components/DashBoardTopbar"
import { Upload, CheckCircle, FileText } from "lucide-react"
import { motion } from "framer-motion"
import { mockApiLayer } from "../../lib/mockAPI"

const summaryStyles = [
  { id: "bullet-points", name: "Bullet Points", description: "Key points in concise bullets" },
  { id: "infographic", name: "Infographic", description: "Visual summary with icons" },
  { id: "mind-map", name: "Mind Map", description: "Hierarchical connections" },
  { id: "timeline", name: "Timeline", description: "Chronological key events" },
]

export default function UploadPage() {
  const navigate = useNavigate()
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState(null)
  const [selectedStyle, setSelectedStyle] = useState("bullet-points")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [step, setStep] = useState(1) // 1: upload, 2: style, 3: processing, 4: done

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile?.type === "application/pdf") {
      setFile(droppedFile)
      setStep(2)
    }
  }

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile?.type === "application/pdf") {
      setFile(selectedFile)
      setStep(2)
    }
  }

  const handleGenerateSummary = async () => {
    setStep(3)

    // Simulate upload and processing
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((r) => setTimeout(r, 300))
      setUploadProgress(i)
    }

    // Call mock API
    await mockApiLayer.uploadPdf(file)
    await mockApiLayer.generateSummary(file.name, selectedStyle)

    setStep(4)
  }

  return (
    <div className="flex h-screen bg-gray-950">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardTopbar />
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-2xl mx-auto">
            {/* Step 1: Upload */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h1 className="text-3xl font-bold mb-2">Upload Your PDF</h1>
                <p className="text-gray-400 mb-8">Choose a PDF file to convert into a visual summary</p>

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`card border-2 border-dashed transition-colors ${
                    isDragging ? "border-indigo-500 bg-indigo-500/5" : "border-gray-700"
                  }`}
                >
                  <div className="text-center py-12">
                    <Upload size={48} className="mx-auto text-indigo-500 mb-4 opacity-50" />
                    <h3 className="text-xl font-bold mb-2">Drag and drop your PDF here</h3>
                    <p className="text-gray-400 mb-6">or</p>
                    <label>
                      <input type="file" accept=".pdf" onChange={handleFileSelect} className="hidden" />
                      <span className="btn-outline cursor-pointer">Browse Files</span>
                    </label>
                    <p className="text-sm text-gray-500 mt-4">Maximum file size: 50MB</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Style Selection */}
            {step === 2 && file && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h1 className="text-3xl font-bold mb-2">Choose Summary Style</h1>
                <p className="text-gray-400 mb-6">
                  File: <span className="text-indigo-400">{file.name}</span>
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  {summaryStyles.map((style) => (
                    <motion.button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      whileHover={{ scale: 1.05 }}
                      className={`card p-6 text-left transition-all ${
                        selectedStyle === style.id ? "border-indigo-500 bg-indigo-500/10 border-2" : "border"
                      }`}
                    >
                      <FileText size={24} className="mb-3" />
                      <h4 className="font-bold mb-1">{style.name}</h4>
                      <p className="text-sm text-gray-400">{style.description}</p>
                    </motion.button>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setFile(null)
                      setStep(1)
                    }}
                    className="btn-secondary"
                  >
                    Back
                  </button>
                  <button onClick={handleGenerateSummary} className="btn-primary flex-1">
                    Generate Summary
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Processing */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-12"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-500/10 rounded-full mb-6">
                  <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Processing Your PDF</h3>
                <p className="text-gray-400 mb-8">This usually takes 30-60 seconds</p>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-4">{uploadProgress}%</p>
              </motion.div>
            )}

            {/* Step 4: Complete */}
            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-12"
              >
                <CheckCircle size={64} className="mx-auto text-green-500 mb-6" />
                <h3 className="text-2xl font-bold mb-2">Summary Generated!</h3>
                <p className="text-gray-400 mb-8">Your summary is ready to view</p>
                <div className="flex gap-4 justify-center">
                  <button onClick={() => navigate("/dashboard")} className="btn-secondary">
                    Back to Dashboard
                  </button>
                  <button onClick={() => navigate("/dashboard")} className="btn-primary">
                    View Summary
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
