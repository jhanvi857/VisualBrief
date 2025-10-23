# VisualBrief : ML 
### This module handles text parsing, summarization, and diagram generation. It uses Python and popular NLP libraries to convert raw documents into structured information.

# 1. File Parsing (parse_file)

## Purpose: Convert uploaded documents (PDF, DOCX, TXT) into plain text.

### Libraries:

- pdfplumber : extract text from PDFs.

- python-docx : read DOCX files.

- Standard open() : read TXT files.

## How it works:
```bash
if file.endswith(".pdf"):
    use pdfplumber to read each page
elif file.endswith(".docx"):
    read paragraphs
else:
    read text file
```
#### Output: Plain text string for summarization or diagram generation.

# 2. Summary Generation (generate_summary)

## Purpose: Create a short extractive summary from document text.

### Library: nltk → sent_tokenize splits text into sentences.

Logic:

- Split text into sentences.

- Take first n sentences (default 5) as summary.

- Output Format (JSON):
```bash
{
  "title": "Document Summary",
  "content": "First 5 sentences..."
}
```

# 3. Diagram Generation (generate_diagram)
## Purpose: Convert text into structured diagrams.

### Steps:

1. Extract entities & relations with SpaCy:

nsubj : subject

dobj : object

VERB : relation
Example: "AI improves learning" = (AI, improve, learning)

2. Build nodes and edges:
```bash
nodes = [{"id": 1, "label": "AI"},
         {"id": 2, "label": "Learning"}
        ]
edges = [{"from": 1, "to": 2, "label": "improve"}]
```

3. Convert to Mermaid.js format:

graph TD
  1 [AI] --> |improve| 2 [Learning]


Output: JSON with nodes, edges, mermaid.

# 4. ML Processor (processor.py)

## Purpose: Acts as a single entry point for Node.js.

### Usage:

- python processor.py parse <file> : just parse

- python processor.py summary <file> : generate summary

- python processor.py diagram <file> : generate diagram

## Workflow:

- Read file or stdin input.

- Call ML functions.

- Output JSON for Node.js to read.