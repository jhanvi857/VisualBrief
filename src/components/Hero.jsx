import { Link } from "react-router-dom";
import { ArrowRight, FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  const isLoggedIn = !!localStorage.getItem("access_token");
  
  return (
    <section className="py-20 px-4 bg-linear-to-b from-gray-950 via-gray-900 to-gray-950">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-block mb-6 px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full">
            <p className="text-indigo-400 text-sm font-medium">
              Convert PDFs into Visual Intelligence
            </p>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
            Transform Long PDFs into{" "}
            <span className="text-indigo-400">Visual Summaries & Diagrams</span>
          </h1>

          <p className="text-xl text-gray-400 mb-8 text-balance">
            Go beyond summaries. Instantly generate diagrams, flowcharts, ER
            diagrams, and structured visual representations. All automatically
            from your PDF.
          </p>

          {/* Feature bullets */}
          <div className="grid md:grid-cols-3 gap-4 my-10 text-sm text-gray-400">
            <div className="flex items-center justify-center gap-2">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
              AI-powered PDF summaries
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
              Auto-generated diagrams (Flow, ER, UML)
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
              Export & share instantly
            </div>
          </div>

          {/*  Hidden for logged in users */}
          {!isLoggedIn && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="btn-primary inline-flex items-center justify-center gap-2"
              >
                Get Started Free
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/viewDemo"
                className="btn-outline inline-flex items-center justify-center gap-2"
              >
                <FileText size={18} />
                View Demo
              </Link>
            </div>
          )}
          
          {/* Show dashbord button for logged in users */}
          {isLoggedIn && (
            <div className="flex justify-center">
              <Link
                to="/dashboard"
                className="btn-primary inline-flex items-center justify-center gap-2"
              >
                Go to Dashboard
                <ArrowRight size={18} />
              </Link>
            </div>
          )}
        </motion.div>

        {/* Hero illustration */}
        <motion.div
          className="mt-16 relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="absolute inset-0 bg-linear-to-r from-indigo-600/20 to-purple-600/20 blur-3xl rounded-full" />
          <div className="relative bg-gray-800 border border-gray-700 rounded-2xl h-80 flex items-center justify-center overflow-hidden">
            <div className="text-center w-full h-full group hover:scale-105 transition-transform duration-500">
              <img
                src="/VisualBriefHome.jpg"
                alt="VisualBrief Preview"
                className="group-hover:scale-105 transition-transform duration-500 w-full h-full object-cover rounded-2xl"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}