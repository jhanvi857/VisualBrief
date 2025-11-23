"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Clock, Tag } from "lucide-react"
import Navbar from "./Navbar"
import Footer from "./Footer"
// import demo from "/diagram.png";
// import demo1 from "/diagram(1).png";
export const blogPosts = [
  {
    id: 1,
    title: "Summarize PDFs Instantly with VisualBrief",
    snippet:
      "Learn how to transform long PDFs into concise summaries and visual diagrams in seconds using our AI-powered tool.",
    date: "Nov 20, 2025",
    category: "Tutorial",
    image: "/image1.jpg",
    slug: "summarize-pdfs-visualbrief",
    content: `
# Summarize PDFs Instantly with VisualBrief

Long PDFs can be overwhelming — textbooks, research papers, reports, case studies.  
**VisualBrief** helps you extract only what matters using fast and accurate **AI-powered summarization**.

---

## 📌 Why Summarization Matters

Most PDFs contain:

- Repeated information  
- Long explanations  
- Low-value filler content  

VisualBrief reduces this into **clear, concise key points**, saving hours of reading time.

---

## ⚙️ How VisualBrief Summarization Works

VisualBrief follows a multi-step processing pipeline:

### 1️⃣ PDF Parsing  
The AI extracts:

- Titles  
- Paragraphs  
- Bullet lists  
- Tables  
- Headings  

This creates a clean text version of your PDF.

### 2️⃣ Key Point Extraction  
The text is analyzed using:

- TextRank  
- Semantic clustering  
- Embedding-based scoring

This identifies meaningful sentences.

### 3️⃣ Summary Generation  
The system produces:

- **Short summaries**  
- **Detailed summaries**  
- **Bullet-point summaries**  
- **Chapter-wise breakdowns**

### 4️⃣ Optional Diagram Generation  
You can convert the summary to:

- Flowcharts  
- Concept diagrams  
- ER diagrams  
- Mermaid.js charts  

All automatically.

---

## 🚀 Benefits of Using VisualBrief

- Save **60–90% reading time**  
- Understand complex documents quickly  
- Perfect for students, researchers, developers  
- Generates outputs that are easy to revise or export  

---

## 📘 Example Summary Output

**PDF Input:**

Research paper (10 pages) about Machine Learning.

**VisualBrief Summary:**

- ML uses algorithms that learn from data  
- Models improve over time using feedback  
- Training requires labeled datasets  
- Evaluation is done using accuracy, recall & precision  
- Applications include vision, NLP & robotics  

---

## 🧪 Try It Yourself

Upload any PDF — VisualBrief will instantly:

- Summarize  
- Extract insights  
- Generate diagrams  

Start exploring smarter reading today!
`

  },

  {
    id: 2,
    title: "Create Flowcharts from Text Using Mermaid.js",
    snippet:
      "Step-by-step guide to generate interactive flowcharts and diagrams from plain text using VisualBrief.",
    date: "Nov 18, 2025",
    category: "Tutorial",
    image: "/flowcartimage.jpg",
    slug: "flowcharts-mermaidjs",
    content: `
# Create Flowcharts from Text Using Mermaid.js

Mermaid.js allows you to convert **plain text into diagrams**, making it ideal for flowcharts, sequences, org charts, and more.

VisualBrief integrates Mermaid.js to let you generate diagrams instantly.

---

## ⭐ What Is Mermaid.js?

Mermaid.js is a lightweight markup language for creating diagrams.

Instead of dragging shapes manually, you write simple text rules.

Example:

\`\`\`mermaid
flowchart TD
    Start --> Process
    Process --> End
\`\`\`

---

## 🛠️ How VisualBrief Boosts Mermaid.js

VisualBrief adds powerful features on top of Mermaid.js:

### ✔ Auto-generate Mermaid code  
You don’t need to know syntax — VisualBrief converts your text or summary into valid Mermaid diagrams.

### ✔ Real-time preview  
As you type, the updated diagram appears instantly.

### ✔ Multi-diagram support  
You can generate:

- Flowcharts  
- ER diagrams  
- Sequence diagrams  
- Class diagrams  
- Mindmaps  

### ✔ Export options  
Download as:

- PNG  
- SVG  
- Markdown file  

---

## 📚 Example: Turning Summary → Diagram

**Input Text:**

\`\`\`
User uploads PDF  
AI reads PDF  
AI extracts summary  
System generates flowchart  
\`\`\`

**VisualBrief Output:**

\`\`\`mermaid
flowchart LR
    User --> PDF
    PDF --> AI
    AI --> Summary
    Summary --> Flowchart
\`\`\`

---

## 🚀 Why Use Mermaid.js in VisualBrief?

- No need for design tools  
- Perfect for documentation  
- Ideal for developers, writers & students  
- Fast, flexible, easy to edit  

---

## 🎉 Try It Now

Paste any process, and watch VisualBrief convert it into a diagram instantly!
`

  },

  {
    id: 3,
    title: "Boost Productivity with AI Summarization",
    snippet:
      "Discover how VisualBrief can save hours of reading time and help you focus on what matters most.",
    date: "Nov 15, 2025",
    category: "Productivity",
    image: "/productivity.jpg",
    slug: "boost-productivity-ai",
    content: `
## 🔥 Why Productivity Matters

Time is the most valuable resource. Long reports slow you down.

AI summarization solves this by:
- Reducing reading time  
- Highlighting critical parts  
- Helping faster decision-making  

---

## 🧠 VisualBrief’s Smart Summarizer

It uses extractive summarization:
- Identifies important sentences  
- Removes fluff  
- Keeps your meaning intact  

---

## 🌟 Real Use Cases

- Students studying large PDFs  
- Founders reading research reports  
- Developers consuming documentation  
- Writers gathering information  

---

## 🎯 Final Advice

Use AI to handle the boring reading so you can focus on **creating better work**.
    `
  },
  {
  id: 4,
  title: "Mastering Mermaid.js with VisualBrief",
  snippet:
    "A clean and easy-to-understand guide explaining Mermaid.js and how VisualBrief enhances it with AI-powered diagram generation.",
  date: "Nov 23, 2025",
  category: "Guide",
  image: "/mermaidwith.jpg",
  slug: "mastering-mermaid-visualbrief",
  content: `
Mermaid.js is a lightweight tool that allows you to create diagrams using simple text instructions. Instead of dragging shapes or manually designing layouts, you just write text that describes the logic, and Mermaid.js turns it into a diagram automatically.

VisualBrief builds on top of Mermaid.js by providing AI-powered generation, live previews, export options, and automatic formatting to make diagram creation even easier for beginners and professionals.

---

What is Mermaid.js?

Mermaid.js is a text-based diagramming tool. You write simple rules like "A --> B" and it visually draws the shapes and arrows for you. Common diagram types supported include:

• Flowcharts  
• Sequence diagrams  
• ER diagrams  
• System architecture diagrams  
• Mindmaps  
• Class diagrams  
• State diagrams  
• Organizational charts  
• Gantt charts  

It’s widely used in documentation, technical writing, engineering plans, and software development.

---

How VisualBrief Enhances Mermaid.js

1. Automatic Mermaid Code Generation  
VisualBrief can take your natural language text — such as a paragraph or a bullet list — and convert it into a valid Mermaid diagram automatically. You don’t need to learn the syntax at all.

2. Real-Time Live Diagram Preview  
As you edit your text or make changes, the diagram updates instantly. This removes guesswork and allows you to correct mistakes immediately.

3. Cleaner Formatting and Error Fixing  
If you write something that Mermaid normally doesn’t understand, VisualBrief auto-corrects the syntax, aligns nodes properly, and ensures the diagram renders smoothly.

4. Supports All Major Diagram Types  
Whether you're creating a flowchart, a process pipeline, an ER diagram, or a mindmap, VisualBrief adapts your content into the right style without extra work.

5. Easy Export Options  
With one click, you can export the diagram as PNG, SVG, or a shareable snippet. Great for students, developers, founders, and content creators.

---

Example: Turning a Process Into a Diagram

Imagine you describe a simple workflow:

• User uploads a PDF  
• The AI reads the file  
• It extracts a summary  
• VisualBrief generates a diagram  
• The user exports the result  

VisualBrief automatically converts this into a clear and organized visual flow. You don't need any diagramming skills — the system handles alignment, layout, and structure.

---

Why Use Mermaid.js With VisualBrief?

• You avoid complicated design tools like Draw.io  
• It saves hours of manual diagram creation  
• Perfect for documentation and technical reports  
• Helps students present processes clearly  
• Great for developers writing system flows  
• Easy to edit and regenerate anytime  

VisualBrief makes Mermaid.js more intuitive by removing the learning curve and giving you instant visuals from everyday text.

---

Final Thoughts

Mermaid.js is already a powerful way to turn text into diagrams, but VisualBrief makes it even better. With AI generation, automated formatting, real-time previews, and export tools, your diagrams become cleaner, faster to create, and more professional.

Whether you're working on assignments, documentation, research, or product workflows, VisualBrief allows you to turn ideas into visuals instantly and effortlessly.
`
}

];

export default function Blog() {
  const [search, setSearch] = useState("")

  const filteredPosts = blogPosts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
    <Navbar/>
    <section className="min-h-screen bg-gray-950 text-gray-100 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Insights & Tutorials
          </h1>
          <p className="text-gray-400 text-lg">
            Learn tips, tutorials, and best practices for document summarization
            and diagram generation.
          </p>

          {/* Search bar */}
          <div className="mt-6 flex justify-center">
            <input
              type="text"
              placeholder="Search blog posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-lg p-3 rounded-lg bg-gray-800 border border-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Featured Post */}
        {filteredPosts.length > 0 && (
          <div className="mb-12">
            <div className="relative bg-gray-800 rounded-2xl overflow-hidden shadow-lg group hover:shadow-2xl transition-smooth">
              <img
                src={filteredPosts[0].image}
                alt={filteredPosts[0].title}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-6">
                <p className="text-sm text-indigo-400 mb-2 flex items-center gap-2">
                  <Tag size={16} /> {filteredPosts[0].category}
                </p>
                <h2 className="text-3xl font-bold mb-2">{filteredPosts[0].title}</h2>
                <p className="text-gray-300 mb-4">{filteredPosts[0].snippet}</p>
                <div className="flex items-center justify-between text-gray-400 text-sm">
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> {filteredPosts[0].date}
                  </span>
                  <Link
                    to={`/blog/${filteredPosts[0].slug}`}
                    className="text-indigo-400 font-medium hover:underline"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.slice(1).map((post) => (
            <div
              key={post.id}
              className="bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-smooth"
            >
              <div className="overflow-hidden rounded-2xl group hover:scale-105 transition-transform duration-500">
  
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              </div>
              <div className="p-6 flex flex-col gap-3">
                <p className="text-sm text-indigo-400 flex items-center gap-2">
                  <Tag size={14} /> {post.category}
                </p>
                <h3 className="text-xl font-bold">{post.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-3">{post.snippet}</p>
                <div className="flex items-center justify-between mt-3 text-gray-400 text-sm">
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> {post.date}
                  </span>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="text-indigo-400 font-medium hover:underline"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
    <Footer/>
    </>
  )
}
