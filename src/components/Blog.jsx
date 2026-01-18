"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Clock, Tag } from "lucide-react"
import Navbar from "./Navbar"
import Footer from "./Footer"

export const blogPosts = [
  {
    id: 1,
    title: "Generate Visual Briefs Instantly with VisualBrief",
    snippet:
      "Learn how to transform documents into intelligent visual briefs and interactive diagrams in seconds using our AI-powered tool.",
    date: "Jan 18, 2026",
    category: "Tutorial",
    image: "/image1.jpg",
    slug: "generate-briefs-visualbrief",
    content: `
# Generate Visual Briefs Instantly with VisualBrief

Complex documents can be overwhelming — technical specs, research papers, architecture reports.  
**VisualBrief** helps you extract the underlying logic and relationships using fast and accurate **AI-powered analysis**.

---

## 📌 Why Visual Briefs Matter

Most documents contain:

- Dense technical jargon
- Complex branching logic
- Hidden relationships between entities

VisualBrief reduces this into **clear, structured visual representations**, saving hours of cognitive effort.

---

## ⚙️ How VisualBrief Works

VisualBrief follows a specialized processing pipeline:

### 1️⃣ Document Logic Parsing  
The AI identifies:

- Entities & Actors
- Decision points
- Progressive steps
- Data relationships

This creates a structural map of your content.

### 2️⃣ Diagram Generation  
The system produces:

- **Flowcharts** for processes
- **ER Diagrams** for data structures
- **Mindmaps** for themes
- **Concept Maps** for relationships

All automatically from text or files.

---

## 🚀 Benefits of Using VisualBrief

- Save **80% analysis time**
- Communicate complex ideas instantly
- Perfect for Architects, Developers, and Analysts
- High-quality exports for documentation

---

## 🧪 Try It Yourself

Upload any technical document — VisualBrief will:

- Extract Logic
- Map Relationships
- Generate Interactive Diagrams

Start building smarter documentation today!
`
  },
  {
    id: 2,
    title: "Mastering Mermaid.js with VisualBrief",
    snippet:
      "A complete guide explaining how VisualBrief leverages AI to build industry-standard Mermaid.js diagrams for your projects.",
    date: "Jan 15, 2026",
    category: "Guide",
    image: "/mermaidwith.jpg",
    slug: "mastering-mermaid-visualbrief",
    content: `
# Mastering Mermaid.js with VisualBrief

Mermaid.js is the industry standard for text-to-diagram generation. VisualBrief takes this to the next level by automating the syntax creation.

---

## ⭐ What Is Mermaid.js?

Mermaid.js is a markdown-like script for diagrams. Instead of manually drawing shapes, you describe the flow.

Example:
\`\`\`mermaid
flowchart TD
    Start --> Analyze
    Analyze --> Result
\`\`\`

---

## 🛠️ How VisualBrief Enhances Mermaid.js

VisualBrief adds powerful automation on top of Mermaid.js:

### ✔ No-Syntax Generation
Describe your process in plain English, and VisualBrief writes the Mermaid code for you.

### ✔ Type-Specific Optimization
Whether it's an ER Diagram for your database or a Flowchart for your CI/CD pipeline, VisualBrief selects the best Mermaid structure.

---

## 🚀 Why Visual Diagrams?

- **Clarity**: Visuals are processed 60,000x faster than text.
- **Consistency**: Standardize your team's documentation format.
- **Maintenance**: Update text-based diagrams in seconds.

---

## 🎉 Try It Now

Provide any process description, and watch VisualBrief convert it into a professional diagram instantly!
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
      <Navbar />
      <section className="min-h-screen bg-gray-950 text-gray-100 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Insights & Tutorials
            </h1>
            <p className="text-gray-400 text-lg">
              Master the art of visual logic extraction and diagram automation.
            </p>

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

          {/* Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-smooth border border-gray-700"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
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
      <Footer />
    </>
  )
}
