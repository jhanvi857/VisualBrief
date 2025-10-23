# VisualBrief : Backend

### The backend is responsible for file handling, Python execution, and sending JSON results to the frontend. It uses Node.js, Express, and python-shell.

# 1. Processor Interface (processor.js)

## Purpose: Bridge between Node.js and Python ML.

### Key Function: runPython(mode, args, inputText)
- mode : "parse", "summary", "diagram".

- args : file path or diagram type.

- inputText : optional text input (for custom diagrams).

### Workflow:

1. Call processor.py using PythonShell.

2. Collect stdout messages into output.

3. Resolve JSON for frontend use.

### Exposed functions:
```bash
parseFile(filePath)
generateSummary(filePath)
generateDiagram(input, diagramType, isFile)
```

# 2. Routes (app.js)

## /upload route :

- Accepts uploaded file.

- Calls generateSummary(filePath) for summary.

- Calls generateDiagram(filePath) for diagram.

- Sends { summary, diagram } as JSON.

## /diagram route

- Accepts custom text + diagram type.

- Calls generateDiagram(text, diagramType, false).

- Sends diagram JSON to frontend.

## Key Libraries:

- express : server and routes

- multer : file uploads

- cors : cross-origin requests

- python-shell → run Python ML code

# 3. Workflow Summary

### Frontend : sends file/text to backend.

### Backend : saves file (if any), calls Python functions via processor.js.

### Python ML : processes text → generates summary or diagram JSON.

### Backend : receives JSON → sends response to frontend.

### Frontend : renders summary text and Mermaid diagrams.