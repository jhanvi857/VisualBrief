"use client"

import { motion } from "framer-motion"
import { Zap, BarChart3, Share2, Lock, Sparkles, Clock } from "lucide-react"

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered",
    description: "Advanced AI understands context and extracts meaningful insights automatically.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Most PDFs are processed in under 30 seconds. No waiting around.",
  },
  {
    icon: BarChart3,
    title: "Multiple Formats",
    description: "Choose from bullet points, infographics, mind maps, and more.",
  },
  {
    icon: Share2,
    title: "Easy Sharing",
    description: "Export as PDF, Markdown, or share directly with your team.",
  },
  {
    icon: Lock,
    title: "Secure & Private",
    description: "Your documents are encrypted and processed securely.",
  },
  {
    icon: Clock,
    title: "Save Hours Daily",
    description: "Reduce reading time by 90%. Spend time on what matters.",
  },
]

export default function Features() {
  return (
    <section className="py-20 px-4 bg-gray-950" id="features">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Powerful Features for Smart Teams</h2>
          <p className="text-xl text-gray-400 text-balance">Everything you need to transform documents into insights</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={idx}
                className="card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <Icon size={32} className="text-indigo-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
