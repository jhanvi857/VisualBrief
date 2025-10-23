const { PythonShell } = require("python-shell");
const path = require("path");

const ML_PATH = path.join(__dirname, "../ML"); 

// Generic function to run Python script
function runPython(mode, args = [], inputText = null) {
  return new Promise((resolve, reject) => {
    const options = {
      args: [mode, ...args],
      pythonPath: "python",
      scriptPath: ML_PATH,
    };

    const pyshell = new PythonShell("processor.py", options);
    let output = [];

    pyshell.on("message", (msg) => output.push(msg));
    pyshell.on("error", (err) => reject(err));
    pyshell.on("stderr", (err) => console.error("Python STDERR:", err));
    pyshell.on("close", () => resolve(output.join("\n")));

    if (inputText) {
      pyshell.send(inputText);
      pyshell.end(); 
    }
  });
}

async function parseFile(filePath) {
  return runPython("parse", [filePath]);
}

async function generateSummary(filePath) {
  const text = await parseFile(filePath);
  const output = await runPython("summary", [], text);
  return JSON.parse(output);
}

async function generateDiagram(input, diagramType = "flowchart", isFile = true) {
  let output;
  if (isFile) {
    output = await runPython("diagram", [input, diagramType]);
  } else {
    output = await runPython("diagram", ["-t", diagramType], input);
  }
  return JSON.parse(output);
}

module.exports = { parseFile, generateSummary, generateDiagram };