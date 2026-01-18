export const APP_NAME = "VisualBrief"
export const APP_DESCRIPTION = "Convert documents into intelligent visual briefs"

export const COLORS = {
  primary: "#6366f1", // indigo-500
  primaryDark: "#4f46e5", // indigo-600
  background: "#030712", // gray-950
  surface: "#111827", // gray-900
  border: "#1f2937", // gray-800
  text: "#f3f4f6", // gray-100
}

export const BRIEF_TYPES = [
  { id: "flowchart", name: "Flowchart", icon: "GitBranch" },
  { id: "er-diagram", name: "ER Diagram", icon: "Database" },
  { id: "mind-map", name: "Mind Map", icon: "Network" },
  { id: "concept-map", name: "Concept Map", icon: "Link" },
]

export const PRICING_PLANS = [
  {
    name: "Starter",
    price: 29,
    features: ["Up to 50 briefs/month", "All diagram types", "Email support"],
  },
  {
    name: "Pro",
    price: 99,
    features: ["Unlimited briefs", "Priority support", "Team collaboration", "API access"],
  },
  {
    name: "Enterprise",
    price: null,
    features: ["Everything", "Dedicated manager", "Custom integrations"],
  },
]
