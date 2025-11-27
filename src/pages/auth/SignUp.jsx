// "use client";

// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import AuthLayout from "../../components/AuthLayout";
// import { Mail, Lock, User, Chrome } from "lucide-react";
// import Navbar from "../../components/Navbar";
// import Footer from "../../components/Footer";
// import toast from "react-hot-toast"

// export default function SignUp() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   const newErrors = {};

//   // if (!formData.name) newErrors.name = "Name is required";
//   // if (!formData.email) newErrors.email = "Email is required";
//   // if (!formData.password) newErrors.password = "Password is required";
//   // if (formData.password !== formData.confirmPassword) {
//   //   newErrors.confirmPassword = "Passwords do not match";
//   // }
//   if (!formData.name || !formData.email || !formData.password) {
//       toast.error("All fields are required");
//       return;
//     }

//     if (formData.password !== formData.confirmPassword) {
//       toast.error("Passwords do not match");
//       return;
//     }

//   if (Object.keys(newErrors).length > 0) {
//     setErrors(newErrors);
//     return;
//   }

//   try {
//     // const res = await fetch("http://localhost:8000/api/signup", {
//     const res = await fetch("https://visualbrief.onrender.com/api/signup", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         name: formData.name,
//         email: formData.email,
//         password: formData.password,
//       }),
//     });

//     const data = await res.json();

//     if (!res.ok) {
//         toast.error(data?.detail?.message || "Signup failed");
//         return;
//       }

//       localStorage.setItem("vb_user", JSON.stringify(data.user));
//       toast.success("Signup successful !");
//       navigate("/login");

//   } catch (err) {
//       toast.error("Signup failed. Try again.");
//       console.error(err);
//   }
// };

//   return (
//     <>
//       <Navbar />
//       <AuthLayout
//         title="Create Your Account"
//         subtitle="Join thousands using VisualBrief"
//       >
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Name input */}
//           <div>
//             <label className="block text-sm font-medium mb-2">Full Name</label>
//             <div className="relative">
//               <User size={18} className="absolute left-3 top-3 text-gray-500" />
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="border border-white p-2 rounded-lg input-field pl-10"
//                 placeholder="John Doe"
//               />
//             </div>
//             {errors.name && (
//               <p className="text-red-400 text-sm mt-1">{errors.name}</p>
//             )}
//           </div>

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
//                 className="border border-white p-2 rounded-lg  input-field pl-10"
//                 placeholder="••••••••"
//               />
//             </div>
//             {errors.password && (
//               <p className="text-red-400 text-sm mt-1">{errors.password}</p>
//             )}
//           </div>

//           {/* Confirm password input */}
//           <div>
//             <label className="block text-sm font-medium mb-2">
//               Confirm Password
//             </label>
//             <div className="relative">
//               <Lock size={18} className="absolute left-3 top-3 text-gray-500" />
//               <input
//                 type="password"
//                 name="confirmPassword"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 className="border border-white p-2 rounded-lg  input-field pl-10"
//                 placeholder="••••••••"
//               />
//             </div>
//             {errors.confirmPassword && (
//               <p className="text-red-400 text-sm mt-1">
//                 {errors.confirmPassword}
//               </p>
//             )}
//           </div>

//           {/* Submit button */}
//           <button type="submit" className="btn-primary w-full">
//             Create Account
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

//           {/* Login link */}
//           <p className="text-center text-sm text-gray-400">
//             Already have an account?{" "}
//             <Link
//               to="/login"
//               className="text-indigo-400 hover:text-indigo-300 font-medium"
//             >
//               Sign in
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
import { Mail, Lock, User, Chrome } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import toast from "react-hot-toast";

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      toast.error("All fields are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("https://visualbrief.onrender.com/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Use toast for error message from backend
        toast.error(data?.detail?.message || "Signup failed");
        return;
      }

      localStorage.setItem("vb_user", JSON.stringify(data.user));
      toast.success("Signup successful!");
      navigate("/login");
    } catch (err) {
      toast.error("Signup failed. Try again.");
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />
      <AuthLayout title="Create Your Account" subtitle="Join thousands using VisualBrief">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name input */}
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-3 text-gray-500" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="border border-white p-2 rounded-lg input-field pl-10"
                placeholder="John Doe"
              />
            </div>
          </div>

          {/* Email input */}
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

          {/* Password input */}
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
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Confirm password input */}
          <div>
            <label className="block text-sm font-medium mb-2">Confirm Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-3 text-gray-500" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="border border-white p-2 rounded-lg input-field pl-10"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full">Create Account</button>

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
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
              Sign in
            </Link>
          </p>
        </form>
      </AuthLayout>
      <Footer />
    </>
  );
}
