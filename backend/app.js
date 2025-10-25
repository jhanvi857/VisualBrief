const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
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
    const diagramType = req.body.diagramType || "flowchart";
    const summary = await generateSummary(req.file.path);
    const diagram = await generateDiagramFromFile(req.file.path,diagramType);

    // adding file delition after processing file..
    const filePath = path.resolve(req.file.path); 
    fs.unlink(filePath, (err) => {
      if (err) console.error("Failed to delete uploaded file:", err);
      else console.log("Deleted uploaded file:",filePath);
    });

    res.json({ summary, diagram });
  } catch (err) {
    console.error("Error in /upload:", err);
    if (req.file?.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Failed to delete uploaded file on error:", err);
      });
    }
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