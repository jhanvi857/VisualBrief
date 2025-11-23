// import { useEffect, useState } from "react";
// import { Zap, Loader, FileText, PenTool, RefreshCw } from "lucide-react";
// import FileUploadSection from "./File-upload";
// import SummaryPanel from "./SummaryPanel";
// import VisualPreview from "./VisualPreview";
// import ExportOptions from "./Export-options";
// import Navbar from "./Navbar";
// import Footer from "./Footer";

// const MAX_DEMO_CREDITS = 2;
// const LOCAL_KEY = "vb_demo_credits";
// const BACKEND_URL = "https://visualbrief.onrender.com";

// function getStoredCredits() {
//   const raw = localStorage.getItem(LOCAL_KEY);
//   const parsed = raw ? parseInt(raw, 10) : NaN;
//   return Number.isFinite(parsed) ? parsed : MAX_DEMO_CREDITS;
// }

// function setStoredCredits(v) {
//   localStorage.setItem(LOCAL_KEY, String(v));
// }

// export default function ViewDemo() {
//   const [credits, setCredits] = useState(getStoredCredits());
//   const [uploadedFile, setUploadedFile] = useState(null);
//   const [summary, setSummary] = useState(null);
//   const [visualData, setVisualData] = useState(null);
//   const [diagramType, setDiagramType] = useState("flowchart");
//   const [diagramCode, setDiagramCode] = useState("");
//   const [isSummaryLoading, setIsSummaryLoading] = useState(false);
//   const [isDiagramLoading, setIsDiagramLoading] = useState(false);

//   useEffect(() => {
//     // sync from localStorage on first mount
//     setCredits(getStoredCredits());
//   }, []);

//   const updateCredits = (next) => {
//     setCredits(next);
//     setStoredCredits(next);
//   };

//   const consumeCredit = () => {
//     const current = getStoredCredits();
//     if (current <= 0) return false;
//     const next = current - 1;
//     updateCredits(next);
//     return true;
//   };

//   const refundCredit = () => {
//     // restore one credit (used when an operation failed after consuming)
//     const current = getStoredCredits();
//     const next = Math.min(current + 1, MAX_DEMO_CREDITS);
//     updateCredits(next);
//   };

//   const resetCredits = () => {
//     updateCredits(MAX_DEMO_CREDITS);
//   };

//   const handleFileUpload = (file) => {
//     setUploadedFile(file);
//   };

//   // Generate summary + diagram for uploaded file (consumes 1 credit)
//   const handleGenerateSummary = async () => {
//     if (!uploadedFile) return;
//     if (credits <= 0) {
//       alert("You used all demo credits. Please sign up to continue.");
//       return;
//     }

//     // consume one credit now (prevents double-usage).
//     // we'll refund if the request fails.
//     const didConsume = consumeCredit();
//     if (!didConsume) {
//       alert("No demo credits left.");
//       return;
//     }

//     setIsSummaryLoading(true);

//     const formData = new FormData();
//     formData.append("file", uploadedFile);
//     formData.append("diagramType", diagramType);

//     try {
//       const res = await fetch(`${BACKEND_URL}/upload`, {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) {
//         const text = await res.text();
//         throw new Error(`Server error: ${res.status} ${text}`);
//       }

//       const data = await res.json();
//       setSummary(data.summary ?? { title: "No summary", content: "" });
//       setVisualData(data.diagram ?? null);
//     } catch (err) {
//       console.error("Summary generation failed:", err);
//       // refund credit on failure
//       refundCredit();
//       setSummary({
//         title: "Error",
//         content:
//           "Failed to generate summary/diagram. Please try again later or check your file.",
//       });
//     } finally {
//       setIsSummaryLoading(false);
//     }
//   };

//   // Generate diagram from custom text (consumes 1 credit)
//   const handleGenerateCustomDiagram = async () => {
//     if (!diagramCode?.trim()) return;
//     if (credits <= 0) {
//       alert("You used all demo credits. Please sign up to continue.");
//       return;
//     }

//     const didConsume = consumeCredit();
//     if (!didConsume) {
//       alert("No demo credits left.");
//       return;
//     }

//     setIsDiagramLoading(true);

//     try {
//       const res = await fetch(`${BACKEND_URL}/diagram`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ text: diagramCode, diagramType }),
//       });

//       if (!res.ok) {
//         const text = await res.text();
//         throw new Error(`Server error: ${res.status} ${text}`);
//       }

//       const data = await res.json();
//       setVisualData(data.diagram ?? null);
//     } catch (err) {
//       console.error("Diagram generation failed:", err);
//       // refund credit on failure
//       refundCredit();
//       alert("Diagram generation failed. Try again.");
//     } finally {
//       setIsDiagramLoading(false);
//     }
//   };

//   const disabled = credits <= 0;

//   return (
//     <>
//     <Navbar/>
//     <div className="min-h-screen bg-gray-950 px-4 md:px-8 py-10">
//       {/* Header */}
//       <div className="max-w-6xl mx-auto text-center mb-10">
//         <div className="flex items-center justify-center gap-3 mb-4">
//           <div className="p-2 bg-indigo-500/20 rounded-xl">
//             <Zap className="w-7 h-7 text-indigo-400" />
//           </div>
//           <h1 className="text-4xl md:text-5xl font-bold text-white">VisualBrief</h1>
//         </div>
//         <p className="text-lg text-slate-400 max-w-2xl mx-auto">
//           Try VisualBrief for free — you have <span className="text-indigo-400 font-semibold">{credits}</span> / {MAX_DEMO_CREDITS} demo credits remaining.
//         </p>
//       </div>

//       {/* Demo Banner & Reset (small debug) */}
//       <div className="max-w-6xl mx-auto mb-8">
//         {disabled ? (
//           <div className="bg-red-600/10 border border-red-600/20 text-red-300 px-4 py-3 rounded-xl flex items-center justify-between gap-4">
//             <div>
//               <strong className="text-sm">Demo credits exhausted</strong>
//               <div className="text-xs text-red-200">Sign up to continue using VisualBrief.</div>
//             </div>
//             <div className="text-xs">
//               <a
//                 href="/signup"
//                 className="inline-block px-3 py-1 rounded-md bg-red-600/80 hover:bg-red-600 text-white text-sm"
//               >
//                 Sign Up
//               </a>
//             </div>
//           </div>
//         ) : (
//           <div className="bg-slate-900/40 border border-slate-800 px-4 py-3 rounded-xl text-slate-300">
//             <div className="flex items-center justify-between">
//               <div className="text-sm">
//                 Demo mode — you can run up to {MAX_DEMO_CREDITS} demo operations (file upload or custom diagram).
//               </div>
//               <div className="flex items-center gap-3">
//                 <button
//                   onClick={() => {
//                     if (confirm("Reset demo credits to full?")) resetCredits();
//                   }}
//                   title="Reset demo credits (debug)"
//                   className="flex items-center gap-2 text-xs px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-800/90 text-slate-300"
//                 >
//                   <RefreshCw size={14} /> Reset
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Inputs */}
//       <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14">
//         {/* FILE INPUT */}
//         <div className={`bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg ${disabled ? "opacity-60 pointer-events-none" : ""}`}>
//           <div className="flex items-center gap-3 mb-4">
//             <FileText className="text-indigo-400 w-6 h-6" />
//             <h2 className="text-xl font-semibold text-white">Upload File</h2>
//           </div>

//           <FileUploadSection onFileUpload={handleFileUpload} uploadedFile={uploadedFile} />

//           {/* Diagram Type */}
//           <div className="mt-5">
//             <label className="block text-white font-semibold mb-2">Diagram Type</label>
//             <select
//               value={diagramType}
//               onChange={(e) => setDiagramType(e.target.value)}
//               className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 w-full"
//             >
//               <option value="flowchart">Flowchart</option>
//               <option value="erDiagram">ER Diagram</option>
//               <option value="conceptMap">Concept Map</option>
//               <option value="sequenceDiagram">Sequence Diagram</option>
//             </select>
//           </div>

//           {uploadedFile && (
//             <button
//               onClick={handleGenerateSummary}
//               disabled={isSummaryLoading || disabled}
//               className={`mt-6 w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition ${
//                 disabled ? "bg-gray-700 cursor-not-allowed" : "bg-linear-to-br from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
//               }`}
//             >
//               {isSummaryLoading ? (
//                 <>
//                   <Loader className="w-5 h-5 animate-spin" /> Processing...
//                 </>
//               ) : (
//                 <>
//                   <Zap className="w-5 h-5" /> Generate Summary & Diagram
//                 </>
//               )}
//             </button>
//           )}
//         </div>

//         {/* CUSTOM TEXT INPUT */}
//         <div className={`bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg ${disabled ? "opacity-60 pointer-events-none" : ""}`}>
//           <div className="flex items-center gap-3 mb-4">
//             <PenTool className="text-teal-400 w-6 h-6" />
//             <h2 className="text-xl font-semibold text-white">Custom Text / Steps</h2>
//           </div>

//           <div className="flex flex-col gap-4">
//             <div>
//               <label className="text-white font-semibold mb-2 block">Diagram Type</label>
//               <select
//                 value={diagramType}
//                 onChange={(e) => setDiagramType(e.target.value)}
//                 className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 w-full"
//               >
//                 <option value="flowchart">Flowchart</option>
//                 <option value="erDiagram">ER Diagram</option>
//                 <option value="conceptMap">Concept Map</option>
//                 <option value="sequenceDiagram">Sequence Diagram</option>
//               </select>
//             </div>

//             <textarea
//               value={diagramCode}
//               onChange={(e) => setDiagramCode(e.target.value)}
//               placeholder="Write your steps or process description..."
//               className="w-full h-48 bg-gray-800 text-white p-3 rounded-lg border border-gray-700 resize-none font-mono"
//             />

//             <button
//               onClick={handleGenerateCustomDiagram}
//               disabled={isDiagramLoading || disabled}
//               className={`w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition ${
//                 disabled ? "bg-gray-700 cursor-not-allowed" : "bg-linear-to-br from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
//               }`}
//             >
//               {isDiagramLoading ? (
//                 <>
//                   <Loader className="w-5 h-5 animate-spin" /> Generating Diagram...
//                 </>
//               ) : (
//                 <>
//                   <Zap className="w-5 h-5" /> Generate Custom Diagram
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Output */}
//       <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
//         <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg">
//           <h2 className="text-xl font-semibold text-white mb-3">Diagram Preview</h2>
//           <VisualPreview diagramData={visualData} />
//         </div>

//         {summary && (
//           <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg">
//             <h2 className="text-xl font-semibold text-white mb-3">Summary</h2>
//             <div className="max-h-[400px] overflow-auto">
//               <SummaryPanel summary={summary} />
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Export */}
//       {(summary || visualData) && (
//         <div className="max-w-6xl mx-auto mt-10">
//           <ExportOptions fileName={uploadedFile?.name || "summary"} />
//         </div>
//       )}
//     </div>
//     <Footer/>
//     </>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { Zap, Loader, FileText, PenTool, RefreshCw } from "lucide-react";
import FileUploadSection from "./File-upload";
import SummaryPanel from "./SummaryPanel";
import VisualPreview from "./VisualPreview";
import ExportOptions from "./Export-options";
import Navbar from "./Navbar";
import Footer from "./Footer";

const MAX_DEMO_CREDITS = 10;
const LOCAL_KEY_CREDITS = "vb_demo_credits";
const LOCAL_KEY_TIMESTAMP = "vb_demo_timestamp";
const COOLDOWN_TIME = 2 * 60 * 60 * 1000; 
const BACKEND_URL = "https://visualbrief.onrender.com";

// Format time mm:ss
function formatCooldown(ms) {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}

export default function ViewDemo({maxCredits = 2,showNav = true}) {
  const [credits, setCredits] = useState(maxCredits);
  const [cooldown, setCooldown] = useState(0); // ms remaining
  const [disabled, setDisabled] = useState(false);

  const [uploadedFile, setUploadedFile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [visualData, setVisualData] = useState(null);
  const [diagramType, setDiagramType] = useState("flowchart");
  const [diagramCode, setDiagramCode] = useState("");
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [isDiagramLoading, setIsDiagramLoading] = useState(false);

  // Load credits + timestamp on mount
  useEffect(() => {
    const storedCredits = parseInt(localStorage.getItem(LOCAL_KEY_CREDITS) || maxCredits);
    const lastUsed = parseInt(localStorage.getItem(LOCAL_KEY_TIMESTAMP) || 0);

    const now = Date.now();
    const diff = now - lastUsed;

    if (storedCredits === 0 && diff < COOLDOWN_TIME) {
      setDisabled(true);
      setCooldown(COOLDOWN_TIME - diff);
    } else {
      // reset if expired
      resetCredits();
    }

    setCredits(storedCredits);
  }, []);

  // Cooldown countdown timer (each sec)
  useEffect(() => {
    if (!disabled) return;
    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1000) {
          resetCredits();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [disabled]);

  // Save credits
  const updateCredits = (val) => {
    setCredits(val);
    localStorage.setItem(LOCAL_KEY_CREDITS, val.toString());
  };

  // Reset credits after cooldown
  const resetCredits = () => {
    updateCredits(maxCredits);
    localStorage.setItem(LOCAL_KEY_TIMESTAMP, "0");
    setDisabled(false);
    setCooldown(0);
  };

  // When user consumes 1 credit
  const consumeCredit = () => {
    if (disabled || credits <= 0) return false;

    const next = credits - 1;
    updateCredits(next);

    if (next === 0) {
      // start cooldown
      const now = Date.now();
      localStorage.setItem(LOCAL_KEY_TIMESTAMP, now.toString());
      setDisabled(true);
      setCooldown(COOLDOWN_TIME);
    }

    return true;
  };

  const refundCredit = () => {
    if (credits < maxCredits) {
      updateCredits(credits + 1);
    }
  };

  const handleFileUpload = (file) => setUploadedFile(file);

  // --- Summary generation with credit consumption ---
  const handleGenerateSummary = async () => {
    if (!uploadedFile) return;
    if (!consumeCredit()) {
      alert("No credits left. Wait for cooldown.");
      return;
    }

    setIsSummaryLoading(true);
    const formData = new FormData();
    formData.append("file", uploadedFile);
    formData.append("diagramType", diagramType);

    try {
      const res = await fetch(`${BACKEND_URL}/upload`, { method: "POST", body: formData });
      const data = await res.json();

      setSummary(data.summary ?? { title: "No summary", content: "" });
      setVisualData(data.diagram ?? null);
    } catch (err) {
      refundCredit();
      alert("Failed. Try again.");
    } finally {
      setIsSummaryLoading(false);
    }
  };

  // --- Custom diagram generation ---
  const handleGenerateCustomDiagram = async () => {
    if (!diagramCode.trim()) return;
    if (!consumeCredit()) {
      alert("No credits left. Wait for cooldown.");
      return;
    }

    setIsDiagramLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/diagram`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: diagramCode, diagramType }),
      });

      const data = await res.json();
      setVisualData(data.diagram ?? null);
    } catch (err) {
      refundCredit();
      alert("Diagram generation failed.");
    } finally {
      setIsDiagramLoading(false);
    }
  };

  return (
    <>
      {showNav && <Navbar/>}
      <div className="min-h-screen bg-gray-950 px-4 md:px-8 py-10">
        {/* CREDIT HEADER */}
        <div className="max-w-6xl mx-auto text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 bg-indigo-500/20 rounded-xl">
              <Zap className="w-7 h-7 text-indigo-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">VisualBrief</h1>
          </div>

          <p className="text-lg text-slate-400">
            Demo Credits:{" "}
            <span className="text-indigo-400 font-semibold">
              {credits} / {maxCredits}
            </span>
          </p>

          {disabled && (
            <p className="text-red-400 mt-2 text-sm">
              ⏳ Credits will reset in {formatCooldown(cooldown)}
            </p>
          )}
        </div>

        {/* REMAINING UI (UNCHANGED FROM YOUR CODE) */}
        {/* ---- KEEP EVERYTHING BELOW EXACT SAME ---- */}

        {/* Demo Banner & Reset */}
        {!disabled ? (
          <div className="max-w-6xl mx-auto mb-8 bg-slate-900/40 border border-slate-800 px-4 py-3 rounded-xl text-slate-300">
            <div className="flex items-center justify-between text-sm">
              Demo mode — You get {maxCredits} free demo operations.
              <button
                onClick={() => resetCredits()}
                className="flex items-center gap-2 text-xs px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-800/90 text-slate-300"
              >
                <RefreshCw size={14} /> Reset
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto mb-8 bg-red-600/10 border border-red-600/20 text-red-300 px-4 py-3 rounded-xl">
            Demo credits exhausted — Wait for cooldown.
          </div>
        )}

        {/* Inputs, Output, Export — unchanged */}
        {/* ------- (YOUR SAME UI CODE BELOW) ------- */}

        {/* FILE + CUSTOM INPUTS */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14">
          {/* FILE INPUT */}
          <div
            className={`bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg ${
              disabled ? "opacity-60 pointer-events-none" : ""
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <FileText className="text-indigo-400 w-6 h-6" />
              <h2 className="text-xl font-semibold text-white">Upload File</h2>
            </div>

            <FileUploadSection onFileUpload={handleFileUpload} uploadedFile={uploadedFile} />

            {/* Diagram Type */}
            <div className="mt-5">
              <label className="block text-white font-semibold mb-2">Diagram Type</label>
              <select
                value={diagramType}
                onChange={(e) => setDiagramType(e.target.value)}
                className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 w-full"
              >
                <option value="flowchart">Flowchart</option>
                <option value="erDiagram">ER Diagram</option>
                <option value="conceptMap">Concept Map</option>
                <option value="sequenceDiagram">Sequence Diagram</option>
              </select>
            </div>

            {uploadedFile && (
              <button
                onClick={handleGenerateSummary}
                disabled={isSummaryLoading || disabled}
                className={`mt-6 w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition ${
                  disabled
                    ? "bg-gray-700 cursor-not-allowed"
                    : "bg-linear-to-br from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                }`}
              >
                {isSummaryLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" /> Generate Summary & Diagram
                  </>
                )}
              </button>
            )}
          </div>

          {/* CUSTOM TEXT INPUT */}
          {/* <div
            className={`bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg ${
              disabled ? "opacity-60 pointer-events-none" : ""
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <PenTool className="text-teal-400 w-6 h-6" />
              <h2 className="text-xl font-semibold text-white">Custom Text / Steps</h2>
            </div>

            <textarea
              value={diagramCode}
              onChange={(e) => setDiagramCode(e.target.value)}
              className="w-full h-48 bg-gray-800 text-white p-3 rounded-lg border border-gray-700 resize-none font-mono"
              placeholder="Write your steps or process description..."
            />

            <button
              onClick={handleGenerateCustomDiagram}
              disabled={isDiagramLoading || disabled}
              className={`mt-4 w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition ${
                disabled
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-linear-to-br from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
              }`}
            >
              {isDiagramLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" /> Generate Custom Diagram
                </>
              )}
            </button>
          </div> */}
          <div
  className={`bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg ${
    disabled ? "opacity-60 pointer-events-none" : ""
  }`}
>
  <div className="flex items-center gap-3 mb-4">
    <PenTool className="text-teal-400 w-6 h-6" />
    <h2 className="text-xl font-semibold text-white">
      Custom Text / Steps
    </h2>
  </div>

  {/* NEW DROPDOWN FOR CUSTOM TEXT */}
  <div className="mb-4">
    <label className="text-white font-semibold mb-2 block">
      Diagram Type
    </label>

    <select
      value={diagramType}
      onChange={(e) => setDiagramType(e.target.value)}
      className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 w-full"
    >
      <option value="flowchart">Flowchart</option>
      <option value="erDiagram">ER Diagram</option>
      <option value="conceptMap">Mindmap / Concept Map</option>
      <option value="sequenceDiagram">Sequence Diagram</option>
    </select>
  </div>

  <textarea
    value={diagramCode}
    onChange={(e) => setDiagramCode(e.target.value)}
    className="w-full h-48 bg-gray-800 text-white p-3 rounded-lg border border-gray-700 resize-none font-mono"
    placeholder="Write your steps or process description..."
  />

  <button
    onClick={handleGenerateCustomDiagram}
    disabled={isDiagramLoading || disabled}
    className={`mt-4 w-full py-3 rounded-xl font-semibold text-white 
      flex items-center justify-center gap-2 transition ${
        disabled
          ? "bg-gray-700 cursor-not-allowed"
          : "bg-linear-to-br from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
      }`}
  >
    {isDiagramLoading ? (
      <>
        <Loader className="w-5 h-5 animate-spin" /> Generating...
      </>
    ) : (
      <>
        <Zap className="w-5 h-5" /> Generate Custom Diagram
      </>
    )}
  </button>
</div>

        </div>

        {/* OUTPUT SECTION */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-3">Diagram Preview</h2>
            <VisualPreview diagramData={visualData} />
          </div>

          {summary && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-white mb-3">Summary</h2>
              <div className="max-h-[400px] overflow-auto">
                <SummaryPanel summary={summary} />
              </div>
            </div>
          )}
        </div>

        {summary || visualData ? (
          <div className="max-w-6xl mx-auto mt-10">
            <ExportOptions fileName={uploadedFile?.name || "summary"} />
          </div>
        ) : null}
      </div>

      <Footer />
    </>
  );
}
