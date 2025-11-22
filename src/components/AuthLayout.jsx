"use client"

import { Link } from "react-router-dom"
import { motion } from "framer-motion"

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
            VB
          </div>
          <span className="text-2xl font-bold text-indigo-400">VisualBrief</span>
        </Link>

        {/* Content */}
        <div className="card">
          <h1 className="text-2xl font-bold mb-2">{title}</h1>
          <p className="text-gray-400 mb-8">{subtitle}</p>

          {children}
        </div>
      </motion.div>
    </div>
  )
}
