const { PythonShell } = require("python-shell");
const path = require("path");
const ML_PATH = path.join(__dirname, "../ML");
//func. to run python via node..
function runPython(mode, args = [], inputText = null) {
  return new Promise((resolve, reject) => {
    const options = {
      args: [mode, ...args],
      pythonPath: "python",
      scriptPath: ML_PATH,
    };

    const pyshell = new PythonShell("processor.py", options);
    let output = "";
    pyshell.on("message", (msg) => (output += msg));
    pyshell.on("stderr", (err) => console.error("Python STDERR:", err));
    pyshell.end((err) => {
      if (err) return reject(err);
      try {
        resolve(JSON.parse(output));
      } catch (e) {
        reject("Failed to parse Python output: " + e);
      }
    });
    if (inputText) {
      pyshell.send(inputText);
      pyshell.end();
    }
  });
}

// passing summ. to ML..
async function generateSummary(filePath) {
  return await runPython("summary", [filePath]);
}

// passing diag to ML..
async function generateDiagramFromFile(filePath, diagramType = "flowchart") {
  return await runPython("diagram", [filePath, diagramType]);
}

// sep. from text to diag. from converting text into valid mermaid inpuyt..
async function generateDiagramFromText(text, diagramType = "flowchart") {
  return await runPython("diagram", ["-t", text, diagramType]);
}

module.exports = {
  generateSummary,
  generateDiagramFromFile,
  generateDiagramFromText,
};
