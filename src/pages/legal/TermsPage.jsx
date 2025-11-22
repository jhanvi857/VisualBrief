"use client"

import { Link } from "react-router-dom"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import { motion } from "framer-motion"

export default function TermsPage() {
  const sections = [
    {
      title: "1. Agreement to Terms",
      content:
        "By accessing and using VisualBrief, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.",
    },
    {
      title: "2. Use License",
      content:
        "Permission is granted to temporarily download one copy of the materials (information or software) on VisualBrief for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not: modify or copy the materials; use the materials for any commercial purpose or for any public display; attempt to decompile or reverse engineer any software contained on VisualBrief; remove any copyright or other proprietary notations from the materials.",
    },
    {
      title: "3. Disclaimer",
      content:
        'The materials on VisualBrief are provided on an "as is" basis. VisualBrief makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.',
    },
    {
      title: "4. Limitations",
      content:
        "In no event shall VisualBrief or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on VisualBrief.",
    },
    {
      title: "5. Accuracy of Materials",
      content:
        "The materials appearing on VisualBrief could include technical, typographical, or photographic errors. VisualBrief does not warrant that any of the materials on VisualBrief are accurate, complete, or current.",
    },
    {
      title: "6. Links",
      content:
        "VisualBrief has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by VisualBrief of the site. Use of any such linked website is at the user's own risk.",
    },
    {
      title: "7. Modifications",
      content:
        "VisualBrief may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.",
    },
    {
      title: "8. Governing Law",
      content:
        "These terms and conditions are governed by and construed in accordance with the laws of the United States, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <main className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h1 className="text-5xl font-bold mb-4">Terms of Service</h1>
            <p className="text-gray-400 text-lg">Last updated: November 22, 2025</p>
          </motion.div>

          <div className="prose prose-invert max-w-none space-y-8">
            <p className="text-gray-300 leading-relaxed">
              Welcome to VisualBrief. These terms of service ("Agreement") set forth the legally binding terms and
              conditions for your use of the website located at visualbrief.com and any related mobile applications,
              software, tools, and services offered by VisualBrief ("Company," "we," "our," or "us").
            </p>

            {sections.map((section, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-bold mb-3">{section.title}</h2>
                <p className="text-gray-300 leading-relaxed">{section.content}</p>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="card mt-12"
            >
              <h2 className="text-2xl font-bold mb-3">Contact Us</h2>
              <p className="text-gray-300 mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="space-y-2">
                <p className="text-gray-300">
                  Email:{" "}
                  <Link to="/" className="text-indigo-400 hover:text-indigo-300">
                    legal@visualbrief.com
                  </Link>
                </p>
                <p className="text-gray-300">Address: 123 Tech Street, San Francisco, CA 94105</p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
