import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Download, RefreshCw, Edit2, Share2, ArrowLeft, FileText } from "lucide-react"
// const BASE_URL = "http://localhost:8000/api"; 
const BASE_URL = "https://visualbrief.onrender.com/api";
const getToken = () => localStorage.getItem('access_token');

export default function SummaryDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [summary, setSummary] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const userToken = getToken();
        if (!userToken) {
            console.warn("No token found. Redirecting to login.");
            navigate("/login");
            return;
        }

        const fetchSummary = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`${BASE_URL}/summaries/${id}`, {
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
                    setSummary(null);
                    setLoading(false);
                    return;
                }

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                // console.log("📥 Fetched summary data:", data); // Debug log
                setSummary(data);

            } catch (err) {
                console.error("Error fetching summary:", err);
                setError("Failed to load summary details. Check server connection.");
            } finally {
                setLoading(false);
            }
        }

        fetchSummary();
    }, [id, navigate])

    const getSummaryContent = () => {
        if (!summary) return { bullets: [], keyQuotes: [], paragraphs: [], text: null };

        const content = summary.summary_content;

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
                console.log("Treating summary_content as plain text paragraph");
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

    const summaryContent = getSummaryContent();

    if (loading) {
        return (
            <div className="flex h-screen bg-gray-950">
                <div className="flex-1 flex flex-col">
                    <main className="flex-1 p-8 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-gray-400">Loading summary...</p>
                        </div>
                    </main>
                </div>
            </div>
        )
    }

    if (!summary || error) {
        return (
            <div className="flex h-screen bg-gray-950">
                <div className="flex-1 flex flex-col">
                    <main className="flex-1 p-8 flex items-center justify-center">
                        <div className="text-center">
                            <FileText size={48} className="mx-auto text-gray-700 mb-4 opacity-50" />
                            <p className="text-gray-400">{error || "Summary not found or access denied."}</p>
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
                                        {summary.file_name || "Untitled Summary"}
                                    </h1>
                                    <p className="text-gray-400">
                                        {summary.created_at
                                            ? new Date(summary.created_at).toLocaleDateString()
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
                                        {summary.file_name || "N/A"}
                                    </p>
                                </div>
                                <div className="bg-gray-800 p-4 rounded-xl">
                                    <p className="text-gray-400 text-sm mb-1">Summary Type</p>
                                    <p className="font-bold capitalize text-gray-200">
                                        {summary.summary_type
                                            ? summary.summary_type.replace(/[-_]/g, " ")
                                            : "Standard"
                                        }
                                    </p>
                                </div>
                                <div className="bg-gray-800 p-4 rounded-xl">
                                    <p className="text-gray-400 text-sm mb-1">Created</p>
                                    <p className="font-bold text-gray-200">
                                        {summary.created_at
                                            ? new Date(summary.created_at).toLocaleDateString()
                                            : "N/A"
                                        }
                                    </p>
                                </div>
                            </div>

                            {/* Summary Content Section. Handles Multiple Formats */}
                            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                                <h2 className="text-xl font-bold mb-4 text-white">Summary</h2>

                                {/* plain test-para */}
                                {summaryContent.text && (
                                    <div className="prose prose-invert max-w-none">
                                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                                            {summaryContent.text}
                                        </p>
                                    </div>
                                )}

                                {/* para arr. */}
                                {summaryContent.paragraphs.length > 0 && (
                                    <div className="space-y-4">
                                        {summaryContent.paragraphs.map((para, idx) => (
                                            <p key={idx} className="text-gray-300 leading-relaxed">
                                                {para}
                                            </p>
                                        ))}
                                    </div>
                                )}

                                {/* bullet points.*/}
                                {summaryContent.bullets.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold mb-3 text-white">Key Points</h3>
                                        <ul className="space-y-3">
                                            {summaryContent.bullets.map((bullet, idx) => (
                                                <li key={idx} className="flex gap-3">
                                                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 shrink-0" />
                                                    <span className="text-gray-300">{bullet}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* fallback*/}
                                {!summaryContent.text &&
                                    summaryContent.bullets.length === 0 &&
                                    summaryContent.paragraphs.length === 0 && (
                                        <p className="text-gray-400 italic">No summary content available.</p>
                                    )}
                            </div>
                            {/* quotes */}
                            {summaryContent.keyQuotes.length > 0 && (
                                <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                                    <h2 className="text-xl font-bold mb-4 text-white">Key Quotes</h2>
                                    <div className="space-y-4">
                                        {summaryContent.keyQuotes.map((quote, idx) => (
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