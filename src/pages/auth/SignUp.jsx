import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/AuthLayout";
import { Mail, Lock, User, Chrome } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import toast from "react-hot-toast";
import { supabase } from "../../lib/supabaseClient";

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [submitted, setSubmitted] = useState(false);

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
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { full_name: formData.name },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      if (data.user && data.session) {
        // User is auto-confirmed or confirmation disabled
        // Create public user record
        const { error: dbError } = await supabase
          .from("users")
          .upsert({
            id: data.user.id,
            email: formData.email,
            name: formData.name,
            role: "free",
            credits: 5,
          }, { onConflict: 'id', ignoreDuplicates: true });

        if (dbError) console.warn("DB Insert warning:", dbError);

        toast.success("Signup successful!");
        navigate("/dashboard");
      } else if (data.user && !data.session) {
        // Confirmation email sent
        setSubmitted(true);
        toast.success("Please check your email to confirm your account.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Signup failed. Try again.");
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
    } catch (err) {
      toast.error("Google authentication failed");
    }
  };

  if (submitted) {
    return (
      <AuthLayout title="Check Your Email" subtitle={`We sent a confirmation link to ${formData.email}`}>
        <div className="text-center space-y-6">
          <div className="bg-indigo-500/10 p-4 rounded-lg border border-indigo-500/20">
            <p className="text-gray-300">
              Click the link in the email to activate your account.
              If you don't see it, check your spam folder.
            </p>
          </div>
          <button
            onClick={() => setSubmitted(false)}
            className="text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Back to Sign Up
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <>
      <Navbar />
      <AuthLayout title="Create Your Account" subtitle="Join thousands using VisualBrief">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
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

          {/* Email */}
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

          {/* Password */}
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

          {/* Confirm Password */}
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

          <button
            type="button"
            onClick={handleGoogleAuth}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
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