import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const API_BASE_URL = "http://localhost:8000";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error || !session) throw new Error("Authentication failed");

        const user = session.user;

        const { error: dbError } = await supabase
          .from("users")
          .upsert({
            id: user.id,
            email: user.email,
            name: user.user_metadata?.full_name || user.email,
            role: "free",
          }, { onConflict: 'id', ignoreDuplicates: true });

        if (dbError) {
          console.error("Profile creation error", dbError);
        }

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
