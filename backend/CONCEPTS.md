# VisualBrief Backend Concepts

This document outlines the architecture, data flow, and NLP concepts used in the VisualBrief backend. The system is built using **FastAPI** and utilizes **Google Gemini (LLM)** for semantic understanding, coupled with a custom **Rule-Based NLP Parser** for structured diagram generation.

---

## 1. High-Level Architecture

The backend serves as a processing engine that converts unstructured text (or file content) into structured visual diagrams (Flowcharts, ER Diagrams, Mindmaps, etc.).

### **Core Components**
1.  **FastAPI App (`app/main.py`)**: Entry point and API routing.
2.  **Brief Generator Router (`app/routers/brief_generator.py`)**: Orchestrates the diagram generation flow.
3.  **LLM Service (`app/services/llm_service.py`)**: Handles interactions with Google Gemini.
4.  **NLP Pipeline (`app/nlp/`)**: Parses LLM output into structured node/edge data.
5.  **Renderers (`app/renderers/`)**: Converts structured data into text narratives or Mermaid.js syntax.
6.  **Schema (`app/schema/`)**: Pydantic models ensuring type safety for the diagram structure.

---

## 2. End-to-End Data Flow

The data flow logically moves from **Unstructured Input** $\rightarrow$ **Intermediate Format** $\rightarrow$ **Structured Schema** $\rightarrow$ **Visual Output**.

### Step 1: Input Handling (Router)
-   **File Parsing**: If a file is uploaded, `extract_text_from_bytes` handles the extraction.
    -   **PDFs**: Uses `pdfplumber` to extract extractable text from each page.
    -   **Other Formats**: Attempts to decode as UTF-8 plain text.
-   **Text Input**: Raw text provided by the user is combined with extracted file content.

### **Step 2: Semantic Normalization (LLM Layer)**
Instead of asking the LLM to write Mermaid code directly (which can be error-prone), we use an **Intermediate "Arrow Format"**.
-   **Why?** LLMs are better at understanding relationships than strict syntax rules.
-   **The Prompt**: The `llm_service` prompts Gemini to convert the prose into a strict line-by-line format:
    ```
    Source Node -> Target Node |Label|
    ```
-   **Output**: A raw string of these arrow relationships.

### **Step 3: NLP Parsing (The "Arrow Parser")**
The raw string from the LLM is passed to `route_nlp`, which uses `ArrowParser`.
-   **Regex Magic**: The parser uses regex (`^(.*?)\s*->\s*([^|]*?)(?:\s*\|(.*?)\|)?$`) to break each line into `Source`, `Target`, and `Label`.
-   **Node resolution**: 
    -   It acts as a symbol table, assigning unique IDs (e.g., `NODE_1`, `NODE_2`) to normalized node labels.
    -   It cleans text (trimming, checking for "Start/End" keywords to assign node types).
-   **Refinement**: 
    -   `flowchart_nlp.py`: checks for "decision" nodes and ensures outgoing edges have "Yes/No" labels if missing.
    -   `er_nlp.py`: assigns "entity" types.

### **Step 4: Schema Construction**
The dictionary output from the parser is validated against `DiagramSchema`.
-   **Nodes**: `{ id: "NODE_1", label: "Login", type: "process" }`
-   **Edges**: `{ from_node: "NODE_1", to_node: "NODE_2", label: "Success" }`

### **Step 5: Visualization & Rendering**
-   **Mermaid Adapter**: `to_mermaid()` iterates over the schema's nodes and edges to write valid Mermaid.js syntax.
    -   *Flowchart*: `NODE_1["Login"] -->|Success| NODE_2`
    -   *ER*: `User ||--o{ Post : "writes"`
-   **Logic Renderer**: Converts the graph back into a linear text explanation ("Step 1: Login, then if Success...").

---

## 3. Deep Dive: NLP Concepts Used

### **A. Tokenization & regex (Rule-Based)**
We rely on a deterministic `ArrowParser` rather than a full statistical NLP model (like spaCy) for the *structure* because the LLM has already done the heavy lifting of understanding the semantics. We just need to parse the *format* it produced.

### **B. Canonicalization (Entity Resolution)**
-   **Problem**: "User logs in" vs "User Log In".
-   **Solution**: `normalize_label` lowercases and strips distinct characters to identify if two nodes are the same, merging them into a single ID.

### **C. Type Inference**
-   **Flowcharts**:
    -   Keywords like "Start", "Begin" $\rightarrow$ `type: start` (renders as rounded/pill shape).
    -   Keywords like "If", "?", "Check" $\rightarrow$ `type: decision` (renders as diamond).
-   **ER Diagrams**: Nodes are treated as "Entities".

### **D. Confidence Scoring**
We calculate a rudimentary confidence score based on the structure's integrity (e.g., do we have unconnected nodes? Is the graph too simple?).

---

## 4. Why this hybrid approach?

1.  **Reliability**: Letting the LLM generate JSON/Mermaid directly often leads to syntax errors. The "Arrow Format" is extremely robust and forgiving.
2.  **Control**: We can inject post-processing logic (like enforcing "Yes/No" on specific branches) that is hard to guarantee with pure LLM generation.
3.  **Traceability**: We keep the `raw_arrow_format` in metadata, allowing us to debug exactly what the LLM "saw" as the relationships.

---

## 5. File Structure Reference

```
backend/app/
├── main.py                # App entry
├── routers/
│   └── brief_generator.py # Controller logic
├── services/
│   └── llm_service.py     # Gemini interface (Text -> Arrow Format)
├── nlp/
│   ├── arrow_parser.py    # The core parser (Arrow Format -> Dict)
│   ├── router.py          # Dispatches to specific NLP handlers
│   ├── flowchart_nlp.py   # Flowchart specific logic
│   └── mermaid_adapter.py # Dict -> Mermaid Syntax
└── schema/
    └── diagram_schema.py  # Data models
```