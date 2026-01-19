import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
// const API_BASE_URL = "http://localhost:8000"
const API_BASE_URL = "https://visualbrief.onrender.com";
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const accessToken = localStorage.getItem("access_token");
  const isLoggedIn = !!accessToken;

  useEffect(() => {
    const fetchUserData = async () => {
      const cachedUser = localStorage.getItem("vb_user");
      if (cachedUser) {
        setUser(JSON.parse(cachedUser));
        return;
      }

      if (isLoggedIn && !cachedUser) {
        try {
          const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const userData = await response.json();
            localStorage.setItem("vb_user", JSON.stringify(userData));
            setUser(userData);
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };

    fetchUserData();
  }, [isLoggedIn, accessToken]);

  const getInitial = () => {
    if (user?.name && user.name.trim()) {
      return user.name.trim().charAt(0).toUpperCase();
    }
    if (user?.email && user.email.trim()) {
      return user.email.trim().charAt(0).toUpperCase();
    }
    return "U";
  };

  const initial = getInitial();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (token) {
        await fetch(`${API_BASE_URL}/api/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }).catch((err) => console.warn("Backend logout failed:", err));
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("vb_session");
      localStorage.removeItem("vb_user");
      setOpenUserMenu(false);
      navigate("/login");
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold text-indigo-400"
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            VB
          </div>
          VisualBrief
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="/#features"
            className="text-gray-300 hover:text-indigo-400 transition-smooth"
          >
            Features
          </a>
          {/* <a
            href="/#pricing"
            className="text-gray-300 hover:text-indigo-400 transition-smooth"
          >
            Pricing
          </a> */}
          <Link
            to="/blog"
            className="text-gray-300 hover:text-indigo-400 transition-smooth"
          >
            Blog
          </Link>
          <Link
            to="/contact"
            className="text-gray-300 hover:text-indigo-400 transition-smooth"
          >
            Contact
          </Link>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setOpenUserMenu(!openUserMenu)}
                className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold hover:bg-indigo-700 transition-colors"
              >
                {initial}
              </button>

              {openUserMenu && (
                <div className="absolute right-0 mt-2 w-44 bg-gray-900 border border-gray-800 rounded-lg shadow-xl">
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-t-lg"
                    onClick={() => setOpenUserMenu(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white"
                    onClick={() => setOpenUserMenu(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-800 hover:text-red-300 rounded-b-lg"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden sm:block text-gray-300 hover:text-indigo-400 transition-smooth"
              >
                Login
              </Link>
              <Link to="/signup" className="hidden sm:block btn-primary">
                Get Started
              </Link>
            </>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-gray-800 rounded-lg text-gray-300"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-950 border-t border-gray-800">
          <div className="flex flex-col px-4 py-4 gap-4">
            <Link
              to="/#features"
              className="text-gray-300 hover:text-indigo-400"
              onClick={() => setIsOpen(false)}
            >
              Features
            </Link>
            <Link
              to="/#pricing"
              className="text-gray-300 hover:text-indigo-400"
              onClick={() => setIsOpen(false)}
            >
              Pricing
            </Link>
            <Link
              to="/blog"
              className="text-gray-300 hover:text-indigo-400"
              onClick={() => setIsOpen(false)}
            >
              Blog
            </Link>
            <Link
              to="/contact"
              className="text-gray-300 hover:text-indigo-400"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-300 hover:text-indigo-400"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/settings"
                  className="text-gray-300 hover:text-indigo-400"
                  onClick={() => setIsOpen(false)}
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="text-red-400 hover:text-red-300 text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-indigo-400"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
