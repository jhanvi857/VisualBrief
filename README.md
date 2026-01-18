# VisualBrief 

**VisualBrief** is a platform that transforms natural language descriptions and documents into high-quality, interactive visual diagrams. Designed for developers, architects, and business analysts, it simplifies complex processes by providing instant visual representations.

## Key Features

- **Natural Language to Diagram**: Convert plain text descriptions into Flowcharts, ER Diagrams, Mindmaps, and Concept Maps.
- **Smart Document Processing**: Upload PDF, DOCX, or Text files to automatically extract and visualize the underlying logic.
- **Persistent Storage**: Securely save your generated visual briefs for up to 30 days.
- **Interactive Previews**: High-performance rendering using Mermaid.js with support for complex branching and logic.
- **Credit-Based System**: Manage usage with a robust credit and cooldown mechanism for both demo and registered users.
- **Industry Standard Export**: Export diagrams as PNG, PDF, or Markdown.

## Tech Stack

### Frontend
- **React 18** + **Vite**
- **Tailwind CSS** (Premium UI/UX)
- **Framer Motion** (Subtle micro-animations)
- **Mermaid.js** (Diagram rendering)
- **Lucide React** (Consistent iconography)

### Backend
- **FastAPI** (High-performance Python framework)
- **Gemini Pro API** (LLM-powered text normalization)
- **SpaCy & NetworkX** (Advanced NLP and graph processing)
- **Supabase** (Authentication & PostgreSQL storage)

---

## Project Structure

```bash
visualBrief/
├── backend/
│   ├── app/
│   │   ├── main.py             # App entry point & middleware
│   │   ├── briefs.py           # Brief storage & retrieval logic
│   │   ├── routers/
│   │   │   ├── brief_generator.py # Core generation engine
│   │   │   └── auth.py         # Authentication endpoints
│   │   ├── nlp/                # NLP engine (Router, Parsers, Adapters)
│   │   └── services/           # LLM & External API integrations
│   └── requirements.txt
├── src/
│   ├── components/             # Reusable UI components
│   ├── pages/
│   │   ├── dashboard/          # Management & View details
│   │   └── auth/               # Login/Signup flows
│   ├── lib/                    # API wrappers & Constants
│   └── App.jsx                 # Routing & Theme management
└── db/
    └── Schema.sql              # Database architecture
```

## Getting Started

### 1. Prerequisites
- Node.js (v18+)
- Python 3.11+
- Supabase Project (Database & Auth)
- Google Gemini API Key

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
# Add your .env (SUPABASE_URL, SUPABASE_KEY, GEMINI_API_KEY)
uvicorn app.main:app --reload
```

### 3. Frontend Setup
```bash
npm install
npm run dev
```

---

## Security & Performance
- **JWT Auth**: Session management via JSON Web Tokens.
- **Gated Access**: Credit system prevents API abuse.
- **TTL logic**: Automatic expiry of briefs ensures database performance.
- **Optimized NLP**: Two-stage pipeline (LLM Normalization + Rules-based Parsing) for speed and accuracy.

## License
This project is licensed under the MIT License.
