import { useState } from "react"
import { Zap, Loader } from "lucide-react"
import FileUploadSection from "./components/File-upload"
import SummaryPanel from "./components/SummaryPanel"
import VisualPreview from "./components/VisualPreview"
import ExportOptions from "./components/Export-options"

export default function Home() {
  const [uploadedFile, setUploadedFile] = useState(null)
  const [summary, setSummary] = useState(null)
  const [visualData, setVisualData] = useState(null)
  const [diagramType, setDiagramType] = useState("flowchart")
  const [diagramCode, setDiagramCode] = useState("graph TD;\nA-->B;\nB-->C;")
  
  // Separate loading states
  const [isSummaryLoading, setIsSummaryLoading] = useState(false)
  const [isDiagramLoading, setIsDiagramLoading] = useState(false)

  const handleFileUpload = (file) => setUploadedFile(file)

  const handleGenerateSummary = () => {
    if (!uploadedFile) return
    setIsSummaryLoading(true)

    setTimeout(() => {
      setSummary({
        title: "Document Summary",
        content: `Key Points from "${uploadedFile.name}":\n\n• Main concept: Understanding document structure\n• Secondary points: Importance of visuals\n• Recommendations: Mind maps for complex topics, flowcharts for processes`,
      })
      setVisualData({
        nodes: [
          { id: 1, label: "Main Topic", x: 50, y: 50 },
          { id: 2, label: "Concept A", x: 20, y: 30 },
          { id: 3, label: "Concept B", x: 80, y: 30 },
        ],
        edges: [
          { from: 1, to: 2 },
          { from: 1, to: 3 },
        ],
      })
      setIsSummaryLoading(false)
    }, 2000)
  }

  const handleGenerateDiagram = () => {
    setIsDiagramLoading(true)
    // In future, you can add a parser to convert user text to diagramCode
    setTimeout(() => {
      // currently diagramCode is already set from textarea
      setIsDiagramLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <Zap className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white">VisuaBrief</h1>
        </div>
        <p className="text-lg text-slate-400">Upload documents and create visual summaries or custom diagrams!</p>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column */}
        <div className="flex-1 flex flex-col space-y-6">
          <FileUploadSection onFileUpload={handleFileUpload} uploadedFile={uploadedFile} />

          {/* Generate Summary */}
          {uploadedFile && (
            <button
              onClick={handleGenerateSummary}
              disabled={isSummaryLoading}
              className="w-full py-3 px-6 bg-gradient-to-b from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/50"
            >
              {isSummaryLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Generating Summary...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Generate Summary
                </>
              )}
            </button>
          )}

          {/* Custom Diagram Input */}
          <div className="bg-slate-800 p-4 rounded-2xl shadow-md">
            <div className="flex justify-between items-center mb-2">
              <label className="text-white font-semibold">Custom Diagram</label>
              <select
                value={diagramType}
                onChange={(e) => setDiagramType(e.target.value)}
                className="bg-slate-700 text-white px-2 py-1 rounded"
              >
                <option value="flowchart">Flowchart</option>
                <option value="er">ER Diagram</option>
                <option value="sequence">Sequence Diagram</option>
              </select>
            </div>
            <textarea
              value={diagramCode}
              onChange={(e) => setDiagramCode(e.target.value)}
              className="w-full h-40 p-2 bg-slate-900 text-white rounded-lg font-mono resize-none"
            />
            <button
              onClick={handleGenerateDiagram}
              disabled={isDiagramLoading}
              className="w-full mt-4 py-3 px-6 bg-gradient-to-b from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-green-500/50"
            >
              {isDiagramLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Generating Diagram...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Generate Diagram
                </>
              )}
            </button>
          </div>

          {summary && <SummaryPanel summary={summary} />}
        </div>

        {/* Right Column */}
        <div className="flex-1 flex flex-col space-y-6">
          {visualData && <VisualPreview data={visualData} />}
        </div>
      </div>

      {/* Export Options */}
      {summary && (
        <div className="mt-8">
          <ExportOptions fileName={uploadedFile?.name || "summary"} />
        </div>
      )}
    </div>
  )
}
