"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useTheme } from "../hooks/useTheme"
import { Menu, X, Sun, Moon } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-indigo-400">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">VB</div>
          VisualBrief
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <a href="/#features" className="text-gray-300 hover:text-indigo-400 transition-smooth">
            Features
          </a>
          <a href="/#pricing" className="text-gray-300 hover:text-indigo-400 transition-smooth">
            Pricing
          </a>
          <a href="/" className="text-gray-300 hover:text-indigo-400 transition-smooth">
            Docs
          </a>
          <a href="/" className="text-gray-300 hover:text-indigo-400 transition-smooth">
            Blog
          </a>
          <a href="/" className="text-gray-300 hover:text-indigo-400 transition-smooth">
            Contact
          </a>
        </div>
        <div className="flex items-center gap-4">
          {/* Theme toggle */}
          {/* <button
            onClick={toggleTheme}
            className="p-2 hover:bg-gray-800 rounded-lg transition-smooth"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun size={20} className="text-gray-400" />
            ) : (
              <Moon size={20} className="text-gray-600" />
            )}
          </button> */}
          <Link to="/login" className="hidden sm:block text-gray-300 hover:text-indigo-400 transition-smooth">
            Login
          </Link>
          <Link to="/signup" className="hidden sm:block btn-primary">
            Get Started
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-gray-800 rounded-lg"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800">
          <div className="flex flex-col gap-4 p-4">
            <Link to="/" className="text-gray-300 hover:text-indigo-400 py-2">
              Features
            </Link>
            <Link to="/#pricing" className="text-gray-300 hover:text-indigo-400 py-2">
              Pricing
            </Link>
            <Link to="/" className="text-gray-300 hover:text-indigo-400 py-2">
              Docs
            </Link>
            <Link to="/" className="text-gray-300 hover:text-indigo-400 py-2">
              Blog
            </Link>
            <Link to="/" className="text-gray-300 hover:text-indigo-400 py-2">
              Contact
            </Link>
            <Link to="/login" className="btn-secondary w-full text-center">
              Login
            </Link>
            <Link to="/signup" className="btn-primary w-full text-center">
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
