import { useEffect, useState } from "react";
import { Zap, Loader, FileText, PenTool, RefreshCw } from "lucide-react";
import FileUploadSection from "./File-upload";
import VisualPreview from "./VisualPreview";
import ExportOptions from "./Export-options";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { getToken } from "../lib/mockAPI";
import toast from "react-hot-toast";

const DEMO_CREDITS = 5;
const LOGGED_IN_CREDITS = 10;
const LOCAL_KEY_CREDITS = "vb_demo_credits";
const LOCAL_KEY_TIMESTAMP = "vb_demo_timestamp";
const COOLDOWN_TIME = 1 * 60 * 60 * 1000;
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
  const [visualData, setVisualData] = useState(null);
  const [diagramType, setDiagramType] = useState("flowchart");
  const [diagramCode, setDiagramCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newBriefId, setNewBriefId] = useState(null);
  const [activeTab, setActiveTab] = useState("diagram");

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
      toast.success('Visual Brief saved! Redirecting...');
      setTimeout(onUploadSuccess, 500);
    }
  };

  const handleGenerateBrief = async () => {
    if (!uploadedFile) return;

    if (!consumeCredit()) {
      toast.error('No credits left. Wait for cooldown or sign up for more!');
      return;
    }

    setIsLoading(true);
    setNewBriefId(null);
    setVisualData(null);

    const formData = new FormData();
    formData.append("file", uploadedFile);
    formData.append("diagram_type", diagramType);

    try {
      const currentToken = await getToken();
      const endpoint = `${BACKEND_URL}/generate-diagram`;
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

      setVisualData(data);
      if (data.briefId) {
        setNewBriefId(data.briefId);
      }
      toast.success('Visual Brief generated!');

    } catch (err) {
      refundCredit();
      console.error("Upload failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateCustomBrief = async () => {
    if (!diagramCode.trim()) {
      toast.error('Please enter some text first.');
      return;
    }

    if (!consumeCredit()) {
      toast.error('No credits left. Wait for cooldown or sign up for more!');
      return;
    }

    setIsLoading(true);
    setVisualData(null);

    const formData = new FormData();
    formData.append("text", diagramCode);
    formData.append("diagram_type", diagramType);

    try {
      const currentToken = await getToken();
      const headers = {};
      if (currentToken && !demo) {
        headers['Authorization'] = `Bearer ${currentToken}`;
      }

      const res = await fetch(`${BACKEND_URL}/generate-diagram`, {
        method: "POST",
        headers: headers,
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Generation failed");
      }

      setVisualData(data);
      if (data.briefId) {
        setNewBriefId(data.briefId);
      }
      toast.success('Visual Brief generated!');
    } catch (err) {
      refundCredit();
      console.error("Generation error:", err);
      toast.error(err.message || 'Generation failed.');
    } finally {
      setIsLoading(false);
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
                <option value="er">ER Diagram</option>
                <option value="conceptMap">Concept Map</option>
                <option value="mindMap">Mindmap</option>
              </select>
            </div>

            {uploadedFile && (
              <button
                onClick={handleGenerateBrief}
                disabled={isLoading || disabled}
                className={`mt-6 w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition ${disabled || isLoading ? "bg-gray-700 cursor-not-allowed" : "bg-linear-to-br from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"}`}
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" /> Generate Visual Brief
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
                <option value="er">ER Diagram</option>
                <option value="conceptMap">Concept Map</option>
                <option value="mindMap">Mindmap</option>
              </select>
            </div>

            <textarea
              value={diagramCode}
              onChange={(e) => setDiagramCode(e.target.value)}
              className="w-full h-48 bg-gray-800 text-white p-3 rounded-lg border border-gray-700 resize-none font-mono focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="Write your steps or process description..."
            />

            <button
              onClick={handleGenerateCustomBrief}
              disabled={isLoading || disabled}
              className={`mt-4 w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition ${disabled || isLoading ? "bg-gray-700 cursor-not-allowed" : "bg-linear-to-br from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"}`}
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

        {/* OUTPUT SECTION */}
        {visualData && visualData.success === false && (
          <div className="max-w-6xl mx-auto bg-amber-500/10 border border-amber-500/30 p-8 rounded-2xl mb-10 text-center shadow-2xl">
            <h3 className="text-amber-400 font-bold text-xl mb-3 flex items-center justify-center gap-2">
              Confidence Warning
            </h3>
            <p className="text-slate-300 text-lg">{visualData.error}</p>
            {visualData.suggested_type && (
              <div className="mt-6 p-4 bg-gray-900/50 rounded-xl inline-block border border-gray-800">
                <p className="text-slate-400 text-sm">
                  Suggested Format: <span className="font-mono text-indigo-400 font-bold px-2 py-1 bg-indigo-500/10 rounded">{visualData.suggested_type}</span>
                </p>
              </div>
            )}
          </div>
        )}

        {visualData && visualData.success !== false && (
          <div className="max-w-6xl mx-auto flex flex-col gap-8">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-4 mb-6 border-b border-gray-800 pb-4">
                {["diagram", "steps", "logic"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === tab
                      ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                      } capitalize`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {activeTab === "diagram" && (
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg">
                  <h2 className="text-xl font-semibold text-white mb-3">Diagram Preview</h2>
                  <VisualPreview diagramData={visualData} />
                </div>
              )}

              {activeTab === "steps" && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white mb-4">Step-by-Step Explanation</h3>
                  {visualData.steps?.map((step, i) => (
                    <div key={i} className="flex gap-4 p-4 bg-gray-950/50 rounded-xl border border-gray-800">
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
                  <div className="bg-gray-950 p-6 rounded-xl border border-gray-800 font-mono">
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
          </div>
        )}

        {/* SAVE AND EXIT BUTTON Only for logged in users */}
        {newBriefId && isLoggedIn && (
          <div className="max-w-6xl mx-auto mt-10 text-center">
            <button
              onClick={handleSaveAndExit}
              className="bg-linear-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold px-8 py-3 rounded-xl transition-all transform hover:scale-105"
            >
              Go to Dashboard and View All Visual Briefs
            </button>
          </div>
        )}

        {/* Sign up CTA for demo users */}
        {!isLoggedIn && visualData && (
          <div className="max-w-6xl mx-auto mt-10 text-center bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-2">Want to save your Visual Briefs?</h3>
            <p className="text-gray-400 mb-4">Sign up to save unlimited Visual Briefs and access them anytime!</p>
            <a
              href="/signup"
              className="inline-block bg-linear-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold px-8 py-3 rounded-xl transition-all"
            >
              Sign Up Now
            </a>
          </div>
        )}

        {visualData ? (
          <div className="max-w-6xl mx-auto mt-10">
            <ExportOptions fileName={uploadedFile?.name || "visual_brief"} />
          </div>
        ) : null}
      </div>

      <Footer />
    </>
  );
}