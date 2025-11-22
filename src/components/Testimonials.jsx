"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Product Manager @ TechCorp",
    content: "VisualBrief has saved me hours every week. I can now review complex reports in minutes.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Legal Consultant",
    content: "The accuracy of the summaries is impressive. It understands nuance better than I expected.",
    rating: 5,
  },
  {
    name: "Elena Rodriguez",
    role: "CEO @ StartupXYZ",
    content: "Our entire team uses it. The ROI is incredible, especially for due diligence.",
    rating: 5,
  },
]

export default function Testimonials() {
  return (
    <section className="py-20 px-4 bg-gray-950">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Loved by Teams Worldwide</h2>
          <p className="text-xl text-gray-400">Join thousands of professionals who trust VisualBrief</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              className="card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex gap-1 mb-4">
                {Array(testimonial.rating)
                  .fill(0)
                  .map((_, i) => (
                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
              </div>
              <p className="text-gray-300 mb-6">{testimonial.content}</p>
              <div>
                <p className="font-bold">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
