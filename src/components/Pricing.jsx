"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Starter",
    price: 29,
    description: "Perfect for individuals",
    features: ["Up to 50 briefs/month", "All diagram types", "Email support", "Basic analytics"],
    cta: "Get Started",
    featured: false,
  },
  {
    name: "Pro",
    price: 99,
    description: "For power users & teams",
    features: [
      "Unlimited briefs/month",
      "All diagram types",
      "Priority support",
      "Advanced analytics",
      "Team collaboration",
      "API access",
      "Custom branding",
    ],
    cta: "Start Free Trial",
    featured: true,
  },
  {
    name: "Enterprise",
    price: null,
    description: "Custom solutions",
    features: [
      "Everything in Pro",
      "Dedicated account manager",
      "Custom integrations",
      "On-premise option",
      "SLA guarantee",
      "Advanced security",
    ],
    cta: "Contact Sales",
    featured: false,
  },
]

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false)

  return (
    <section className="py-20 px-4 bg-gray-950" id="pricing">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-400 mb-8">Choose the plan that fits your needs</p>

          {/* Pricing toggle */}
          <div className="flex items-center justify-center gap-4 bg-gray-800 w-fit mx-auto px-2 py-2 rounded-lg">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-4 py-2 rounded transition-smooth ${!isYearly ? "bg-indigo-600 text-white" : "text-gray-400"
                }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-4 py-2 rounded transition-smooth ${isYearly ? "bg-indigo-600 text-white" : "text-gray-400"
                }`}
            >
              Yearly <span className="text-sm text-green-400">Save 20%</span>
            </button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              className={`rounded-2xl p-8 transition-smooth ${plan.featured
                  ? "border-2 border-indigo-500 bg-indigo-500/5 relative"
                  : "border border-gray-800 bg-gray-800/30"
                }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              {plan.featured && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-gray-400 text-sm mb-6">{plan.description}</p>

              <div className="mb-6">
                {plan.price !== null ? (
                  <>
                    <span className="text-4xl font-bold">
                      ${isYearly ? Math.round(plan.price * 12 * 0.8) : plan.price}
                    </span>
                    <span className="text-gray-400 ml-2">{isYearly ? "/year" : "/month"}</span>
                  </>
                ) : (
                  <p className="text-2xl text-indigo-400">Custom pricing</p>
                )}
              </div>

              <Link
                to="/signup"
                className={`block w-full text-center py-3 rounded-lg font-medium transition-smooth mb-8 ${plan.featured ? "btn-primary" : "btn-outline"
                  }`}
              >
                {plan.cta}
              </Link>

              <div className="space-y-3">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check size={20} className="text-indigo-400 mt-0.5 shrink-0" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
