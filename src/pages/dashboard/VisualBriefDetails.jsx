import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Download, RefreshCw, Edit2, Share2, ArrowLeft, FileText } from "lucide-react"
import MermaidRenderer from "../../components/MermaidRenderer"
// const BASE_URL = "http://localhost:8000/api";
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;
const getToken = () => localStorage.getItem('access_token');

export default function VisualBriefDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [brief, setBrief] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const userToken = getToken();
        if (!userToken) {
            console.warn("No token found. Redirecting to login.");
            navigate("/login");
            return;
        }

        const fetchBrief = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`${BASE_URL}/briefs/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status === 401 || response.status === 403) {
                    console.error("Authentication failed during fetch. Redirecting.");
                    localStorage.removeItem('access_token');
                    navigate("/login");
                    return;
                }

                if (response.status === 404) {
                    setBrief(null);
                    setLoading(false);
                    return;
                }

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setBrief(data);

            } catch (err) {
                console.error("Error fetching brief:", err);
                setError("Failed to load brief details. Check server connection.");
            } finally {
                setLoading(false);
            }
        }

        fetchBrief();
    }, [id, navigate])

    const getBriefContent = () => {
        if (!brief) return { bullets: [], keyQuotes: [], paragraphs: [], text: null };

        const content = brief.brief_content;

        if (content && typeof content === 'object') {
            return {
                bullets: Array.isArray(content.bullets) ? content.bullets : [],
                keyQuotes: Array.isArray(content.keyQuotes) ? content.keyQuotes : [],
                paragraphs: Array.isArray(content.paragraphs) ? content.paragraphs : [],
                text: content.text || content.content || null,
            };
        }

        if (typeof content === 'string') {
            try {
                const parsed = JSON.parse(content);
                return {
                    bullets: Array.isArray(parsed.bullets) ? parsed.bullets : [],
                    keyQuotes: Array.isArray(parsed.keyQuotes) ? parsed.keyQuotes : [],
                    paragraphs: Array.isArray(parsed.paragraphs) ? parsed.paragraphs : [],
                    text: parsed.text || parsed.content || null,
                };
            } catch (e) {
                return {
                    bullets: [],
                    keyQuotes: [],
                    paragraphs: [],
                    text: content,
                };
            }
        }

        return { bullets: [], keyQuotes: [], paragraphs: [], text: null };
    };

    const briefContent = getBriefContent();

    if (loading) {
        return (
            <div className="flex h-screen bg-gray-950">
                <div className="flex-1 flex flex-col">
                    <main className="flex-1 p-8 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-gray-400">Loading visual brief...</p>
                        </div>
                    </main>
                </div>
            </div>
        )
    }

    if (!brief || error) {
        return (
            <div className="flex h-screen bg-gray-950">
                <div className="flex-1 flex flex-col">
                    <main className="flex-1 p-8 flex items-center justify-center">
                        <div className="text-center">
                            <FileText size={48} className="mx-auto text-gray-700 mb-4 opacity-50" />
                            <p className="text-gray-400">{error || "Visual brief not found or access denied."}</p>
                            <button
                                onClick={() => navigate("/dashboard")}
                                className="mt-4 text-indigo-400 hover:text-indigo-300 flex items-center justify-center mx-auto transition-colors"
                            >
                                <ArrowLeft size={16} className="mr-1" /> Go back to Dashboard
                            </button>
                        </div>
                    </main>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-screen bg-gray-950">
            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-auto p-8 text-white">
                    <div className="max-w-4xl mx-auto">
                        {/* Header Section */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => navigate("/dashboard")}
                                    className="p-2 hover:bg-gray-800 rounded-lg transition-all text-gray-300"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                                <div>
                                    <h1 className="text-3xl font-bold">
                                        {brief.file_name || "Untitled Brief"}
                                    </h1>
                                    <p className="text-gray-400">
                                        {brief.created_at
                                            ? new Date(brief.created_at).toLocaleDateString()
                                            : "Date unknown"
                                        }
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 text-gray-300">
                                <button
                                    className="p-2 hover:bg-gray-800 rounded-lg hover:text-white transition-colors"
                                    title="Share"
                                >
                                    <Share2 size={20} />
                                </button>
                                <button
                                    className="p-2 hover:bg-gray-800 rounded-lg hover:text-white transition-colors"
                                    title="Edit"
                                >
                                    <Edit2 size={20} />
                                </button>
                                <button
                                    className="p-2 hover:bg-gray-800 rounded-lg hover:text-white transition-colors"
                                    title="Regenerate"
                                >
                                    <RefreshCw size={20} />
                                </button>
                                <button
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg p-2 transition-colors"
                                    title="Download"
                                >
                                    <Download size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="space-y-6">
                            {/* Stats Cards */}
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="bg-gray-800 p-4 rounded-xl">
                                    <p className="text-gray-400 text-sm mb-1">File</p>
                                    <p className="font-bold truncate text-gray-200">
                                        {brief.file_name || "N/A"}
                                    </p>
                                </div>
                                <div className="bg-gray-800 p-4 rounded-xl">
                                    <p className="text-gray-400 text-sm mb-1">Brief Type</p>
                                    <p className="font-bold capitalize text-gray-200">
                                        {brief.brief_type
                                            ? brief.brief_type.replace(/[-_]/g, " ")
                                            : "Standard"
                                        }
                                    </p>
                                </div>
                                <div className="bg-gray-800 p-4 rounded-xl">
                                    <p className="text-gray-400 text-sm mb-1">Created</p>
                                    <p className="font-bold text-gray-200">
                                        {brief.created_at
                                            ? new Date(brief.created_at).toLocaleDateString()
                                            : "N/A"
                                        }
                                    </p>
                                </div>
                            </div>

                            {/* Diagram Section */}
                            {brief.diagram_content?.mermaid && (
                                <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                                    <h2 className="text-xl font-bold mb-4 text-white">Visual Flow</h2>
                                    <div className="bg-white rounded-lg p-4 overflow-hidden">
                                        <MermaidRenderer chart={brief.diagram_content.mermaid} />
                                    </div>
                                </div>
                            )}

                            {/* Brief Content Section. Handles Multiple Formats */}
                            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                                <h2 className="text-xl font-bold mb-4 text-white">Logic & Details</h2>

                                {/* plain test-para */}
                                {briefContent.text && (
                                    <div className="prose prose-invert max-w-none">
                                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                                            {briefContent.text}
                                        </p>
                                    </div>
                                )}

                                {/* para arr. */}
                                {briefContent.paragraphs.length > 0 && (
                                    <div className="space-y-4">
                                        {briefContent.paragraphs.map((para, idx) => (
                                            <p key={idx} className="text-gray-300 leading-relaxed">
                                                {para}
                                            </p>
                                        ))}
                                    </div>
                                )}

                                {/* bullet points.*/}
                                {briefContent.bullets.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold mb-3 text-white">Key Insights</h3>
                                        <ul className="space-y-3">
                                            {briefContent.bullets.map((bullet, idx) => (
                                                <li key={idx} className="flex gap-3">
                                                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 shrink-0" />
                                                    <span className="text-gray-300">{bullet}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* fallback*/}
                                {!briefContent.text &&
                                    briefContent.bullets.length === 0 &&
                                    briefContent.paragraphs.length === 0 && (
                                        <p className="text-gray-400 italic">No additional content available.</p>
                                    )}
                            </div>
                            {/* quotes */}
                            {briefContent.keyQuotes.length > 0 && (
                                <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                                    <h2 className="text-xl font-bold mb-4 text-white">Key Quotes</h2>
                                    <div className="space-y-4">
                                        {briefContent.keyQuotes.map((quote, idx) => (
                                            <div
                                                key={idx}
                                                className="pl-4 border-l-4 border-indigo-500"
                                            >
                                                <p className="italic text-gray-300">"{quote}"</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Export Options */}
                            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                                <h3 className="font-bold mb-4 text-white">Export Options</h3>
                                <div className="flex flex-wrap gap-3">
                                    <button className="border border-indigo-500 text-indigo-400 hover:bg-indigo-900 px-4 py-2 rounded-lg transition-colors">
                                        Export as PDF
                                    </button>
                                    <button className="border border-indigo-500 text-indigo-400 hover:bg-indigo-900 px-4 py-2 rounded-lg transition-colors">
                                        Export as Markdown
                                    </button>
                                    <button className="border border-indigo-500 text-indigo-400 hover:bg-indigo-900 px-4 py-2 rounded-lg transition-colors">
                                        Export as PNG
                                    </button>
                                    <button className="border border-indigo-500 text-indigo-400 hover:bg-indigo-900 px-4 py-2 rounded-lg transition-colors">
                                        Copy to Clipboard
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}