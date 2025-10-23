const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const {
  generateSummary,
  generateDiagramFromFile,
  generateDiagramFromText,
} = require("./processor");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now();
    cb(null, name + ext);
  },
});
const upload = multer({ storage });

// upload route to get summ+diag..
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded." });

    const summary = await generateSummary(req.file.path);
    const diagram = await generateDiagramFromFile(req.file.path);

    res.json({ summary, diagram });
  } catch (err) {
    console.error("Error in /upload:", err);
    res.status(500).json({ error: "Failed to process file" });
  }
});

// Custom diag from cust. text input..
app.post("/diagram", async (req, res) => {
  try {
    const { text, diagramType } = req.body;
    if (!text || !diagramType)
      return res.status(400).json({ error: "Missing text or diagramType" });

    const diagram = await generateDiagramFromText(text, diagramType);
    res.json({ diagram });
  } catch (err) {
    console.error("Error in /diagram:", err);
    res.status(500).json({ error: "Failed to generate diagram" });
  }
});

app.listen(3000, () => console.log("Server running on PORT 3000"));