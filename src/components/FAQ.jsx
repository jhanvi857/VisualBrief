"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "How accurate are the visual briefs?",
    answer:
      "Our AI model extracts structural logic with extreme precision, mapping relationships and flow with over 95% accuracy for standard documentation.",
  },
  {
    question: "What file formats do you support?",
    answer: "We support PDF, DOCX, and TXT files. You can also provide raw text inputs directly.",
  },
  {
    question: "Can I download or export my diagrams?",
    answer:
      "Yes! You can export diagrams as PNG, PDF, or Markdown. Pro plans also support API access for automated workflows.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. All files are encrypted in transit and at rest. We do not use your data for training purposes without explicit consent.",
  },
  {
    question: "Can I use this for my team?",
    answer:
      "Yes! The Pro plan includes team collaboration features. The Enterprise plan offers dedicated account management and custom solutions.",
  },
  {
    question: "What's your refund policy?",
    answer:
      "We offer a 30-day money-back guarantee. If you're not satisfied, we'll refund your payment with no questions asked.",
  },
]

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(0)

  return (
    <section className="py-20 px-4 bg-gray-950">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-400">Find answers to common questions</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-gray-800 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenIdx((prev) => (prev === idx ? -1 : idx))}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
              >
                <span className="text-left font-medium">{faq.question}</span>
                <ChevronDown
                  size={20}
                  className={`text-indigo-400 transition-transform ${openIdx === idx ? "rotate-180" : ""}`}
                />
              </button>

              {/* CSS-driven collapse for smoother transitions */}
              <div
                className="px-6 bg-gray-800/30 border-t border-gray-800 text-gray-400"
                style={{
                  maxHeight: openIdx === idx ? "500px" : "0px",
                  opacity: openIdx === idx ? 1 : 0,
                  overflow: "hidden",
                  transition: "max-height 220ms ease, opacity 180ms ease",
                }}
              >
                <div className="py-4">{faq.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
