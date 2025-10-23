"use client"

import { FileText, ImageIcon, FileJson } from "lucide-react"

export default function ExportOptions({ fileName }) {
  const handleExport = (format) => {
    // Simulate export
    console.log(`Exporting as ${format}`)
    alert(`Exporting summary as ${format}...`)
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
      <h3 className="text-lg font-bold text-white mb-4">Export Options</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => handleExport("PDF")}
          className="flex items-center gap-3 p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors border border-slate-600 hover:border-indigo-500"
        >
          <FileText className="w-5 h-5 text-indigo-400" />
          <div className="text-left">
            <p className="font-semibold text-white">Download PDF</p>
            <p className="text-xs text-slate-400">High quality document</p>
          </div>
        </button>

        <button
          onClick={() => handleExport("PNG")}
          className="flex items-center gap-3 p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors border border-slate-600 hover:border-indigo-500"
        >
          <ImageIcon className="w-5 h-5 text-purple-400" />
          <div className="text-left">
            <p className="font-semibold text-white">Export PNG</p>
            <p className="text-xs text-slate-400">Visual mind map</p>
          </div>
        </button>

        <button
          onClick={() => handleExport("PPTX")}
          className="flex items-center gap-3 p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors border border-slate-600 hover:border-indigo-500"
        >
          <FileJson className="w-5 h-5 text-pink-400" />
          <div className="text-left">
            <p className="font-semibold text-white">Export PPTX</p>
            <p className="text-xs text-slate-400">Presentation format</p>
          </div>
        </button>
      </div>
    </div>
  )
}
