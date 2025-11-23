// require("dotenv").config();
// const { createClient } = require("@supabase/supabase-js");

// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseKey = process.env.SUPABASE_ANON_KEY;
// console.log("URL:", process.env.SUPABASE_URL);
// console.log("KEY:", process.env.SUPABASE_ANON_KEY ? "LOADED" : "MISSING");

// if (!supabaseUrl) console.error("SUPABASE_URL missing");
// if (!supabaseKey) console.error("SUPABASE_ANON_KEY missing");

// const supabase = createClient(supabaseUrl, supabaseKey);

// module.exports = supabase;
// supabaseClient.js
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = supabase;
