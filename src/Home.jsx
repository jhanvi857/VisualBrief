import { useState } from "react";
import { Zap, Loader } from "lucide-react";
import FileUploadSection from "./components/File-upload";
import SummaryPanel from "./components/SummaryPanel";
import VisualPreview from "./components/VisualPreview";
import ExportOptions from "./components/Export-options";
import MermaidRenderer from "./components/MermaidRenderer";
export default function Home() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [visualData, setVisualData] = useState(null);
  const [diagramType, setDiagramType] = useState("flowchart");
  const [diagramCode, setDiagramCode] = useState("Enter description in your words..");
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [isDiagramLoading, setIsDiagramLoading] = useState(false);

  const BACKEND_URL = "http://localhost:3000"; 

  const handleFileUpload = (file) => setUploadedFile(file);

  const handleGenerateSummary = async () => {
    if (!uploadedFile) return;
    setIsSummaryLoading(true);

    const formData = new FormData();
    formData.append("file", uploadedFile);

    try {
      const response = await fetch(`${BACKEND_URL}/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      setSummary(data.summary);
      setVisualData(data.diagram);
    } catch (err) {
      console.error("Summary generation failed:", err);
      setSummary({
        title: "Error",
        content: "Failed to generate summary. Check backend logs.",
      });
    } finally {
      setIsSummaryLoading(false);
    }
  };

  // Generate diagram only (custom text)
  const handleGenerateDiagram = async (type) => {
    setIsDiagramLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/diagram`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ text: diagramCode, diagramType, isFile: false }),
});
      const data = await response.json();
      setVisualData(data.diagram);
    } catch (err) {
      console.error("Diagram generation failed:", err);
    } finally {
      setIsDiagramLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <Zap className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white">VisualBrief</h1>
        </div>
        <p className="text-lg text-slate-400">
          Upload documents or input text to generate intelligent summaries and diagrams.
        </p>
      </div>

      {/* Inputs: File Upload + Custom Diagram */}
      <div className="flex flex-col lg:flex-row gap-8 mb-8">
        {/* File Input */}
        <div className="flex-1 flex flex-col space-y-4">
          <h2 className="text-white text-xl font-semibold mb-2">File Input</h2>
          <FileUploadSection onFileUpload={handleFileUpload} uploadedFile={uploadedFile} />
          {uploadedFile && (
            <div className="flex flex-col gap-2">
              <button
                onClick={handleGenerateSummary}
                disabled={isSummaryLoading}
                className="w-full py-3 px-6 bg-linear-to-br from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/50"
              >
                {isSummaryLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" /> Generating Summary...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" /> Generate Summary
                  </>
                )}
              </button>

              <button
                onClick={() => handleGenerateDiagram("file")}
                disabled={isDiagramLoading}
                className="w-full py-3 px-6 bg-linear-to-br from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-green-500/50"
              >
                {isDiagramLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" /> Generating Diagram...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" /> Generate Diagram from File
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Custom Diagram Input */}
        <div className="flex-1 flex flex-col space-y-4">
          <h2 className="text-white text-xl font-semibold mb-2">Custom Diagram / Steps</h2>
          <div className="bg-slate-800 p-4 rounded-2xl shadow-md flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <label className="text-white font-semibold">Diagram Type</label>
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
              placeholder="Type your steps or description here..."
            />
            <button
              onClick={() => handleGenerateDiagram("custom")}
              disabled={isDiagramLoading}
              className="w-full py-3 px-6 bg-linear-to-br from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-green-500/50"
            >
              {isDiagramLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" /> Generating Diagram...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" /> Generate Custom Diagram
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-800 p-4 rounded-2xl shadow-md flex flex-col gap-4">
          <h2 className="text-white text-xl font-semibold">Diagram Preview</h2>
          <div className="bg-slate-900 p-2 rounded-lg min-h-[250px] overflow-auto">
  {visualData?.mermaid ? (
    <MermaidRenderer chart={visualData.mermaid} />
  ) : (
    <p className="text-slate-400">Diagram will appear here</p>
  )}
</div>
        </div>

        {summary && (
          <div className="bg-slate-800 p-4 rounded-2xl shadow-md">
            <h2 className="text-white text-xl font-semibold mb-2">Summary</h2>
            <div className="overflow-auto max-h-[400px]">
              <SummaryPanel summary={summary} />
            </div>
          </div>
        )}
      </div>

      {(summary || visualData) && (
        <div className="mt-8">
          <ExportOptions fileName={uploadedFile?.name || "summary"} />
        </div>
      )}
    </div>
  );
}
