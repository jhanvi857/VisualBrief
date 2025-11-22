"use client"

import { Link } from "react-router-dom"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import { motion } from "framer-motion"

export default function PrivacyPage() {
  const sections = [
    {
      title: "Information We Collect",
      content:
        "We collect information you provide directly to us, such as when you create an account, upload files, or contact us for support. This includes your name, email address, password, and any other information you choose to provide. We also automatically collect certain information about your device and how you interact with our service, such as IP address, browser type, and pages visited.",
    },
    {
      title: "How We Use Your Information",
      content:
        "We use the information we collect to provide, maintain, and improve our service, process transactions, send transactional and promotional communications, and comply with legal obligations. We may also use anonymized and aggregated data for analytics and research purposes.",
    },
    {
      title: "Data Security",
      content:
        "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is completely secure, and we cannot guarantee absolute security.",
    },
    {
      title: "Third-Party Services",
      content:
        "We may use third-party service providers to perform functions on our behalf, such as payment processing, data analysis, and customer support. These providers are bound by confidentiality agreements and are only permitted to use your information as necessary to provide services to us.",
    },
    {
      title: "Your Privacy Rights",
      content:
        "Depending on your location, you may have certain rights regarding your personal information, such as the right to access, correct, delete, or port your data. To exercise these rights, please contact us using the information provided below.",
    },
    {
      title: "Cookies and Tracking",
      content:
        "We use cookies and similar tracking technologies to enhance your experience on our platform. You can control cookie settings through your browser preferences. Please note that disabling cookies may affect the functionality of our service.",
    },
    {
      title: "Children's Privacy",
      content:
        "Our service is not intended for individuals under 13 years of age. We do not knowingly collect personal information from children under 13. If we learn that we have collected such information, we will promptly delete it.",
    },
    {
      title: "Changes to This Privacy Policy",
      content:
        'We may update this Privacy Policy periodically to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of material changes by posting the updated policy and updating the "Last Updated" date.',
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
            <h1 className="text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-gray-400 text-lg">Last updated: November 22, 2025</p>
          </motion.div>

          <div className="prose prose-invert max-w-none space-y-8">
            <p className="text-gray-300 leading-relaxed">
              VisualBrief ("Company," "we," "our," or "us") is committed to protecting your privacy. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your information when you visit our website, use our
              mobile application, and use our services (collectively, the "Service").
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
                If you have questions about this Privacy Policy or our privacy practices, please contact us at:
              </p>
              <div className="space-y-2">
                <p className="text-gray-300">
                  Email:{" "}
                  <Link to="/" className="text-indigo-400 hover:text-indigo-300">
                    privacy@visualbrief.com
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
