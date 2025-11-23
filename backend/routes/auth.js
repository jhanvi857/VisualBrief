const express = require("express");
const supabase  = require("../supabaseClient");
const router = express.Router();

// signup route.
router.post("/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) return res.status(400).json({ error: "Missing fields" });

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (authError) return res.status(400).json({ error: authError.message });

    const { error: dbError } = await supabase.from("users").insert([
      {
        id: authData.user.id,
        name,
        email,
        role: "free",
        credits: 5,
      },
    ]);
    if (dbError) return res.status(500).json({ error: dbError.message });

    res.status(201).json({ user: authData.user });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// login route.
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return res.status(400).json({ error: error.message });

    res.json({ user: data.user, session: data.session });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// logout route.
router.post("/logout", async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
