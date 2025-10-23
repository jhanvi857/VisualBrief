"use client"

import { useState } from "react"
import { Upload, File, X } from "lucide-react"

export default function FileUploadSection({ onFileUpload, uploadedFile }) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      onFileUpload(file)
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileUpload(file)
    }
  }

  const handleRemove = () => {
    onFileUpload(null)
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 ${
        isDragging ? "border-indigo-400 bg-indigo-500/10" : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
      }`}
    >
      <input
        type="file"
        onChange={handleFileSelect}
        accept=".pdf,.ppt,.pptx,.docx,.txt"
        className="hidden"
        id="file-input"
      />

      {!uploadedFile ? (
        <label htmlFor="file-input" className="cursor-pointer">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="p-4 bg-indigo-500/20 rounded-lg">
              <Upload className="w-8 h-8 text-indigo-400" />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-white mb-1">Drag and drop your file here</p>
              <p className="text-sm text-slate-400">or click to browse (PDF, PPT, DOCX, TXT)</p>
            </div>
          </div>
        </label>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <File className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <p className="font-semibold text-white">{uploadedFile.name}</p>
              <p className="text-sm text-slate-400">{(uploadedFile.size / 1024).toFixed(2)} KB</p>
            </div>
          </div>
          <button onClick={handleRemove} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400 hover:text-white" />
          </button>
        </div>
      )}
    </div>
  )
}
