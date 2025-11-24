"use client"

import { useState } from "react"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { motion } from "framer-motion"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setFormData({ name: "", email: "", subject: "", message: "" })
      setSubmitted(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <main className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold mb-4">Get in Touch</h1>
            <p className="text-xl text-gray-400">Have questions? We'd love to hear from you.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 mb-12">
            {/* Contact info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold mb-8">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="p-3 bg-indigo-500/10 rounded-lg h-fit">
                      <Mail size={24} className="text-indigo-500" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Email</h3>
                      <p className="text-gray-400">support@visualbrief.com</p>
                      <p className="text-gray-500 text-sm">We typically respond within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="p-3 bg-indigo-500/10 rounded-lg h-fit">
                      <Phone size={24} className="text-indigo-500" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Phone</h3>
                      <p className="text-gray-400">+1 (555) 123-4567</p>
                      <p className="text-gray-500 text-sm">Monday - Friday, 9am - 6pm PST</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="p-3 bg-indigo-500/10 rounded-lg h-fit">
                      <MapPin size={24} className="text-indigo-500" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Address</h3>
                      <p className="text-gray-400">123 Tech Street</p>
                      <p className="text-gray-400">San Francisco, CA 94105</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ quick links */}
              <div className="card">
                <h3 className="font-bold mb-4">Quick Help</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="/" className="text-indigo-400 hover:text-indigo-300">
                      View Documentation
                    </a>
                  </li>
                  <li>
                    <a href="/" className="text-indigo-400 hover:text-indigo-300">
                      Check FAQ
                    </a>
                  </li>
                  <li>
                    <a href="/" className="text-indigo-400 hover:text-indigo-300">
                      View Pricing
                    </a>
                  </li>
                  <li>
                    <a href="/" className="text-indigo-400 hover:text-indigo-300">
                      Report a Bug
                    </a>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Contact form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="card"
            >
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="text-green-500" size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Thank you!</h3>
                  <p className="text-gray-400">We've received your message and will get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="p-2 border border-white rounded-lg input-field"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="p-2 border border-white rounded-lg input-field"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="p-2 border border-white rounded-lg input-field"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="p-2 border border-white rounded-lg input-field resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                    <Send size={18} />
                    Send Message
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
