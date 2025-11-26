"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import DashboardSidebar from "../../components/DashBoardSidebar"
import DashboardTopbar from "../../components/DashBoardTopbar"
import { Upload, CheckCircle, FileText } from "lucide-react"
import { motion } from "framer-motion"
import { mockApiLayer } from "../../lib/mockAPI"
import ViewDemo from "../../components/ViewDemo"

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
  const [step, setStep] = useState(1) 

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

    // await mockApiLayer.uploadPdf(file)
    // await mockApiLayer.generateSummary(file.name, selectedStyle)
    const formData = new FormData();
formData.append("file", file);
formData.append("diagramType", selectedStyle);

const res = await fetch(`${BACKEND_URL}/upload`, { method: "POST", body: formData });
// const res = await fetch(`http://localhost:8000/upload`, { method: "POST", body: formData });
const data = await res.json();

    setStep(4)
  }
  const userLoggedIn = true; 
  return (
    <div className="flex h-screen bg-gray-950">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardTopbar />
        <main className="flex-1 overflow-auto p-8">
          <ViewDemo maxCredits={userLoggedIn ? 5 : 2} showNav={false}/>
        </main>
      </div>
    </div>
  )
}
