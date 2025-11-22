export const APP_NAME = "VisualBrief"
export const APP_DESCRIPTION = "Convert long PDFs into visual summaries"

export const COLORS = {
  primary: "#6366f1", // indigo-500
  primaryDark: "#4f46e5", // indigo-600
  background: "#030712", // gray-950
  surface: "#111827", // gray-900
  border: "#1f2937", // gray-800
  text: "#f3f4f6", // gray-100
}

export const SUMMARY_STYLES = [
  { id: "bullet-points", name: "Bullet Points", icon: "List" },
  { id: "infographic", name: "Infographic", icon: "BarChart3" },
  { id: "mind-map", name: "Mind Map", icon: "Network" },
  { id: "timeline", name: "Timeline", icon: "Clock" },
]

export const PRICING_PLANS = [
  {
    name: "Starter",
    price: 29,
    features: ["Up to 50 PDFs/month", "All summary styles", "Email support"],
  },
  {
    name: "Pro",
    price: 99,
    features: ["Unlimited PDFs", "Priority support", "Team collaboration", "API access"],
  },
  {
    name: "Enterprise",
    price: null,
    features: ["Everything", "Dedicated manager", "Custom integrations"],
  },
]
