# VisualBrief 📝✨

**VisualBrief** is an intelligent document analyzer that transforms text into **summaries and interactive diagrams**. Upload PDFs, Word docs, or plain text, or write your own description, and instantly get concise summaries and visual diagrams for easy understanding.  

Perfect for students, educators, or professionals who want to **save time and visualize information quickly**.

---

## Features 🚀

- **Document Summarization**
  - Extract key points from PDFs, DOCX, or TXT files.
  - Generates concise summaries in JSON format.

- **Diagram Generation**
  - Automatically converts text into **flowcharts, ER diagrams, and sequence diagrams**.
  - Generates Mermaid.js diagrams for interactive previews.

- **Custom Diagrams**
  - Write your own text/steps and choose diagram type.
  - Instantly visualize processes and relationships.

- **Frontend Preview**
  - Beautiful, interactive visualization with React and Tailwind CSS.

- **Export Options**
  - Download your summary and diagrams for offline use.

---

## How It Works 🧠

### 1. **Upload & Parse**
- Upload a document or input text.
- Backend saves the file and calls the Python ML processor.
- ML module parses the text for further processing.

### 2. **Summarization**
- Uses `nltk` and `SpaCy` to split text and extract key sentences.
- Returns JSON containing summary.

### 3. **Diagram Generation**
- Extracts **entities and relationships** (subject, object, verb) from text.
- Builds nodes and edges.
- Converts nodes/edges into **Mermaid.js format** for rendering.

### 4. **Frontend Rendering**
- React + Tailwind renders:
  - Summary text panel
  - Interactive diagram preview
- Users can also generate diagrams from custom text.

---

## Tech Stack ⚡

- **Frontend:** React, Tailwind CSS, Mermaid.js  
- **Backend:** Node.js, Express, Multer, Python Shell  
- **ML:** Python, SpaCy, NLTK, pdfplumber, python-docx  
- **Visualization:** Mermaid.js for flowcharts and diagrams

---
## Learnings / Concepts 📚

- ML folder: Text parsing, summary, diagram generation logic.

- Backend folder: Node.js → Python communication with python-shell.

- Frontend: Interactive diagram rendering using Mermaid.js and React hooks.

## Installation & Setup 🛠

1. **Clone the repo**
```bash
git clone https://github.com/jhanvi857/VisualBrief.git
cd VisualBrief
```
2. **Install backend dependencies**
```bash
cd backend
npm install
```
3. **Install Python dependencies**
```bash
cd ML
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```
4. **Run backend**
```bash
node app.js
```
5. **Run frontend**
```bash
cd frontend
npm install
npm start
```
6. **Open in browser** : 
http://localhost:3000
