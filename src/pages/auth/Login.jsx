// "use client";

// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import AuthLayout from "../../components/AuthLayout";
// import { Mail, Lock, Chrome, ArrowRight } from "lucide-react";
// import Navbar from "../../components/Navbar";
// import Footer from "../../components/Footer";
// import toast from "react-hot-toast";
// export default function Login() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const newErrors = {};

//     // if (!formData.email) newErrors.email = "Email is required";
//     // if (!formData.password) newErrors.password = "Password is required";
//     if (!formData.email || !formData.password) {
//       toast.error("Email and password are required");
//       return;
//     }

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     try {
//       const res = await fetch("http://localhost:8000/api/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email:formData.email,
//           password:formData.password
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         toast.error(data?.detail?.message || "Login failed");
//         return;
//       }
//       localStorage.setItem("vb_session", JSON.stringify(data.session));
//       toast.success("Login successful!");
//       navigate("/dashboard");

//     } catch (err) {
//       console.error(err);
//       toast.error("Login failed. Try again.");
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <AuthLayout title="Welcome Back" subtitle="Sign in to your account">
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Email input */}
//           <div>
//             <label className="block text-sm font-medium mb-2">
//               Email Address
//             </label>
//             <div className="relative">
//               <Mail size={18} className="absolute left-3 top-3 text-gray-500" />
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="border border-white p-2 rounded-lg input-field pl-10"
//                 placeholder="you@example.com"
//               />
//             </div>
//             {errors.email && (
//               <p className="text-red-400 text-sm mt-1">{errors.email}</p>
//             )}
//           </div>

//           {/* Password input */}
//           <div>
//             <label className="block text-sm font-medium mb-2">Password</label>
//             <div className="relative">
//               <Lock size={18} className="absolute left-3 top-3 text-gray-500" />
//               <input
//                 type="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="border border-white p-2 rounded-lg input-field pl-10"
//                 placeholder="******"
//               />
//             </div>
//             {errors.password && (
//               <p className="text-red-400 text-sm mt-1">{errors.password}</p>
//             )}
//           </div>

//           {/* Remember me & Forgot password */}
//           <div className="flex items-center justify-between text-sm">
//             <label className="flex items-center gap-2 cursor-pointer">
//               <input
//                 type="checkbox"
//                 className="w-4 h-4 rounded border-gray-600"
//               />
//               <span className="text-gray-400">Remember me</span>
//             </label>
//             <Link
//               to="/forgot-password"
//               className="text-indigo-400 hover:text-indigo-300"
//             >
//               Forgot password?
//             </Link>
//           </div>

//           {/* Submit button */}
//           <button
//             type="submit"
//             className="btn-primary w-full flex items-center justify-center gap-2"
//           >
//             Sign In
//             <ArrowRight size={18} />
//           </button>

//           {/* Divider */}
//           <div className="relative my-6">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-700" />
//             </div>
//             <div className="relative flex justify-center text-sm">
//               <span className="px-2 bg-gray-900 text-gray-400">
//                 Or continue with
//               </span>
//             </div>
//           </div>

//           {/* OAuth button */}
//           <button
//             type="button"
//             className="btn-secondary w-full flex items-center justify-center gap-2"
//           >
//             <Chrome size={18} />
//             Google
//           </button>

//           {/* Signup link */}
//           <p className="text-center text-sm text-gray-400">
//             Don't have an account?{" "}
//             <Link
//               to="/signup"
//               className="text-indigo-400 hover:text-indigo-300 font-medium"
//             >
//               Create one
//             </Link>
//           </p>
//         </form>
//       </AuthLayout>
//       <Footer />
//     </>
//   );
// }
"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/AuthLayout";
import { Mail, Lock, Chrome, ArrowRight } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Email and password are required");
      return;
    }

    try {
      // const res = await fetch("https://visualbrief.onrender.com/api/login", {
      const res = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.detail?.message || "Login failed");
        return;
      }

      localStorage.setItem("vb_session", JSON.stringify(data));
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Login failed. Try again.");
    }
  };

  return (
    <>
      <Navbar />
      <AuthLayout title="Welcome Back" subtitle="Sign in to your account">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-3 text-gray-500" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="border border-white p-2 rounded-lg input-field pl-10"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-3 text-gray-500" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="border border-white p-2 rounded-lg input-field pl-10"
                placeholder="******"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-600" />
              <span className="text-gray-400">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-indigo-400 hover:text-indigo-300">Forgot password?</Link>
          </div>

          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
            Sign In <ArrowRight size={18} />
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
            </div>
          </div>

          <button type="button" className="btn-secondary w-full flex items-center justify-center gap-2">
            <Chrome size={18} /> Google
          </button>

          <p className="text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium">Create one</Link>
          </p>
        </form>
      </AuthLayout>
      <Footer />
    </>
  );
}
