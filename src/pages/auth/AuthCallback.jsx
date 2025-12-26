import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import toast from "react-hot-toast";

// const API_BASE_URL = "https://visualbrief.onrender.com";
const API_BASE_URL = "http://localhost:8000";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // ✅ Get the current session (v2 SDK)
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error || !session) throw new Error("Authentication failed");

        const user = session.user;
        const email = user.email;
        const name = user.user_metadata?.full_name || email;

        const res = await fetch(`${API_BASE_URL}/api/google-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, name }),
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.detail || "Backend login failed");

        localStorage.setItem("access_token", result.access_token);
        localStorage.setItem("vb_user", JSON.stringify(result.user));

        toast.success("Logged in successfully!");
        navigate("/dashboard");
      } catch (err) {
        console.error(err);
        toast.error("Authentication failed");
        navigate("/login");
      }
    };

    handleCallback();
  }, [navigate]);

  return <p className="text-center mt-10">Signing you in…</p>;
}
