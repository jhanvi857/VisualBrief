"use client"

import { Copy, Check } from "lucide-react"
import { useState } from "react"

export default function SummaryPanel({ summary }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(summary.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">{summary.title}</h2>
        <button
          onClick={handleCopy}
          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          title="Copy to clipboard"
        >
          {copied ? (
            <Check className="w-5 h-5 text-green-400" />
          ) : (
            <Copy className="w-5 h-5 text-slate-400 hover:text-white" />
          )}
        </button>
      </div>
      <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
        <p className="text-slate-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">{summary.content}</p>
      </div>
    </div>
  )
}
