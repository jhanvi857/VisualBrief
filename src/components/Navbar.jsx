// import { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Menu, X } from "lucide-react";
// import { useTheme } from "../hooks/useTheme";

// export default function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const navigate = useNavigate();
//   const { theme, toggleTheme } = useTheme();

//   useEffect(() => {
//     setIsLoggedIn(!!localStorage.getItem("vb_session"));
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("vb_session");
//     setIsLoggedIn(false);
//     navigate("/");
//   };

//   return (
//     <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
//       <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

//         {/* Logo */}
//         <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-indigo-400">
//           <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">VB</div>
//           VisualBrief
//         </Link>

//         {/* Desktop Menu */}
//         <div className="hidden md:flex items-center gap-8">
//           <a href="/#features" className="text-gray-300 hover:text-indigo-400 transition-smooth">Features</a>
//           <a href="/#pricing" className="text-gray-300 hover:text-indigo-400 transition-smooth">Pricing</a>
//           <a href="/blog" className="text-gray-300 hover:text-indigo-400 transition-smooth">Blog</a>
//           <a href="/contact" className="text-gray-300 hover:text-indigo-400 transition-smooth">Contact</a>
//         </div>

//         <div className="flex items-center gap-4">
//           {/* Conditional Buttons */}
//           {!isLoggedIn ? (
//             <>
//               <Link to="/login" className="hidden sm:block text-gray-300 hover:text-indigo-400 transition-smooth">
//                 Login
//               </Link>
//               <Link to="/signup" className="hidden sm:block btn-primary">
//                 Get Started
//               </Link>
//             </>
//           ) : (
//             <>
//               <Link to="/dashboard" className="hidden sm:block text-gray-300 hover:text-indigo-400 transition-smooth">
//                 Dashboard
//               </Link>
//               <button
//                 onClick={handleLogout}
//                 className="hidden sm:block text-red-400 hover:text-red-300 transition-smooth"
//               >
//                 Logout
//               </button>
//             </>
//           )}

//           {/* Mobile menu button */}
//           <button
//             onClick={() => setIsOpen(!isOpen)}
//             className="md:hidden p-2 hover:bg-gray-800 rounded-lg"
//           >
//             {isOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {isOpen && (
//         <div className="md:hidden bg-gray-900 border-t border-gray-800">
//           <div className="flex flex-col gap-4 p-4">

//             <a href="/#features" className="text-gray-300 hover:text-indigo-400 py-2">Features</a>
//             <a href="/#pricing" className="text-gray-300 hover:text-indigo-400 py-2">Pricing</a>
//             <a href="/blog" className="text-gray-300 hover:text-indigo-400 py-2">Blog</a>
//             <a href="/contact" className="text-gray-300 hover:text-indigo-400 py-2">Contact</a>

//             {!isLoggedIn ? (
//               <>
//                 <Link to="/login" className="btn-secondary w-full text-center">Login</Link>
//                 <Link to="/signup" className="btn-primary w-full text-center">Get Started</Link>
//               </>
//             ) : (
//               <>
//                 <Link to="/dashboard" className="btn-secondary w-full text-center">Dashboard</Link>
//                 <button
//                   onClick={handleLogout}
//                   className="btn-primary w-full text-center"
//                 >
//                   Logout
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// }
"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useTheme } from "../hooks/useTheme"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [openUserMenu, setOpenUserMenu] = useState(false)

  const { theme, toggleTheme } = useTheme()
  const session = localStorage.getItem("vb_session")
  const isLoggedIn = !!session

  // get user initials
  const user = JSON.parse(localStorage.getItem("vb_user") || "{}")
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U"

  const logout = () => {
    localStorage.removeItem("vb_session")
    localStorage.removeItem("vb_user")
    window.location.reload()
  }

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
          <a href="/#features" className="text-gray-300 hover:text-indigo-400 transition-smooth">Features</a>
          <a href="/#pricing" className="text-gray-300 hover:text-indigo-400 transition-smooth">Pricing</a>
          <a href="/blog" className="text-gray-300 hover:text-indigo-400 transition-smooth">Blog</a>
          <a href="/contact" className="text-gray-300 hover:text-indigo-400 transition-smooth">Contact</a>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4">

          {/* ▼ User avatar dropdown (when logged in) */}
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setOpenUserMenu(!openUserMenu)}
                className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold"
              >
                {initial}
              </button>

              {openUserMenu && (
                <div className="absolute right-0 mt-2 w-44 bg-gray-900 border border-gray-800 rounded-lg shadow-xl">
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-800 hover:text-red-300"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* When NOT logged in */}
              <Link to="/login" className="hidden sm:block text-gray-300 hover:text-indigo-400 transition-smooth">
                Login
              </Link>
              <Link to="/signup" className="hidden sm:block btn-primary">Get Started</Link>
            </>
          )}

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
    </nav>
  )
}
