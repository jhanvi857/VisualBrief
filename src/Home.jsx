import { useState } from "react";
import { Zap, Loader } from "lucide-react";
import FileUploadSection from "./components/File-upload";
import VisualPreview from "./components/VisualPreview";
import ExportOptions from "./components/Export-options";

export default function Home() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [visualData, setVisualData] = useState(null);
  const [diagramType, setDiagramType] = useState("flowchart");
  const [diagramCode, setDiagramCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("diagram");

  const BACKEND_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

  const handleFileUpload = (file) => setUploadedFile(file);
  const handleGenerateBrief = async () => {
    if (!uploadedFile) return;
    setIsLoading(true);
    setVisualData(null);

    const formData = new FormData();
    formData.append("file", uploadedFile);
    formData.append("diagramType", diagramType);

    try {
      const response = await fetch(`${BACKEND_URL}/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setVisualData(data);
    } catch (err) {
      console.error("Brief generation failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateCustomBrief = async () => {
    if (!diagramCode) return;
    setIsLoading(true);
    setVisualData(null);
    try {
      const response = await fetch(`${BACKEND_URL}/diagram`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: diagramCode, diagramType }),
      });
      const data = await response.json();
      setVisualData(data);
    } catch (err) {
      console.error("Generation failed:", err);
    } finally {
      setIsLoading(false);
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
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            VisualBrief
          </h1>
        </div>
        <p className="text-lg text-slate-400">
          Upload documents or input text to generate intelligent diagrams and walkthroughs.
        </p>
      </div>

      {/* Inputs */}
      <div className="flex flex-col lg:flex-row gap-8 mb-8">
        <div className="flex-1 flex flex-col space-y-4">
          <h2 className="text-white text-xl font-semibold mb-2">File Input</h2>
          <FileUploadSection
            onFileUpload={handleFileUpload}
            uploadedFile={uploadedFile}
          />

          {/* Diagram Type Selector */}
          <div className="flex items-center gap-4 mt-2">
            <label className="text-white font-semibold">Diagram Type:</label>
            <select
              value={diagramType}
              onChange={(e) => setDiagramType(e.target.value)}
              className="bg-slate-900 text-white rounded-lg p-2 border border-slate-700 focus:outline-none focus:border-indigo-500"
            >
              <option value="flowchart">Flowchart (Ordered Steps)</option>
              <option value="erDiagram">ER Diagram (Stable Setup)</option>
              <option value="conceptMap">Concept Map (Associations)</option>
            </select>
          </div>

          {uploadedFile && (
            <button
              onClick={handleGenerateBrief}
              disabled={isLoading}
              className="w-full py-3 px-6 bg-linear-to-br from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 mt-4 transition-all hover:scale-[1.02] shadow-lg shadow-indigo-500/20"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" /> Generating Visual Brief...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" /> Generate Visual Brief
                </>
              )}
            </button>
          )}
        </div>

        {/* Custom Diagram Input */}
        <div className="flex-1 flex flex-col space-y-4">
          <h2 className="text-white text-xl font-semibold mb-2">
            Custom Diagram / Steps
          </h2>
          <div className="bg-slate-800 p-4 rounded-2xl shadow-md border border-slate-700 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <label className="text-white font-semibold">Diagram Type</label>
              <select
                value={diagramType}
                onChange={(e) => setDiagramType(e.target.value)}
                className="text-white py-2 rounded-lg px-2 bg-slate-900 border border-slate-700"
              >
                <option value="flowchart">Flowchart</option>
                <option value="erDiagram">ER Diagram</option>
                <option value="conceptMap">Concept Map</option>
              </select>
            </div>
            <textarea
              value={diagramCode}
              onChange={(e) => setDiagramCode(e.target.value)}
              className="w-full h-40 p-3 bg-slate-900 text-white rounded-lg font-mono resize-none border border-slate-700 focus:border-indigo-500 outline-none"
              placeholder="Describe your process or setup here..."
            />
            <button
              onClick={handleGenerateCustomBrief}
              disabled={isLoading}
              className="w-full py-3 px-6 bg-linear-to-br from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-lg shadow-green-500/20"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" /> Generate Visual Brief
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Output Section */}
      {visualData && visualData.success === false && (
        <div className="bg-amber-500/10 border border-amber-500/30 p-6 rounded-2xl mb-8 text-center shadow-xl">
          <p className="text-amber-400 font-bold text-lg mb-2">Confidence Warning</p>
          <p className="text-slate-300">{visualData.error}</p>
          {visualData.suggested_type && (
            <p className="mt-4 text-slate-400 text-sm">
              Suggested Diagram Type: <span className="font-mono text-indigo-400">{visualData.suggested_type}</span>
            </p>
          )}
        </div>
      )}

      {visualData && visualData.success !== false && (
        <div className="flex flex-col gap-8">
          <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700">
            <div className="flex items-center gap-4 mb-6 border-b border-slate-700 pb-4">
              {["diagram", "steps", "logic"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === tab
                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-700"
                    } capitalize`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "diagram" && (
              <VisualPreview diagramData={visualData} />
            )}

            {activeTab === "steps" && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white mb-4">Step-by-Step Explanation</h3>
                {visualData.steps?.map((step, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                      {i + 1}
                    </span>
                    <p className="text-slate-300 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "logic" && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white mb-4">Logic Representation</h3>
                <div className="bg-slate-950 p-6 rounded-xl border border-slate-700 font-mono">
                  {visualData.logic?.map((line, i) => (
                    <div key={i} className="text-emerald-400">
                      <span className="text-slate-600 mr-4 select-none">{i + 1}</span>
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <ExportOptions fileName={uploadedFile?.name || "visual_brief"} />
        </div>
      )}
    </div>
  );
}
