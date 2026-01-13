// import { useEffect, useState } from "react";
// import { Zap, Loader, FileText, PenTool, RefreshCw } from "lucide-react";
// import FileUploadSection from "./File-upload";
// import SummaryPanel from "./SummaryPanel";
// import VisualPreview from "./VisualPreview";
// import ExportOptions from "./Export-options";
// import Navbar from "./Navbar";
// import Footer from "./Footer";
// import { getToken } from "../lib/mockAPI"; 
// import toast from "react-hot-toast";

// const DEMO_CREDITS = 2;
// const LOGGED_IN_CREDITS = 5;
// const LOCAL_KEY_CREDITS = "vb_demo_credits";
// const LOCAL_KEY_TIMESTAMP = "vb_demo_timestamp";
// const COOLDOWN_TIME = 2 * 60 * 60 * 1000; 
// // const BACKEND_URL = "http://localhost:8000/api";
// const BACKEND_URL = "https://visualbrief.onrender.com/api";

// function formatCooldown(ms) {
//   const totalSec = Math.floor(ms / 1000);
//   const min = Math.floor(totalSec / 60);
//   const sec = totalSec % 60;
//   return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
// }

// export default function ViewDemo({showNav = true, onUploadSuccess}) {
//   const userToken = getToken();
//   const isLoggedIn = !!userToken;

//   const maxCredits = isLoggedIn ? LOGGED_IN_CREDITS : DEMO_CREDITS;

//   const [credits, setCredits] = useState(maxCredits);
//   const [cooldown, setCooldown] = useState(0); 
//   const [disabled, setDisabled] = useState(false);

//   const [uploadedFile, setUploadedFile] = useState(null);
//   const [summary, setSummary] = useState(null);
//   const [visualData, setVisualData] = useState(null);
//   const [diagramType, setDiagramType] = useState("flowchart");
//   const [diagramCode, setDiagramCode] = useState("");
//   const [isSummaryLoading, setIsSummaryLoading] = useState(false);
//   const [isDiagramLoading, setIsDiagramLoading] = useState(false);
//   const [newSummaryId, setNewSummaryId] = useState(null);
//   useEffect(() => {
//     if (isLoggedIn) {
//       setCredits(LOGGED_IN_CREDITS);
//       return;
//     }

//     const savedCredits = localStorage.getItem(LOCAL_KEY_CREDITS);
//     const savedTimestamp = localStorage.getItem(LOCAL_KEY_TIMESTAMP);

//     if (savedCredits) {
//       const creditsNum = parseInt(savedCredits, 10);
//       setCredits(creditsNum);

//       if (creditsNum === 0 && savedTimestamp && savedTimestamp !== "0") {
//         const elapsed = Date.now() - parseInt(savedTimestamp, 10);
//         const remaining = COOLDOWN_TIME - elapsed;

//         if (remaining > 0) {
//           setDisabled(true);
//           setCooldown(remaining);
//         } else {
//           resetCredits();
//         }
//       }
//     }
//   }, [isLoggedIn]);

//   useEffect(() => {
//     if (!disabled) return;

//     const interval = setInterval(() => {
//       setCooldown((prev) => {
//         if (prev <= 1000) {
//           resetCredits();
//           return 0;
//         }
//         return prev - 1000;
//       });
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [disabled]);

//   const updateCredits = (val) => {
//     setCredits(val);
//     if (!isLoggedIn) {
//       localStorage.setItem(LOCAL_KEY_CREDITS, val.toString());
//     }
//   };

//   const resetCredits = () => {
//     updateCredits(maxCredits);
//     if (!isLoggedIn) {
//       localStorage.setItem(LOCAL_KEY_TIMESTAMP, "0");
//     }
//     setDisabled(false);
//     setCooldown(0);
//   };

//   const consumeCredit = () => {
//     if (disabled || credits <= 0) return false;

//     const next = credits - 1;
//     updateCredits(next);

//     if (next === 0) {
//       const now = Date.now();
//       if (!isLoggedIn) {
//         localStorage.setItem(LOCAL_KEY_TIMESTAMP, now.toString());
//       }
//       setDisabled(true);
//       setCooldown(COOLDOWN_TIME);
//     }

//     return true;
//   };

//   const refundCredit = () => {
//     if (credits < maxCredits) {
//       updateCredits(credits + 1);
//     }
//   };

//   const handleFileUpload = (file) => setUploadedFile(file);

//   const handleSaveAndExit = () => {
//     if (onUploadSuccess) {
//       toast.success('Summary saved! Redirecting...');
//       setTimeout(onUploadSuccess, 500);
//     }
//   };

//   const handleGenerateSummary = async () => {
//     if (!uploadedFile) return;

//     if (!consumeCredit()) {
//       toast.error('No credits left. Wait for cooldown or sign up for more!');
//       return;
//     }

//     setIsSummaryLoading(true);
//     setNewSummaryId(null);
//     setSummary(null);
//     setVisualData(null);

//     const formData = new FormData();
//     formData.append("file", uploadedFile);
//     formData.append("diagramType", diagramType);

//     try {
//       const endpoint = isLoggedIn ? `${BACKEND_URL}/upload` : `${BACKEND_URL}/upload-demo`;

//       const headers = {};
//       if (isLoggedIn) {
//         headers['Authorization'] = `Bearer ${userToken}`;
//       }

//       const res = await fetch(endpoint, { 
//         method: "POST", 
//         headers: headers,
//         body: formData 
//       });

//       const data = await res.json();

//       if (res.status === 401 && isLoggedIn) {
//         toast.error('Session expired. Please log in again.');
//         throw new Error("Unauthorized");
//       }

//       if (!res.ok) {
//         console.error("Upload API Error:", data);
//         toast.error(data.detail || "Server Error during generation.");
//         throw new Error(data.detail || "Server Error");
//       }

//       setSummary(data.summary);
//       setVisualData(data.diagram);

//       if (isLoggedIn) {
//         setNewSummaryId(data.summaryId);
//         toast.success('Summary generated and saved! Scroll down to view.');
//       } else {
//         toast.success('Summary generated! Sign up to save your summaries.');
//       }

//     } catch (err) {
//       refundCredit();
//       console.error("Upload failed:", err);
//       if (err.message === "Unauthorized" && onUploadSuccess) {
//         onUploadSuccess();
//       }
//     } finally {
//       setIsSummaryLoading(false);
//     }
//   };

//   const handleGenerateCustomDiagram = async () => {
//     if (!diagramCode.trim()) {
//       toast.error('Please enter some text first.');
//       return;
//     }

//     if (!consumeCredit()) {
//       toast.error('No credits left. Wait for cooldown or sign up for more!');
//       return;
//     }

//     setIsDiagramLoading(true);

//     try {
//       const res = await fetch(`${BACKEND_URL}/diagram`, {
//         method: "POST",
//         headers: { 
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ text: diagramCode, diagramType }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.detail || "Diagram generation failed");
//       }

//       setVisualData(data.diagram);
//       toast.success('Custom diagram generated!');
//     } catch (err) {
//       refundCredit();
//       console.error("Diagram generation error:", err);
//       toast.error(err.message || 'Diagram generation failed.');
//     } finally {
//       setIsDiagramLoading(false);
//     }
//   };

//   return (
//     <>
//       {showNav && <Navbar/>}
//       <div className="min-h-screen bg-gray-950 px-4 md:px-8 py-10">
//         {/* CREDIT HEADER */}
//         <div className="max-w-6xl mx-auto text-center mb-10">
//           <div className="flex items-center justify-center gap-3 mb-4">
//             <div className="p-2 bg-indigo-500/20 rounded-xl">
//               <Zap className="w-7 h-7 text-indigo-400" />
//             </div>
//             <h1 className="text-4xl md:text-5xl font-bold text-white">VisualBrief</h1>
//           </div>

//           <p className="text-lg text-slate-400">
//             {isLoggedIn ? "Your" : "Demo"} Credits:{" "}
//             <span className="text-indigo-400 font-semibold">
//               {credits} / {maxCredits}
//             </span>
//           </p>

//           {disabled && (
//             <p className="text-red-400 mt-2 text-sm">
//               ⏳ Credits will reset in {formatCooldown(cooldown)}
//             </p>
//           )}
//         </div>

//         {/* Demo Banner & Reset */}
//         {!isLoggedIn && !disabled && (
//           <div className="max-w-6xl mx-auto mb-8 bg-slate-900/40 border border-slate-800 px-4 py-3 rounded-xl text-slate-300">
//             <div className="flex items-center justify-between text-sm">
//               <span>Demo mode — You get {maxCredits} free demo operations. <a href="/signup" className="text-indigo-400 hover:underline">Sign up</a> for more!</span>
//               <button
//                 onClick={() => {
//                   resetCredits();
//                   toast.success('Credits reset!');
//                 }}
//                 className="flex items-center gap-2 text-xs px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-800/90 text-slate-300 transition-colors"
//               >
//                 <RefreshCw size={14} /> Reset
//               </button>
//             </div>
//           </div>
//         )}

//         {disabled && (
//           <div className="max-w-6xl mx-auto mb-8 bg-red-600/10 border border-red-600/20 text-red-300 px-4 py-3 rounded-xl">
//             {isLoggedIn 
//               ? "You've used all your credits. Wait for cooldown or upgrade your plan."
//               : "Demo credits exhausted. Sign up for more credits or wait for cooldown."
//             }
//           </div>
//         )}

//         {/* FILE + CUSTOM INPUTS */}
//         <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14">
//           {/* FILE INPUT */}
//           <div
//             className={`bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg ${
//               disabled ? "opacity-60 pointer-events-none" : ""
//             }`}
//           >
//             <div className="flex items-center gap-3 mb-4">
//               <FileText className="text-indigo-400 w-6 h-6" />
//               <h2 className="text-xl font-semibold text-white">Upload File</h2>
//             </div>

//             <FileUploadSection onFileUpload={handleFileUpload} uploadedFile={uploadedFile} />

//             <div className="mt-5">
//               <label className="block text-white font-semibold mb-2">Diagram Type</label>
//               <select
//                 value={diagramType}
//                 onChange={(e) => setDiagramType(e.target.value)}
//                 className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 w-full focus:outline-none focus:border-indigo-500 transition-colors"
//               >
//                 <option value="flowchart">Flowchart</option>
//                 <option value="erDiagram">ER Diagram</option>
//                 <option value="conceptMap">Concept Map</option>
//                 <option value="sequenceDiagram">Sequence Diagram</option>
//               </select>
//             </div>

//             {uploadedFile && (
//               <button
//                 onClick={handleGenerateSummary}
//                 disabled={isSummaryLoading || disabled}
//                 className={`mt-6 w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition ${
//                   disabled || isSummaryLoading
//                     ? "bg-gray-700 cursor-not-allowed"
//                     : "bg-linear-to-br from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
//                 }`}
//               >
//                 {isSummaryLoading ? (
//                   <>
//                     <Loader className="w-5 h-5 animate-spin" /> Processing...
//                   </>
//                 ) : (
//                   <>
//                     <Zap className="w-5 h-5" /> Generate Summary & Diagram
//                   </>
//                 )}
//               </button>
//             )}
//           </div>

//           {/* CUSTOM TEXT INPUT */}
//           <div
//             className={`bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg ${
//               disabled ? "opacity-60 pointer-events-none" : ""
//             }`}
//           >
//             <div className="flex items-center gap-3 mb-4">
//               <PenTool className="text-teal-400 w-6 h-6" />
//               <h2 className="text-xl font-semibold text-white">
//                 Custom Text / Steps
//               </h2>
//             </div>

//             <div className="mb-4">
//               <label className="text-white font-semibold mb-2 block">
//                 Diagram Type
//               </label>
//               <select
//                 value={diagramType}
//                 onChange={(e) => setDiagramType(e.target.value)}
//                 className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 w-full focus:outline-none focus:border-indigo-500 transition-colors"
//               >
//                 <option value="flowchart">Flowchart</option>
//                 <option value="erDiagram">ER Diagram</option>
//                 <option value="conceptMap">Mindmap / Concept Map</option>
//                 <option value="sequenceDiagram">Sequence Diagram</option>
//               </select>
//             </div>

//             <textarea
//               value={diagramCode}
//               onChange={(e) => setDiagramCode(e.target.value)}
//               className="w-full h-48 bg-gray-800 text-white p-3 rounded-lg border border-gray-700 resize-none font-mono focus:outline-none focus:border-indigo-500 transition-colors"
//               placeholder="Write your steps or process description..."
//             />

//             <button
//               onClick={handleGenerateCustomDiagram}
//               disabled={isDiagramLoading || disabled}
//               className={`mt-4 w-full py-3 rounded-xl font-semibold text-white 
//                 flex items-center justify-center gap-2 transition ${
//                   disabled || isDiagramLoading
//                     ? "bg-gray-700 cursor-not-allowed"
//                     : "bg-linear-to-br from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
//                 }`}
//             >
//               {isDiagramLoading ? (
//                 <>
//                   <Loader className="w-5 h-5 animate-spin" /> Generating...
//                 </>
//               ) : (
//                 <>
//                   <Zap className="w-5 h-5" /> Generate Custom Diagram
//                 </>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* OUTPUT SECTION */}
//         <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
//           <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg">
//             <h2 className="text-xl font-semibold text-white mb-3">Diagram Preview</h2>
//             <VisualPreview diagramData={visualData} />
//           </div>

//           {summary && (
//             <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg">
//               <h2 className="text-xl font-semibold text-white mb-3">Summary</h2>
//               <div className="max-h-[400px] overflow-auto">
//                 <SummaryPanel summary={summary} />
//               </div>
//             </div>
//           )}
//         </div>

//         {/* SAVE AND EXIT BUTTON Only for logged in users */}
//         {newSummaryId && isLoggedIn && (
//           <div className="max-w-6xl mx-auto mt-10 text-center">
//             <button
//               onClick={handleSaveAndExit}
//               className="bg-linear-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold px-8 py-3 rounded-xl transition-all transform hover:scale-105"
//             >
//               Go to Dashboard and View All Summaries
//             </button>
//           </div>
//         )}

//         {/* Sign up CTA for demo users */}
//         {!isLoggedIn && (summary || visualData) && (
//           <div className="max-w-6xl mx-auto mt-10 text-center bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-6">
//             <h3 className="text-xl font-bold text-white mb-2">Want to save your summaries?</h3>
//             <p className="text-gray-400 mb-4">Sign up to save unlimited summaries and access them anytime!</p>
//             <a 
//               href="/signup" 
//               className="inline-block bg-linear-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold px-8 py-3 rounded-xl transition-all"
//             >
//               Sign Up Now
//             </a>
//           </div>
//         )}

//         {summary || visualData ? (
//           <div className="max-w-6xl mx-auto mt-10">
//             <ExportOptions fileName={uploadedFile?.name || "summary"} />
//           </div>
//         ) : null}
//       </div>

//       <Footer />
//     </>
//   );
// }
import { useEffect, useState } from "react";
import { Zap, Loader, FileText, PenTool, RefreshCw } from "lucide-react";
import FileUploadSection from "./File-upload";
import SummaryPanel from "./SummaryPanel";
import VisualPreview from "./VisualPreview";
import ExportOptions from "./Export-options";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { getToken } from "../lib/mockAPI";
import toast from "react-hot-toast";

const DEMO_CREDITS = 2;
const LOGGED_IN_CREDITS = 5;
const LOCAL_KEY_CREDITS = "vb_demo_credits";
const LOCAL_KEY_TIMESTAMP = "vb_demo_timestamp";
const COOLDOWN_TIME = 2 * 60 * 60 * 1000;
// const BACKEND_URL = "http://localhost:8000/api";
const BACKEND_URL = "https://visualbrief.onrender.com/api";

function formatCooldown(ms) {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}

export default function ViewDemo({
  showNav = true,
  onUploadSuccess,
  maxCredits: propMaxCredits,
  demo = true
}) {
  const [userToken, setUserToken] = useState(null);
  const [isTokenLoading, setIsTokenLoading] = useState(true);

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getToken();
      setUserToken(token);
      setIsTokenLoading(false);
    };
    fetchToken();
  }, []);

  const isLoggedIn = !!userToken && !demo;

  const defaultCredits = propMaxCredits ?? (isLoggedIn ? LOGGED_IN_CREDITS : DEMO_CREDITS);
  const [credits, setCredits] = useState(defaultCredits);
  const [cooldown, setCooldown] = useState(0);
  const [disabled, setDisabled] = useState(false);

  const [uploadedFile, setUploadedFile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [visualData, setVisualData] = useState(null);
  const [diagramType, setDiagramType] = useState("flowchart");
  const [diagramCode, setDiagramCode] = useState("");
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [isDiagramLoading, setIsDiagramLoading] = useState(false);
  const [newSummaryId, setNewSummaryId] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      setCredits(defaultCredits);
      return;
    }

    const savedCredits = localStorage.getItem(LOCAL_KEY_CREDITS);
    const savedTimestamp = localStorage.getItem(LOCAL_KEY_TIMESTAMP);

    if (savedCredits) {
      const creditsNum = parseInt(savedCredits, 10);
      setCredits(creditsNum);

      if (creditsNum === 0 && savedTimestamp && savedTimestamp !== "0") {
        const elapsed = Date.now() - parseInt(savedTimestamp, 10);
        const remaining = COOLDOWN_TIME - elapsed;

        if (remaining > 0) {
          setDisabled(true);
          setCooldown(remaining);
        } else {
          resetCredits();
        }
      }
    }
  }, [isLoggedIn]);

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

  const updateCredits = (val) => {
    setCredits(val);
    if (!isLoggedIn) {
      localStorage.setItem(LOCAL_KEY_CREDITS, val.toString());
    }
  };

  const resetCredits = () => {
    updateCredits(defaultCredits);
    if (!isLoggedIn) {
      localStorage.setItem(LOCAL_KEY_TIMESTAMP, "0");
    }
    setDisabled(false);
    setCooldown(0);
  };

  const consumeCredit = () => {
    if (disabled || credits <= 0) return false;

    const next = credits - 1;
    updateCredits(next);

    if (next === 0) {
      const now = Date.now();
      if (!isLoggedIn) {
        localStorage.setItem(LOCAL_KEY_TIMESTAMP, now.toString());
      }
      setDisabled(true);
      setCooldown(COOLDOWN_TIME);
    }

    return true;
  };

  const refundCredit = () => {
    if (credits < defaultCredits) {
      updateCredits(credits + 1);
    }
  };

  const handleFileUpload = (file) => setUploadedFile(file);

  const handleSaveAndExit = () => {
    if (onUploadSuccess) {
      toast.success('Summary saved! Redirecting...');
      setTimeout(onUploadSuccess, 500);
    }
  };

  const handleGenerateSummary = async () => {
    if (!uploadedFile) return;

    if (!consumeCredit()) {
      toast.error('No credits left. Wait for cooldown or sign up for more!');
      return;
    }

    setIsSummaryLoading(true);
    setNewSummaryId(null);
    setSummary(null);
    setVisualData(null);

    const formData = new FormData();
    formData.append("file", uploadedFile);
    formData.append("diagramType", diagramType);

    try {
      const currentToken = await getToken();
      const endpoint = demo ? `${BACKEND_URL}/upload-demo` : `${BACKEND_URL}/upload`;
      const headers = {};

      if (currentToken && !demo) {
        headers['Authorization'] = `Bearer ${currentToken}`;
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: headers,
        body: formData
      });

      const data = await res.json();

      if (res.status === 401 && isLoggedIn) {
        toast.error('Session expired. Please log in again.');
        throw new Error("Unauthorized");
      }

      if (!res.ok) {
        console.error("Upload API Error:", data);
        toast.error(data.detail || "Server Error during generation.");
        throw new Error(data.detail || "Server Error");
      }

      setSummary(data.summary);
      setVisualData(data.diagram);

      if (isLoggedIn) {
        setNewSummaryId(data.summaryId);
        toast.success('Summary generated and saved! Scroll down to view.');
      } else {
        toast.success('Summary generated! Sign up to save your summaries.');
      }

    } catch (err) {
      refundCredit();
      console.error("Upload failed:", err);
      if (err.message === "Unauthorized" && onUploadSuccess) {
        onUploadSuccess();
      }
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const handleGenerateCustomDiagram = async () => {
    if (!diagramCode.trim()) {
      toast.error('Please enter some text first.');
      return;
    }

    if (!consumeCredit()) {
      toast.error('No credits left. Wait for cooldown or sign up for more!');
      return;
    }

    setIsDiagramLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/diagram`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: diagramCode, diagramType }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Diagram generation failed");
      }

      setVisualData(data.diagram);
      toast.success('Custom diagram generated!');
    } catch (err) {
      refundCredit();
      console.error("Diagram generation error:", err);
      toast.error(err.message || 'Diagram generation failed.');
    } finally {
      setIsDiagramLoading(false);
    }
  };

  return (
    <>
      {showNav && <Navbar />}
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
            {isLoggedIn ? "Your" : "Demo"} Credits:{" "}
            <span className="text-indigo-400 font-semibold">
              {credits} / {defaultCredits}
            </span>
          </p>

          {disabled && (
            <p className="text-red-400 mt-2 text-sm">
              ⏳ Credits will reset in {formatCooldown(cooldown)}
            </p>
          )}
        </div>

        {/* FILE + CUSTOM INPUTS */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14">
          {/* FILE INPUT */}
          <div
            className={`bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg ${disabled ? "opacity-60 pointer-events-none" : ""}`}
          >
            <div className="flex items-center gap-3 mb-4">
              <FileText className="text-indigo-400 w-6 h-6" />
              <h2 className="text-xl font-semibold text-white">Upload File</h2>
            </div>

            <FileUploadSection onFileUpload={handleFileUpload} uploadedFile={uploadedFile} />

            <div className="mt-5">
              <label className="block text-white font-semibold mb-2">Diagram Type</label>
              <select
                value={diagramType}
                onChange={(e) => setDiagramType(e.target.value)}
                className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 w-full focus:outline-none focus:border-indigo-500 transition-colors"
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
                className={`mt-6 w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition ${disabled || isSummaryLoading ? "bg-gray-700 cursor-not-allowed" : "bg-linear-to-br from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"}`}
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
          <div
            className={`bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg ${disabled ? "opacity-60 pointer-events-none" : ""}`}
          >
            <div className="flex items-center gap-3 mb-4">
              <PenTool className="text-teal-400 w-6 h-6" />
              <h2 className="text-xl font-semibold text-white">Custom Text / Steps</h2>
            </div>

            <div className="mb-4">
              <label className="text-white font-semibold mb-2 block">Diagram Type</label>
              <select
                value={diagramType}
                onChange={(e) => setDiagramType(e.target.value)}
                className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 w-full focus:outline-none focus:border-indigo-500 transition-colors"
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
              className="w-full h-48 bg-gray-800 text-white p-3 rounded-lg border border-gray-700 resize-none font-mono focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="Write your steps or process description..."
            />

            <button
              onClick={handleGenerateCustomDiagram}
              disabled={isDiagramLoading || disabled}
              className={`mt-4 w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition ${disabled || isDiagramLoading ? "bg-gray-700 cursor-not-allowed" : "bg-linear-to-br from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"}`}
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

        {/* SAVE AND EXIT BUTTON Only for logged in users */}
        {newSummaryId && isLoggedIn && (
          <div className="max-w-6xl mx-auto mt-10 text-center">
            <button
              onClick={handleSaveAndExit}
              className="bg-linear-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold px-8 py-3 rounded-xl transition-all transform hover:scale-105"
            >
              Go to Dashboard and View All Summaries
            </button>
          </div>
        )}

        {/* Sign up CTA for demo users */}
        {!isLoggedIn && (summary || visualData) && (
          <div className="max-w-6xl mx-auto mt-10 text-center bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-2">Want to save your summaries?</h3>
            <p className="text-gray-400 mb-4">Sign up to save unlimited summaries and access them anytime!</p>
            <a
              href="/signup"
              className="inline-block bg-linear-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold px-8 py-3 rounded-xl transition-all"
            >
              Sign Up Now
            </a>
          </div>
        )}

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