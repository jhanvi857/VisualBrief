const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const { parseFile, generateSummary, generateDiagram } = require("./processor");

const app = express();
app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); 
    const name = Date.now(); 
    cb(null, name + ext);
  },
});
const upload = multer({ storage });

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded." });

    console.log("Saved file as:", req.file.path);

    const summary = await generateSummary(req.file.path);    
    const diagram = await generateDiagram(req.file.path);    

    res.json({ summary, diagram });
  } catch (err) {
    console.error("Error in /upload backend:", err);
    res.status(500).json({ error: "Failed to parse file" });
  }
});

app.post("/diagram", async (req, res) => {
  try {
    const { text, diagramType } = req.body;
    if (!text || !diagramType) {
      return res.status(400).json({ error: "Missing text or diagramType." });
    }
    const diagram = await generateDiagram(text, diagramType);
    res.json({ diagram });
  } catch (err) {
    console.error("Error in /diagram route:", err);
    res.status(500).json({ error: "Error in generate diagram" });
  }
});

app.listen(3000, () => console.log("Server is running on PORT 3000"));
