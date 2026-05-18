"use client"

import { Link } from "react-router-dom"
import { Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 text-lg font-bold text-indigo-400 mb-4">
              <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center text-white text-xs">
                VB
              </div>
              VisualBrief
            </div>
            <p className="text-sm text-gray-500">Transform PDFs into visual summaries with AI.</p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-400 hover:text-indigo-400 transition-smooth">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-400 hover:text-indigo-400 transition-smooth">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-400 hover:text-indigo-400 transition-smooth">
                  Security
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-400 hover:text-indigo-400 transition-smooth">
                  Roadmap
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-400 hover:text-indigo-400 transition-smooth">
                  Docs
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-400 hover:text-indigo-400 transition-smooth">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-400 hover:text-indigo-400 transition-smooth">
                  API Ref
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-400 hover:text-indigo-400 transition-smooth">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-indigo-400 transition-smooth">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-indigo-400 transition-smooth">
                  Terms
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-400 hover:text-indigo-400 transition-smooth">
                  Cookies
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-400 hover:text-indigo-400 transition-smooth">
                  DPA
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold mb-4">Stay Updated</h4>
            <p className="text-sm text-gray-400 mb-4">Get the latest updates on new features.</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter email" className="input-field flex-1 text-sm border border-white rounded-lg p-2" />
              <button className="btn-primary p-2">
                <Mail size={18} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-500">© 2025 VisualBrief. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-indigo-400 transition-smooth">
              Twitter
            </a>
            <a href="#" className="text-gray-400 hover:text-indigo-400 transition-smooth">
              LinkedIn
            </a>
            <a href="#" className="text-gray-400 hover:text-indigo-400 transition-smooth">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
